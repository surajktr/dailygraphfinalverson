const mockData = {
  "articles": [
    {
      "id": "test-456",
      "title": "The Global Impact of Climate Policies",
      "text": "Climate change remains one of the most pressing challenges of our time. Governments across the globe are increasingly recognizing the urgent need to implement comprehensive environmental policies to mitigate the devastating effects of global warming. From investing heavily in renewable energy sources like solar and wind power to imposing stricter regulations on industrial emissions, the transition towards a sustainable future is gaining unprecedented momentum. However, this transition is not without its difficulties. Developing nations often face significant economic hurdles when attempting to adopt green technologies, as the initial costs can be prohibitive. International cooperation and financial assistance are imperative to ensure that no country is left behind in this crucial endeavor. The establishment of global treaties, such as the Paris Agreement, serves as a foundational step, but consistent enforcement and ambitious national commitments are necessary to achieve meaningful, long-term results.",
      "fullTranslationHindi": "जलवायु परिवर्तन हमारे समय की सबसे गंभीर चुनौतियों में से एक बना हुआ है। दुनिया भर की सरकारें ग्लोबल वार्मिंग के विनाशकारी प्रभावों को कम करने के लिए व्यापक पर्यावरण नीतियों को लागू करने की तत्काल आवश्यकता को तेजी से पहचान रही हैं। सौर और पवन ऊर्जा जैसे नवीकरणीय ऊर्जा स्रोतों में भारी निवेश से लेकर औद्योगिक उत्सर्जन पर सख्त नियम लागू करने तक, एक स्थायी भविष्य की ओर संक्रमण अभूतपूर्व गति प्राप्त कर रहा है। हालांकि, यह संक्रमण अपनी कठिनाइयों के बिना नहीं है। विकासशील देशों को अक्सर हरित प्रौद्योगिकियों को अपनाने का प्रयास करते समय महत्वपूर्ण आर्थिक बाधाओं का सामना करना पड़ता है, क्योंकि प्रारंभिक लागत निषेधात्मक हो सकती है। यह सुनिश्चित करने के लिए अंतर्राष्ट्रीय सहयोग और वित्तीय सहायता अनिवार्य है कि इस महत्वपूर्ण प्रयास में कोई देश पीछे न रहे। पेरिस समझौते जैसी वैश्विक संधियों की स्थापना एक आधारभूत कदम के रूप में कार्य करती है, लेकिन सार्थक, दीर्घकालिक परिणाम प्राप्त करने के लिए निरंतर प्रवर्तन और महत्वाकांक्षी राष्ट्रीय प्रतिबद्धताओं की आवश्यकता है।",
      "vocabulary": [
        {
          "word": "mitigate",
          "hindi": "कम करना",
          "definition": "To make something less severe, harmful, or painful."
        },
        {
          "word": "unprecedented",
          "hindi": "अभूतपूर्व",
          "definition": "Never done or known before."
        },
        {
          "word": "prohibitive",
          "hindi": "निषेधात्मक",
          "definition": "Excessively high; difficult or impossible to pay."
        },
        {
          "word": "imperative",
          "hindi": "अनिवार्य",
          "definition": "Of vital importance; crucial."
        },
        {
          "word": "endeavor",
          "hindi": "प्रयास",
          "definition": "An attempt to achieve a goal."
        }
      ],
      "sentenceAnalyses": [
        {
          "sentence": "Governments across the globe are increasingly recognizing the urgent need to implement comprehensive environmental policies to mitigate the devastating effects of global warming.",
          "explanation": "दुनिया भर की सरकारें ग्लोबल वार्मिंग के विनाशकारी प्रभावों को कम करने के लिए व्यापक पर्यावरण नीतियों को लागू करने की तत्काल आवश्यकता को तेजी से पहचान रही हैं।"
        },
        {
          "sentence": "Developing nations often face significant economic hurdles when attempting to adopt green technologies, as the initial costs can be prohibitive.",
          "explanation": "विकासशील देशों को अक्सर हरित प्रौद्योगिकियों को अपनाने का प्रयास करते समय महत्वपूर्ण आर्थिक बाधाओं का सामना करना पड़ता है, क्योंकि प्रारंभिक लागत निषेधात्मक हो सकती है।"
        }
      ]
    }
  ]
};

async function upload() {
  const url = "https://cdwikwwpakmlauiddasz.supabase.co/functions/v1/content-upload-api";
  const apiKey = "dg_api_k3y_2024_s3cur3_upl04d_x7m9p2q";
  
  const payload = {
    type: "editorial",
    upload_date: "2026-06-14",
    title: "The Global Impact of Climate Policies",
    html_content: JSON.stringify(mockData),
    questions: {}
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

upload();
