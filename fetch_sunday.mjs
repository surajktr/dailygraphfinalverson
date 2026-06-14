import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = "https://cdwikwwpakmlauiddasz.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkd2lrd3dwYWttbGF1aWRkYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjkzNTcsImV4cCI6MjA3NzE0NTM1N30.02KB2EawFjfiUM0i22-v9TfxEkNqEc4YcXqR9C8xRHg";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSundayScript() {
    console.log("Running Sunday Compilation Script...");
    
    // Simulate IST Time
    const istTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
    const todayStr = istTime.toISOString().split('T')[0];

    const sixDaysAgo = new Date(istTime);
    sixDaysAgo.setDate(istTime.getDate() - 6);
    const startDateStr = sixDaysAgo.toISOString().split('T')[0];
    const endDateStr = new Date(istTime.getTime() - 24*60*60*1000).toISOString().split('T')[0];

    console.log(`Fetching articles from ${startDateStr} to ${endDateStr}...`);

    const { data: pastDays, error: dbError } = await supabase
        .from('daily_graphs')
        .select('html_content, upload_date')
        .gte('upload_date', startDateStr)
        .lte('upload_date', endDateStr);

    if (dbError) {
        console.error("Failed to fetch past days:", dbError);
        return;
    }

    console.log(`Found ${pastDays.length} days of content.`);

    let allVocab = [];
    
    // Extract vocab from all JSON
    for (const day of (pastDays || [])) {
        if (typeof day.html_content === 'string') {
            const match = day.html_content.match(/window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
            if (match && match[1]) {
                try {
                    const parsed = JSON.parse(match[1]);
                    if (parsed.articles) {
                        for (const article of parsed.articles) {
                            if (article.vocabulary) {
                                allVocab = allVocab.concat(article.vocabulary);
                            }
                        }
                    }
                } catch(e) {
                    console.error(`Failed to parse JSON for ${day.upload_date}`);
                }
            }
        }
    }

    console.log(`Extracted a total of ${allVocab.length} vocabulary words.`);

    // Deduplicate vocab by word
    const uniqueVocab = [];
    const seen = new Set();
    for (const v of allVocab) {
        const wordLower = v.word.toLowerCase();
        if (!seen.has(wordLower)) {
            seen.add(wordLower);
            uniqueVocab.push(v);
        }
    }

    console.log(`After deduplication, we have ${uniqueVocab.length} unique vocabulary words.`);

    if (uniqueVocab.length === 0) {
        console.log("No vocabulary found. Exiting.");
        return;
    }

    // Sort alphabetically
    uniqueVocab.sort((a, b) => a.word.localeCompare(b.word));

    // Create fake article for Sunday
    const finalJsonData = {
        isStaticExport: true,
        articles: [
            {
                id: "weekly-revision",
                isWeeklyRevision: true,
                title: "Weekly Vocabulary Revision",
                titleHindi: "साप्ताहिक शब्दावली पुनरीक्षण",
                text: `Here is the complete compilation of all difficult words from the past week (${startDateStr} to ${endDateStr}). Review them to solidify your memory!`,
                vocabulary: uniqueVocab,
                sentenceAnalyses: []
            }
        ],
        synonyms: [],
        oneWordSubstitutions: [],
        idioms: [],
        articleQuizzes: {},
        synonymQuiz: null,
        oneWordQuiz: null,
        idiomQuiz: null
    };

    console.log("Injecting data into HTML template...");
    const templateHtml = fs.readFileSync('C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraph-supabase/supabase/functions/dailygraph-bot/template.ts', 'utf8');
    
    let htmlTemplate = templateHtml.replace('export const htmlTemplate = `', '');
    htmlTemplate = htmlTemplate.substring(0, htmlTemplate.lastIndexOf('`;'));

    const injectedHtml = htmlTemplate.replace(
        '<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = null;</script>',
        `<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = ${JSON.stringify(finalJsonData)};</script>`
    );

    console.log(`Uploading Weekly Revision for ${todayStr}...`);
    try {
        const response = await fetch('https://cdwikwwpakmlauiddasz.supabase.co/functions/v1/content-upload-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'dg_api_k3y_2024_s3cur3_upl04d_x7m9p2q'
            },
            body: JSON.stringify({
                type: 'editorial',
                upload_date: todayStr,
                title: "Weekly Vocabulary Revision",
                html_content: injectedHtml
            })
        });

        if (!response.ok) {
            console.error("Upload failed:", await response.text());
        } else {
            console.log("Successfully uploaded Sunday Revision!");
        }
    } catch (err) {
        console.error("Upload failed exception:", err);
    }
}

runSundayScript();
