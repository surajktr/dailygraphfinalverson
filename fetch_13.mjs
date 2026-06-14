import fs from 'fs';

const TELEGRAM_CHAT_ID = '@thedailygraph';
const RSS_URL = 'https://www.thehindu.com/opinion/editorial/feeder/default.rss';
const DEEPSEEK_API_KEY = 'sk-cddbcd96a77444a09bd21951b140edf0';
const PROMPT = `You are a vocabulary extraction engine for SSC/UPSC competitive exam preparation. I have an editorial from The Hindu.
Title: {{TITLE}}
Text: {{TEXT}}

Generate a JSON object containing:
1. "title": The original editorial title as-is.
2. "titleHindi": A one-line Hindi explanation (15-25 words) summarizing what this article discusses.
3. "text": The main article text ONLY. You MUST forcefully ignore and remove ANY subscription messages, copyright notices, metadata, "Published", "Updated", "Fresh News", "Comments", "Terms & conditions", "Additional Subscription Benefits", or other irrelevant footer text.
4. "vocabulary": An array of AT LEAST 40 items. Extract single difficult words (30-33), phrasal verbs (4-6), and idioms/collocations (2-4).
   Each object must have:
   - "word": The extracted word/phrase.
   - "hindi": Simple layman Hindi meaning ONLY. Make it very easy to understand. For example, DO NOT say "उन्मूलन", instead say "जड़ से खत्म करना". DO NOT say "प्रतिकूल", say "विपरीत, उल्टा". DO NOT say "विसंगति", say "असंगति, बेमेलपन". DO NOT say "संवेदनशील", say "भावनात्मक रूप से नाजुक".
   - "definition": Explain the difficult word in simple, everyday layman's language using easy English words. Do NOT use complex synonyms. Make it extremely easy for a beginner to grasp the exact contextual meaning.
5. "sentenceAnalyses": An array containing EVERY single sentence from the text translated into Hindi line-by-line. 
   Each object must have:
   - "sentence": the original English sentence
   - "explanation": The Hindi translation. You MUST use very simple, natural, everyday layman Hindi. DO NOT use complex, formal, or bookish literal translations. Break down long complex English sentences into 2 or 3 short, easy-to-read Hindi sentences.
     Example BAD translation: "राष्ट्रपति डोनाल्ड ट्रंप का ईरान पर हमला करने से पीछे हटने का निर्णय, देश के खार्ग द्वीप को जब्त करने की धमकी देने के कुछ ही घंटों बाद, तेहरान से निपटने में उनकी दुविधा को रेखांकित करता है।"
     Example GOOD translation: "राष्ट्रपति डोनाल्ड ट्रंप ने पहले ईरान के खार्ग द्वीप पर कब्ज़ा करने की धमकी दी थी। लेकिन कुछ ही घंटों बाद, उन्होंने ईरान पर हमला न करने का फैसला किया। उनका यह कदम दिखाता है कि वे ईरान के मामले में काफी उलझन में हैं।"

Return ONLY valid JSON matching this schema.`;

async function fetchDeepSeek(title, text) {
    const prompt = PROMPT.replace('{{TITLE}}', title).replace('{{TEXT}}', text);
    
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-v4-flash",
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Always output strictly valid JSON format." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                })
            });
            
            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`DeepSeek API ${response.status}: ${errBody}`);
            }
            
            const data = await response.json();
            let rawText = data.choices[0].message.content || '{}';
            rawText = rawText.replace(/^```(?:json)?\n?/i, '').replace(/```$/i, '').trim();
            return JSON.parse(rawText);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            console.log(`DeepSeek attempt ${attempt} failed, retrying...`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

function extractArticleText(html) {
    let text = '';
    const articleBodyMatch = html.match(/<[^>]*itemprop\s*=\s*"articleBody"[^>]*>([\s\S]*?)<\/[^>]*>/gi);
    if (articleBodyMatch) {
        articleBodyMatch.forEach(block => {
            const pMatches = block.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
            if (pMatches) {
                pMatches.forEach(p => {
                    text += p.replace(/<[^>]+>/g, '').trim() + '\n';
                });
            }
        });
    }
    
    if (!text.trim()) {
        const allP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        if (allP) {
            allP.forEach(p => {
                text += p.replace(/<[^>]+>/g, '').trim() + '\n';
            });
        }
    }
    
    const finalLines = [];
    for (const line of text.split('\n')) {
        const t = line.trim();
        if (t.length < 30) continue;
        
        // Skip metadata lines
        if (t.includes('Active Subscription')) continue;
        if (t.includes('Subscribed with another email')) continue;
        if (t.includes('Account subscription benefits')) continue;
        if (t.includes('Additional Subscription Benefits')) continue;
        if (t.includes('Terms & conditions')) continue;
        if (t.includes('Comments have to be in English')) break;
        if (t.includes('migrated to a new commenting platform')) break;
        
        finalLines.push(t);
    }
    const filteredText = finalLines.join('\n');
    return filteredText.substring(0, 5000);
}

async function uploadToWebsite(htmlContent, title) {
    console.log('Uploading HTML to website via Supabase API...');
    const uploadDate = '2026-06-13';
    
    const response = await fetch('https://cdwikwwpakmlauiddasz.supabase.co/functions/v1/content-upload-api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'dg_api_k3y_2024_s3cur3_upl04d_x7m9p2q'
        },
        body: JSON.stringify({
            type: 'editorial',
            upload_date: uploadDate,
            title: title || 'Daily Editorial',
            html_content: htmlContent,
            questions: []
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase API returned status ${response.status}: ${errorText}`);
    }
    console.log('Successfully uploaded to website!');
}

async function runBot() {
    try {
        console.log("Fetching RSS...");
        const rssRes = await fetch(RSS_URL);
        if (!rssRes.ok) throw new Error(`RSS fetch failed: ${rssRes.status}`);
        const rssText = await rssRes.text();
        
        // Use regex instead of fast-xml-parser to save a dependency install
        const items = [];
        let match;
        const itemRegex = /<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>[\s\S]*?<\/item>/gi;
        while ((match = itemRegex.exec(rssText)) !== null) {
            let link = match[2];
            if (link.startsWith('<![CDATA[')) {
                link = link.replace('<![CDATA[', '').replace(']]>', '');
            }
            items.push({ title: match[1], link: link });
        }
        
        const itemsToProcess = items.slice(0, 2);
        
        console.log(`Processing ${itemsToProcess.length} articles in parallel...`);
        
        const processPromises = itemsToProcess.map(async (item, i) => {
            console.log(`Fetching: ${item.title}`);
            const articleRes = await fetch(item.link);
            if (!articleRes.ok) return null;
            const html = await articleRes.text();
            
            const text = extractArticleText(html);
            if (!text || text.trim().length < 50) {
                console.log(`Skipped article ${i+1}: No valid text found.`);
                return null;
            }
            
            console.log(`Calling DeepSeek for article ${i+1}...`);
            const data = await fetchDeepSeek(item.title, text);
            
            return {
                id: `hindu-editorial-${Date.now()}-${i}`,
                title: data.title || item.title,
                titleHindi: data.titleHindi || '',
                text: data.text || text,
                imageUrl: null,
                audioUrl: null,
                vocabulary: data.vocabulary || [],
                sentenceAnalyses: data.sentenceAnalyses || []
            };
        });
        
        const processedResults = await Promise.all(processPromises);
        const processedArticles = processedResults.filter(article => article !== null);
        
        if (processedArticles.length === 0) {
            throw new Error("No articles were successfully processed");
        }
        
        const finalJsonData = {
            isStaticExport: true,
            articles: processedArticles,
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
        // Get template text by removing the first line "export const htmlTemplate = `" and the last line "`;"
        let htmlTemplate = templateHtml.replace('export const htmlTemplate = `', '');
        htmlTemplate = htmlTemplate.substring(0, htmlTemplate.lastIndexOf('`;'));

        const injectedHtml = htmlTemplate.replace(
            '<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = null;</script>',
            `<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = ${JSON.stringify(finalJsonData)};</script>`
        );
        
        const masterTitle = processedArticles.map(a => a.title).join(' | ');
        
        try {
            await uploadToWebsite(injectedHtml, "The Hindu Editorial Daily Digest");
        } catch (err) {
            console.error("Website upload error:", err);
        }
        
        console.log("Automation completed!");
    } catch (error) {
        console.error("Automation error:", error);
    }
}

runBot();
