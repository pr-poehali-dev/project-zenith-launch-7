import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97248965_project_zenith_launc')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

def ok(data):
    return {'statusCode': 200, 'headers': cors(), 'body': json.dumps(data, default=str)}

def forbidden():
    return {'statusCode': 403, 'headers': cors(), 'body': json.dumps({'error': 'Forbidden'})}

def check_auth(event):
    token = (event.get('headers') or {}).get('X-Admin-Token', '')
    if not token:
        return False
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.admin_session WHERE token = %s", (token,))
    row = cur.fetchone()
    conn.close()
    return row is not None

def handler(event: dict, context) -> dict:
    """CRUD API для контента портфолио. resource — тип данных, action — операция (get/save/create/delete)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    resource = body.get('resource', '')
    action = body.get('action', 'get')

    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # PROFILE
    if resource == 'profile':
        if action == 'get':
            cur.execute(f"SELECT key, value FROM {SCHEMA}.profile")
            rows = {r['key']: r['value'] for r in cur.fetchall()}
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'save':
            for key, value in body.get('data', {}).items():
                cur.execute(f"UPDATE {SCHEMA}.profile SET value = %s WHERE key = %s", (value, key))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    # PORTFOLIO PROFILE
    if resource == 'portfolio_profile':
        if action == 'get':
            cur.execute(f"SELECT * FROM {SCHEMA}.portfolio_profile ORDER BY sort_order")
            rows = list(cur.fetchall())
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'save':
            cur.execute(f"UPDATE {SCHEMA}.portfolio_profile SET value = %s WHERE id = %s",
                (body['value'], body['id']))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    # QUALIFICATIONS
    if resource == 'qualifications':
        if action == 'get':
            cur.execute(f"SELECT * FROM {SCHEMA}.qualifications ORDER BY sort_order, year DESC")
            rows = list(cur.fetchall())
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'create':
            cur.execute(f"INSERT INTO {SCHEMA}.qualifications (year, title, org, hours, sort_order) VALUES (%s,%s,%s,%s,%s) RETURNING *",
                (body['year'], body['title'], body['org'], body['hours'], body.get('sort_order', 0)))
            row = dict(cur.fetchone())
            conn.commit()
            conn.close()
            return ok(row)
        if action == 'save':
            cur.execute(f"UPDATE {SCHEMA}.qualifications SET year=%s, title=%s, org=%s, hours=%s WHERE id=%s",
                (body['year'], body['title'], body['org'], body['hours'], body['id']))
            conn.commit()
            conn.close()
            return ok({'ok': True})
        if action == 'delete':
            cur.execute(f"DELETE FROM {SCHEMA}.qualifications WHERE id = %s", (body['id'],))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    # ACHIEVEMENTS
    if resource == 'achievements':
        if action == 'get':
            cur.execute(f"SELECT * FROM {SCHEMA}.achievements ORDER BY type, sort_order, year DESC")
            rows = list(cur.fetchall())
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'create':
            cur.execute(f"INSERT INTO {SCHEMA}.achievements (type, year, title, description, level, sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                (body['type'], body['year'], body['title'], body['description'], body['level'], body.get('sort_order', 0)))
            row = dict(cur.fetchone())
            conn.commit()
            conn.close()
            return ok(row)
        if action == 'save':
            cur.execute(f"UPDATE {SCHEMA}.achievements SET year=%s, title=%s, description=%s, level=%s WHERE id=%s",
                (body['year'], body['title'], body['description'], body['level'], body['id']))
            conn.commit()
            conn.close()
            return ok({'ok': True})
        if action == 'delete':
            cur.execute(f"DELETE FROM {SCHEMA}.achievements WHERE id = %s", (body['id'],))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    # METHODS FILES
    if resource == 'methods_files':
        if action == 'get':
            cur.execute(f"SELECT * FROM {SCHEMA}.methods_files ORDER BY created_at DESC")
            rows = list(cur.fetchall())
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'create':
            cur.execute(f"INSERT INTO {SCHEMA}.methods_files (tab, name, url, size) VALUES (%s,%s,%s,%s) RETURNING *",
                (body['tab'], body['name'], body['url'], body['size']))
            row = dict(cur.fetchone())
            conn.commit()
            conn.close()
            return ok(row)
        if action == 'delete':
            cur.execute(f"DELETE FROM {SCHEMA}.methods_files WHERE id = %s", (body['id'],))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    # GALLERY
    if resource == 'gallery':
        if action == 'get':
            cur.execute(f"SELECT * FROM {SCHEMA}.gallery ORDER BY created_at DESC")
            rows = list(cur.fetchall())
            conn.close()
            return ok(rows)
        if not check_auth(event):
            conn.close()
            return forbidden()
        if action == 'create':
            cur.execute(f"INSERT INTO {SCHEMA}.gallery (url, name) VALUES (%s,%s) RETURNING *",
                (body['url'], body['name']))
            row = dict(cur.fetchone())
            conn.commit()
            conn.close()
            return ok(row)
        if action == 'delete':
            cur.execute(f"DELETE FROM {SCHEMA}.gallery WHERE id = %s", (body['id'],))
            conn.commit()
            conn.close()
            return ok({'ok': True})

    conn.close()
    return {'statusCode': 404, 'headers': cors(), 'body': json.dumps({'error': 'Not found'})}
