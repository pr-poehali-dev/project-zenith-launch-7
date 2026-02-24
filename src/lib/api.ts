const AUTH_URL = 'https://functions.poehali.dev/ef93ec0c-fd5c-40fb-8447-b80f16d2694b';
const API_URL = 'https://functions.poehali.dev/2041503f-77f5-4d11-bba1-d84c4b4421a4';
const UPLOAD_URL = 'https://functions.poehali.dev/b2489f59-4d00-4724-9a89-0168ecb48d3c';

function getToken() {
  return localStorage.getItem('admin_token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'X-Admin-Token': getToken() };
}

export async function login(password: string) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', password }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('admin_token', data.token);
    return true;
  }
  return false;
}

export async function logout() {
  await fetch(AUTH_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'logout' }),
  });
  localStorage.removeItem('admin_token');
}

export async function checkAuth() {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'check' }),
  });
  const data = await res.json();
  return data.valid === true;
}

export async function apiGet(resource: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource, action: 'get' }),
  });
  return res.json();
}

export async function apiSave(resource: string, payload: object) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ resource, action: 'save', ...payload }),
  });
  return res.json();
}

export async function apiCreate(resource: string, payload: object) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ resource, action: 'create', ...payload }),
  });
  return res.json();
}

export async function apiDelete(resource: string, id: number) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ resource, action: 'delete', id }),
  });
  return res.json();
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(',')[1];
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: b64, filename: file.name, contentType: file.type, folder }),
      });
      const data = await res.json();
      if (data.url) resolve(data.url);
      else reject(new Error('Upload failed'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
