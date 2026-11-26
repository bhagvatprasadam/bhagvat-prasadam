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

  const apiBaseUrl = (process.env.VITE_API_BASE_URL || 'https://megaecomm.megascale.co.in/backend/api/shop').replace(/\/+$/, '');
  const token = (
    process.env.SHOPFRONT_TOKEN ||
    process.env.VITE_SHOPFRONT_TOKEN ||
    process.env.VITE_API_SHOPFRONT_TOKEN ||
    process.env.SHOPIFY_ADMIN_TOKEN ||
    ''
  ).trim();

  if (!token) {
    res.status(500).send('Storefront token is not configured.');
    return;
  }

  try {
    const target = new URL(`${apiBaseUrl}/${feed}.xml`);
    target.searchParams.set('token', token);

    const response = await fetch(target);
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(`Failed to fetch ${feed} feed:`, error);
    res.status(502).send('Unable to fetch the SEO feed.');
  }
}
