fetch('https://www.newindianexpress.com/opinion').then(r=>r.text()).then(async html=>{
    const regex = /\/opinion\/[0-9]{4}\/[a-zA-Z]{3}\/[0-9]{2}\/[^\"]+/g;
    const matches = [...new Set(html.match(regex))];
    const url = 'https://www.newindianexpress.com' + matches[0];
    const articleHtml = await (await fetch(url)).text();
    
    // Find JSON-LD containing articleBody
    const ldJsonMatches = [...articleHtml.matchAll(/<script type=\"application\/ld\+json\">(\{[\s\S]*?\})<\/script>/g)];
    for (const match of ldJsonMatches) {
        try {
            const data = JSON.parse(match[1]);
            if (data.articleBody) {
                console.log("TITLE:", data.headline || data.name);
                console.log("TEXT:", data.articleBody.substring(0, 100) + '...');
                return;
            }
        } catch(e) {}
    }
    console.log("Could not find articleBody");
});
