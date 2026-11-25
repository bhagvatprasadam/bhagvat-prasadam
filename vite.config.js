import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function paymentGatewayCallbackPlugin() {
  const handler = (req, res, next) => {
    // Check for POST to payment callback routes or checkout routes
    const url = req.url || '';
    if (req.method === 'POST' && (url.startsWith('/checkout') || url.includes('/callback'))) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const bodyParams = new URLSearchParams(body);
          const [urlPath, existingQuery] = url.split('?');
          const finalParams = new URLSearchParams(existingQuery || '');

          for (const [key, value] of bodyParams.entries()) {
            finalParams.set(key, value);
          }

          const queryString = finalParams.toString();
          const targetUrl = urlPath + (queryString ? `?${queryString}` : '');

          // 303 See Other redirects POST request into a GET request
          res.writeHead(303, { Location: targetUrl });
          res.end();
        } catch (err) {
          res.writeHead(303, { Location: url });
          res.end();
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'payment-gateway-callback-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = (env.VITE_API_BASE_URL || 'https://megaecomm.megascale.co.in/backend/api/shop').replace(/\/+$/, '');
  const shopfrontToken = env.SHOPFRONT_TOKEN || env.VITE_API_SHOPFRONT_TOKEN || env.VITE_SHOPFRONT_TOKEN;
  const feedTarget = feed => {
    const target = new URL(`${apiBaseUrl}/${feed}.xml`);
    if (shopfrontToken) target.searchParams.set('token', shopfrontToken);
    return target.toString();
  };

  return {
    plugins: [
      paymentGatewayCallbackPlugin(),
      react()
    ],
    server: {
      port: 3000,
      open: false,
      host: true,
      proxy: {
        '/meta-products.xml': {
          target: feedTarget('meta-products'),
          changeOrigin: true,
          rewrite: () => '',
        },
        '/sitemap.xml': {
          target: feedTarget('sitemap'),
          changeOrigin: true,
          rewrite: () => '',
        },
      },
    },
  };
});
