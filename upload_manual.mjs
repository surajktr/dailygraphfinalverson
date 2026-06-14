import fs from 'fs';

async function run() {
    const todayStr = '2026-06-14';

    const finalJsonData = {
        isStaticExport: true,
        articles: [
            {
                id: "power-dressing-2026",
                title: "The evolving symbolism of power dressing",
                titleHindi: "राजनीति में 'पावर ड्रेसिंग' (कपड़ों) का बदलता महत्व और उसका इतिहास",
                text: "Lawyers sport it. Corporate executives flaunt it. Even callow job aspirants wear it to interviews. But when a newly-minted chief minister shows up in one in Tamil Nadu, it can raise eyebrows. On that rests the power of symbolism and context in political dressing. Power dressing has a whole new meaning in India, thanks to the bittersweet memories of the British Raj. It gets more complicated when dresses reflect style, attitude and contrasting shades of ideology. Given the pluralistic but chequered past of social conflicts in India, outfits can be read like tarot cards, with deep symbolism. Tamil Nadu’s latest actor-leader thundered that his decision to wear a black-and-white suit instead of traditional ethnic clothes symbolised transparency and simplicity. “Is it meant only for people in positions of authority? There is nothing like that,” he said. How things have changed, I said to myself in what seemed like the reverse of a reverse swing. Mahatma Gandhi wore his famous dhoti after shedding the fancy lawyer suits he had sported for decades in Britain and South Africa. The homespun dress led to Winston Churchill’s infamous description of him as a “half-naked fakir”, which in turn helped Gandhi invoke the spirit of swadeshi pride that showed empathy for the suffering masses. Things have come a full circle, because for at least four generations born at the time of India’s independence and later, the black Western jacket signalled not just British colonial domination but simply a sense of authority or an attitude. In that earlier significance, the choice was not between the East and the West conflict, but between an elite and a commoner. The British Raj gave rise to dress options that spelt varying degrees of authority and what fashionistas might call mix-n-match elegance. We had Nobel-prize-winning physicist C V Raman and engineer-statesman Mokshagundam Visvesvaraya wearing Indian turbans with Western jackets. Many swapped trousers for the more comfortable dhoti or its southern variation, the veshti, tied without the formal folds. It was different for B R Ambedkar, noted V S Naipaul in A Million Mutinies Now. The writer described the Dalit icon as somebody who consciously embraced Western dressing to show an affinity with the British so that it would help lift the depressed classes of Hindu society. Naipaul threw in the fact that most Ambedkar statues in Dalit neighbourhoods show him with a book, representing his wish to educate those left behind in a traditional hierarchy. Of course, the book he carries is the Constitution of India, which promises to empower the disenfranchised. Tussles continue in some parts of India over Dalit grooms sporting turbans and riding horses during wedding processions, which are seen as sartorial markers of upper-caste dominance and invite push-back. Ambedkar’s dress code is thus highly relevant as an iconic assertion. In Tamil Nadu, Ambedkarite VCK leader Thol Thirumavalavan can sometimes be spotted wearing the complete Western ensemble including a tie, evidently inspired by his icon. The Ambedkar-Gandhi dichotomy in engaging with British rulers persisted after 1947 in many forms. The corporate culture in ‘boxwallah’ multinationals and the social status commanded by executives in British companies ensured that the suit endured far beyond the end of the Raj. Officers of the Indian Civil Service and its successor Indian Administrative Service kept up the British practices. Jawaharlal Nehru, described by some as a WOG or westernised oriental gentleman, made his nationalistic style statement with the Nehru jacket, a bandhgala attire. Its sleeveless variant is increasingly called the Modi jacket in what the ideologically astute might describe as sheer irony. It is the elite symbolism of the black jacket that perhaps inspired Vijay, whose appeal to Gen Z voters may show what young Indians are looking for today is a modern sense of self-confidence rather than the anti-colonial appeal of earlier power-dressing. Political symbolism in dressing took a different turn in the South when E V Ramasamy Periyar’s Dravida Kazhagam adopted black as its colour of ideological assertion. For Periyar, black was the colour to show the historical enslavement of lower-caste communities. Though the veshti sported by him and his followers often stayed the traditional white. In contrast, leaders of breakaway parties like the DMK and the AIADMK embraced the all-white shirt-and-veshti ensemble. Somewhere along the way, former PM Rajiv Gandhi and DMK leader M K Stalin made everything less fussy. The Nehru family scion was seen occasionally sporting the Western suit, at other times in the Nehru jacket and, for a marathon, even in a round-neck sweatshirt and track pants. Stalin has been photographed in similar outfits during his morning walks and bicycle rides. By and large, dressing now seems more meant for social media banter than for political or ideological symbolism. A fashion faux pas may invite chuckles, but outfit variations are unlikely to invite a dressing down from Gen Z. Immaculately dressed leaders like Shashi Tharoor, who sports Western suits and colourful ethnic weaves with equal aplomb, tell us that ordinary Indians are increasingly comfortable with elegance in various forms. The game has shifted from politics to aesthetics.",
                vocabulary: [
                    { word: "sport", hindi: "पहनना या दिखाना", definition: "To wear or display something proudly." },
                    { word: "flaunt", hindi: "दिखावा करना", definition: "To show off something to get admiration." },
                    { word: "callow", hindi: "नासमझ, अनुभवहीन", definition: "Young and inexperienced." },
                    { word: "aspirants", hindi: "उम्मीदवार, चाहने वाले", definition: "People who have strong ambitions to achieve something." },
                    { word: "newly-minted", hindi: "हाल ही में बना हुआ", definition: "Recently created or newly established." },
                    { word: "raise eyebrows", hindi: "हैरानी पैदा करना", definition: "To cause surprise or mild disapproval." },
                    { word: "symbolism", hindi: "प्रतीकवाद, इशारों में बात कहना", definition: "The use of symbols to represent ideas or qualities." },
                    { word: "bittersweet", hindi: "खट्टा-मीठा, खुशी और दुःख दोनों", definition: "Arousing pleasure mixed with a bit of sadness." },
                    { word: "contrasting", hindi: "एकदम अलग, विपरीत", definition: "Very different from each other." },
                    { word: "pluralistic", hindi: "विविधतापूर्ण, अनेकतावादी", definition: "A society where multiple groups, cultures, or ideas exist together." },
                    { word: "chequered", hindi: "उतार-चढ़ाव भरा", definition: "Marked by periods of varied fortune or disrepute." },
                    { word: "tarot cards", hindi: "भविष्य बताने वाले कार्ड", definition: "Cards used for fortune-telling." },
                    { word: "thundered", hindi: "जोर से बोलना, गरजना", definition: "Spoke very loudly and forcefully." },
                    { word: "transparency", hindi: "पारदर्शिता, खुलापन", definition: "The quality of being open, honest, and easy to understand." },
                    { word: "reverse swing", hindi: "उलटा बदलाव", definition: "A sudden change in the opposite direction." },
                    { word: "shedding", hindi: "त्यागना, उतारना", definition: "Taking off or getting rid of something." },
                    { word: "homespun", hindi: "घर का बुना हुआ, सादा", definition: "Simple and unsophisticated; made at home." },
                    { word: "infamous", hindi: "बदनाम", definition: "Well known for some bad quality or deed." },
                    { word: "invoke", hindi: "आवाहन करना, जगाना", definition: "To call on or appeal to something." },
                    { word: "empathy", hindi: "सहानुभूति, हमदर्दी", definition: "The ability to understand and share the feelings of another." },
                    { word: "domination", hindi: "दबदबा, नियंत्रण", definition: "The exercise of control or influence over someone." },
                    { word: "significance", hindi: "महत्व, मायने", definition: "The quality of being important." },
                    { word: "elite", hindi: "खास वर्ग, उच्च वर्ग", definition: "A select group that is superior in terms of ability or qualities." },
                    { word: "commoner", hindi: "आम आदमी", definition: "An ordinary person, without rank or title." },
                    { word: "elegance", hindi: "खूबसूरती, शालीनता", definition: "The quality of being graceful and stylish." },
                    { word: "embraced", hindi: "अपनाना, गले लगाना", definition: "Accepted or supported a belief or change willingly." },
                    { word: "affinity", hindi: "लगाव, झुकाव", definition: "A natural liking or sympathy for someone or something." },
                    { word: "hierarchy", hindi: "ऊंच-नीच का क्रम", definition: "A system in which people are ranked one above the other according to status." },
                    { word: "disenfranchised", hindi: "अधिकारों से वंचित", definition: "Deprived of power or a right, especially the right to vote." },
                    { word: "tussles", hindi: "झगड़े, संघर्ष", definition: "Vigorous struggles or scuffles." },
                    { word: "sartorial", hindi: "कपड़ों से संबंधित", definition: "Relating to clothes or style of dress." },
                    { word: "dominance", hindi: "प्रभुत्व, अधिकार", definition: "Power and influence over others." },
                    { word: "push-back", hindi: "विरोध, प्रतिक्रिया", definition: "A negative or unfavorable reaction or response." },
                    { word: "assertion", hindi: "दावा, दृढ़ कथन", definition: "A confident and forceful statement of fact or belief." },
                    { word: "ensemble", hindi: "पूरी पोशाक", definition: "A group of items viewed as a whole, often used for outfits." },
                    { word: "dichotomy", hindi: "दो हिस्सों में बंटना, विरोधाभास", definition: "A division or contrast between two things that are opposed." },
                    { word: "endured", hindi: "टिका रहा, सहना", definition: "Lasted over a period of time; suffered patiently." },
                    { word: "astute", hindi: "चतुर, समझदार", definition: "Having an ability to accurately assess situations to one's advantage." },
                    { word: "irony", hindi: "विडंबना", definition: "A situation that is strange or funny because things happen in a way that seems opposite to what you expect." },
                    { word: "enslavement", hindi: "गुलामी", definition: "The action of making someone a slave." },
                    { word: "breakaway", hindi: "अलग होने वाला", definition: "Having separated from a larger group." },
                    { word: "scion", hindi: "वंशज, वारिस", definition: "A descendant of a notable family." },
                    { word: "banter", hindi: "हंसी-मजाक", definition: "The playful and friendly exchange of teasing remarks." },
                    { word: "faux pas", hindi: "गलती, सामाजिक भूल", definition: "An embarrassing remark or act in a social situation." },
                    { word: "chuckles", hindi: "दबी हुई हंसी", definition: "Quiet or suppressed laughs." },
                    { word: "dressing down", hindi: "डांट-फटकार", definition: "A severe reprimand or scolding." },
                    { word: "immaculately", hindi: "साफ-सुथरे ढंग से, बेदाग", definition: "In a perfectly clean, neat, or tidy manner." },
                    { word: "aplomb", hindi: "आत्मविश्वास", definition: "Self-confidence or assurance, especially when in a demanding situation." },
                    { word: "aesthetics", hindi: "सौंदर्यशास्त्र, सुंदरता", definition: "A set of principles concerned with the nature and appreciation of beauty." }
                ],
                sentenceAnalyses: [
                    { sentence: "Lawyers sport it.", explanation: "वकील इसे पहनते हैं।" },
                    { sentence: "Corporate executives flaunt it.", explanation: "कॉर्पोरेट अधिकारी इसका दिखावा करते हैं।" },
                    { sentence: "Even callow job aspirants wear it to interviews.", explanation: "यहाँ तक कि नए और अनुभवहीन नौकरी तलाशने वाले भी इसे इंटरव्यू में पहनकर जाते हैं।" },
                    { sentence: "But when a newly-minted chief minister shows up in one in Tamil Nadu, it can raise eyebrows.", explanation: "लेकिन जब तमिलनाडु में एक नया बना हुआ मुख्यमंत्री इसे पहनकर आता है, तो लोगों को हैरानी होती है।" },
                    { sentence: "On that rests the power of symbolism and context in political dressing.", explanation: "राजनीति में कपड़ों का महत्व इसी प्रतीकवाद और माहौल पर टिका होता है।" },
                    { sentence: "Power dressing has a whole new meaning in India, thanks to the bittersweet memories of the British Raj.", explanation: "भारत में 'पावर ड्रेसिंग' (महत्वपूर्ण दिखने वाले कपड़े पहनने) का एक अलग ही मतलब है। इसके पीछे ब्रिटिश राज की खट्टी-मीठी यादें हैं।" },
                    { sentence: "It gets more complicated when dresses reflect style, attitude and contrasting shades of ideology.", explanation: "यह तब और उलझ जाता है जब कपड़े सिर्फ स्टाइल नहीं, बल्कि नजरिया और अलग-अलग विचारधाराओं को भी दर्शाते हैं।" },
                    { sentence: "Given the pluralistic but chequered past of social conflicts in India, outfits can be read like tarot cards, with deep symbolism.", explanation: "भारत के सामाजिक संघर्षों का इतिहास बहुत विविध और उतार-चढ़ाव भरा रहा है। इसलिए यहाँ पहनावे को भविष्य बताने वाले कार्ड की तरह पढ़ा जा सकता है, जिसके बहुत गहरे मायने होते हैं।" },
                    { sentence: "Tamil Nadu’s latest actor-leader thundered that his decision to wear a black-and-white suit instead of traditional ethnic clothes symbolised transparency and simplicity.", explanation: "तमिलनाडु के नए अभिनेता-नेता ने ज़ोर देकर कहा कि उनका पारंपरिक कपड़ों की जगह काला-सफेद सूट पहनने का फैसला ईमानदारी और सादगी को दिखाता है।" },
                    { sentence: "“Is it meant only for people in positions of authority? There is nothing like that,” he said.", explanation: "उन्होंने कहा, 'क्या यह (सूट) सिर्फ सत्ता में बैठे लोगों के लिए है? ऐसा कुछ नहीं है।'" },
                    { sentence: "How things have changed, I said to myself in what seemed like the reverse of a reverse swing.", explanation: "मैंने खुद से कहा कि चीज़ें कितनी बदल गई हैं। यह किसी पुरानी चीज़ के वापस पलटने जैसा लगता है।" },
                    { sentence: "Mahatma Gandhi wore his famous dhoti after shedding the fancy lawyer suits he had sported for decades in Britain and South Africa.", explanation: "महात्मा गांधी ने ब्रिटेन और दक्षिण अफ्रीका में दशकों तक पहने गए महंगे वकील वाले सूट त्याग दिए थे। उसके बाद उन्होंने अपनी मशहूर धोती पहनी।" },
                    { sentence: "The homespun dress led to Winston Churchill’s infamous description of him as a “half-naked fakir”, which in turn helped Gandhi invoke the spirit of swadeshi pride that showed empathy for the suffering masses.", explanation: "उनके इस साधारण घर के बुने कपड़े को देखकर विंस्टन चर्चिल ने उन्हें 'आधा-नंगा फकीर' कहा था। लेकिन इसी कपड़े ने गांधी जी को 'स्वदेशी गर्व' जगाने में मदद की, जो गरीब जनता के प्रति उनकी हमदर्दी दिखाता था।" },
                    { sentence: "Things have come a full circle, because for at least four generations born at the time of India’s independence and later, the black Western jacket signalled not just British colonial domination but simply a sense of authority or an attitude.", explanation: "अब बात फिर से वहीं आ गई है। आज़ादी के समय और उसके बाद पैदा हुई कम से कम चार पीढ़ियों के लिए, काली पश्चिमी जैकेट सिर्फ ब्रिटिश गुलामी का नहीं, बल्कि अधिकार और रूतबे का प्रतीक थी।" },
                    { sentence: "In that earlier significance, the choice was not between the East and the West conflict, but between an elite and a commoner.", explanation: "उस पुराने समय में, यह चुनाव पूरब (भारत) और पश्चिम (ब्रिटेन) के बीच का नहीं था। बल्कि यह एक खास वर्ग (अमीर/पढ़े-लिखे) और आम आदमी के बीच का चुनाव था।" },
                    { sentence: "The British Raj gave rise to dress options that spelt varying degrees of authority and what fashionistas might call mix-n-match elegance.", explanation: "ब्रिटिश राज ने ऐसे कपड़ों का चलन शुरू किया जो अलग-अलग स्तर के अधिकार को दिखाते थे। इसे आज के फैशन के जानकारों की भाषा में 'मिक्स-एंड-मैच' (मिला-जुला स्टाइल) कह सकते हैं।" },
                    { sentence: "We had Nobel-prize-winning physicist C V Raman and engineer-statesman Mokshagundam Visvesvaraya wearing Indian turbans with Western jackets.", explanation: "नोबेल पुरस्कार जीतने वाले वैज्ञानिक सी.वी. रमन और महान इंजीनियर एम. विश्वेश्वरैया पश्चिमी जैकेट के साथ भारतीय पगड़ी पहनते थे।" },
                    { sentence: "Many swapped trousers for the more comfortable dhoti or its southern variation, the veshti, tied without the formal folds.", explanation: "कई लोगों ने पैंट की जगह ज्यादा आरामदायक धोती या दक्षिण भारतीय 'वेष्टि' पहनना शुरू किया। इसे वे बिना किसी औपचारिक सिलवट के पहनते थे।" },
                    { sentence: "It was different for B R Ambedkar, noted V S Naipaul in A Million Mutinies Now.", explanation: "लेकिन बी.आर. अंबेडकर के लिए बात अलग थी। ऐसा लेखक वी.एस. नायपॉल ने अपनी किताब 'ए मिलियन म्यूटनीज़ नाउ' में लिखा था।" },
                    { sentence: "The writer described the Dalit icon as somebody who consciously embraced Western dressing to show an affinity with the British so that it would help lift the depressed classes of Hindu society.", explanation: "लेखक ने दलित नेता (अंबेडकर) को एक ऐसे व्यक्ति के रूप में दिखाया, जिसने जानबूझकर पश्चिमी कपड़ों को अपनाया। उनका मकसद अंग्रेजों के साथ जुड़ाव दिखाना था, ताकि हिंदू समाज के दबे-कुचले वर्गों को ऊपर उठाने में मदद मिल सके।" },
                    { sentence: "Naipaul threw in the fact that most Ambedkar statues in Dalit neighbourhoods show him with a book, representing his wish to educate those left behind in a traditional hierarchy.", explanation: "नायपॉल ने यह भी बताया कि दलित बस्तियों में अंबेडकर की ज़्यादातर मूर्तियों में उनके हाथ में एक किताब होती है। यह किताब उनकी इस इच्छा को दिखाती है कि पुरानी जाति व्यवस्था में पीछे रह गए लोगों को शिक्षित किया जाए।" },
                    { sentence: "Of course, the book he carries is the Constitution of India, which promises to empower the disenfranchised.", explanation: "बेशक, उनके हाथ में जो किताब है वह भारत का संविधान है। यह संविधान अधिकारों से वंचित लोगों को ताक़त देने का वादा करता है।" },
                    { sentence: "Tussles continue in some parts of India over Dalit grooms sporting turbans and riding horses during wedding processions, which are seen as sartorial markers of upper-caste dominance and invite push-back.", explanation: "भारत के कुछ हिस्सों में आज भी दलित दूल्हों के शादी में पगड़ी पहनने और घोड़े पर बैठने पर झगड़े होते हैं। इन चीज़ों को ऊंची जाति के दबदबे का प्रतीक माना जाता है और इसलिए इनका विरोध होता है।" },
                    { sentence: "Ambedkar’s dress code is thus highly relevant as an iconic assertion.", explanation: "इसलिए अंबेडकर का कपड़े पहनने का तरीका आज भी अपने हक़ को जताने का एक बहुत बड़ा प्रतीक है।" },
                    { sentence: "In Tamil Nadu, Ambedkarite VCK leader Thol Thirumavalavan can sometimes be spotted wearing the complete Western ensemble including a tie, evidently inspired by his icon.", explanation: "तमिलनाडु में, वीसीके पार्टी के नेता और अंबेडकर के अनुयायी थोल थिरुमावलवन कभी-कभी पूरी पश्चिमी पोशाक (टाई के साथ) पहने नज़र आते हैं। यह साफ तौर पर उनके आदर्श (अंबेडकर) से प्रेरित है।" },
                    { sentence: "The Ambedkar-Gandhi dichotomy in engaging with British rulers persisted after 1947 in many forms.", explanation: "अंग्रेजों से निपटने के मामले में अंबेडकर और गांधी की अलग-अलग सोच 1947 (आज़ादी) के बाद भी कई रूपों में बनी रही।" },
                    { sentence: "The corporate culture in ‘boxwallah’ multinationals and the social status commanded by executives in British companies ensured that the suit endured far beyond the end of the Raj.", explanation: "विदेशी कंपनियों का तौर-तरीका और ब्रिटिश कंपनियों के अधिकारियों के रुतबे ने यह सुनिश्चित किया कि अंग्रेज़ों के जाने के बाद भी 'सूट' का चलन बना रहे। (इसे सत्यजीत रे की 1971 की फिल्म 'सीमाबद्ध' में बहुत अच्छे से दिखाया गया है)।" },
                    { sentence: "Officers of the Indian Civil Service and its successor Indian Administrative Service kept up the British practices.", explanation: "इंडियन सिविल सर्विस और बाद में इंडियन एडमिनिस्ट्रेटिव सर्विस (IAS) के अधिकारियों ने भी ब्रिटिश तौर-तरीकों को कायम रखा।" },
                    { sentence: "Jawaharlal Nehru, described by some as a WOG or westernised oriental gentleman, made his nationalistic style statement with the Nehru jacket, a bandhgala attire.", explanation: "जवाहरलाल नेहरू, जिन्हें कुछ लोग 'पश्चिमी रंग में रंगा हुआ भारतीय' मानते थे, ने अपना एक राष्ट्रवादी स्टाइल बनाया। उन्होंने बंद गले वाली 'नेहरू जैकेट' पहनी।" },
                    { sentence: "Its sleeveless variant is increasingly called the Modi jacket in what the ideologically astute might describe as sheer irony.", explanation: "इस जैकेट के बिना बाजू वाले रूप को अब 'मोदी जैकेट' कहा जाने लगा है। समझदार लोग इसे एक बहुत बड़ी विडंबना (हैरानी की बात) कह सकते हैं।" },
                    { sentence: "It is the elite symbolism of the black jacket that perhaps inspired Vijay, whose appeal to Gen Z voters may show what young Indians are looking for today is a modern sense of self-confidence rather than the anti-colonial appeal of earlier power-dressing.", explanation: "काली जैकेट के इसी रूतबे ने शायद (अभिनेता-नेता) विजय को प्रेरित किया। नई पीढ़ी (Gen Z) के बीच उनकी लोकप्रियता दिखाती है कि आज का युवा वर्ग क्या चाहता है। वे पहले की तरह अंग्रेज़ों का विरोध दिखाने वाले कपड़े नहीं, बल्कि एक आधुनिक और आत्मविश्वास से भरा स्टाइल चाहते हैं।" },
                    { sentence: "Political symbolism in dressing took a different turn in the South when E V Ramasamy Periyar’s Dravida Kazhagam adopted black as its colour of ideological assertion.", explanation: "दक्षिण भारत में कपड़ों के ज़रिए राजनीति दिखाने का एक अलग ही रूप सामने आया। यह तब हुआ जब ई.वी. रामासामी पेरियार की पार्टी (द्रविड़ कड़गम) ने अपनी विचारधारा जताने के लिए काले रंग को अपना लिया।" },
                    { sentence: "For Periyar, black was the colour to show the historical enslavement of lower-caste communities.", explanation: "पेरियार के लिए काला रंग निचली जातियों की पुरानी गुलामी को दिखाने का प्रतीक था।" },
                    { sentence: "Though the veshti sported by him and his followers often stayed the traditional white.", explanation: "हालाँकि, उनके और उनके समर्थकों द्वारा पहनी जाने वाली 'वेष्टि' (धोती) अक्सर पारंपरिक सफ़ेद ही होती थी।" },
                    { sentence: "In contrast, leaders of breakaway parties like the DMK and the AIADMK embraced the all-white shirt-and-veshti ensemble.", explanation: "इसके विपरीत, डीएमके और एआईएडीएमके जैसी अलग हुई पार्टियों के नेताओं ने पूरी तरह से सफ़ेद शर्ट और वेष्टि पहनने का तरीका अपनाया।" },
                    { sentence: "Somewhere along the way, former PM Rajiv Gandhi and DMK leader M K Stalin made everything less fussy.", explanation: "समय के साथ, पूर्व प्रधानमंत्री राजीव गांधी और डीएमके नेता एम.के. स्टालिन ने इस पहनावे को थोड़ा आसान और सामान्य बना दिया।" },
                    { sentence: "The Nehru family scion was seen occasionally sporting the Western suit, at other times in the Nehru jacket and, for a marathon, even in a round-neck sweatshirt and track pants.", explanation: "नेहरू परिवार के वारिस (राजीव गांधी) कभी-कभी पश्चिमी सूट पहनते थे, तो कभी नेहरू जैकेट। यहाँ तक कि एक मैराथन दौड़ के दौरान उन्होंने गोल गले वाली स्वेटशर्ट और ट्रैक पैंट भी पहनी थी।" },
                    { sentence: "Stalin has been photographed in similar outfits during his morning walks and bicycle rides.", explanation: "स्टालिन की भी सुबह की सैर और साइकिल चलाने के दौरान ऐसे ही (कैज़ुअल) कपड़ों में तस्वीरें सामने आई हैं।" },
                    { sentence: "By and large, dressing now seems more meant for social media banter than for political or ideological symbolism.", explanation: "कुल मिलाकर, अब कपड़े पहनना राजनीतिक या वैचारिक प्रतीकों से ज़्यादा सोशल मीडिया पर हंसी-मज़ाक का विषय बन गया है।" },
                    { sentence: "A fashion faux pas may invite chuckles, but outfit variations are unlikely to invite a dressing down from Gen Z.", explanation: "अगर कोई फैशन में गलती करता है, तो लोग उस पर थोड़ा हंस सकते हैं। लेकिन कपड़ों में बदलाव करने पर आज की नई पीढ़ी (Gen Z) शायद ही किसी को बुरी तरह डांटेगी।" },
                    { sentence: "Immaculately dressed leaders like Shashi Tharoor, who sports Western suits and colourful ethnic weaves with equal aplomb, tell us that ordinary Indians are increasingly comfortable with elegance in various forms.", explanation: "शशि थरूर जैसे बहुत सलीके से कपड़े पहनने वाले नेता पश्चिमी सूट और रंग-बिरंगे पारंपरिक कपड़े, दोनों ही बड़े आत्मविश्वास से पहनते हैं। यह हमें बताता है कि आम भारतीय अब अलग-अलग तरह के सुंदर पहनावे को आसानी से स्वीकार कर रहे हैं।" },
                    { sentence: "The game has shifted from politics to aesthetics.", explanation: "अब बात राजनीति से हटकर खूबसूरती और अच्छे दिखने पर आ गई है।" }
                ]
            }
        ]
    };

    console.log("Injecting data into HTML template...");
    const templateHtml = fs.readFileSync('C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraph-supabase/supabase/functions/dailygraph-bot/template.ts', 'utf8');
    
    let htmlTemplate = templateHtml.replace('export const htmlTemplate = `', '');
    htmlTemplate = htmlTemplate.substring(0, htmlTemplate.lastIndexOf('`;'));

    const injectedHtml = htmlTemplate.replace(
        '<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = null;</script>',
        `<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = ${JSON.stringify(finalJsonData).replace(/\\/g, '\\\\').replace(/"/g, '\\"')};</script>`
    );
    // Wait, the stringify alone is enough if we don't enclose in extra quotes. 
    // JSON.stringify() outputs a valid string representation of the object. 
    // In Javascript context, we don't need to escape the quotes because it's directly assigned to a variable!
    const properInjectedHtml = htmlTemplate.replace(
        '<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = null;</script>',
        `<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = ${JSON.stringify(finalJsonData)};</script>`
    );

    console.log(`Uploading article for ${todayStr}...`);
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
                title: "The evolving symbolism of power dressing",
                html_content: properInjectedHtml,
                questions: []
            })
        });

        if (!response.ok) {
            console.error("Upload failed:", await response.text());
        } else {
            console.log("Successfully uploaded article!");
        }
    } catch (err) {
        console.error("Upload failed exception:", err);
    }
}

run();
