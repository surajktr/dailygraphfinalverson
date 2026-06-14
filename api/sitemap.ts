import { createClient } from '@supabase/supabase-js';

// Helper to convert title to slug
function createSlug(text: string) {
  if (!text) return 'editorial';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default async function handler(req: any, res: any) {
  // Set headers early
  res.setHeader('Content-Type', 'application/xml');
  // Cache the sitemap at the Edge for 1 hour, stale-while-revalidate for up to 24 hours
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all upload dates and html_content
    const { data, error } = await supabase
      .from('daily_graphs')
      .select('upload_date, html_content')
      .not('html_content', 'is', null)
      .order('upload_date', { ascending: false });

    if (error) throw error;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Always include the homepage
    xml += `
  <url>
    <loc>https://dailygraph.in/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dailygraph.in/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://dailygraph.in/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://dailygraph.in/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://dailygraph.in/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://dailygraph.in/disclaimer</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Include all dynamic article routes
    if (data && data.length > 0) {
      for (const article of data) {
        if (!article.upload_date) continue;

        let title = '';

        try {
          if (typeof article.html_content === 'string') {
            // First try basic JSON parse
            try {
              const parsed = JSON.parse(article.html_content);
              if (parsed && parsed.articles && parsed.articles[0]) {
                title = parsed.articles[0].title;
              }
            } catch (e) {
              // If not JSON, it might be HTML containing __INITIAL_DATA__
              const match = article.html_content.match(/window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
              if (match && match[1]) {
                const parsedData = JSON.parse(match[1]);
                if (parsedData && parsedData.articles && parsedData.articles[0]) {
                  title = parsedData.articles[0].title;
                }
              }
            }
          } else if (article.html_content && typeof article.html_content === 'object') {
            // If Supabase already parsed it as JSONB
            const obj = article.html_content as any;
            if (obj.articles && obj.articles[0]) {
              title = obj.articles[0].title;
            }
          }
        } catch (err) {
          // Ignore parsing errors for individual articles to ensure the rest of the sitemap loads
          console.error(`Failed to parse article for date ${article.upload_date}`, err);
        }

        const slug = createSlug(title);
        // Include the slug if it exists, otherwise just the date
        const urlPath = slug && slug !== 'editorial' ? `/date/${article.upload_date}/${slug}` : `/date/${article.upload_date}`;

        xml += `
  <url>
    <loc>https://dailygraph.in${urlPath}</loc>
    <lastmod>${article.upload_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    xml += `\n</urlset>`;

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Even if it fails, return a valid basic sitemap to avoid completely breaking SEO
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://dailygraph.in/</loc>\n  </url>\n</urlset>`;
    res.status(500).send(fallbackXml);
  }
}
