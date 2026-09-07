import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nometa.app';
  const routes = ['/', '/clean', '/how-it-works', '/pricing', '/privacy', '/terms', '/data-and-cookies', '/security', '/refunds'];
  return routes.map((path) => ({ url: `${base}${path}`, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : 0.6 }));
}
