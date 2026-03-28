import { GoogleGenAI, Type, Modality } from "@google/genai";

// This MUST match the name VITE_GEMINI_API_KEY exactly
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("API Key not found! Check your Vercel settings. Make sure it starts with VITE_.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

// Persistent cache using localStorage
const getCache = () => {
  try {
    const saved = localStorage.getItem('gemini_news_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      const map = new Map<string, { data: any; timestamp: number }>();
      Object.entries(parsed).forEach(([key, value]: [string, any]) => {
        map.set(key, value);
      });
      return map;
    }
  } catch (e) {
    console.error("Failed to load cache from localStorage", e);
  }
  return new Map<string, { data: any; timestamp: number }>();
};

const saveCache = (map: Map<string, { data: any; timestamp: number }>) => {
  try {
    const obj = Object.fromEntries(map);
    localStorage.setItem('gemini_news_cache', JSON.stringify(obj));
  } catch (e) {
    console.error("Failed to save cache to localStorage", e);
  }
};

const cache = getCache();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours for persistent cache

export const STATIC_NEWS: NewsArticle[] = [
  {
    id: "static-1",
    title: "The 2026 Pentagon AI Surge: A $153 Billion Bet on Digital Warfare",
    content: "In a move that signaling a fundamental shift in American military doctrine, the Pentagon announced today it is fast-tracking $153 billion in new funding for 2026 to modernize the U.S. military with advanced Artificial Intelligence (AI) and autonomous systems. This funding, which was originally slated to be spread over five years, is being \"compressed\" into a single fiscal year to ensure the U.S. maintains a technological edge over China's rapidly advancing \"intelligentized\" warfare capabilities. The Department of Defense report emphasizes that these funds will be poured into AI-driven missile defense, autonomous naval \"ghost fleets,\" and battlefield data-processing tools designed to make split-second decisions. However, the acceleration has sparked a fierce debate in the House Armed Services Committee, where critics argue that such massive, rapid spending bypasses essential oversight and risks deploying lethal autonomous systems before ethical guardrails are fully matured. This \"AI Arms Race\" spending is expected to be a central theme of tonight’s State of the Union address, as the administration frames technological supremacy as the only path to preventing a global conflict.",
    category: "Politics",
    author: "Defense Correspondent",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/pentagon/800/600"
  },
  {
    id: "static-2",
    title: "The \"Bridge Tariff\" Crisis: US Trade Policy in Limbo",
    content: "While the Supreme Court may have struck down President Trump’s original \"Liberation Day\" tariffs on February 20, the White House effectively bypassed that ruling today by triggering Section 122 of the Trade Act of 1974. Starting at midnight, U.S. Customs began collecting a new 10% \"bridge tariff\" on nearly all global imports. This temporary measure is designed to last 150 days, serving as a legal placeholder while the administration attempts to negotiate more permanent trade laws with a reluctant Congress. The move has created absolute chaos in the global markets today; while the President had threatened a 15% rate on social media over the weekend, the actual implementation at 10% has left businesses in a state of \"expensive confusion.\" In London and Tokyo, trade ministers have expressed \"extreme frustration,\" noting that the sudden policy shifts make it nearly impossible for firms to calculate margins for goods currently in transit. This maneuver is being viewed by legal experts as a direct challenge to the Supreme Court’s authority, setting the stage for a constitutional showdown over who truly controls the nation's \"purse strings\" regarding international trade.",
    category: "Economy",
    author: "Trade Analyst",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/tariff/800/600"
  },
  {
    id: "static-3",
    title: "Escalating Tensions: The Taliban-Pakistan Airstrike Dispute",
    content: "The geopolitical situation in South Asia has reached a boiling point today as UN Deputy Chief Rosemary DiCarlo engaged in a high-stakes phone call with the Taliban’s Foreign Ministry to discuss recent Pakistani airstrikes inside Afghan territory. These strikes, which took place over the weekend in the Nangarhar and Paktika provinces, reportedly killed 13 civilians, according to UN monitors. While Pakistan maintains the strikes were a necessary \"act of self-defense\" targeting TTP (Tehrik-i-Taliban Pakistan) militants who have been launching cross-border attacks, the Taliban government has formally filed a complaint with the UN Security Council, labeling the move a violation of sovereignty. Today, the situation grew even more complex as Iran offered to mediate between the two neighbors, fearing that a full-scale border war would destabilize the entire region and trigger a massive new wave of refugees. The UN is now under intense pressure to intervene before the escalating \"tit-for-tat\" skirmishes lead to a permanent breakdown of the fragile peace in the region.",
    category: "General",
    author: "Global Security Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/southasia/800/600"
  },
  {
    id: "static-4",
    title: "South Korea’s Legal Drama: Ousted President Yoon Appeals Life Sentence",
    content: "In Seoul, the political world is transfixed by the legal battle of ousted President Yoon Suk Yeol, who today officially filed an appeal against his life sentence for the controversial martial law decree of late 2025. The Seoul High Court is now the center of a national divide; supporters of the former president held a massive rally outside the courthouse today, claiming the sentence is \"political revenge,\" while counter-protesters demanded the sentence be upheld to protect the country's democracy. This appeal comes at a time of extreme vulnerability for South Korea, as the current transitional government struggles to manage a slowing economy and a cooling relationship with Washington. The outcome of this case is seen as a litmus test for the independence of the South Korean judiciary and will likely dictate the country’s political stability for the remainder of the decade",
    category: "Politics",
    author: "Seoul Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/seoul/800/600"
  },
  {
    id: "static-5",
    title: "Nigeria’s Constitutional Pivot: The Move Toward State Police",
    content: "In a significant departure from Nigeria’s historically centralized security architecture, President Bola Tinubu used an interfaith fast gathering today in Abuja to signal a definitive push for the establishment of State Police. Addressing a diverse group of governors and religious leaders, the President emphasized that the current \"dark tunnel of uncertainty\" regarding national security can only be cleared by empowering local levels of government to protect their own citizens. This policy shift comes as a response to years of escalating banditry and kidnapping that have overwhelmed the federal police force. By promising that \"security is the foundation of prosperity,\" Tinubu is attempting to build a bipartisan consensus between Muslim and Christian leaders to support a constitutional amendment that would allow states to manage their own law enforcement. Critics, however, warn that without stringent federal oversight, state-controlled police could become tools for local political intimidation, setting the stage for a fierce legislative battle in the National Assembly over the coming months.",
    category: "Politics",
    author: "Abuja Correspondent",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/nigeria/800/600"
  },
  {
    id: "static-6",
    title: "Japan’s \"Ocean of Peace\" Initiative: Shinjiro Koizumi’s Pacific Strategy",
    content: "Japanese Defense Minister Shinjiro Koizumi made a bold diplomatic play today in Tokyo, hosting defense chiefs from 14 Pacific island nations for the Japan Pacific Islands Defense Dialogue. Koizumi’s speech centered on building a \"multilayered network\" to ensure a \"free and open\" Indo-Pacific, explicitly stating that attempts to change the status quo by force—a veiled reference to China’s naval expansion—will not be tolerated. Simultaneously, the Japanese government revealed a strategic pivot toward Europe’s defense market, with high-level delegations currently visiting Finland and Sweden to match Japanese technological expertise with European dual-use military needs. This dual-track strategy marks a historic evolution in Japan’s post-war pacifist stance, as Tokyo seeks to reduce its defense reliance on the United States by becoming a primary security partner for both the Pacific islands and the European Union.",
    category: "Politics",
    author: "Tokyo Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/japan/800/600"
  },
  {
    id: "static-7",
    title: "The Brazil-US Standoff: Coup Convictions Meet Trade Retaliation",
    content: "The diplomatic relationship between Brasília and Washington has reached its lowest point in decades following the recent conviction of former President Jair Bolsonaro for his role in the 2023 attempted coup. Today, as President Luiz Inácio Lula da Silva continues to laud the judiciary for \"fulfilling its role\" in protecting democracy, the administration is simultaneously grappling with the fallout of U.S.-imposed 50% tariffs on Brazilian goods. President Trump has labeled the trial a \"witch hunt\" and a personal attack on his ally, leading to a tit-for-tat economic war that has seen Brazil condemn the use of \"force against our democracy\" via economic coercion. With Lula now confirmed to seek re-election in the 2026 general election to prevent \"troglodytes\" from returning to power, Brazil is pivoting its trade focus toward the BRICS bloc and South Korea to offset the loss of the American market.",
    category: "Politics",
    author: "Brasília Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/brazil/800/600"
  },
  {
    id: "static-8",
    title: "African Union's Quest for \"Health Sovereignty\"",
    content: "Following the conclusion of the 39th African Union Summit in Addis Ababa, the continent’s leaders today began implementing a landmark \"Health Sovereignty\" framework. With Tanzania’s President Samia Suluhu Hassan designated as the AU Champion for Reproductive and Maternal Health, the initiative seeks to drastically reduce Africa’s dependence on foreign aid and fragile global supply chains. The policy, which was a central pillar of the summit, mandates that member states increase domestic financing for health infrastructure to combat the fact that Sub-Saharan Africa still accounts for 70% of global maternal deaths. This movement toward self-reliance is being framed as a necessary survival tactic in a \"new world order\" where international partners, particularly the U.S., have significantly cut foreign humanitarian aid to prioritize domestic spending.",
    category: "Health",
    author: "Addis Ababa Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/africa/800/600"
  },
  {
    id: "static-9",
    title: "Philippine Power Struggle: Impeachment vs. 2028 Presidential Ambitions",
    content: "The political landscape in Manila is currently defined by a high-stakes \"war of attrition\" between the House of Representatives and Vice President Sara Duterte. Today, as a fourth impeachment complaint was endorsed against her by Manila Representative Bienvenido Abante Jr., Duterte countered by officially announcing her 2028 presidential bid. Supporters view the impeachment attempts as a coordinated effort by the \"Lakas-CMD\" bloc to derail her political future, while opponents argue the Vice President is using her early campaign announcement to divert public attention from allegations of fund mismanagement. This domestic turmoil coincides with the Philippines' current ASEAN chairmanship, where the country is leading a critical review of the \"Five-Point Consensus\" on Myanmar, leaving many to wonder if the internal political infighting will diminish the Philippines' ability to lead on the regional stage.",
    category: "Politics",
    author: "Manila Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/manila/800/600"
  }
];

export const STATIC_SPORTS_NEWS: NewsArticle[] = [
  {
    id: "sports-1",
    title: "Winter Olympics: USA Ends 46-Year Gold Drought in Ice Hockey",
    content: "The Milano Cortina 2026 Winter Games concluded with a historic victory for Team USA as they defeated longtime rival Canada 2-1 in a thrilling overtime final. Jack Hughes scored the \"Golden Goal\" to secure the first American men’s ice hockey gold since the 1980 \"Miracle on Ice.\" The Games officially closed with Norway topping the medal table for the third consecutive time with 18 golds, while cross-country skier Johannes Høsflot Klæbo set a new world record by winning six gold medals in a single Olympic edition.",
    category: "Sports",
    author: "Olympic Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/hockey/800/600"
  },
  {
    id: "sports-2",
    title: "Cricket: South Africa Stuns India in T20 World Cup Super 8s",
    content: "In a high-stakes encounter at the Narendra Modi Stadium, South Africa defeated India by 76 runs to shake up the T20 World Cup Super 8 standings. India’s chase faltered against a disciplined Proteas bowling attack, complicating their path to the semi-finals. Meanwhile, Zimbabwe has emerged as the \"Cinderella team\" of the tournament; after a rain-washed draw against Ireland knocked out powerhouse Australia, Zimbabwe is now preparing for a critical Super 8 showdown against the West Indies in Mumbai.",
    category: "Sports",
    author: "Cricket Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/cricket/800/600"
  },
  {
    id: "sports-3",
    title: "Golf: Jacob Bridgeman Clinches Maiden PGA Tour Title",
    content: "American golfer Jacob Bridgeman secured his first-ever PGA Tour victory at the prestigious Genesis Invitational on Sunday. Bridgeman held his nerve under immense pressure at Riviera, shooting a final-round 72 to finish at 18-under par. He managed to hold off a late surge from world number one Rory McIlroy and Kurt Kitayama, who both finished just one stroke behind. The emotional victory marks a career-defining moment for the 26-year-old rising star.",
    category: "Sports",
    author: "Golf Digest",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/golf/800/600"
  },
  {
    id: "sports-4",
    title: "NBA: Celtics Sweep Lakers as Spurs Continue Win Streak",
    content: "In the latest NBA action, Jaylen Brown powered the Boston Celtics to a season sweep of the Los Angeles Lakers, delivering a dominant performance that solidified the Celtics' lead in the Eastern Conference. Elsewhere, the San Antonio Spurs have extended their winning streak to eight games, led by the unstoppable Victor Wembanyama, whose defensive prowess and scoring have catapulted the Spurs into serious playoff contention.",
    category: "Sports",
    author: "NBA Insider",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/nba/800/600"
  },
  {
    id: "sports-5",
    title: "Tennis: Etcheverry and Sakellaridis Secure Landmark Titles",
    content: "On the ATP circuit, Argentina’s Tomas Martin Etcheverry claimed his maiden ATP 500 title at the Rio Open, defeating Chile's Alejandro Tabilo in a grueling three-set battle. Meanwhile, in Asia, Greece’s Stefanos Sakellaridis lifted the Delhi Open 2026 singles trophy after a convincing win over Oliver Crawford. Both players have seen significant jumps in the world rankings following their successful weekend runs on clay and hard courts respectively",
    category: "Sports",
    author: "Tennis World",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/tennis/800/600"
  },
  {
    id: "sports-6",
    title: "Formula 1: Hamilton’s Ferrari Debut Sparks Frenzy in Bahrain",
    content: "The 2026 Formula 1 pre-season testing kicked off in Bahrain, marking Lewis Hamilton’s highly anticipated official debut in the scarlet red of Ferrari. Under the new 2026 engine regulations, Ferrari’s power unit showed impressive reliability, with Hamilton clocking the second-fastest time of the day. Meanwhile, Red Bull’s Max Verstappen remained the man to beat, leading the charts and signaling that the rivalry between the two multi-time world champions is set to reach a fever pitch this season.",
    category: "Sports",
    author: "F1 Correspondent",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/f1/800/600"
  },
  {
    id: "sports-7",
    title: "Champions League: Real Madrid Edge Past Bayern in Thriller",
    content: "In a classic European heavyweight clash, Real Madrid secured a narrow 2-1 victory over Bayern Munich in the first leg of their Champions League Round of 16 tie. Vinícius Júnior was the standout performer, scoring a stunning solo goal in the 78th minute to silence the Allianz Arena. Bayern, led by Harry Kane, struggled to break down a disciplined Madrid defense, leaving them with a mountain to climb in the return leg at the Santiago Bernabéu next week.",
    category: "Sports",
    author: "Football Weekly",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/football/800/600"
  },
  {
    id: "sports-8",
    title: "Athletics: Femke Bol Smashes 400m Indoor World Record",
    content: "Dutch superstar Femke Bol has once again rewritten the history books at the World Athletics Indoor Tour in Liévin. Bol shattered her own world record in the 400 meters, clocking a blistering 49.12 seconds. Her dominant performance cements her status as the favorite for the upcoming World Indoor Championships and serves as a warning shot to her rivals ahead of the summer outdoor season.",
    category: "Sports",
    author: "Track & Field",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/athletics/800/600"
  },
  {
    id: "sports-9",
    title: "UFC: Makhachev Retains Lightweight Title in Gritty Defense",
    content: "In the main event of UFC 312, Islam Makhachev successfully defended his Lightweight Championship against a surging Arman Tsarukyan. The bout was a masterclass in elite wrestling and grappling, with Makhachev securing a unanimous decision after five grueling rounds. Despite Tsarukyan’s relentless pressure, Makhachev’s superior counter-striking and ground control proved the difference, extending his winning streak to 15 and fueling talk of a move up to Welterweight.",
    category: "Sports",
    author: "MMA Insider",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/ufc/800/600"
  }
];

export const STATIC_POLITICAL_NEWS: NewsArticle[] = [
  {
    id: "poly-1",
    title: "The 2026 Pentagon AI Surge: A $153 Billion Bet on Digital Warfare",
    content: "In a move that signaling a fundamental shift in American military doctrine, the Pentagon announced today it is fast-tracking $153 billion in new funding for 2026 to modernize the U.S. military with advanced Artificial Intelligence (AI) and autonomous systems. This funding, which was originally slated to be spread over five years, is being \"compressed\" into a single fiscal year to ensure the U.S. maintains a technological edge over China's rapidly advancing \"intelligentized\" warfare capabilities. The Department of Defense report emphasizes that these funds will be poured into AI-driven missile defense, autonomous naval \"ghost fleets,\" and battlefield data-processing tools designed to make split-second decisions. However, the acceleration has sparked a fierce debate in the House Armed Services Committee, where critics argue that such massive, rapid spending bypasses essential oversight and risks deploying lethal autonomous systems before ethical guardrails are fully matured. This \"AI Arms Race\" spending is expected to be a central theme of tonight’s State of the Union address, as the administration frames technological supremacy as the only path to preventing a global conflict.",
    category: "Politics",
    author: "Defense Correspondent",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/pentagon/800/600"
  },
  {
    id: "poly-2",
    title: "The \"Bridge Tariff\" Crisis: US Trade Policy in Limbo",
    content: "While the Supreme Court may have struck down President Trump’s original \"Liberation Day\" tariffs on February 20, the White House effectively bypassed that ruling today by triggering Section 122 of the Trade Act of 1974. Starting at midnight, U.S. Customs began collecting a new 10% \"bridge tariff\" on nearly all global imports. This temporary measure is designed to last 150 days, serving as a legal placeholder while the administration attempts to negotiate more permanent trade laws with a reluctant Congress. The move has created absolute chaos in the global markets today; while the President had threatened a 15% rate on social media over the weekend, the actual implementation at 10% has left businesses in a state of \"expensive confusion.\" In London and Tokyo, trade ministers have expressed \"extreme frustration,\" noting that the sudden policy shifts make it nearly impossible for firms to calculate margins for goods currently in transit. This maneuver is being viewed by legal experts as a direct challenge to the Supreme Court’s authority, setting the stage for a constitutional showdown over who truly controls the nation's \"purse strings\" regarding international trade.",
    category: "Economy",
    author: "Trade Analyst",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/tariff/800/600"
  },
  {
    id: "poly-3",
    title: "Escalating Tensions: The Taliban-Pakistan Airstrike Dispute",
    content: "The geopolitical situation in South Asia has reached a boiling point today as UN Deputy Chief Rosemary DiCarlo engaged in a high-stakes phone call with the Taliban’s Foreign Ministry to discuss recent Pakistani airstrikes inside Afghan territory. These strikes, which took place over the weekend in the Nangarhar and Paktika provinces, reportedly killed 13 civilians, according to UN monitors. While Pakistan maintains the strikes were a necessary \"act of self-defense\" targeting TTP (Tehrik-i-Taliban Pakistan) militants who have been launching cross-border attacks, the Taliban government has formally filed a complaint with the UN Security Council, labeling the move a violation of sovereignty. Today, the situation grew even more complex as Iran offered to mediate between the two neighbors, fearing that a full-scale border war would destabilize the entire region and trigger a massive new wave of refugees. The UN is now under intense pressure to intervene before the escalating \"tit-for-tat\" skirmishes lead to a permanent breakdown of the fragile peace in the region.",
    category: "Politics",
    author: "Global Security Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/southasia/800/600"
  },
  {
    id: "poly-4",
    title: "South Korea’s Legal Drama: Ousted President Yoon Appeals Life Sentence",
    content: "In Seoul, the political world is transfixed by the legal battle of ousted President Yoon Suk Yeol, who today officially filed an appeal against his life sentence for the controversial martial law decree of late 2025. The Seoul High Court is now the center of a national divide; supporters of the former president held a massive rally outside the courthouse today, claiming the sentence is \"political revenge,\" while counter-protesters demanded the sentence be upheld to protect the country's democracy. This appeal comes at a time of extreme vulnerability for South Korea, as the current transitional government struggles to manage a slowing economy and a cooling relationship with Washington. The outcome of this case is seen as a litmus test for the independence of the South Korean judiciary and will likely dictate the country’s political stability for the remainder of the decade",
    category: "Politics",
    author: "Seoul Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/seoul/800/600"
  },
  {
    id: "poly-5",
    title: "Nigeria’s Constitutional Pivot: The Move Toward State Police",
    content: "In a significant departure from Nigeria’s historically centralized security architecture, President Bola Tinubu used an interfaith fast gathering today in Abuja to signal a definitive push for the establishment of State Police. Addressing a diverse group of governors and religious leaders, the President emphasized that the current \"dark tunnel of uncertainty\" regarding national security can only be cleared by empowering local levels of government to protect their own citizens. This policy shift comes as a response to years of escalating banditry and kidnapping that have overwhelmed the federal police force. By promising that \"security is the foundation of prosperity,\" Tinubu is attempting to build a bipartisan consensus between Muslim and Christian leaders to support a constitutional amendment that would allow states to manage their own law enforcement. Critics, however, warn that without stringent federal oversight, state-controlled police could become tools for local political intimidation, setting the stage for a fierce legislative battle in the National Assembly over the coming months.",
    category: "Politics",
    author: "Abuja Correspondent",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/nigeria/800/600"
  },
  {
    id: "poly-6",
    title: "Japan’s \"Ocean of Peace\" Initiative: Shinjiro Koizumi’s Pacific Strategy",
    content: "Japanese Defense Minister Shinjiro Koizumi made a bold diplomatic play today in Tokyo, hosting defense chiefs from 14 Pacific island nations for the Japan Pacific Islands Defense Dialogue. Koizumi’s speech centered on building a \"multilayered network\" to ensure a \"free and open\" Indo-Pacific, explicitly stating that attempts to change the status quo by force—a veiled reference to China’s naval expansion—will not be tolerated. Simultaneously, the Japanese government revealed a strategic pivot toward Europe’s defense market, with high-level delegations currently visiting Finland and Sweden to match Japanese technological expertise with European dual-use military needs. This dual-track strategy marks a historic evolution in Japan’s post-war pacifist stance, as Tokyo seeks to reduce its defense reliance on the United States by becoming a primary security partner for both the Pacific islands and the European Union.",
    category: "Politics",
    author: "Tokyo Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/japan/800/600"
  },
  {
    id: "poly-7",
    title: "The Brazil-US Standoff: Coup Convictions Meet Trade Retaliation",
    content: "The diplomatic relationship between Brasília and Washington has reached its lowest point in decades following the recent conviction of former President Jair Bolsonaro for his role in the 2023 attempted coup. Today, as President Luiz Inácio Lula da Silva continues to laud the judiciary for \"fulfilling its role\" in protecting democracy, the administration is simultaneously grappling with the fallout of U.S.-imposed 50% tariffs on Brazilian goods. President Trump has labeled the trial a \"witch hunt\" and a personal attack on his ally, leading to a tit-for-tat economic war that has seen Brazil condemn the use of \"force against our democracy\" via economic coercion. With Lula now confirmed to seek re-election in the 2026 general election to prevent \"troglodytes\" from returning to power, Brazil is pivoting its trade focus toward the BRICS bloc and South Korea to offset the loss of the American market.",
    category: "Politics",
    author: "Brasília Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/brazil/800/600"
  },
  {
    id: "poly-8",
    title: "African Union's Quest for \"Health Sovereignty\"",
    content: "Following the conclusion of the 39th African Union Summit in Addis Ababa, the continent’s leaders today began implementing a landmark \"Health Sovereignty\" framework. With Tanzania’s President Samia Suluhu Hassan designated as the AU Champion for Reproductive and Maternal Health, the initiative seeks to drastically reduce Africa’s dependence on foreign aid and fragile global supply chains. The policy, which was a central pillar of the summit, mandates that member states increase domestic financing for health infrastructure to combat the fact that Sub-Saharan Africa still accounts for 70% of global maternal deaths. This movement toward self-reliance is being framed as a necessary survival tactic in a \"new world order\" where international partners, particularly the U.S., have significantly cut foreign humanitarian aid to prioritize domestic spending.",
    category: "Health",
    author: "Addis Ababa Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/africa/800/600"
  },
  {
    id: "poly-9",
    title: "Philippine Power Struggle: Impeachment vs. 2028 Presidential Ambitions",
    content: "The political landscape in Manila is currently defined by a high-stakes \"war of attrition\" between the House of Representatives and Vice President Sara Duterte. Today, as a fourth impeachment complaint was endorsed against her by Manila Representative Bienvenido Abante Jr., Duterte countered by officially announcing her 2028 presidential bid. Supporters view the impeachment attempts as a coordinated effort by the \"Lakas-CMD\" bloc to derail her political future, while opponents argue the Vice President is using her early campaign announcement to divert public attention from allegations of fund mismanagement. This domestic turmoil coincides with the Philippines' current ASEAN chairmanship, where the country is leading a critical review of the \"Five-Point Consensus\" on Myanmar, leaving many to wonder if the internal political infighting will diminish the Philippines' ability to lead on the regional stage.",
    category: "Politics",
    author: "Manila Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/manila/800/600"
  }
];

const STATIC_LIFESTYLE_NEWS: NewsArticle[] = [
  {
    id: "life-1",
    title: "Travel: The New Language of Romance",
    content: "New research from major travel platforms shows that in 2026, the \"six-pack\" has been replaced by the \"booked getaway\" as the ultimate romantic gesture. In India, confirmed holiday bookings have become a primary expression of love, with couples prioritizing experiential escapes over traditional gifts. This shift emphasizes shared memories and \"destination dating\" as the core of modern relationships.",
    category: "Lifestyle",
    author: "Travel Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/romance/800/600"
  },
  {
    id: "life-2",
    title: "Wellness: From Intensity to \"Load Management\"",
    content: "The fitness world is officially moving away from \"no pain, no gain\" culture. Today's wellness experts are highlighting Load Management, which focuses on how much physical and mental stress the body can handle before requiring recovery. Instead of pushing through exhaustion, the 2026 trend favors \"pain-aware movement\" and nervous system regulation to build long-term resilience.",
    category: "Lifestyle",
    author: "Wellness Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/fitness/800/600"
  },
  {
    id: "life-3",
    title: "Interior Design: The Rise of \"Scanditalia\"",
    content: "A new aesthetic is dominating home décor: Scanditalia. This trend blends the functional, clean silhouettes of Scandinavian design with the bold, expressive textures of Italian style. Expect to see homes featuring warm palettes, sculptural furniture, and rich materials like reeded wood and fluted glass, creating spaces that are both serene and high-drama.",
    category: "Lifestyle",
    author: "Design Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/interior/800/600"
  },
  {
    id: "life-4",
    title: "Health: Stem Cell Breakthrough for Diabetes",
    content: "In major medical news today, researchers have reported a successful reversal of Type 2 Diabetes in patients using stem cell therapy. The treatment focuses on restoring the body's natural insulin production, offering a potential future where patients are no longer dependent on lifelong medication. This marks a massive leap in regenerative medicine for lifestyle-related diseases.",
    category: "Lifestyle",
    author: "Medical Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/diabetes/800/600"
  },
  {
    id: "life-5",
    title: "Digital Lifestyle: The AI Health Coach Era",
    content: "The health coaching market is projected to skyrocket this year as AI-enabled tools become mainstream. Unlike basic fitness trackers, these new AI coaches provide real-time, personalized advice based on metabolic data and stress levels. They are being integrated into corporate wellness programs to help employees manage \"digital fatigue\" and prevent burnout before it happens.",
    category: "Lifestyle",
    author: "Tech Lifestyle",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/aicoach/800/600"
  },
  {
    id: "life-6",
    title: "Mindful Living: \"Analog Affection\"",
    content: "As AI becomes more integrated into work, people are seeking \"Analog Affection\" in their personal lives. Hobbies like ceramics, film photography, and hand-knitting are seeing a massive resurgence. These activities are being embraced as \"quiet acts of resistance,\" where the goal is to create something imperfect and tangible in an increasingly digital world.",
    category: "Lifestyle",
    author: "Culture Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/analog/800/600"
  },
  {
    id: "life-7",
    title: "Nutrition: The Heart-Healthy Power of Pomegranates",
    content: "New clinical studies released today emphasize the cardiovascular benefits of pomegranate juice. Drinking it daily has been linked to improved blood flow and arterial health. Nutritionists are also recommending \"sprinkling cinnamon on fruits\" to help with blood sugar control, highlighting a return to simple, functional whole foods over complex supplements.",
    category: "Lifestyle",
    author: "Nutrition Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/pomegranate/800/600"
  },
  {
    id: "life-8",
    title: "Home Trends: The Return of the Game Parlor",
    content: "Forget the \"home office\"—2026 is the year of the \"Players Only\" room. Interior designers are seeing a surge in requests for dedicated game parlors featuring mahjong tables, poker setups, and family shuffleboards. This trend reflects a post-digital desire for communal, face-to-face entertainment within the comfort of the home.",
    category: "Lifestyle",
    author: "Home Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/gameparlor/800/600"
  },
  {
    id: "life-9",
    title: "Fashion: Soft Power and Fluid Grandeur",
    content: "Wedding fashion for 2026 is moving toward Soft Power Dressing. Brides are moving away from heavy, restrictive traditional wear in favor of fluid, drape-led couture that honors Indian craftsmanship through lighter, sustainable fabrics. This \"Fluid Grandeur\" focuses on comfort and movement, allowing the wearer to feel both powerful and unburdened.",
    category: "Lifestyle",
    author: "Fashion Desk",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/fashion/800/600"
  },
  {
    id: "life-10",
    title: "Mental Health: Nervous System Regulation",
    content: "\"Mental health\" is expanding to include Nervous System Regulation. Today's top wellness routines prioritize \"vagus nerve\" exercises, box breathing, and slow-motion stretching. The goal is to move the body out of a \"fight or flight\" state caused by constant notifications and into a \"rest and digest\" state, treating the nervous system as the foundation of overall health",
    category: "Lifestyle",
    author: "Health Bureau",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/mentalhealth/800/600"
  }
];

const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "fallback-1",
    title: "Global Tech Summit Announces Breakthrough in Sustainable Energy",
    content: "Leading scientists and tech giants gathered today to unveil a revolutionary solid-state battery technology that promises to triple the range of electric vehicles while reducing charging times to under five minutes. The breakthrough, a result of a decade-long international collaboration, uses recycled materials and significantly reduces the environmental footprint of battery production. Industry experts predict this could accelerate the transition to renewable energy by several years, making green transportation accessible to millions more people worldwide.",
    category: "Technology",
    author: "Sarah Jenkins",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/tech1/800/600"
  },
  {
    id: "fallback-2",
    title: "New Global Policy Aims to Protect 30% of Oceans by 2030",
    content: "In a historic move, over 190 nations have signed a comprehensive treaty to establish vast marine protected areas in international waters. The agreement provides a legal framework for conservation in the 'High Seas,' which cover nearly half the Earth's surface but have previously been largely unregulated. Marine biologists hailed the treaty as a 'turning point' for biodiversity, noting that it will help protect endangered species, restore depleted fish stocks, and enhance the ocean's ability to absorb carbon dioxide from the atmosphere.",
    category: "Politics",
    author: "Michael Chen",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/ocean1/800/600"
  },
  {
    id: "fallback-3",
    title: "The Future of Remote Work: Hybrid Models Become the New Standard",
    content: "A comprehensive study of 5,000 global companies reveals that the hybrid work model has officially surpassed both fully remote and fully in-office setups as the preferred choice for employees and employers alike. The report highlights that flexibility is now the top priority for job seekers, leading to a significant shift in urban planning and commercial real estate. Cities are beginning to adapt by converting vacant office spaces into residential units and community hubs, reflecting a permanent change in how society balances professional and personal life.",
    category: "Lifestyle",
    author: "Elena Rodriguez",
    date: "April 6, 2026",
    imageUrl: "https://picsum.photos/seed/work1/800/600"
  }
];

function pcmToWav(pcmBase64: string, sampleRate: number = 24000): Uint8Array {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + len, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (PCM = 1)
  view.setUint16(20, 1, true);
  // channel count (Mono = 1)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, len, true);

  const wavData = new Uint8Array(44 + len);
  wavData.set(new Uint8Array(wavHeader), 0);
  wavData.set(bytes, 44);

  return wavData;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes("429") || error?.status === 429 || error?.code === 429;
    const isInternalError = error?.message?.includes("500") || error?.status === 500 || error?.code === 500 || error?.message?.includes("Internal error");
    
    if ((isRateLimit || isInternalError) && retries > 0) {
      console.warn(`API error (${isRateLimit ? '429' : '500'}). Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: "Politics" | "Sports" | "Lifestyle" | "Economy" | "Health" | "Urban" | "Technology" | "General";
  author: string;
  date: string;
  imageUrl: string;
  summary?: string;
}

export const geminiService = {
  async searchRealTimeNews(query: string): Promise<NewsArticle[]> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for real-time news related to: "${query}". 
        Provide the most accurate and up-to-date information available.
        Return them as a JSON array of objects with: id, title, content (at least 200 words), category, author, date, and a descriptive imageUrl placeholder.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING },
                author: { type: Type.STRING },
                date: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
              },
              required: ["id", "title", "content", "category", "author", "date", "imageUrl"],
            },
          },
        },
      });

      try {
        return JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("Failed to parse search results", e);
        return [];
      }
    });
  },

  async chatWithNews(message: string, newsContext: NewsArticle[]): Promise<string> {
    const context = newsContext.map(a => `Title: ${a.title}\nContent: ${a.content.substring(0, 300)}...`).join('\n\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI News Assistant for "AI NEWS WORLD". 
      Below is the context of current news articles available in the app:
      
      ${context}
      
      User Question: ${message}
      
      Answer the user's question based on the provided news context and the app's functionality (summarizing news, fake news detection, exam mode). If the question is not related to the news or the app, politely guide them back. Keep responses concise and helpful.`,
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  },

  async generateNews(category: string = "General"): Promise<NewsArticle[]> {
    const cacheKey = `news_${category}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for the 5 most recent and relevant news for the category: ${category}. 
        Focus on events happening right now or in the last 24 hours.
        Return them as a JSON array of objects with: id, title, content (around 100 words), category, author, date (set this to "April 6, 2026"), and a descriptive imageUrl placeholder (e.g., https://picsum.photos/seed/news1/800/600).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING },
                author: { type: Type.STRING },
                date: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
              },
              required: ["id", "title", "content", "category", "author", "date", "imageUrl"],
            },
          },
        },
      });

      try {
        let data = JSON.parse(response.text || "[]");
        if (data && Array.isArray(data)) {
          // Prepend static news for General/Home categories
          if (category.toLowerCase().includes("general") || category.toLowerCase().includes("home")) {
            // Filter out any existing static news to avoid duplicates
            const staticIds = new Set(STATIC_NEWS.map(n => n.id));
            const filteredData = data.filter(n => !staticIds.has(n.id));
            data = [...STATIC_NEWS, ...filteredData];
          }
          
          // Prepend static sports news for Sports category
          if (category.toLowerCase().includes("sports")) {
            const staticIds = new Set(STATIC_SPORTS_NEWS.map(n => n.id));
            const filteredData = data.filter(n => !staticIds.has(n.id));
            data = [...STATIC_SPORTS_NEWS, ...filteredData];
          }

          // Prepend static political news for Politics category
          if (category.toLowerCase().includes("politics")) {
            const staticIds = new Set(STATIC_POLITICAL_NEWS.map(n => n.id));
            const filteredData = data.filter(n => !staticIds.has(n.id));
            data = [...STATIC_POLITICAL_NEWS, ...filteredData];
          }

          // Prepend static lifestyle news for Lifestyle category
          if (category.toLowerCase().includes("lifestyle")) {
            const staticIds = new Set(STATIC_LIFESTYLE_NEWS.map(n => n.id));
            const filteredData = data.filter(n => !staticIds.has(n.id));
            data = [...STATIC_LIFESTYLE_NEWS, ...filteredData];
          }
          
          if (data.length > 0) {
            cache.set(cacheKey, { data, timestamp: Date.now() });
            saveCache(cache);
          }
          return data;
        }
        throw new Error("Invalid news data received");
      } catch (e) {
        console.error("Failed to parse news, using fallback", e);
        const isGeneral = category.toLowerCase().includes("general") || category.toLowerCase().includes("home");
        const isSports = category.toLowerCase().includes("sports");
        const isPolitics = category.toLowerCase().includes("politics");
        const isLifestyle = category.toLowerCase().includes("lifestyle");
        
        if (isGeneral) return [...STATIC_NEWS, ...FALLBACK_NEWS];
        if (isSports) return [...STATIC_SPORTS_NEWS, ...FALLBACK_NEWS];
        if (isPolitics) return [...STATIC_POLITICAL_NEWS, ...FALLBACK_NEWS];
        if (isLifestyle) return [...STATIC_LIFESTYLE_NEWS, ...FALLBACK_NEWS];
        return FALLBACK_NEWS;
      }
    }).catch(() => {
      console.warn("API failed after retries, serving fallback news.");
      const isGeneral = category.toLowerCase().includes("general") || category.toLowerCase().includes("home");
      const isSports = category.toLowerCase().includes("sports");
      const isPolitics = category.toLowerCase().includes("politics");
      const isLifestyle = category.toLowerCase().includes("lifestyle");
      
      if (isGeneral) return [...STATIC_NEWS, ...FALLBACK_NEWS];
      if (isSports) return [...STATIC_SPORTS_NEWS, ...FALLBACK_NEWS];
      if (isPolitics) return [...STATIC_POLITICAL_NEWS, ...FALLBACK_NEWS];
      if (isLifestyle) return [...STATIC_LIFESTYLE_NEWS, ...FALLBACK_NEWS];
      return FALLBACK_NEWS;
    });
  },

  getCachedNews(category: string): NewsArticle[] | null {
    const cacheKey = `news_${category}`;
    const cached = cache.get(cacheKey);
    
    let data: NewsArticle[] | null = null;
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      data = cached.data;
    }

    // Always ensure static news is present for General/Home
    if (category.toLowerCase().includes("general") || category.toLowerCase().includes("home")) {
      if (!data) return STATIC_NEWS;
      
      const staticIds = new Set(STATIC_NEWS.map(n => n.id));
      const filteredData = data.filter(n => !staticIds.has(n.id));
      return [...STATIC_NEWS, ...filteredData];
    }

    // Always ensure static sports news is present for Sports
    if (category.toLowerCase().includes("sports")) {
      if (!data) return STATIC_SPORTS_NEWS;
      
      const staticIds = new Set(STATIC_SPORTS_NEWS.map(n => n.id));
      const filteredData = data.filter(n => !staticIds.has(n.id));
      return [...STATIC_SPORTS_NEWS, ...filteredData];
    }

    // Always ensure static political news is present for Politics
    if (category.toLowerCase().includes("politics")) {
      if (!data) return STATIC_POLITICAL_NEWS;
      
      const staticIds = new Set(STATIC_POLITICAL_NEWS.map(n => n.id));
      const filteredData = data.filter(n => !staticIds.has(n.id));
      return [...STATIC_POLITICAL_NEWS, ...filteredData];
    }

    // Always ensure static lifestyle news is present for Lifestyle
    if (category.toLowerCase().includes("lifestyle")) {
      if (!data) return STATIC_LIFESTYLE_NEWS;
      
      const staticIds = new Set(STATIC_LIFESTYLE_NEWS.map(n => n.id));
      const filteredData = data.filter(n => !staticIds.has(n.id));
      return [...STATIC_LIFESTYLE_NEWS, ...filteredData];
    }
    
    return data;
  },

  async summarizeArticle(content: string, level: string): Promise<string> {
    const cacheKey = `summary_${content.substring(0, 50)}_${level}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const prompts: Record<string, string> = {
        "30-word": "Summarize this news in exactly 30 words.",
        "100-word": "Summarize this news in exactly 100 words.",
        "bullet": "Provide a bullet-point summary of the key facts.",
        "exam": "Summarize this news in an analytical way suitable for a competitive exam (UPSC style).",
        "tweet": "Create a catchy tweet-ready summary with hashtags.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompts[level] || prompts["30-word"]}\n\nContent: ${content}`,
      });

      const text = response.text || "Summary unavailable.";
      cache.set(cacheKey, { data: text, timestamp: Date.now() });
      saveCache(cache);
      return text;
    });
  },

  async translateArticle(content: string, targetLanguage: string): Promise<string> {
    const cacheKey = `translate_${content.substring(0, 50)}_${targetLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following news article content into ${targetLanguage}. Maintain the original tone and facts. Do not add any extra commentary.\n\nContent: ${content}`,
      });

      const text = response.text || "Translation unavailable.";
      cache.set(cacheKey, { data: text, timestamp: Date.now() });
      saveCache(cache);
      return text;
    });
  },

  // Simple memory cache for audio to speed up repeated listens
  audioCache: new Map<string, Uint8Array>(),

  async generateSpeech(text: string): Promise<Uint8Array> {
    // Truncate text to 500 characters for significantly faster generation
    // Most users only listen to the first few paragraphs anyway
    const cleanText = text.substring(0, 500).replace(/[#*`]/g, '').trim();
    
    // Check cache first
    const cacheKey = cleanText.substring(0, 100);
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio generated");
      
      const wavData = pcmToWav(base64Audio, 24000);
      
      // Store in cache
      this.audioCache.set(cacheKey, wavData);
      
      return wavData;
    });
  },

  async detectFakeNews(text: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
    const cacheKey = `fake_${text.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a comprehensive authenticity analysis on the following news text.
        
        Step 1: Linguistic Analysis:
        - Check for sensationalism, clickbait tactics, and emotional manipulation.
        - Identify logical fallacies or inconsistent arguments.
        
        Step 2: Fact-Checking (Google Search):
        - Verify the core claims, dates, and entities against real-time global news data.
        - Cross-reference with multiple reputable news agencies (Reuters, AP, BBC, etc.).
        
        Step 3: Final Verdict:
        - Provide an authenticity score (0-100). 100 = definitely real, 0 = definitely fake.
        - Provide a detailed, objective reasoning for your conclusion.
        - List the specific sources used for verification.
        
        Text to analyze: ${text}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Authenticity score from 0 to 100" },
              reasoning: { type: Type.STRING },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "reasoning", "sources"],
          },
        },
      });

      try {
        const data = JSON.parse(response.text || "{}");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        saveCache(cache);
        return data;
      } catch (e) {
        return { score: 50, reasoning: "Analysis failed.", sources: [] };
      }
    });
  },

  async predictTrends(): Promise<string[]> {
    const cacheKey = "trends";
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Based on current global events, predict 5 trending news topics for the next 48 hours. Return as a simple list.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      try {
        const data = JSON.parse(response.text || "[]");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (e) {
        return ["Global Economy", "AI Advancements", "Climate Action", "Space Exploration", "Health Tech"];
      }
    });
  },

  async generateExamQuestions(content: string): Promise<{ questions: string[]; type: string }> {
    const cacheKey = `exam_${content.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this news article, generate 3 high-quality multiple-choice questions for a competitive exam.
        Content: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              type: { type: Type.STRING }
            },
            required: ["questions", "type"]
          }
        }
      });

      try {
        const data = JSON.parse(response.text || "{}");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (e) {
        return { questions: ["What is the primary focus of this article?", "Who are the key stakeholders mentioned?", "What is the predicted outcome?"], type: "General Knowledge" };
      }
    });
  },

  getLiveConnection(callbacks: any) {
    return ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a concise news assistant. Use Google Search to find the most up-to-date and accurate news information. Summarize articles briefly and respond immediately.",
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });
  },

  getStoredNews(category: string): NewsArticle[] {
    const cat = category.toLowerCase();
    if (cat.includes("sports")) return STATIC_SPORTS_NEWS;
    if (cat.includes("politics")) return STATIC_POLITICAL_NEWS;
    return STATIC_NEWS;
  },

  async analyzeNewsImage(base64Image: string, mimeType: string): Promise<{ score: number; reasoning: string; sources: string[]; isNewsImage: boolean }> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image with extreme objectivity to determine if it is real or fake news. 
            
            CRITICAL INSTRUCTION: Do not label news as "fake" simply because of low image quality, compression artifacts, or if it's a screenshot. Many real news reports are shared as low-quality screenshots. Only label as "fake" if you find definitive evidence of manipulation or if the claims are factually disproven.

            Step 1: Visual Forensic Analysis:
            - Check for clear signs of digital tampering (e.g., mismatched fonts in headlines, poorly photoshopped elements, inconsistent lighting on subjects).
            - Identify if the image is a screenshot of a reputable news site (BBC, CNN, Reuters, etc.). If it looks like a standard, unmodified screenshot of a known site, treat it as highly likely to be real unless the content is known to be a parody or fabricated.
            
            Step 2: Content Identification:
            - Is this a news article, headline, or report? Set 'isNewsImage' to true if it is.
            
            Step 3: Fact-Checking (Google Search):
            - Search for the specific headlines, events, or quotes mentioned in the image.
            - Verify if reputable news organizations have reported on this exact story.
            
            Step 4: Verdict:
            - Provide an authenticity score (0-100). 
              * 80-100: Confirmed Real (reported by multiple reputable sources).
              * 50-79: Likely Real or Unverified (no evidence of fakery, but maybe niche news).
              * 0-49: Likely Fake or Manipulated (clear evidence of tampering or factually false).
            - Provide a detailed reasoning. If it's real, explain why (e.g., "Matches BBC reporting from [Date]"). If it's fake, point out the specific error.
            - List the sources found.`,
          },
        ],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isNewsImage: { type: Type.BOOLEAN, description: "Whether the image is news-related content" },
              score: { type: Type.NUMBER, description: "Authenticity score from 0 to 100" },
              reasoning: { type: Type.STRING },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["isNewsImage", "score", "reasoning", "sources"],
          },
        },
      });

      try {
        const result = JSON.parse(response.text || "{}");
        if (typeof result.score !== 'number') result.score = 50;
        result.score = Math.max(0, Math.min(100, result.score));
        return result;
      } catch (e) {
        console.error("Failed to parse analysis result", e);
        return { isNewsImage: true, score: 50, reasoning: "Analysis completed but result parsing failed. Please try again.", sources: [] };
      }
    });
  }
};
