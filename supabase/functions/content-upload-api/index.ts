import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Generated API Key - This is your secret key for uploading content
const VALID_API_KEY = "dg_api_k3y_2024_s3cur3_upl04d_x7m9p2q";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API Key
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== VALID_API_KEY) {
      console.log('Invalid API key provided:', apiKey);
      return new Response(
        JSON.stringify({ error: 'Invalid or missing API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { type, upload_date, questions } = body;

    // Validate required fields
    if (!type || !upload_date || !questions) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['type', 'upload_date', 'questions'],
          received: { type: !!type, upload_date: !!upload_date, questions: !!questions }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate type
    if (!['current_affairs', 'topicwise'].includes(type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid type. Must be "current_affairs" or "topicwise"' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate questions format
    if (!Array.isArray(questions)) {
      return new Response(
        JSON.stringify({ error: 'Questions must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if entry exists for this date
    const { data: existing } = await supabase
      .from(type)
      .select('id')
      .eq('upload_date', upload_date)
      .single();

    let result;

    if (existing) {
      // Update existing entry
      const { data, error } = await supabase
        .from(type)
        .update({ 
          questions,
          updated_at: new Date().toISOString()
        })
        .eq('upload_date', upload_date)
        .select()
        .single();

      if (error) throw error;
      result = { action: 'updated', data };
    } else {
      // Insert new entry - use a system user ID for API uploads
      const { data, error } = await supabase
        .from(type)
        .insert({
          upload_date,
          questions,
          user_id: '00000000-0000-0000-0000-000000000000' // System API user
        })
        .select()
        .single();

      if (error) throw error;
      result = { action: 'created', data };
    }

    console.log(`Content ${result.action} for ${type} on ${upload_date}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Content ${result.action} successfully`,
        type,
        upload_date,
        questions_count: questions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in content-upload-api:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
