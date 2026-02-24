import json
import os
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97248965_project_zenith_launc')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Авторизация администратора. action=login — вход, action=logout — выход, action=check — проверка токена."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')
    token = (event.get('headers') or {}).get('X-Admin-Token', '')

    if action == 'login':
        if body.get('password') != ADMIN_PASSWORD:
            return {'statusCode': 401, 'headers': cors(), 'body': json.dumps({'error': 'Неверный пароль'})}
        new_token = secrets.token_hex(32)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.admin_session (token) VALUES (%s)", (new_token,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors(), 'body': json.dumps({'token': new_token})}

    if action == 'logout':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.admin_session WHERE token = %s", (token,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors(), 'body': json.dumps({'ok': True})}

    if action == 'check':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.admin_session WHERE token = %s", (token,))
        row = cur.fetchone()
        conn.close()
        return {'statusCode': 200, 'headers': cors(), 'body': json.dumps({'valid': row is not None})}

    return {'statusCode': 404, 'headers': cors(), 'body': json.dumps({'error': 'Not found'})}

def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }
