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
    if (!['current_affairs', 'topicwise', 'editorial'].includes(type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid type. Must be "current_affairs", "topicwise", or "editorial"' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate content format based on type
    if (type === 'editorial') {
      const { html_content, title } = body;
      if (!html_content) {
        return new Response(
          JSON.stringify({ error: 'html_content is required for editorial type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      if (!Array.isArray(questions)) {
        return new Response(
          JSON.stringify({ error: 'Questions must be an array for current_affairs/topicwise' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;
    
    if (type === 'editorial') {
      const { html_content, title } = body;
      
      // Check if entry exists for this date in daily_graphs
      const { data: existing } = await supabase
        .from('daily_graphs')
        .select('id')
        .eq('upload_date', upload_date)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('daily_graphs')
          .update({ 
            html_content,
            title: title || null,
            updated_at: new Date().toISOString()
          })
          .eq('upload_date', upload_date)
          .select()
          .single();

        if (error) throw error;
        result = { action: 'updated', data };
      } else {
        const { data, error } = await supabase
          .from('daily_graphs')
          .insert({
            upload_date,
            html_content,
            title: title || null,
            user_id: '00000000-0000-0000-0000-000000000000'
          })
          .select()
          .single();

        if (error) throw error;
        result = { action: 'created', data };
      }

      console.log(`Editorial ${result.action} for ${upload_date}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Editorial ${result.action} successfully`,
          type,
          upload_date,
          title: title || null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle current_affairs and topicwise
    const { data: existing } = await supabase
      .from(type)
      .select('id')
      .eq('upload_date', upload_date)
      .single();

    if (existing) {
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
      const { data, error } = await supabase
        .from(type)
        .insert({
          upload_date,
          questions,
          user_id: '00000000-0000-0000-0000-000000000000'
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
