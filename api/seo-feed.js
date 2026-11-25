const FEEDS = new Set(['meta-products', 'sitemap']);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).send('Method not allowed');
    return;
  }

  const feed = req.query?.feed;
  if (!FEEDS.has(feed)) {
    res.status(404).send('SEO feed not found');
    return;
  }

  const apiBaseUrl = (process.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!apiBaseUrl || !adminToken) {
    res.status(500).send('VITE_API_BASE_URL and SHOPIFY_ADMIN_TOKEN must be configured.');
    return;
  }

  try {
    const target = new URL(`${apiBaseUrl}/${feed}.xml`);
    target.searchParams.set('token', adminToken);
    const response = await fetch(target);
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/xml');
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(`Failed to fetch ${feed} feed:`, error);
    res.status(502).send('Unable to fetch the SEO feed.');
  }
}
