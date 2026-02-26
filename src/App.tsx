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
  ChevronLeft,
  Play,
  Volume2,
  VolumeX,
  FileText,
  Globe,
  BookOpen,
  TrendingUp,
  Languages,
  X,
  CheckCircle2,
  AlertTriangle,
  Twitter,
  ChevronDown,
  GraduationCap,
  MapPin,
  Trophy,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { geminiService, NewsArticle } from './services/geminiService';
import { cn } from './lib/utils';
import { VoiceAssistant } from './components/VoiceAssistant';

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: (name: string, email: string) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin(name, email);
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-brand-orange" />,
      title: "AI Chat Assistant",
      description: "Converse with every story. Ask questions, get context, and dive deeper into the headlines."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-orange" />,
      title: "Smart Summaries",
      description: "Save time with AI-generated versions of long-form reports and global news."
    },
    {
      icon: <Languages className="w-6 h-6 text-brand-orange" />,
      title: "Real-Time Translation",
      description: "Breaking news has no borders. Instantly translate any article into your preferred language."
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-orange" />,
      title: "24/7 Live Pulse",
      description: "Continuous updates and live-tracked market shifts, refreshed every second."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Feature Showcase */}
        <div className="lg:w-1/2 bg-brand-dark p-12 lg:p-24 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-brand-blue rounded-full blur-[100px]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="mb-12">
              <span className="text-brand-orange text-xs font-black uppercase tracking-[0.4em] mb-4 block">AI NEWS WORLD</span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-[0.9] tracking-tighter mb-6">
                Welcome to the Future of Information.
              </h1>
              <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed">
                Access your personalized AI-driven newsroom and stay ahead of the curve.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="space-y-3"
                >
                  <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-gray-50/50">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-brand-dark mb-2">Get Started</h2>
              <p className="text-gray-500 font-medium">Enter your details to access the newsroom.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@email.com"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-2xl shadow-brand-orange/20 hover:bg-opacity-90 transition-all transform hover:-translate-y-1"
              >
                open the web
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-4 text-gray-400 font-bold tracking-widest">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-white border border-gray-200 text-brand-dark py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Google Account
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      {/* Developer Footer */}
      <footer className="py-12 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-brand-dark mb-2 uppercase tracking-tighter">
            Proudly developed by Ejay M & G Karthik
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            SMIT Students | batch of 2022
          </p>
        </div>
      </footer>
    </div>
  );
};

const Navbar = ({ activePage, setActivePage, onSearch, user, onSignOut }: { activePage: string, setActivePage: (p: string) => void, onSearch: (q: string) => void, user: { name: string, email: string } | null, onSignOut: () => void }) => {
  const navItems = ['Home', 'General News', 'Sports', 'Politics', 'Lifestyle'];
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center cursor-pointer" onClick={() => setActivePage('Home')}>
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
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Live Updates</span>
            </div>
            
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
                  >
                    <input 
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search real-time news..."
                      className="w-full pl-4 pr-10 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-orange"
                    />
                    <button type="submit" className="absolute right-3 text-gray-400 hover:text-brand-orange">
                      <Search className="w-4 h-4" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-500 hover:text-brand-orange transition-colors"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-gray-500 hover:text-brand-orange transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 z-50"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <button 
                        onClick={onSignOut}
                        className="w-full text-left text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Update 24 * 7 News
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <Globe className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Grounded in Google Search</span>
          </div>
        </div>

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

const ArticleActions = ({ content }: { content: string }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isReadingMore, setIsReadingMore] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState('English');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const requestIdRef = React.useRef(0);

  // Close lang menu on outside click
  useEffect(() => {
    if (!isLangMenuOpen) return;
    const handleOutsideClick = () => setIsLangMenuOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isLangMenuOpen]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [audio]);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentId = ++requestIdRef.current;
    
    // If already speaking or loading, stop everything
    if (isSpeaking || isLoadingAudio) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const wavBytes = await geminiService.generateSpeech(content);
      
      // Check if the request was cancelled during the async call
      if (currentId !== requestIdRef.current) return;

      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.oncanplay = () => {
        if (currentId !== requestIdRef.current) {
          URL.revokeObjectURL(audioUrl);
          return;
        }
        setIsLoadingAudio(false);
        setIsSpeaking(true);
        newAudio.play().catch(err => {
          console.error("Playback failed", err);
          setIsSpeaking(false);
        });
      };
      
      newAudio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      newAudio.onerror = (e) => {
        console.error("Audio error", e);
        setIsLoadingAudio(false);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      setAudio(newAudio);
    } catch (error) {
      console.error("Speech generation failed", error);
      setIsLoadingAudio(false);
      setIsSpeaking(false);
    }
  };

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (summary) {
      setSummary(null);
      return;
    }
    setIsSummarizing(true);
    try {
      const text = await geminiService.summarizeArticle(content, "30-word");
      setSummary(text);
    } catch (error) {
      console.error("Summarization failed", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReadMore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (brief) {
      setBrief(null);
      return;
    }
    setIsReadingMore(true);
    try {
      const text = await geminiService.summarizeArticle(content, "100-word");
      setBrief(text);
    } catch (error) {
      console.error("Read More failed", error);
    } finally {
      setIsReadingMore(false);
    }
  };

  const handleTranslate = async (lang: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (lang === 'English') {
      setTranslatedText(null);
      setCurrentLang('English');
      return;
    }
    
    setIsTranslating(true);
    setIsLangMenuOpen(false);
    try {
      const text = await geminiService.translateArticle(content, lang);
      setTranslatedText(text);
      setCurrentLang(lang);
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <AnimatePresence>
        {(summary || brief || translatedText) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-orange/5 border border-brand-orange/10 p-3 rounded-xl text-xs font-medium text-brand-dark italic leading-relaxed overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-1 text-brand-orange font-bold uppercase text-[9px]">
              {summary ? <FileText className="w-3 h-3" /> : brief ? <BookOpen className="w-3 h-3" /> : <Languages className="w-3 h-3" />}
              {summary ? "AI Summary" : brief ? "Brief Version" : `Translated (${currentLang})`}
            </div>
            {summary || brief || translatedText}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={handleSpeak}
          disabled={isLoadingAudio && !isSpeaking}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            (isSpeaking || isLoadingAudio) ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
        >
          {isLoadingAudio ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : isSpeaking ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className="w-3 h-3" />
          )}
          {isLoadingAudio ? "Loading..." : isSpeaking ? "Stop" : "Listen"}
        </button>
        <button 
          onClick={handleSummarize}
          disabled={isSummarizing}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            summary ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
        >
          {isSummarizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
          {isSummarizing ? "Summarizing..." : summary ? "Show Original" : "Summarize"}
        </button>
        <button 
          onClick={handleReadMore}
          disabled={isReadingMore}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            brief ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
        >
          {isReadingMore ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BookOpen className="w-3 h-3" />}
          {isReadingMore ? "Loading..." : brief ? "Hide Brief" : "Read More"}
        </button>

        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLangMenuOpen(!isLangMenuOpen);
            }}
            disabled={isTranslating}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              currentLang !== 'English' ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {isTranslating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
            {isTranslating ? "Translating..." : currentLang === 'English' ? "Language" : currentLang}
            <ChevronDown className={cn("w-3 h-3 transition-transform", isLangMenuOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-2 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl p-2 z-50 min-w-[140px]"
              >
                <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest px-3 py-1 mb-1">Select Language</div>
                {['English', 'Tamil', 'Malayalam', 'Hindi'].map(lang => (
                  <button
                    key={lang}
                    onClick={(e) => handleTranslate(lang, e)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between",
                      currentLang === lang ? "text-emerald-600 bg-emerald-50" : "text-gray-600"
                    )}
                  >
                    {lang}
                    {currentLang === lang && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }: { article: NewsArticle }) => {
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
      className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
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
                <span className={cn(
                  "font-black uppercase text-sm tracking-tight",
                  authData.score > 70 ? "text-green-600" : "text-red-600"
                )}>
                  {authData.score > 70 ? "IT IS REAL" : "IT IS FAKE"}
                </span>
              </div>
              <p className={cn(
                "line-clamp-2 mb-2 font-bold",
                authData.score > 70 ? "text-green-700" : "text-red-700"
              )}>
                {authData.reasoning}
              </p>
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
        
        <ArticleActions content={article.content} />
        
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const [mimePart, base64Part] = imagePreview.split(',');
      const mimeType = mimePart.match(/:(.*?);/)?.[1] || 'image/jpeg';
      const data = await geminiService.analyzeNewsImage(base64Part, mimeType);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
      setResult({ score: 0, reasoning: "Error analyzing image. Please try again.", sources: [] });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section 
      className="relative bg-brand-dark rounded-[2rem] p-1 lg:p-12 mb-12 overflow-hidden shadow-2xl"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-orange rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-stretch">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-brand-orange/20 rounded-2xl border border-brand-orange/30">
              <ShieldCheck className="text-brand-orange w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter uppercase">Fake News Detector</h2>
              <p className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em]">AI-Powered Verification</p>
            </div>
          </motion.div>

          <p className="text-white/60 text-lg mb-8 max-w-xl leading-relaxed font-medium">
            Combat misinformation with our advanced neural verification engine. Upload any news snippet or headline to instantly verify its authenticity against global data streams.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="group flex items-center gap-3 bg-white text-brand-dark px-8 py-4 rounded-2xl font-bold hover:bg-brand-orange hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <Upload className="w-5 h-5 group-hover:animate-bounce" />
              SELECT IMAGE
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*" 
            />
            {imagePreview && !isAnalyzing && (
              <button 
                onClick={handleScan} 
                className="flex items-center gap-3 bg-brand-orange text-white px-10 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-orange/20"
              >
                <RefreshCw className="w-5 h-5" />
                INITIATE SCAN
              </button>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-brand-dark bg-gray-800 flex items-center justify-center">
                  <Globe className="w-3 h-3" />
                </div>
              ))}
            </div>
            <span>Cross-referencing 500+ sources</span>
          </div>
        </div>
        
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="relative w-full aspect-square bg-white/5 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/10 flex items-center justify-center group">
            {imagePreview ? (
              <div className="relative w-full h-full p-4">
                <img 
                  src={imagePreview} 
                  className="w-full h-full object-cover rounded-[1.5rem] shadow-2xl" 
                  alt="Preview" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <div className="text-center p-12 transition-all group-hover:scale-110">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Upload className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                  Drop evidence here<br/><span className="text-[10px] opacity-50 font-medium">PNG, JPG, WEBP</span>
                </p>
              </div>
            )}
            
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md flex flex-col items-center justify-center z-20"
                >
                  <div className="relative mb-6">
                    <RefreshCw className="w-16 h-16 text-brand-orange animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-brand-orange rounded-full animate-ping opacity-20"></div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Analyzing Neural Patterns...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                  "rounded-[2.5rem] p-8 border-2 shadow-2xl relative overflow-hidden",
                  result.score > 70 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}
              >
                {/* Result Glow */}
                <div className={cn(
                  "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-30",
                  result.score > 70 ? "bg-emerald-500" : "bg-rose-500"
                )}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verification Result</span>
                      <h3 className="text-4xl font-black tracking-tighter">
                        {result.score > 70 ? "IT IS REAL NEWS" : "IT IS FAKE NEWS"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-black tracking-tighter leading-none">{result.score}%</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Confidence</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white/5 h-3 rounded-full mb-8 overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)]",
                        result.score > 70 ? "bg-emerald-500" : "bg-rose-500"
                      )} 
                    ></motion.div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-xs font-semibold leading-relaxed text-white/80 italic">
                        "{result.reasoning}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {result.sources.map((s: string) => (
                          <span key={s} className="text-[9px] bg-white/5 text-white/60 px-3 py-1.5 rounded-full border border-white/10 font-bold uppercase tracking-wider">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// --- Pages ---

const GlobalBriefings = () => {
  const briefings = [
    {
      category: "Geopolitical Intelligence",
      icon: <Globe className="w-5 h-5" />,
      items: [
        {
          title: "Ukraine Conflict Anniversary",
          content: "Today marks exactly four years since the start of the war. President Zelenskyy reaffirmed Ukraine’s commitment to the struggle, even as internal divisions among Western allies complicate further aid packages. Meanwhile, the UK has announced its largest-ever sanctions package against Russia, targeting the oil pipeline operator Transneft."
        },
        {
          title: "North Korean Power Shift",
          content: "During a high-profile party congress, Kim Jong Un pledged a major five-year economic push. Notably, his sister, Kim Yo Jong, has been further elevated within the party hierarchy, signaling a tightening of the family’s grip on state policy."
        },
        {
          title: "ASEAN Diplomacy",
          content: "The Philippines is leading commemorations for the 50th Anniversary of the Treaty of Amity and Cooperation (TAC), a cornerstone agreement for regional peace in Southeast Asia."
        }
      ]
    },
    {
      category: "Economic & Market Analysis",
      icon: <TrendingUp className="w-5 h-5" />,
      items: [
        {
          title: "US Tariff Volatility",
          content: "Following a Supreme Court ruling that struck down emergency trade measures, the US has officially implemented a 10% tariff on all non-exempt goods. This is lower than the 15% rate previously threatened but has still caused ripples of uncertainty across global equity indices."
        },
        {
          title: "Monetary Policy & Security",
          content: "The Bank of Israel has signaled that geopolitical tensions with Iran are now the primary driver of its interest rate decisions, overriding traditional domestic indicators like inflation and currency strength."
        }
      ]
    },
    {
      category: "Science & Technology",
      icon: <Zap className="w-5 h-5" />,
      items: [
        {
          title: "Artemis II Delay",
          content: "NASA has pushed the historic Artemis II lunar mission back to at least April 2026. The delay stems from a persistent helium flow issue in the moon rocket that engineers need more time to resolve."
        },
        {
          title: "Climate Data Transparency",
          content: "The UN, in partnership with Microsoft, has launched the Climate Data Hub. This AI-enabled platform centralizes climate data from over 190 countries to track real-time progress on Paris Agreement targets."
        },
        {
          title: "AI Productivity",
          content: "Global markets are closely watching a surge in AI-driven productivity gains, though investors remain cautious about the potential for labor market disruption in the tech and services sectors."
        }
      ]
    },
    {
      category: "Global Spotlights",
      icon: <Star className="w-5 h-5" />,
      items: [
        {
          title: "Milan’s Olympic Legacy",
          content: "As the Milan-Cortina 2026 Winter Games conclude their main events, the city is transitioning into a \"legacy phase,\" with the Olympic Village being converted into much-needed student housing for the region’s 10 universities."
        },
        {
          title: "India-Japan Relations",
          content: "The 7th edition of the \"Dharma Guardian\" joint military exercise has commenced in Uttarakhand, focusing on jungle and semi-urban warfare coordination."
        }
      ]
    }
  ];

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-12 h-1 bg-brand-orange"></div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Global Briefings</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-auto">Intelligence Report • Feb 2026</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {briefings.map((section, idx) => (
          <div key={idx} className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg text-brand-orange">
                {section.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-dark">
                {section.category}
              </h3>
            </div>
            
            <div className="space-y-10">
              {section.items.map((item, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="text-sm font-bold mb-2 group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const HomePage = ({ news }: { news: NewsArticle[] }) => {
  // Separate static news from dynamic news
  const staticNews = news.filter(a => a.id.startsWith('static-'));
  const dynamicNews = news.filter(a => !a.id.startsWith('static-'));
  
  const featured = dynamicNews[0] || staticNews[0] || news[0];
  const others = news.filter(a => a.id !== featured?.id && !a.id.startsWith('static-'));

  return (
    <div className="space-y-20">
      {/* Editorial Hero Section */}
      {featured && (
        <section 
          className="relative h-[80vh] min-h-[600px] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden group"
        >
          <img 
            src={featured.imageUrl} 
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-brand-orange text-white text-[10px] font-black px-3 py-1.5 rounded-sm uppercase tracking-[0.2em]">
                  {featured.category}
                </span>
                <div className="h-px w-12 bg-white/30"></div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {featured.date}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl text-white mb-8 leading-[0.85] tracking-tighter font-bold group-hover:text-brand-orange transition-colors duration-500">
                {featured.title}
              </h1>
              <p className="text-white/70 text-xl mb-10 line-clamp-2 max-w-2xl font-medium leading-relaxed">
                {featured.content}
              </p>
              <ArticleActions content={featured.content} />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <span>By {featured.author}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Special Report: Permanent News Updates */}
      {staticNews.length > 0 && (
        <section className="relative py-20 border-y border-gray-100">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
            <div className="space-y-2">
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] block">Exclusive</span>
              <h2 className="text-5xl font-bold uppercase tracking-tighter text-brand-dark">
                Special Reports
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-xs font-medium italic">
              "Curated insights and permanent updates from our global editorial team."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-3xl overflow-hidden shadow-2xl shadow-brand-dark/5">
            {staticNews.map((a, idx) => {
              // Dynamic featured logic: 1st, 4th, 5th, 8th, 9th...
              const isFeatured = idx % 4 === 0 || idx % 4 === 3;
              return (
                <div 
                  key={a.id} 
                  className={cn(
                    "bg-white p-8 transition-all duration-500 flex flex-col justify-between min-h-[400px] relative group/item",
                    isFeatured && "md:col-span-2 lg:col-span-2"
                  )}
                >
                  {isFeatured && (
                    <div className="absolute inset-0 opacity-5 group-hover/item:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <img src={a.imageUrl} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">
                        {idx < 9 ? `0${idx + 1}` : idx + 1} / {a.category}
                      </span>
                      <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-bold leading-[0.95] mb-6 tracking-tighter group-hover/item:text-brand-orange transition-colors duration-300",
                          isFeatured ? "text-4xl lg:text-5xl" : "text-2xl"
                        )}>
                          {a.title}
                        </h3>
                        <p className={cn(
                          "text-gray-500 leading-relaxed font-medium",
                          isFeatured ? "text-base line-clamp-6" : "text-sm line-clamp-4"
                        )}>
                          {a.content}
                        </p>
                        <ArticleActions content={a.content} />
                      </div>
                      {isFeatured && (
                        <div className="hidden md:block w-1/3 aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">By {a.author}</span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">{a.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fake News Detector - Integrated as a tool */}
      <div className="py-10">
        <FakeNewsDetector />
      </div>

      {/* Trending & Must Read Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-gray-100 pt-20">
        <div className="lg:col-span-4 bg-brand-dark rounded-3xl p-10 text-white relative overflow-hidden h-fit">
          <div className="relative z-10">
            <TrendingUp className="text-brand-orange w-8 h-8 mb-6" />
            <h3 className="text-2xl font-bold mb-4 leading-tight">Trending Topics</h3>
            <p className="text-white/50 text-sm mb-8">AI-curated topics currently shaping the global conversation.</p>
            <div className="flex flex-wrap gap-2">
              {['Tariffs', 'SpaceX', 'AI Ethics', 'Climate', 'Elections'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-dark">Must Read Stories</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {others.slice(0, 3).map((a, i) => (
              <div key={a.id} className="group cursor-pointer">
                <div className="text-5xl font-black text-gray-100 group-hover:text-brand-orange/20 transition-colors mb-4">0{i + 1}</div>
                <h4 className="text-sm font-bold leading-tight mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                  {a.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium line-clamp-2 mb-4">{a.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{a.category}</span>
                  <span className="text-[8px] font-bold text-gray-300 uppercase">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main News Feed */}
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {others.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
      {/* Global Briefings Section */}
      <section className="py-12 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicNews.slice(0, 6).map((a, i) => (
            <div key={a.id} className="group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-dark text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm">
                    {a.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                {a.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-4 font-medium leading-relaxed">
                {a.content}
              </p>
              <ArticleActions content={a.content} />
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">By {a.author}</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GlobalBriefings />

      <Newsletter />
    </div>
  );
};

const PoliticsPage = ({ news }: { news: NewsArticle[] }) => {
  // Separate static news from dynamic news
  const staticPolitics = news.filter(a => a.id.startsWith('poly-'));
  const dynamicPolitics = news.filter(a => !a.id.startsWith('poly-'));
  
  const featured = dynamicPolitics[0] || staticPolitics[0] || news[0];
  const others = news.filter(a => a.id !== featured?.id && !a.id.startsWith('poly-'));

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {featured && (
            <section className="relative h-[500px] rounded-3xl overflow-hidden group">
              <img src={featured.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">{featured.category}</span>
                <h1 className="text-4xl text-white mb-4 leading-tight font-bold group-hover:text-brand-orange transition-colors">{featured.title}</h1>
                <p className="text-white/70 text-sm mb-6 max-w-xl line-clamp-2">{featured.content}</p>
                <ArticleActions content={featured.content} />
                <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase">
                  <span>{featured.date}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span>By {featured.author}</span>
                </div>
              </div>
            </section>
          )}
        </div>
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            <PoliticalMap />
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
      </div>

      <Newsletter />

      {/* Permanent Political Updates Section */}
      {staticPolitics.length > 0 && (
        <section className="relative py-12 border-y border-gray-100">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
            <div className="space-y-2">
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] block">Exclusive</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter text-brand-dark">
                Political Briefings
              </h2>
            </div>
            <p className="text-gray-400 text-xs max-w-xs font-medium italic">
              "Permanent updates and deep-dives into the corridors of power."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-3xl overflow-hidden">
            {staticPolitics.map((a, idx) => {
              // Dynamic featured logic: 1st, 4th, 5th, 8th, 9th...
              const isFeatured = idx % 4 === 0 || idx % 4 === 3;
              return (
                <div 
                  key={a.id} 
                  className={cn(
                    "bg-white p-6 transition-all duration-500 flex flex-col justify-between min-h-[350px] relative group/item",
                    isFeatured && "md:col-span-2 lg:col-span-2"
                  )}
                >
                  {isFeatured && (
                    <div className="absolute inset-0 opacity-[0.03] group-hover/item:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <img src={a.imageUrl} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
                        {idx < 9 ? `0${idx + 1}` : idx + 1} / {a.category}
                      </span>
                      <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-bold leading-tight mb-4 tracking-tight group-hover/item:text-brand-orange transition-colors duration-300",
                          isFeatured ? "text-2xl lg:text-3xl" : "text-xl"
                        )}>
                          {a.title}
                        </h3>
                        <p className={cn(
                          "text-gray-500 leading-relaxed font-medium",
                          isFeatured ? "text-sm line-clamp-6" : "text-xs line-clamp-4"
                        )}>
                          {a.content}
                        </p>
                        <ArticleActions content={a.content} />
                      </div>
                      {isFeatured && (
                        <div className="hidden md:block w-1/4 aspect-square rounded-xl overflow-hidden border border-gray-100">
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">By {a.author}</span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">{a.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {others.map(a => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      <Newsletter />
    </div>
  );
};

const SportsPage = ({ news }: { news: NewsArticle[] }) => {
  // Separate static news from dynamic news for specific display
  const staticSports = news.filter(a => a.id.startsWith('sports-'));
  const dynamicSports = news.filter(a => !a.id.startsWith('sports-'));
  
  // Use the first dynamic article or first static for the hero
  const heroArticle = dynamicSports[0] || staticSports[0] || news[0];
  const otherNews = news.filter(a => a.id !== heroArticle?.id);

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
          {heroArticle && (
            <section className="relative h-[500px] rounded-3xl overflow-hidden group">
              <img src={heroArticle.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">{heroArticle.category}</span>
                <h1 className="text-4xl text-white mb-4 leading-tight font-bold group-hover:text-brand-orange transition-colors">{heroArticle.title}</h1>
                <p className="text-white/70 text-sm mb-6 max-w-xl line-clamp-2">{heroArticle.content}</p>
                <ArticleActions content={heroArticle.content} />
                <div className="flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {heroArticle.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {heroArticle.author}</span>
                </div>
              </div>
            </section>
          )}
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

      {/* Permanent Sports Updates Section */}
      {staticSports.length > 0 && (
        <section className="relative py-12 border-y border-gray-100">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
            <div className="space-y-2">
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] block">Exclusive</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter text-brand-dark">
                Sports Archives
              </h2>
            </div>
            <p className="text-gray-400 text-xs max-w-xs font-medium italic">
              "Permanent records of historic sporting moments and ongoing updates."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-3xl overflow-hidden">
            {staticSports.map((a, idx) => {
              // Dynamic featured logic: 1st, 4th, 5th, 8th, 9th...
              const isFeatured = idx % 4 === 0 || idx % 4 === 3;
              return (
                <div 
                  key={a.id} 
                  className={cn(
                    "bg-white p-6 transition-all duration-500 flex flex-col justify-between min-h-[350px] relative group/item",
                    isFeatured && "md:col-span-2 lg:col-span-2"
                  )}
                >
                  {isFeatured && (
                    <div className="absolute inset-0 opacity-[0.03] group-hover/item:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <img src={a.imageUrl} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
                        {idx < 9 ? `0${idx + 1}` : idx + 1} / {a.category}
                      </span>
                      <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-bold leading-tight mb-4 tracking-tight group-hover/item:text-brand-orange transition-colors duration-300",
                          isFeatured ? "text-2xl lg:text-3xl" : "text-xl"
                        )}>
                          {a.title}
                        </h3>
                        <p className={cn(
                          "text-gray-500 leading-relaxed font-medium",
                          isFeatured ? "text-sm line-clamp-6" : "text-xs line-clamp-4"
                        )}>
                          {a.content}
                        </p>
                        <ArticleActions content={a.content} />
                      </div>
                      {isFeatured && (
                        <div className="hidden md:block w-1/4 aspect-square rounded-xl overflow-hidden border border-gray-100">
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">By {a.author}</span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">{a.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {otherNews.filter(a => !a.id.startsWith('sports-')).map(a => (
          <div key={a.id} className="group">
            <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
              <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase">{a.category}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.content}</p>
            <ArticleActions content={a.content} />
          </div>
        ))}
      </div>
      <Newsletter />
    </div>
  );
};

const LifestylePage = ({ news }: { news: NewsArticle[] }) => {
  // Separate static news from dynamic news
  const staticLifestyle = news.filter(a => a.id.startsWith('life-'));
  const dynamicLifestyle = news.filter(a => !a.id.startsWith('life-'));
  
  const heroArticle = dynamicLifestyle[0] || staticLifestyle[0] || news[0];
  const otherNews = news.filter(a => a.id !== heroArticle?.id);

  return (
    <div className="space-y-12">
      {heroArticle && (
        <section className="relative h-[500px] rounded-3xl overflow-hidden group">
          <img src={heroArticle.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-12 w-full">
            <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">{heroArticle.category}</span>
            <h1 className="text-5xl text-white mb-4 leading-tight max-w-2xl font-bold group-hover:text-brand-orange transition-colors">{heroArticle.title}</h1>
            <p className="text-white/80 text-lg max-w-xl line-clamp-2">{heroArticle.content}</p>
            <ArticleActions content={heroArticle.content} />
          </div>
        </section>
      )}

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

      {/* Permanent Lifestyle Updates Section */}
      {staticLifestyle.length > 0 && (
        <section className="relative py-12 border-y border-gray-100">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
            <div className="space-y-2">
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] block">Exclusive</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter text-brand-dark">
                Lifestyle Chronicles
              </h2>
            </div>
            <p className="text-gray-400 text-xs max-w-xs font-medium italic">
              "Timeless stories of culture, wellness, and the art of living."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-3xl overflow-hidden">
            {staticLifestyle.map((a, idx) => {
              // Dynamic featured logic: 1st, 4th, 5th, 8th, 9th...
              const isFeatured = idx % 4 === 0 || idx % 4 === 3;
              return (
                <div 
                  key={a.id} 
                  className={cn(
                    "bg-white p-6 transition-all duration-500 flex flex-col justify-between min-h-[350px] relative group/item",
                    isFeatured && "md:col-span-2 lg:col-span-2"
                  )}
                >
                  {isFeatured && (
                    <div className="absolute inset-0 opacity-[0.03] group-hover/item:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <img src={a.imageUrl} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
                        {idx < 9 ? `0${idx + 1}` : idx + 1} / {a.category}
                      </span>
                      <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-bold leading-tight mb-4 tracking-tight group-hover/item:text-brand-orange transition-colors duration-300",
                          isFeatured ? "text-2xl lg:text-3xl" : "text-xl"
                        )}>
                          {a.title}
                        </h3>
                        <p className={cn(
                          "text-gray-500 leading-relaxed font-medium",
                          isFeatured ? "text-sm line-clamp-6" : "text-xs line-clamp-4"
                        )}>
                          {a.content}
                        </p>
                        <ArticleActions content={a.content} />
                      </div>
                      {isFeatured && (
                        <div className="hidden md:block w-1/4 aspect-square rounded-xl overflow-hidden border border-gray-100">
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">By {a.author}</span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">{a.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="space-y-16">
        <section>
          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-10">
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Latest Lifestyle News</h2>
            <button className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">View All Stories</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {otherNews.filter(a => !a.id.startsWith('life-')).slice(0, 8).map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-gray-100 pt-16">
          <div className="lg:col-span-8">
            <div className="bg-brand-orange rounded-3xl p-10 text-white h-full flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <Bell className="w-10 h-10 mb-6" />
                <h3 className="text-3xl font-bold mb-4">The Lifestyle Digest</h3>
                <p className="text-white/80 text-lg mb-10 max-w-xl">The best of travel, food, and wellness delivered to your inbox every Saturday morning. Join 50,000+ subscribers.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input type="email" placeholder="Your email address" className="flex-1 bg-white/20 border border-white/30 rounded-xl px-6 py-4 text-sm placeholder:text-white/50 focus:outline-none focus:bg-white/30 transition-all" />
                  <button className="bg-white text-brand-orange px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">Subscribe</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
            </div>
          </div>
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-8 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> The Lifestyle Edit
            </h3>
            <div className="space-y-8">
              {otherNews.slice(0, 4).map((a, i) => (
                <div key={a.id} className="flex gap-6 group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                    <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-bold leading-tight mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">{a.title}</h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{a.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

const Chatbot = ({ news }: { news: NewsArticle[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI News Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.chatWithNews(userMsg, news);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            <div className="bg-brand-dark p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-brand-orange p-1.5 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">News Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex",
                  m.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    m.role === 'user' 
                      ? "bg-brand-orange text-white rounded-tr-none" 
                      : "bg-white text-brand-dark border border-gray-100 rounded-tl-none shadow-sm"
                  )}>
                    <Markdown>{m.text}</Markdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about the news..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-orange"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-brand-orange text-white p-2 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-dark text-white p-4 rounded-full shadow-xl hover:bg-brand-orange transition-all group relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with AI Assistant
          </span>
        )}
      </button>
    </div>
  );
};

const Newsletter = () => (
  <section className="py-20 bg-brand-orange text-white rounded-3xl my-20 px-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
    <div className="relative z-10 max-w-xl">
      <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Stay Ahead of the Curve</h2>
      <p className="text-white/80 font-medium">Get the most important AI and global news delivered to your inbox every morning. No fluff, just facts.</p>
    </div>
    <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4">
      <input type="email" placeholder="your@email.com" className="bg-white/10 border border-white/20 px-6 py-4 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all min-w-[300px]" />
      <button className="bg-white text-brand-orange font-black uppercase px-8 py-4 rounded-xl hover:bg-brand-dark hover:text-white transition-all">Subscribe</button>
    </div>
  </section>
);

const PoliticalMap = () => (
  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-xs font-black uppercase tracking-widest text-brand-orange">Global Influence</h4>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-brand-orange rounded-full"></div>
        <div className="w-1 h-1 bg-brand-orange/30 rounded-full"></div>
        <div className="w-1 h-1 bg-brand-orange/30 rounded-full"></div>
      </div>
    </div>
    <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden group">
      <img src="https://picsum.photos/seed/map/400/225?grayscale" alt="Map" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">Interactive Map Coming Soon</span>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400">
        <span>Active Conflicts</span>
        <span className="text-red-500">12 High Alert</span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="w-2/3 h-full bg-red-500"></div>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-brand-dark text-white pt-20 pb-10 mt-20">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [activePage, setActivePage] = useState('Home');
  const [news, setNews] = useState<NewsArticle[]>(geminiService.getStoredNews('General'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState('Global');

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    setNews([]);
    setActivePage('Home');
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await geminiService.searchRealTimeNews(query);
      if (results.length > 0) {
        setNews(results);
        setActivePage(`Search: ${query}`);
      } else {
        setError(`No real-time news found for "${query}"`);
      }
    } catch (err) {
      console.error("Search failed", err);
      setError("Failed to search real-time news.");
    } finally {
      setLoading(false);
    }
  };

  const loadNews = async (force: boolean = false) => {
    const category = (activePage === 'Home' || activePage === 'General News') ? 'General' : activePage;
    const prompt = region === 'Global' ? category : `${category} news focusing on ${region}`;
    
    // Check cache first if not forcing a refresh
    if (!force) {
      const cached = geminiService.getCachedNews(prompt);
      if (cached) {
        setNews(cached);
        setLoading(false);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const data = await geminiService.generateNews(prompt);
      setNews(data);
    } catch (err: any) {
      console.error("Failed to load news", err);
      if (err?.message?.includes("429") || err?.status === 429) {
        setError("API Quota Exhausted. Please try again in a few minutes.");
      } else {
        setError("Failed to load news. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On page or region change, try to load from cache
    // But don't trigger a network request automatically
    if (!isLoggedIn) return;
    if (activePage.startsWith('Search:')) return;

    const category = (activePage === 'Home' || activePage === 'General News') ? 'General' : activePage;
    const prompt = region === 'Global' ? category : `${category} news focusing on ${region}`;
    const cached = geminiService.getCachedNews(prompt);
    
    if (cached) {
      setNews(cached);
      setLoading(false);
      setError(null);
    } else {
      // If no cache, load the default stored news for the category
      const stored = geminiService.getStoredNews(category);
      setNews(stored);
      setLoading(false);
      setError(null);
    }
  }, [activePage, region]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          <Navbar activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} user={user} onSignOut={handleSignOut} />
          <UpdateBar onRefresh={() => loadNews(true)} loading={loading} region={region} setRegion={setRegion} />
          <BreakingNews />
          
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {loading && news.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <RefreshCw className="w-16 h-16 animate-spin mb-6 text-brand-orange" />
                <h2 className="text-xl font-bold uppercase tracking-[0.2em]">AI is gathering the latest news...</h2>
              </div>
            ) : error ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-16 h-16 text-brand-orange mb-6" />
                <h2 className="text-2xl font-bold text-brand-dark mb-4 uppercase tracking-tighter">{error}</h2>
                <p className="text-gray-500 mb-8 max-w-md">We're experiencing high demand. Our AI journalists are taking a short break. Please try again shortly.</p>
                <button 
                  onClick={() => loadNews(true)}
                  className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  RETRY NOW
                </button>
              </div>
            ) : news.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <BookOpen className="w-16 h-16 text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-brand-dark mb-4 uppercase tracking-tighter">No Stored News for {activePage}</h2>
                <p className="text-gray-500 mb-8 max-w-md">You haven't updated the news for this category yet. Click the button below to fetch the latest AI-generated stories.</p>
                <button 
                  onClick={() => loadNews(true)}
                  className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  FETCH LATEST NEWS
                </button>
              </div>
            ) : (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activePage === 'Home' && <HomePage news={news} />}
                {activePage === 'General News' && <HomePage news={news} />}
                {activePage === 'Politics' && <PoliticsPage news={news} />}
                {activePage === 'Sports' && <SportsPage news={news} />}
                {activePage === 'Lifestyle' && <LifestylePage news={news} />}
              </motion.div>
            )}
          </main>

          <Footer />
          <Chatbot news={news} />
          <VoiceAssistant />
        </>
      )}
    </div>
  );
}
