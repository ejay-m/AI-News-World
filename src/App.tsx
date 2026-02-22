import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  Camera, 
  Upload, 
  ChevronRight, 
  Play,
  Globe,
  BookOpen,
  TrendingUp,
  Languages,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Twitter,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { geminiService, NewsArticle } from './services/geminiService';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) => {
  const navItems = ['Home', 'General News', 'Sports', 'Politics', 'Lifestyle'];
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center cursor-pointer" onClick={() => setActivePage('Home')}>
              <div className="bg-brand-dark p-1.5 rounded-lg mr-2">
                <FileText className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tighter flex items-center">
                AI NEWS <span className="text-brand-orange ml-1">WORLD</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActivePage(item)}
                  className={cn(
                    "text-sm font-semibold uppercase tracking-wider transition-colors",
                    activePage === item ? "text-brand-orange border-b-2 border-brand-orange" : "text-gray-600 hover:text-brand-orange"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-brand-orange transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">
              SUBSCRIBE
            </button>
            <button className="p-2 text-gray-500 hover:text-brand-orange transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const UpdateBar = ({ onRefresh, loading, region, setRegion }: { onRefresh: () => void, loading: boolean, region: string, setRegion: (r: string) => void }) => {
  return (
    <div className="bg-white py-3 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Edition:</span>
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-[10px] font-bold uppercase bg-transparent border-none focus:ring-0 cursor-pointer text-brand-dark"
          >
            <option value="Global">Global</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
          </select>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Update 24 * 7 News
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Trend:</span>
          <span className="text-[10px] font-bold uppercase text-green-600 animate-pulse">AI Regulation Surge</span>
        </div>
      </div>
    </div>
  );
};

const BreakingNews = () => (
  <div className="bg-red-50 border-y border-red-100 py-2 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 flex items-center">
      <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded mr-4 uppercase">Breaking</span>
      <div className="text-xs font-medium text-red-800 animate-pulse">
        Global Markets React to New Environmental Policy Shift — Early Results Show Optimism in Green Tech Sector
      </div>
    </div>
  </div>
);

const ArticleCard = ({ article, onSummarize }: { article: NewsArticle, onSummarize: (a: NewsArticle) => void }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [authData, setAuthData] = useState<any>(null);

  const handleVerify = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnalyzing(true);
    try {
      const data = await geminiService.detectFakeNews(article.content);
      setAuthData(data);
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
      onClick={() => onSummarize(article)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button className="bg-white text-brand-dark px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Read More
          </button>
          <button 
            onClick={handleVerify}
            disabled={isAnalyzing}
            className="bg-brand-orange text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1"
          >
            {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
            Verify
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
            {article.category}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold leading-tight group-hover:text-brand-orange transition-colors">
          {article.title}
        </h3>
        
        <AnimatePresence>
          {authData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={cn(
                "p-3 rounded-xl border text-[10px] font-medium leading-relaxed mb-2",
                authData.score > 70 ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-tighter flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Authenticity: {authData.score}%
                </span>
              </div>
              <p className="line-clamp-2 mb-2">{authData.reasoning}</p>
              <div className="flex flex-wrap gap-1">
                {authData.sources?.slice(0, 2).map((s: string) => (
                  <span key={s} className="bg-white/50 px-1.5 py-0.5 rounded border border-current/10">{s}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-500 line-clamp-2">
          {article.content}
        </p>
        
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter pt-2 border-t border-gray-50">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </motion.div>
  );
};

const FakeNewsDetector = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setIsAnalyzing(true);
    // Simulate scan
    setTimeout(() => {
      setResult({
        score: 85,
        reasoning: "The content aligns with verified reports from major news outlets. No inflammatory patterns detected.",
        sources: ["Reuters", "Associated Press", "BBC News"]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-brand-orange w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Fake News Detector</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-xl">
            Upload a screenshot or use your camera to verify news authenticity instantly. Our AI-powered tool cross-references multiple verified sources to provide a reliability score.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleScan} className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
              <Camera className="w-5 h-5" />
              SCAN WITH CAMERA
            </button>
            <button className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
              <Upload className="w-5 h-5" />
              UPLOAD LOCAL IMAGE
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-64 h-48 bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200"
            >
              <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mb-2" />
              <span className="text-xs font-bold text-gray-500 uppercase">Analyzing Content...</span>
            </motion.div>
          )}
          
          {result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full md:w-80 bg-green-50 rounded-xl p-6 border border-green-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-green-700 uppercase">Authenticity Score</span>
                <span className="text-2xl font-black text-green-600">{result.score}%</span>
              </div>
              <div className="w-full bg-green-200 h-2 rounded-full mb-4">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${result.score}%` }}></div>
              </div>
              <p className="text-xs text-green-800 mb-4 font-medium leading-relaxed">
                {result.reasoning}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((s: string) => (
                  <span key={s} className="text-[9px] bg-white text-green-700 px-2 py-1 rounded border border-green-200 font-bold uppercase">{s}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const SummarizerModal = ({ article, onClose }: { article: NewsArticle, onClose: () => void }) => {
  const [level, setLevel] = useState('30-word');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [examMode, setExamMode] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [fakeNewsMode, setFakeNewsMode] = useState(false);
  const [fakeNewsData, setFakeNewsData] = useState<any>(null);
  const [lang, setLang] = useState('English');

  const levels = [
    { id: '30-word', label: '30 Words', icon: FileText },
    { id: '100-word', label: '100 Words', icon: FileText },
    { id: 'bullet', label: 'Bullets', icon: ChevronRight },
    { id: 'tweet', label: 'Tweet', icon: Twitter },
  ];

  const fetchSummary = async (l: string) => {
    setLoading(true);
    setExamMode(false);
    setFakeNewsMode(false);
    const s = await geminiService.summarizeArticle(article.content, l);
    setSummary(s);
    setLoading(false);
  };

  const handleExamMode = async () => {
    setLoading(true);
    setExamMode(true);
    setFakeNewsMode(false);
    const data = await geminiService.generateExamQuestions(article.content);
    setExamData(data);
    setLoading(false);
  };

  const handleFakeNewsCheck = async () => {
    setLoading(true);
    setExamMode(false);
    setFakeNewsMode(true);
    const data = await geminiService.detectFakeNews(article.content);
    setFakeNewsData(data);
    setLoading(false);
  };

  const handleTranslate = async (target: string) => {
    setLoading(true);
    const t = await geminiService.translateArticle(summary || article.content, target);
    setSummary(t);
    setLang(target);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary(level);
  }, [article]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
      >
        <div className="w-full md:w-1/3 bg-brand-dark p-8 text-white">
          <button onClick={onClose} className="mb-8 text-white/60 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="mb-6">
            <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2 block">AI Smart Summarizer</span>
            <h2 className="text-2xl font-bold leading-tight">{article.title}</h2>
          </div>
          
          <div className="space-y-3">
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLevel(l.id); fetchSummary(l.id); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  level === l.id && !examMode ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </button>
            ))}
            <button
              onClick={handleExamMode}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                examMode ? "bg-brand-blue text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              Exam Mode (UPSC)
            </button>
            <button
              onClick={handleFakeNewsCheck}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                fakeNewsMode ? "bg-red-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Authenticity Check
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase text-white/40 mb-4 block">Translate Summary</span>
            <div className="grid grid-cols-2 gap-2">
              {['Tamil', 'Hindi', 'French', 'Spanish'].map(l => (
                <button 
                  key={l}
                  onClick={() => handleTranslate(l)}
                  className="text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 py-2 rounded transition-all"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-12 h-12 animate-spin mb-4" />
              <span className="text-sm font-bold uppercase tracking-widest">AI is processing...</span>
            </div>
          ) : examMode ? (
            <div className="space-y-8">
              <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
                <h3 className="text-brand-blue font-bold uppercase text-xs mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> UPSC-Style Analysis
                </h3>
                <div className="prose prose-slate max-w-none">
                  <Markdown>{summary}</Markdown>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="font-bold uppercase text-sm text-gray-500">Practice Questions</h4>
                {examData?.questions.map((q: string, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <span className="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                    <p className="text-sm font-medium text-gray-700">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : fakeNewsMode ? (
            <div className="space-y-8">
              <div className={cn(
                "p-8 rounded-3xl border",
                fakeNewsData?.score > 70 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={cn(
                    "font-bold uppercase text-xs flex items-center gap-2",
                    fakeNewsData?.score > 70 ? "text-green-700" : "text-red-700"
                  )}>
                    <ShieldCheck className="w-4 h-4" /> Authenticity Report
                  </h3>
                  <span className={cn(
                    "text-3xl font-black",
                    fakeNewsData?.score > 70 ? "text-green-600" : "text-red-600"
                  )}>{fakeNewsData?.score}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${fakeNewsData?.score}%` }}
                    className={cn(
                      "h-full rounded-full",
                      fakeNewsData?.score > 70 ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                </div>
                <p className="text-sm font-medium leading-relaxed text-gray-800 mb-6">
                  {fakeNewsData?.reasoning}
                </p>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Verified Sources</span>
                  <div className="flex flex-wrap gap-2">
                    {fakeNewsData?.sources?.map((s: string) => (
                      <span key={s} className="text-[10px] bg-white px-3 py-1 rounded-full border border-gray-100 font-bold text-gray-600 shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase text-brand-orange bg-brand-orange/10 px-2 py-1 rounded">
                  {level.replace('-', ' ')} Summary ({lang})
                </span>
                <button className="text-gray-400 hover:text-brand-orange">
                  <Languages className="w-4 h-4" />
                </button>
              </div>
              <Markdown>{summary}</Markdown>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ news, onSummarize }: { news: NewsArticle[], onSummarize: (a: NewsArticle) => void }) => {
  const featured = news[0];
  const others = news.slice(1);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {featured && (
        <section 
          className="relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer"
          onClick={() => onSummarize(featured)}
        >
          <img 
            src={featured.imageUrl} 
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-12 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded uppercase">World Affairs</span>
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <Play className="w-3 h-3" /> Listen
                <FileText className="w-3 h-3 ml-2" /> Summary
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-6 leading-[0.9] tracking-tighter">
              {featured.title}
            </h1>
            <p className="text-white/80 text-lg mb-8 line-clamp-2 font-medium">
              {featured.content}
            </p>
            <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <span>{featured.author}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>{featured.date}</span>
            </div>
          </div>
        </section>
      )}

      {/* Fake News Detector */}
      <FakeNewsDetector />

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-3xl uppercase tracking-tighter">Latest Stories</h2>
            <button className="text-brand-orange text-xs font-bold uppercase flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {others.map((article) => (
              <ArticleCard key={article.id} article={article} onSummarize={onSummarize} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Most Read
            </h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <span className="text-4xl font-black text-gray-100 group-hover:text-brand-orange/20 transition-colors">0{i}</span>
                  <div>
                    <h4 className="text-sm font-bold leading-tight mb-1 group-hover:text-brand-orange transition-colors">
                      The 10 Best Investment Strategies for a Volatile Market
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Economy • 2.4k views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Live Scores</h3>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase">NBA • Final</span>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>LAK</span>
                    <span className="text-brand-orange">112 - 108</span>
                    <span>GSW</span>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase">Premier League • 65'</span>
                    <span className="text-[8px] bg-red-500 text-white px-1 rounded animate-pulse">LIVE</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>MUN</span>
                    <span className="text-brand-orange">2 - 1</span>
                    <span>CHE</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const PoliticsPage = ({ news, onSummarize }: { news: NewsArticle[], onSummarize: (a: NewsArticle) => void }) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer" onClick={() => onSummarize(news[0])}>
            <img src={news[0]?.imageUrl} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">Government</span>
              <h1 className="text-4xl text-white mb-4 leading-tight">Landmark Legislative Victory: Health Reform Bill Passes Senate Floor</h1>
              <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase">
                <span>2 hours ago</span>
                <span>By Julian Thorne</span>
              </div>
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-brand-orange mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Election Center
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Incumbent Party</span>
                  <span className="text-brand-orange">48%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-orange h-full" style={{ width: '48%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Challenger Party</span>
                  <span className="text-brand-blue">46%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-blue h-full" style={{ width: '46%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-brand-orange text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Full Polling Dashboard
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-6">Latest Bulletins</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <span className="text-[9px] font-bold text-brand-orange uppercase block mb-1">10:45 AM</span>
                  <p className="text-xs font-bold leading-tight">Supreme Court hears arguments on voting access rights</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.slice(1).map(a => (
          <ArticleCard key={a.id} article={a} onSummarize={onSummarize} />
        ))}
      </div>

      <section className="bg-brand-dark rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl mb-6">The Morning Briefing</h2>
            <p className="text-white/60 mb-8 max-w-md">Get the most critical political analysis, government updates, and election news delivered to your inbox every morning at 6:00 AM.</p>
            <div className="flex gap-4">
              <input type="email" placeholder="Enter your email address" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-sm focus:outline-none focus:border-brand-orange" />
              <button className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Subscribe</button>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
             <Bell className="w-24 h-24 text-brand-orange/20" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SportsPage = ({ news, onSummarize }: { news: NewsArticle[], onSummarize: (a: NewsArticle) => void }) => {
  return (
    <div className="space-y-12">
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['All Sports', 'Football', 'Cricket', 'Tennis', 'Formula 1', 'NBA', 'Golf'].map((s, i) => (
          <button key={s} className={cn(
            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shrink-0 transition-all",
            i === 0 ? "bg-brand-orange text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-brand-orange hover:text-brand-orange"
          )}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer" onClick={() => onSummarize(news[0])}>
            <img src={news[0]?.imageUrl} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">Champions League</span>
              <h1 className="text-4xl text-white mb-4 leading-tight">Champions League Finals: Previewing the Big Match</h1>
              <p className="text-white/60 text-sm mb-6 max-w-xl">The stage is set in Istanbul as two giants of European football prepare for the ultimate showdown. Can the underdogs pull off a miracle?</p>
              <div className="flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 2 hours ago</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 128 comments</span>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-orange flex items-center gap-2">
              <Play className="w-4 h-4" /> Live Scores
            </h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase">Updated 1m ago</span>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-3">
                <span>Premier League</span>
                <span className="text-red-500">85'</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
                    <span>Man City</span>
                  </div>
                  <span>2</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white border border-gray-200 rounded-sm"></div>
                    <span>Real Madrid</span>
                  </div>
                  <span>1</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-3">
                <span>ICC World Cup</span>
                <span className="bg-gray-200 text-gray-600 px-1 rounded">Innings Break</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-800 rounded-sm"></div>
                    <span>India</span>
                  </div>
                  <span>184/3</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-800 rounded-sm"></div>
                    <span>Pakistan</span>
                  </div>
                  <span>-</span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 text-gray-400 text-[10px] font-bold uppercase hover:text-brand-orange transition-colors">
            View All Match Center
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.slice(1).map(a => (
          <div key={a.id} className="group cursor-pointer" onClick={() => onSummarize(a)}>
            <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
              <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase">{a.category}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LifestylePage = ({ news, onSummarize }: { news: NewsArticle[], onSummarize: (a: NewsArticle) => void }) => {
  return (
    <div className="space-y-12">
      <section className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer" onClick={() => onSummarize(news[0])}>
        <img src={news[0]?.imageUrl} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12">
          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">Travel</span>
          <h1 className="text-5xl text-white mb-4 leading-tight max-w-2xl">The 10 Best Hidden Getaways for 2024</h1>
          <p className="text-white/80 text-lg max-w-xl">Escape the crowds and rediscover tranquility in these hand-picked destinations across the globe.</p>
        </div>
      </section>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['All Stories', 'Health & Wellness', 'Travel', 'Food & Dining', 'Culture'].map((s, i) => (
          <button key={s} className={cn(
            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shrink-0 transition-all",
            i === 0 ? "bg-brand-orange text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-brand-orange hover:text-brand-orange"
          )}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <h2 className="text-2xl uppercase tracking-tighter">Health & Wellness</h2>
              <button className="text-brand-orange text-[10px] font-bold uppercase">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.slice(1, 5).map(a => (
                <ArticleCard key={a.id} article={a} onSummarize={onSummarize} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <h2 className="text-2xl uppercase tracking-tighter">Food & Dining</h2>
              <button className="text-brand-orange text-[10px] font-bold uppercase">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.slice(5).map(a => (
                <div key={a.id} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => onSummarize(a)}>
                  <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl text-white font-bold">{a.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <div className="bg-brand-orange rounded-3xl p-8 text-white">
            <Bell className="w-8 h-8 mb-6" />
            <h3 className="text-2xl font-bold mb-4">The Lifestyle Digest</h3>
            <p className="text-white/80 text-sm mb-8">The best of travel, food, and wellness delivered to your inbox every Saturday morning.</p>
            <input type="email" placeholder="Your email address" className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm mb-4 placeholder:text-white/50 focus:outline-none" />
            <button className="w-full bg-white text-brand-orange py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Subscribe Now</button>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-6 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> The Edit
            </h3>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/edit${i}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight mb-1 group-hover:text-brand-orange transition-colors">Sustainable Accessories to Watch in 2024</h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Elegance & Ethics</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-brand-dark text-white pt-20 pb-10 mt-20">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-1 rounded-lg mr-2">
              <FileText className="text-brand-dark w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              AI NEWS <span className="text-brand-orange ml-1">WORLD</span>
            </span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Dedicated to bringing you impartial, in-depth, and impactful journalism from around the globe since 1924. Quality news you can trust.
          </p>
          <div className="flex gap-4">
            <Globe className="w-5 h-5 text-white/40 hover:text-brand-orange cursor-pointer" />
            <Twitter className="w-5 h-5 text-white/40 hover:text-brand-orange cursor-pointer" />
            <Play className="w-5 h-5 text-white/40 hover:text-brand-orange cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Sections</h4>
          <ul className="space-y-4 text-sm text-white/60 font-medium">
            <li className="hover:text-brand-orange cursor-pointer">General News</li>
            <li className="hover:text-brand-orange cursor-pointer">Sports Analysis</li>
            <li className="hover:text-brand-orange cursor-pointer">Global Politics</li>
            <li className="hover:text-brand-orange cursor-pointer">Lifestyle & Culture</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-white/60 font-medium">
            <li className="hover:text-brand-orange cursor-pointer">About Us</li>
            <li className="hover:text-brand-orange cursor-pointer">Contact Support</li>
            <li className="hover:text-brand-orange cursor-pointer">Terms of Service</li>
            <li className="hover:text-brand-orange cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-6">Founders</h4>
          <div className="space-y-2">
            <p className="text-sm font-bold">Ejay M & G Karthik</p>
            <p className="text-xs text-white/40 uppercase tracking-widest">SMIT students 2022 batch</p>
          </div>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2024 The Daily Navy Media Group. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Ad Choices</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('Home');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [region, setRegion] = useState('Global');

  const loadNews = async () => {
    setLoading(true);
    const category = activePage === 'Home' ? 'General' : activePage;
    const prompt = region === 'Global' ? category : `${category} news focusing on ${region}`;
    const data = await geminiService.generateNews(prompt);
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, [activePage, region]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <UpdateBar onRefresh={loadNews} loading={loading} region={region} setRegion={setRegion} />
      <BreakingNews />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading && news.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="w-16 h-16 animate-spin mb-6 text-brand-orange" />
            <h2 className="text-xl font-bold uppercase tracking-[0.2em]">AI is gathering the latest news...</h2>
          </div>
        ) : (
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activePage === 'Home' && <HomePage news={news} onSummarize={setSelectedArticle} />}
            {activePage === 'General News' && <HomePage news={news} onSummarize={setSelectedArticle} />}
            {activePage === 'Politics' && <PoliticsPage news={news} onSummarize={setSelectedArticle} />}
            {activePage === 'Sports' && <SportsPage news={news} onSummarize={setSelectedArticle} />}
            {activePage === 'Lifestyle' && <LifestylePage news={news} onSummarize={setSelectedArticle} />}
          </motion.div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selectedArticle && (
          <SummarizerModal 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
