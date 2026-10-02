const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8001';

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('eduos_token') ||
        sessionStorage.getItem('eduos_token')
      : null;

  const headers = new Headers(options.headers || {});

  // JSON requests need Content-Type, but FormData must NOT set it manually.
  // The browser adds the correct multipart boundary automatically.
  if (
    !headers.has('Content-Type') &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail = data?.detail;

    if (Array.isArray(detail)) {
      throw new Error(
        detail.map((item) => item?.msg || String(item)).join(', ')
      );
    }

    throw new Error(
      typeof detail === 'string'
        ? detail
        : response.status === 401
          ? 'Your login session has expired. Please log in again.'
          : 'API request failed.'
    );
  }

  return data;
}

export async function fetchPdfBlob(materialId: number | string) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('eduos_token') ||
        sessionStorage.getItem('eduos_token')
      : null;

  if (!token) {
    throw new Error('You are not logged in. Please log in again.');
  }

  const response = await fetch(
    `${API_BASE_URL}/study-materials/${materialId}/file`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let message = 'Unable to load PDF.';

    try {
      const data = await response.json();

      if (typeof data?.detail === 'string') {
        message = data.detail;
      }
    } catch {}

    if (response.status === 401) {
      message = 'Your login session has expired. Please log in again.';
    }

    throw new Error(message);
  }

  return response.blob();
}
