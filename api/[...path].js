const UPSTREAM_ORIGIN = 'https://megaecomm.megascale.co.in';
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);

function getPathSegments(path) {
  const rawPath = Array.isArray(path) ? path.join('/') : String(path || '');
  const segments = rawPath.split('/').filter(Boolean);

  if (segments.some(segment => segment === '.' || segment === '..')) {
    return null;
  }

  return segments;
}

function appendQuery(searchParams, query) {
  for (const [key, value] of Object.entries(query)) {
    if (key === 'path' || key === 'token' || value === undefined || value === null) continue;

    for (const item of Array.isArray(value) ? value : [value]) {
      searchParams.append(key, String(item));
    }
  }
}

export default async function handler(req, res) {
  const token = process.env.SHOPFRONT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Shopfront API is not configured.' });
  }

  const segments = getPathSegments(req.query && req.query.path);
  if (!segments || segments.length === 0) {
    return res.status(400).json({ error: 'Invalid API path.' });
  }

  const method = req.method || 'GET';
  if (!ALLOWED_METHODS.has(method)) {
    res.setHeader('Allow', Array.from(ALLOWED_METHODS).join(', '));
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const path = segments.map(encodeURIComponent).join('/');
  let upstreamPath;
  const searchParams = new URLSearchParams();
  appendQuery(searchParams, req.query || {});

  if (path === 'meta-products.xml' || path === 'sitemap.xml') {
    upstreamPath = `/backend/api/shop/${path}`;
    searchParams.set('token', token);
  } else if (path === 'customers' || path.startsWith('customers/')) {
    upstreamPath = `/backend/api/${path}`;
  } else {
    const shopPath = path.startsWith('shop/') ? path.slice('shop/'.length) : path;
    upstreamPath = `/backend/api/shop/${shopPath}`;
  }

  const upstreamUrl = new URL(upstreamPath, UPSTREAM_ORIGIN);
  upstreamUrl.search = searchParams.toString();

  const headers = new Headers({
    'X-Shopfront-Token': token,
    'Accept': req.headers.accept || 'application/json',
  });
  for (const headerName of ['content-type', 'authorization', 'x-cart-token']) {
    const value = req.headers[headerName];
    if (value) headers.set(headerName, value);
  }

  let body;
  if (method !== 'GET' && method !== 'HEAD' && req.body !== undefined) {
    body = typeof req.body === 'string' || Buffer.isBuffer(req.body)
      ? req.body
      : JSON.stringify(req.body);
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, { method, headers, body });
    res.status(upstreamResponse.status);

    for (const headerName of ['content-type', 'cache-control', 'etag', 'last-modified']) {
      const value = upstreamResponse.headers.get(headerName);
      if (value) res.setHeader(headerName, value);
    }

    return res.send(Buffer.from(await upstreamResponse.arrayBuffer()));
  } catch (error) {
    console.error('Shopfront API proxy request failed:', error);
    return res.status(502).json({ error: 'Shopfront API is unavailable.' });
  }
}