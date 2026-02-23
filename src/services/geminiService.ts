import { GoogleGenAI, Type } from "@google/genai";

// This MUST match the name VITE_GEMINI_API_KEY exactly
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("API Key not found! Check your Vercel settings. Make sure it starts with VITE_.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

const STATIC_NEWS: NewsArticle[] = [
  {
    id: "static-1",
    title: "International: Trump Administration Imposes New 15% Global Tariff",
    content: "In a swift response to a US Supreme Court ruling that struck down previous trade levies, the Trump administration has announced a new 15% temporary global tariff on all imports under Section 122 of the Trade Act of 1974. The move came after the Court declared earlier tariffs under the Emergency Economic Powers Act illegal, causing a brief rally in global markets that was quickly reversed by the new announcement. The US dollar and European stock markets saw a sharp decline today as businesses brace for a fresh wave of trade uncertainty.",
    category: "Politics",
    author: "Global Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/tariff/800/600"
  },
  {
    id: "static-2",
    title: "India: PM Modi Inaugurates Delhi-Meerut Namo Bharat Corridor",
    content: "Prime Minister Narendra Modi officially inaugurated the Meerut Metro and dedicated the full 82-km Delhi–Meerut Namo Bharat Corridor to the nation. This milestone in regional connectivity is expected to significantly reduce travel time and ease traffic congestion across the National Capital Region (NCR). During the event, the Prime Minister also announced that the statue of British architect Edwin Lutyens at Rashtrapati Bhavan would be replaced by one of C. Rajagopalachari, signaling a symbolic shift toward honoring indigenous Indian leadership.",
    category: "Technology",
    author: "National Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/corridor/800/600"
  },
  {
    id: "static-3",
    title: "Global Security: Tensions Rise Between Pakistan and Afghanistan",
    content: "Diplomatic tensions have escalated in South Asia as Pakistan confirmed carrying out cross-border strikes targeting militant hideouts inside Afghanistan. Islamabad stated the strikes were a response to recent suicide bombings orchestrated by fighters operating from Afghan soil. Meanwhile, in Europe, Hungary has blocked a new EU sanctions package against Russia, stalling progress on the fourth anniversary of the Ukraine war and highlighting continued internal divisions within the European Union.",
    category: "Politics",
    author: "Security Analyst",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/security/800/600"
  },
  {
    id: "static-4",
    title: "National Briefs: Security, Elections, and Incidents",
    content: "Security: Indian security forces neutralized a Jaish-e-Mohammad terrorist in an encounter in Jammu and Kashmir’s Kishtwar district under Operation Trashi-I.\n\nElections: The final electoral roll for Tamil Nadu was published today, revealing a total of 5.67 crore electors after a massive revision process that saw nearly 70 lakh names deleted from the rolls.\n\nIncident: In Florida, the Secret Service fatally shot an armed man who attempted to breach the perimeter of the Mar-a-Lago resort while the President was away in Washington D.C.",
    category: "General",
    author: "Staff Reporter",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/briefs/800/600"
  }
];

const STATIC_SPORTS_NEWS: NewsArticle[] = [
  {
    id: "sports-1",
    title: "Winter Olympics: USA Ends 46-Year Gold Drought in Ice Hockey",
    content: "The Milano Cortina 2026 Winter Games concluded with a historic victory for Team USA as they defeated longtime rival Canada 2-1 in a thrilling overtime final. Jack Hughes scored the \"Golden Goal\" to secure the first American men’s ice hockey gold since the 1980 \"Miracle on Ice.\" The Games officially closed with Norway topping the medal table for the third consecutive time with 18 golds, while cross-country skier Johannes Høsflot Klæbo set a new world record by winning six gold medals in a single Olympic edition.",
    category: "Sports",
    author: "Olympic Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/hockey/800/600"
  },
  {
    id: "sports-2",
    title: "Cricket: South Africa Stuns India in T20 World Cup Super 8s",
    content: "In a high-stakes encounter at the Narendra Modi Stadium, South Africa defeated India by 76 runs to shake up the T20 World Cup Super 8 standings. India’s chase faltered against a disciplined Proteas bowling attack, complicating their path to the semi-finals. Meanwhile, Zimbabwe has emerged as the \"Cinderella team\" of the tournament; after a rain-washed draw against Ireland knocked out powerhouse Australia, Zimbabwe is now preparing for a critical Super 8 showdown against the West Indies in Mumbai.",
    category: "Sports",
    author: "Cricket Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/cricket/800/600"
  },
  {
    id: "sports-3",
    title: "Golf: Jacob Bridgeman Clinches Maiden PGA Tour Title",
    content: "American golfer Jacob Bridgeman secured his first-ever PGA Tour victory at the prestigious Genesis Invitational on Sunday. Bridgeman held his nerve under immense pressure at Riviera, shooting a final-round 72 to finish at 18-under par. He managed to hold off a late surge from world number one Rory McIlroy and Kurt Kitayama, who both finished just one stroke behind. The emotional victory marks a career-defining moment for the 26-year-old rising star.",
    category: "Sports",
    author: "Golf Digest",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/golf/800/600"
  },
  {
    id: "sports-4",
    title: "NBA: Celtics Sweep Lakers as Spurs Continue Win Streak",
    content: "In the latest NBA action, Jaylen Brown powered the Boston Celtics to a season sweep of the Los Angeles Lakers, delivering a dominant performance that solidified the Celtics' lead in the Eastern Conference. Elsewhere, the San Antonio Spurs have extended their winning streak to eight games, led by the unstoppable Victor Wembanyama, whose defensive prowess and scoring have catapulted the Spurs into serious playoff contention.",
    category: "Sports",
    author: "NBA Insider",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/nba/800/600"
  },
  {
    id: "sports-5",
    title: "Tennis: Etcheverry and Sakellaridis Secure Landmark Titles",
    content: "On the ATP circuit, Argentina’s Tomas Martin Etcheverry claimed his maiden ATP 500 title at the Rio Open, defeating Chile's Alejandro Tabilo in a grueling three-set battle. Meanwhile, in Asia, Greece’s Stefanos Sakellaridis lifted the Delhi Open 2026 singles trophy after a convincing win over Oliver Crawford. Both players have seen significant jumps in the world rankings following their successful weekend runs on clay and hard courts respectively",
    category: "Sports",
    author: "Tennis World",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/tennis/800/600"
  },
  {
    id: "sports-6",
    title: "Formula 1: Hamilton’s Ferrari Debut Sparks Frenzy in Bahrain",
    content: "The 2026 Formula 1 pre-season testing kicked off in Bahrain, marking Lewis Hamilton’s highly anticipated official debut in the scarlet red of Ferrari. Under the new 2026 engine regulations, Ferrari’s power unit showed impressive reliability, with Hamilton clocking the second-fastest time of the day. Meanwhile, Red Bull’s Max Verstappen remained the man to beat, leading the charts and signaling that the rivalry between the two multi-time world champions is set to reach a fever pitch this season.",
    category: "Sports",
    author: "F1 Correspondent",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/f1/800/600"
  },
  {
    id: "sports-7",
    title: "Champions League: Real Madrid Edge Past Bayern in Thriller",
    content: "In a classic European heavyweight clash, Real Madrid secured a narrow 2-1 victory over Bayern Munich in the first leg of their Champions League Round of 16 tie. Vinícius Júnior was the standout performer, scoring a stunning solo goal in the 78th minute to silence the Allianz Arena. Bayern, led by Harry Kane, struggled to break down a disciplined Madrid defense, leaving them with a mountain to climb in the return leg at the Santiago Bernabéu next week.",
    category: "Sports",
    author: "Football Weekly",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/football/800/600"
  },
  {
    id: "sports-8",
    title: "Athletics: Femke Bol Smashes 400m Indoor World Record",
    content: "Dutch superstar Femke Bol has once again rewritten the history books at the World Athletics Indoor Tour in Liévin. Bol shattered her own world record in the 400 meters, clocking a blistering 49.12 seconds. Her dominant performance cements her status as the favorite for the upcoming World Indoor Championships and serves as a warning shot to her rivals ahead of the summer outdoor season.",
    category: "Sports",
    author: "Track & Field",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/athletics/800/600"
  },
  {
    id: "sports-9",
    title: "UFC: Makhachev Retains Lightweight Title in Gritty Defense",
    content: "In the main event of UFC 312, Islam Makhachev successfully defended his Lightweight Championship against a surging Arman Tsarukyan. The bout was a masterclass in elite wrestling and grappling, with Makhachev securing a unanimous decision after five grueling rounds. Despite Tsarukyan’s relentless pressure, Makhachev’s superior counter-striking and ground control proved the difference, extending his winning streak to 15 and fueling talk of a move up to Welterweight.",
    category: "Sports",
    author: "MMA Insider",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/ufc/800/600"
  }
];

const STATIC_POLITICAL_NEWS: NewsArticle[] = [
  {
    id: "poly-1",
    title: "Netherlands: Rob Jetten Sworn In as Nation’s Youngest Prime Minister",
    content: "In a historic shift for Dutch politics, Rob Jetten (38) has been officially sworn in as the youngest-ever Prime Minister of the Netherlands. Leading a three-party minority coalition, Jetten faces the immediate challenge of navigating a fragmented parliament where his government holds only 66 of the 150 seats. King Willem-Alexander wished the new cabinet \"good luck in uncertain times\" as they prepare to negotiate every piece of legislation with opposition lawmakers to ensure stability.",
    category: "Politics",
    author: "EU Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/jetten/800/600"
  },
  {
    id: "poly-2",
    title: "Israel: Domestic Dispute Threatens Reception for PM Modi’s Visit",
    content: "Prime Minister Narendra Modi’s upcoming state visit to Israel is facing an unexpected hurdle due to Israeli domestic friction. Opposition leader Yair Lapid has threatened to boycott the parliamentary address unless the Supreme Court President is invited, a traditional protocol currently entangled in a heated debate over judicial overhaul. Despite the political drama in the Knesset, Prime Minister Netanyahu has reaffirmed the \"enduring bond\" between India and Israel ahead of the February 25 arrival.",
    category: "Politics",
    author: "Middle East Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/israel/800/600"
  },
  {
    id: "poly-3",
    title: "United States: Poll Shows Record Low Faith in \"Checks and Balances\"",
    content: "On the eve of the 2026 State of the Union address, a new PBS News/NPR/Marist poll reveals that two-thirds of Americans believe the nation’s system of checks and balances is failing. Confidence has dropped significantly across the partisan spectrum, with many expressing doubt that the White House, Congress, and the courts are effectively dividing power. The data highlights a growing skepticism toward democratic institutions as President Trump prepares to address a polarized nation.",
    category: "Politics",
    author: "Washington Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/poll/800/600"
  },
  {
    id: "poly-4",
    title: "Philippines: ICC to Hold Public Hearings on Duterte Era Charges",
    content: "The International Criminal Court (ICC) has announced it will move forward with public hearings regarding charges against former President Rodrigo Duterte. The investigation focuses on alleged human rights violations during his \"war on drugs.\" The current administration in Manila remains divided on the issue, with some officials calling for cooperation with the ICC while others maintain that the Philippine judiciary is capable of handling the cases internally.",
    category: "Politics",
    author: "Asia Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/philippines/800/600"
  },
  {
    id: "poly-5",
    title: "North Korea: Kim Jong Un Re-elected as Workers’ Party Chief",
    content: "State media in Pyongyang confirmed today that Kim Jong Un has been re-elected as the General Secretary of the Workers' Party. The announcement came during a major party plenary session where leaders emphasized \"self-reliance\" and military modernization amidst ongoing global sanctions. Analysts suggest the move is intended to project absolute stability and long-term continuity as North Korea continues to expand its technological and nuclear capabilities.",
    category: "Politics",
    author: "Pyongyang Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/nkorea/800/600"
  },
  {
    id: "poly-6",
    title: "Brazil: President Lula Rejects \"New Cold War\" Narrative",
    content: "Speaking to international media, Brazilian President Luiz Inácio Lula da Silva emphasized that Brazil has no interest in participating in a \"new Cold War\" between global superpowers. Lula stated his intention to meet with President Trump to advocate for a multipolar world where all nations are \"treated equally.\" He reiterated that Brazil’s foreign policy remains focused on economic growth, environmental protection, and maintaining trade relations with both the US and China.",
    category: "Politics",
    author: "South America Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/brazil/800/600"
  },
  {
    id: "poly-7",
    title: "Mexico: Army Operation Leads to Significant Security Crisis",
    content: "Following a high-stakes military operation that resulted in the death of a major cartel leader known as 'El Mencho', violence has erupted across several Mexican states. Security forces have been deployed to curb retaliatory attacks and roadblocks. President Claudia Sheinbaum has called for calm while defending the operation as a necessary step in the nation’s long-term strategy to dismantle organized crime networks and restore the rule of law.",
    category: "Politics",
    author: "Mexico City Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/mexico/800/600"
  },
  {
    id: "poly-8",
    title: "Canada: Legal Battle Intensifies Over High-Speed Rail Project",
    content: "A coalition known as Alt-NO has launched a series of legal and public challenges against the federal government's planned high-speed rail line between Toronto and Quebec City. The group is specifically fighting \"Bill C-15,\" which would grant the government powers to expedite property expropriation for the project. Protesters argue that the focus should be on improving existing rail infrastructure rather than creating a costly new system that bypasses smaller communities.",
    category: "Politics",
    author: "Ottawa Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/canada/800/600"
  },
  {
    id: "poly-9",
    title: "India: J&K Apple Traders Raise Alarm Over New Trade Deals",
    content: "Horticulture leaders in Jammu and Kashmir have expressed deep concern over recent trade agreements that reduce import duties on US and EU apples from 50% to 25%. Local orchardists argue that the move could flood the Indian market with cheaper foreign fruit, threatening the livelihoods of millions dependent on the region’s ₹10,000 crore apple industry. Political figures in Srinagar are now urging the central government to reconsider the tariffs to protect domestic farmers.",
    category: "Politics",
    author: "Srinagar Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/apple/800/600"
  },
  {
    id: "poly-10",
    title: "United Nations: Human Rights Council Opens with Warning on \"Normalization of Force\"",
    content: "UN High Commissioner for Human Rights Volker Türk opened the latest session of the Human Rights Council in Geneva with a sharp critique of global leaders. Türk warned that the \"use of force\" is becoming normalized in international disputes, citing ongoing suffering in Gaza, Ukraine, Sudan, and Myanmar. He called on member states to act as \"persistent objectors\" to international law violations and to prioritize human dignity over geopolitical supremacy.",
    category: "Politics",
    author: "Geneva Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/un/800/600"
  },
  {
    id: "poly-11",
    title: "Japan: PM Takaichi Vows Defense Overhaul to Counter \"Coercion\"",
    content: "Japanese Prime Minister Sanae Takaichi delivered a high-stakes address to parliament, pledging to overhaul the nation’s defense strategy and ease restrictions on military exports. Highlighting what she called \"increased coercion\" in the East and South China Seas, Takaichi reaffirmed her commitment to doubling Japan's defense spending to 2% of GDP. The move signals a more assertive regional security posture for Japan amidst growing tensions with Beijing.",
    category: "Politics",
    author: "Tokyo Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/japan/800/600"
  },
  {
    id: "poly-12",
    title: "Latin America: Mexico Defies US Pressure with Humanitarian Aid to Cuba",
    content: "Mexican President Claudia Sheinbaum confirmed that her government will continue sending food and humanitarian aid to Cuba, despite threats of tariffs from Washington. This comes after the US administration cut off oil supplies to Havana following a leadership change in Venezuela. While Mexico has paused direct oil shipments, Sheinbaum’s stance highlights a growing rift in the region regarding the US-led embargo and the political isolation of the Caribbean island.",
    category: "Politics",
    author: "Regional Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/cuba/800/600"
  },
  {
    id: "poly-13",
    title: "African Union: AU Summit Grapples with \"Legitimacy Crisis\" Among Youth",
    content: "At the 39th African Union Summit in Addis Ababa, leaders are facing intense pressure to address a \"legitimacy crisis\" fueled by widespread youth discontent. With the continent home to the world’s youngest population, the AU is under fire for failing to prevent military coups and for its perceived silence on disputed elections. AU Commission Chairperson Mahamoud Ali Youssouf stressed that instability from Sudan to the Sahel continues to hinder the continent's development.",
    category: "Politics",
    author: "Addis Ababa Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/au/800/600"
  },
  {
    id: "poly-14",
    title: "China: Beijing Assesses Impact of US Tariff Ruling",
    content: "China’s Ministry of Commerce announced today that it is conducting a \"comprehensive assessment\" of the US Supreme Court's ruling against previous Trump-era tariffs. While welcoming the legal setback for Washington’s trade policy, Beijing urged the US to remove all \"unilateral and protectionist\" levies. Chinese officials reiterated that a trade war has no winners, even as they prepare retaliatory measures should the new 15% global tariff remain in place long-term.",
    category: "Politics",
    author: "Beijing Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/china/800/600"
  },
  {
    id: "poly-15",
    title: "Global Security: Nigeria Pushes for South Sudan Election Roadmap",
    content: "During the African Union summit, Nigerian Vice President Kashim Shettima called for the immediate release of opposition figures in South Sudan to pave the way for a national dialogue. Nigeria is leading a regional push to ensure that South Sudan’s delayed transition leads to transparent and peaceful national elections. The move is seen as part of Nigeria’s broader goal to stabilize conflict zones across the continent through diplomatic \"Regional Partnerships for Democracy.\"",
    category: "Politics",
    author: "Diplomatic Desk",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/southsudan/800/600"
  },
  {
    id: "poly-16",
    title: "United Kingdom: Labour Government Increases Local Funding for Hackney",
    content: "In a move being watched closely across the UK, the Hackney Council has published a balanced budget for 2026/27, bolstered by a 25% increase in core funding from the national Labour government. The budget includes significant investments in social housing and homelessness prevention. This local success is being framed by the Labour party as a model for \"stable financial planning,\" even as they face national debates regarding the long-term sustainability of public spending.",
    category: "Politics",
    author: "London Bureau",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/hackney/800/600"
  }
];

const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "fallback-1",
    title: "Global Tech Summit Announces Breakthrough in Sustainable Energy",
    content: "Leading scientists and tech giants gathered today to unveil a revolutionary solid-state battery technology that promises to triple the range of electric vehicles while reducing charging times to under five minutes. The breakthrough, a result of a decade-long international collaboration, uses recycled materials and significantly reduces the environmental footprint of battery production. Industry experts predict this could accelerate the transition to renewable energy by several years, making green transportation accessible to millions more people worldwide.",
    category: "Technology",
    author: "Sarah Jenkins",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/tech1/800/600"
  },
  {
    id: "fallback-2",
    title: "New Global Policy Aims to Protect 30% of Oceans by 2030",
    content: "In a historic move, over 190 nations have signed a comprehensive treaty to establish vast marine protected areas in international waters. The agreement provides a legal framework for conservation in the 'High Seas,' which cover nearly half the Earth's surface but have previously been largely unregulated. Marine biologists hailed the treaty as a 'turning point' for biodiversity, noting that it will help protect endangered species, restore depleted fish stocks, and enhance the ocean's ability to absorb carbon dioxide from the atmosphere.",
    category: "Politics",
    author: "Michael Chen",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/ocean1/800/600"
  },
  {
    id: "fallback-3",
    title: "The Future of Remote Work: Hybrid Models Become the New Standard",
    content: "A comprehensive study of 5,000 global companies reveals that the hybrid work model has officially surpassed both fully remote and fully in-office setups as the preferred choice for employees and employers alike. The report highlights that flexibility is now the top priority for job seekers, leading to a significant shift in urban planning and commercial real estate. Cities are beginning to adapt by converting vacant office spaces into residential units and community hubs, reflecting a permanent change in how society balances professional and personal life.",
    category: "Lifestyle",
    author: "Elena Rodriguez",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/work1/800/600"
  }
];

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes("429") || error?.status === 429 || error?.code === 429;
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
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
  async generateNews(category: string = "General"): Promise<NewsArticle[]> {
    const cacheKey = `news_${category}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 10 highly realistic and current news articles for the category: ${category}. 
        Return them as a JSON array of objects with: id, title, content (at least 200 words), category, author, date, and a descriptive imageUrl placeholder (e.g., https://picsum.photos/seed/news1/800/600).`,
        config: {
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
        
        if (isGeneral) return [...STATIC_NEWS, ...FALLBACK_NEWS];
        if (isSports) return [...STATIC_SPORTS_NEWS, ...FALLBACK_NEWS];
        if (isPolitics) return [...STATIC_POLITICAL_NEWS, ...FALLBACK_NEWS];
        return FALLBACK_NEWS;
      }
    }).catch(() => {
      console.warn("API failed after retries, serving fallback news.");
      const isGeneral = category.toLowerCase().includes("general") || category.toLowerCase().includes("home");
      const isSports = category.toLowerCase().includes("sports");
      const isPolitics = category.toLowerCase().includes("politics");
      
      if (isGeneral) return [...STATIC_NEWS, ...FALLBACK_NEWS];
      if (isSports) return [...STATIC_SPORTS_NEWS, ...FALLBACK_NEWS];
      if (isPolitics) return [...STATIC_POLITICAL_NEWS, ...FALLBACK_NEWS];
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

  async detectFakeNews(text: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
    const cacheKey = `fake_${text.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following news text for authenticity. Check for sensationalism, logical fallacies, and verify against known facts. 
        Text: ${text}`,
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

  async translateArticle(content: string, targetLang: string): Promise<string> {
    const cacheKey = `trans_${content.substring(0, 50)}_${targetLang}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following news article to ${targetLang}. Preserve the professional journalistic tone and adapt regional cultural context where appropriate.\n\nContent: ${content}`,
      });

      const text = response.text || content;
      cache.set(cacheKey, { data: text, timestamp: Date.now() });
      return text;
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
        contents: `Based on this news article, generate 3 UPSC-style MCQs and 2 descriptive interview questions.\n\nContent: ${content}`,
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
        return { questions: [], type: "Exam Mode" };
      }
    });
  },

  async analyzeNewsImage(base64Image: string, mimeType: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
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
            text: "Analyze this image of a news article or headline. Verify its authenticity by cross-referencing with current global news using Google Search. Determine if it is real or fake news. Provide an authenticity score (0-100), reasoning, and list verified sources.",
          },
        ],
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
        return JSON.parse(response.text || "{}");
      } catch (e) {
        return { score: 50, reasoning: "Image analysis failed.", sources: [] };
      }
    });
  }
};
