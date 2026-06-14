import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Set headers so this isn't cached
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json');

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ status: 'error', message: 'Missing DB config' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ping the database by checking for exactly 1 row (fastest possible query)
    const { data, error } = await supabase
      .from('daily_graphs')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Health check DB error:', error);
      return res.status(500).json({ status: 'error', message: 'Database unreachable' });
    }

    return res.status(200).json({
      status: 'ok',
      message: 'All systems operational',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Health check exception:', err);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}
