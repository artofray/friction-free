import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Upload, Music, DollarSign, Activity, 
  Hexagon, Wallet, Mic2, Heart, ThumbsDown, Share2, 
  Menu, X, Sparkles, Zap, Radio
} from 'lucide-react';
import { Button } from './components/Button';
import { StatsChart } from './components/StatsChart';
import { ViewState, Track, User, AiLyricsResponse } from './types';
import { generateCreativeMetadata, analyzeDistributionTrend } from './services/geminiService';

// --- MOCK DATA ---
const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'CyberPunk Collective',
    coverUrl: 'https://picsum.photos/400/400?random=1',
    duration: '3:45',
    plays: 125430,
    likes: 8420,
    dislikes: 120,
    isDemonetized: false,
    royaltyRate: 0.08,
    nearTokenId: 'near.cyber.123'
  },
  {
    id: '2',
    title: 'Void Runner',
    artist: 'Null Pointer',
    coverUrl: 'https://picsum.photos/400/400?random=2',
    duration: '2:30',
    plays: 89000,
    likes: 4100,
    dislikes: 200,
    isDemonetized: false,
    royaltyRate: 0.08,
    nearTokenId: 'near.null.456'
  },
  {
    id: '3',
    title: 'Controversial Beats',
    artist: 'Edgy Boi',
    coverUrl: 'https://picsum.photos/400/400?random=3',
    duration: '4:12',
    plays: 5430,
    likes: 100,
    dislikes: 400, // High dislikes
    isDemonetized: true, // Mocked logic
    royaltyRate: 0.00,
    nearTokenId: 'near.edgy.789'
  }
];

const MOCK_USER: User = {
  id: 'user_01',
  username: 'SoundArchitect',
  walletAddress: null,
  balance: 0,
  isArtist: true
};

// --- COMPONENTS WITHIN APP ---

// 1. NAVIGATION
const Navigation: React.FC<{ 
  currentView: ViewState; 
  setView: (v: ViewState) => void; 
  walletAddress: string | null;
  connectWallet: () => void;
}> = ({ currentView, setView, walletAddress, connectWallet }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ view, icon, label }: { view: ViewState; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => { setView(view); setMobileMenuOpen(false); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        currentView === view 
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
          : 'text-zinc-400 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
            <Hexagon className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
            <span className="font-bold text-xl tracking-tight">Sonic<span className="text-cyan-400">Node</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavItem view={ViewState.STREAMING} icon={<Radio size={18} />} label="Stream" />
            <NavItem view={ViewState.STUDIO} icon={<Mic2 size={18} />} label="Studio" />
            <NavItem view={ViewState.DASHBOARD} icon={<Activity size={18} />} label="Dashboard" />
            
            <Button 
              variant={walletAddress ? "secondary" : "neon"} 
              size="sm"
              onClick={connectWallet}
              icon={<Wallet size={16} />}
            >
              {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : "Connect NEAR"}
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-4">
          <NavItem view={ViewState.STREAMING} icon={<Radio size={18} />} label="Stream" />
          <NavItem view={ViewState.STUDIO} icon={<Mic2 size={18} />} label="Studio" />
          <NavItem view={ViewState.DASHBOARD} icon={<Activity size={18} />} label="Dashboard" />
        </div>
      )}
    </nav>
  );
};

// 2. STUDIO (Creator Tool)
const Studio: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<AiLyricsResponse | null>(null);
  const [title, setTitle] = useState('');
  const [vibe, setVibe] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAnalysis = async () => {
    if (!title || !vibe) return;
    setAnalyzing(true);
    const result = await generateCreativeMetadata(title, vibe);
    setMetadata(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Zap className="text-yellow-400" /> Music Machine Node
        </h2>
        <p className="text-zinc-400">Zero latency real-time creation. From idea to blockchain.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Upload size={20} className="text-cyan-400" /> Distribution
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Track Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none"
                placeholder="e.g. Midnight Run"
              />
            </div>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Vibe / Description</label>
              <textarea 
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none h-24 resize-none"
                placeholder="Dark cyberpunk synthwave with heavy bass..."
              />
            </div>

            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={(e) => setUploadedFile(e.target.files ? e.target.files[0] : null)}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Music className="w-10 h-10 text-zinc-500 mb-2" />
                <span className="text-sm font-medium">{uploadedFile ? uploadedFile.name : "Drop master file or click to browse"}</span>
                <span className="text-xs text-zinc-500 mt-1">WAV, FLAC, AIFF (Max 100MB)</span>
              </label>
            </div>

            <Button 
              variant="neon" 
              className="w-full" 
              onClick={handleAnalysis}
              disabled={analyzing || !title || !vibe}
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="animate-spin" size={16} /> Analysis in progress...
                </span>
              ) : "Analyze & Generate Metadata"}
            </Button>
          </div>
        </div>

        {/* AI Output Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 relative overflow-hidden">
          {!metadata ? (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
              <div className="text-center">
                <Sparkles size={48} className="mx-auto mb-2 opacity-20" />
                <p>AI Output will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white">Sonic Fingerprint</h3>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/20">Generated</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Suggested Genre</span>
                  <p className="text-lg text-cyan-50 font-medium">{metadata.suggestedGenre}</p>
                </div>
                
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Detected Mood</span>
                  <p className="text-white">{metadata.mood}</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Lyric Idea (Chorus)</span>
                  <p className="text-zinc-300 italic mt-1">"{metadata.lyrics}"</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button variant="primary" className="w-full">
                  Mint to NEAR Network & Distribute
                </Button>
                <p className="text-xs text-center text-zinc-500 mt-2">Creates unique identifier on chain. Zero friction.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. STREAMING (Spotify Alternative)
const Streaming: React.FC = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState(MOCK_TRACKS);

  const togglePlay = (id: string) => {
    if (currentTrackId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(id);
      setIsPlaying(true);
    }
  };

  const handleVote = (id: string, type: 'up' | 'down') => {
    setTracks(prev => prev.map(t => {
      if (t.id !== id) return t;
      // Simple mock logic for immediate UI update
      if (type === 'up') return { ...t, likes: t.likes + 1 };
      // If dislikes > likes * 2 (simple threshold), demonstrate demonetization
      const newDislikes = t.dislikes + 1;
      const isDemonetized = newDislikes > (t.likes + 10) * 3; // Hard threshold for demo
      return { ...t, dislikes: newDislikes, isDemonetized };
    }));
  };

  const activeTrack = tracks.find(t => t.id === currentTrackId);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-32">
       <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Decentralized Streams</h1>
        <p className="text-zinc-400">Listen, curate, and earn. Community governed.</p>
      </div>

      <div className="grid gap-4">
        {tracks.map(track => (
          <div 
            key={track.id} 
            className={`group flex items-center p-4 rounded-xl transition-all border ${
              track.isDemonetized 
                ? 'bg-red-900/10 border-red-500/20 opacity-75' 
                : currentTrackId === track.id 
                  ? 'bg-cyan-500/5 border-cyan-500/30' 
                  : 'glass-panel hover:bg-zinc-800/50 border-transparent'
            }`}
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => togglePlay(track.id)}
                className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity ${currentTrackId === track.id ? 'opacity-100' : ''}`}
              >
                {currentTrackId === track.id && isPlaying ? <Pause className="text-white" /> : <Play className="text-white" />}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-lg truncate ${currentTrackId === track.id ? 'text-cyan-400' : 'text-white'}`}>{track.title}</h3>
                {track.isDemonetized && (
                  <span className="px-2 py-0.5 bg-red-500 text-black text-[10px] font-bold uppercase rounded-sm">Demonetized</span>
                )}
              </div>
              <p className="text-zinc-400">{track.artist}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-zinc-400">
              <div className="hidden md:flex items-center space-x-1">
                <Play size={14} />
                <span>{track.plays.toLocaleString()}</span>
              </div>
              <div className="hidden md:block">{track.duration}</div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleVote(track.id, 'up')}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-green-400 transition-colors"
                >
                  <Heart size={18} fill={track.likes > 8000 ? "currentColor" : "none"} />
                </button>
                <span className="text-xs font-mono">{track.likes}</span>
                
                <button 
                  onClick={() => handleVote(track.id, 'down')}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <ThumbsDown size={18} />
                </button>
                <span className="text-xs font-mono">{track.dislikes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Player */}
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={activeTrack.coverUrl} alt="cover" className="w-12 h-12 rounded bg-zinc-800" />
              <div>
                <h4 className="text-white font-medium text-sm">{activeTrack.title}</h4>
                <p className="text-zinc-500 text-xs">{activeTrack.artist}</p>
              </div>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center space-x-6 mb-2">
                <button className="text-zinc-400 hover:text-white"><Radio size={16} /></button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                </button>
                <button className="text-zinc-400 hover:text-white"><Share2 size={16} /></button>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1">
                <div className="bg-cyan-500 h-1 rounded-full w-1/3 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-zinc-500">
               <span className="bg-zinc-800 px-2 py-1 rounded">NEAR UID: {activeTrack.nearTokenId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. DASHBOARD (Analytics)
const Dashboard: React.FC = () => {
  const [advice, setAdvice] = useState<string>("Analyzing trends...");

  useEffect(() => {
    // Simulate fetching advice based on user stats
    analyzeDistributionTrend("Plays: 125k, Likes: 8.4k, Royalty: 0.08").then(setAdvice);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-400 text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">$10,420.50</h3>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <DollarSign className="text-cyan-400" size={24} />
            </div>
          </div>
          <div className="text-xs text-zinc-500">
            Paid instantly via NEAR smart contract
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-400 text-sm">Total Streams</p>
              <h3 className="text-3xl font-bold text-white">219,860</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="text-xs text-zinc-500">
            +12% from last week
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500">
          <div className="flex justify-between items-start mb-4">
             <div>
              <p className="text-zinc-400 text-sm">Community Score</p>
              <h3 className="text-3xl font-bold text-white">98/100</h3>
            </div>
             <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Heart className="text-emerald-400" size={24} />
            </div>
          </div>
           <div className="text-xs text-zinc-500">
            Safe from demonetization
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <StatsChart />
        
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
            <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-4 font-bold">AI Strategic Advisor</h3>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-full">
                    <Sparkles className="text-indigo-400" />
                </div>
                <div>
                    <p className="text-lg leading-relaxed text-zinc-200">"{advice}"</p>
                    <p className="text-xs text-zinc-500 mt-2">Based on your current streaming velocity vs. royalty output.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// 5. LANDING PAGE
const Landing: React.FC<{ enterApp: () => void }> = ({ enterApp }) => (
  <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-cyan-100 to-zinc-400 bg-clip-text text-transparent">
      Friction Free.
    </h1>
    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
      The industry's highest royalties. Automated distribution. 
      <span className="text-cyan-400 block mt-2">Zero latency idea-to-fanbase.</span>
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <Button variant="neon" size="lg" onClick={enterApp} icon={<Play fill="currentColor" />}>
        Start Listening
      </Button>
      <Button variant="secondary" size="lg" onClick={enterApp} icon={<Upload />}>
        Distribute Music
      </Button>
    </div>

    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-zinc-500 text-sm font-medium tracking-widest uppercase">
      <div>NEAR Network</div>
      <div>AI Powered</div>
      <div>DAO Governed</div>
      <div>Instant Payouts</div>
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User>(MOCK_USER);

  const handleConnectWallet = () => {
    // Simulating wallet connection
    setUser(prev => ({ ...prev, walletAddress: '0x71C...9A23' }));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navigation 
        currentView={view} 
        setView={setView} 
        walletAddress={user.walletAddress}
        connectWallet={handleConnectWallet}
      />
      
      <main className="pt-24 pb-12">
        {view === ViewState.LANDING && <Landing enterApp={() => setView(ViewState.STREAMING)} />}
        {view === ViewState.STREAMING && <Streaming />}
        {view === ViewState.STUDIO && <Studio />}
        {view === ViewState.DASHBOARD && <Dashboard />}
      </main>
    </div>
  );
};

export default App;