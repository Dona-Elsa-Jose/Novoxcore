import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Send, X, RefreshCw, ChevronDown } from 'lucide-react';
import novoxChatLogo from '../../logo core (1).png';

const NovoxLogo = React.memo(({ className = "w-6 h-6" }) => (
  <img src={novoxChatLogo} alt="Novox Core" className={`${className} object-contain`} />
));

const TypingIndicator = React.memo(() => (
  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm w-fit shadow-md backdrop-blur-md">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-violet-400"
        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
  </div>
));

const FollowUpSuggestions = React.memo(({ lastUserMsg, onSend }) => {
  const suggestions = useMemo(() => {
    if (!lastUserMsg) return [];
    const text = lastUserMsg.toLowerCase();
    if (text.includes('service') || text.includes('offer')) return ['Contact', 'Location', 'Pricing', 'About Us'];
    if (text.includes('contact') || text.includes('reach')) return ['Location', 'Services', 'Book Consultation'];
    if (text.includes('about') || text.includes('company')) return ['Services', 'Contact'];
    return ['Services', 'Contact', 'About Us'];
  }, [lastUserMsg]);

  if (!suggestions.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="flex flex-wrap gap-2 mt-2 ml-10"
    >
      {suggestions.map((s, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSend(s)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 border border-white/10 rounded-full hover:border-violet-500/50 shadow-sm transition-colors"
        >
          {s}
        </motion.button>
      ))}
    </motion.div>
  );
});

const MessageBubble = React.memo(({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex max-w-[85%] gap-3 ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser ? 'bg-gradient-to-br from-violet-600 to-purple-500 text-white' : 'bg-white/5 border border-white/10 backdrop-blur-md'
      }`}>
        {isUser ? <div className="text-xs">👤</div> : <NovoxLogo className="w-4 h-4" />}
      </div>
      <div className={`px-3 py-2.5 text-[14px] leading-relaxed shadow-lg whitespace-pre-wrap ${
        isUser 
          ? 'bg-gradient-to-br from-violet-600 to-purple-500 text-white rounded-2xl rounded-tr-sm' 
          : 'bg-white/5 border border-white/10 backdrop-blur-xl text-white rounded-2xl rounded-tl-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
      }`}>
        {msg.text}
      </div>
    </motion.div>
  );
});

const QuickActionCard = React.memo(({ icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)' }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(title)}
    className="flex flex-col items-start p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left w-full h-full"
  >
    <div className="text-xl mb-2">{icon}</div>
    <h4 className="text-[13px] font-semibold text-white mb-1">{title}</h4>
    <p className="text-[11px] text-gray-400 line-clamp-2 leading-snug">{description}</p>
  </motion.button>
));

const EmptyState = React.memo(({ onSend }) => {
  const [showSecond, setShowSecond] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const title = "Hi 👋 I'm Novox AI";

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 800);
    const t2 = setTimeout(() => setShowCards(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const actions = [
    { label: 'Services', text: 'What services do you provide?' },
    { label: 'Pricing', text: 'What is your pricing?' },
    { label: 'Projects', text: 'Show me your projects.' },
    { label: 'Contact', text: 'How can I contact you?' }
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
  };

  const charVariants = {
    hidden: { opacity: 0, display: 'none' },
    visible: { opacity: 1, display: 'inline' }
  };

  return (
    <div className="flex flex-col items-start w-full gap-1 px-1 pb-2">
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="text-[20px] font-semibold text-white tracking-tight leading-tight mt-2 min-h-[28px]"
      >
        {title.split('').map((char, index) => (
          <motion.span key={index} variants={charVariants}>{char}</motion.span>
        ))}
      </motion.div>

      <div className="min-h-[24px] mb-4">
        <AnimatePresence>
          {showSecond && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-[15px] text-gray-300 font-medium"
            >
              How can I help?
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCards && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-2.5 w-full"
          >
            {actions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSend(action.text)}
                className="flex items-center justify-center p-3 text-[13px] font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors shadow-sm"
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function NovoxChat({ messages, isLoading, onSend, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Onboarding States: 'animating' -> 'done'
  // Always initialize to 'animating' so the intro animation plays on every page load
  const [onboardingStage, setOnboardingStage] = useState('animating');
  const [showTeaser, setShowTeaser] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  
  const logoControls = useAnimation();
  const bgControls = useAnimation();
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current && window.innerWidth > 768) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Premium SaaS Onboarding Animation Logic
  useEffect(() => {
    if (onboardingStage === 'animating') {
      const runAnimation = async () => {
        console.log("Center logo visible");
        
        bgControls.set({ opacity: 0 });
        bgControls.start({ opacity: 1, transition: { duration: 0.8 } });
        
        logoControls.set({ opacity: 0, scale: 0.8, x: 0, y: 0, rotate: 0 });
        
        await logoControls.start({
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: "easeOut" }
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Launching logo");
        setIsFlying(true);
        
        bgControls.start({ opacity: 0, transition: { duration: 1.2 } });
        
        const targetX = (document.documentElement.clientWidth / 2) - 56;
        const targetY = (document.documentElement.clientHeight / 2) - 56;
        
        await logoControls.start({
          x: targetX,
          y: targetY,
          scale: 0.18,
          transition: { type: "spring", stiffness: 120, damping: 18 }
        });
        
        setIsFlying(false);
        console.log("Logo landed");
        
        setOnboardingStage('done');
        setShowFlash(true);
        
        console.log("Launcher active");
        
        setTimeout(() => {
          setShowTeaser(true);
          console.log("Tooltip shown");
          
          setTimeout(() => {
            setShowTeaser(false);
          }, 6000);
        }, 400);
      };
      
      runAnimation();
    }
  }, [logoControls, bgControls, onboardingStage]);

  const handleSubmit = useCallback((e, predefinedText = null) => {
    if (e) e.preventDefault();
    const text = predefinedText || input;
    if (!text.trim() || isLoading) return;
    onSend(text);
    setInput('');
  }, [input, isLoading, onSend]);

  const lastUserMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].text;
    }
    return null;
  }, [messages]);

  const windowVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1, when: "beforeChildren" }
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 p-0 md:p-6 flex flex-col items-end pointer-events-none w-full md:w-auto h-[100dvh] md:h-auto justify-end">
      
      {/* Premium Onboarding Animation Container */}
      {onboardingStage === 'animating' && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div 
            animate={bgControls}
            className="absolute inset-0 bg-[#0B0914]/80 backdrop-blur-sm"
          />
          <motion.div
            animate={logoControls}
            initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
            className="relative flex items-center justify-center pointer-events-auto z-10"
          >
            {/* Particle Trail while flying */}
            {isFlying && Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: Math.random() * 0.5 + 0.5 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  x: -(Math.random() * 100 + 30),
                  y: -(Math.random() * 100 + 30)
                }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                className="absolute left-1/4 top-1/2 w-2 h-2 bg-violet-300 rounded-full blur-[1px] pointer-events-none"
              />
            ))}

            {/* Soft Purple Glow */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[200px] h-[100px] bg-violet-500 blur-[60px] pointer-events-none rounded-full" 
            />
            
            <img src="/logo-core.png" alt="Novox Core" className="w-[320px] md:w-[420px] h-auto relative z-10 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)] pointer-events-none object-contain" />
          </motion.div>
        </div>
      )}

      {/* Floating Teaser Bubble */}
      <AnimatePresence>
        {!isOpen && showTeaser && onboardingStage === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="mb-6 mr-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_50px_rgba(139,92,246,0.2)] text-white w-[200px] pointer-events-auto origin-bottom-right relative z-[90]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <NovoxLogo className="w-5 h-5" />
              <h4 className="font-semibold text-sm tracking-tight">Need help?</h4>
            </div>
            <p className="text-[12px] text-gray-300 font-medium">Ask Novox AI anything.</p>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/10 border-r border-b border-white/20 rotate-45 backdrop-blur-xl pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Interface */}
        <AnimatePresence>
          {isOpen && onboardingStage === 'done' && (
            <motion.div
              layout
              variants={windowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`pointer-events-auto w-full md:w-[320px] lg:w-[340px] ${messages.length === 0 ? 'h-auto min-h-[260px]' : 'h-[100dvh] md:h-[560px]'} md:max-h-[600px] max-h-[100dvh] md:mb-4 bg-[#0B0914]/95 backdrop-blur-3xl md:rounded-3xl border-t md:border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_30px_rgba(139,92,246,0.12)] flex flex-col overflow-hidden origin-bottom-right fixed md:relative top-0 left-0 md:top-auto md:left-auto z-[95]`}
            >
              <motion.header 
                variants={childVariants}
                className="px-3 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                    <NovoxLogo className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-[14px] leading-tight">Novox AI</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-green-500 text-[9px]">●</span>
                      <span className="text-[10px] font-medium text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={onReset}
                    aria-label="Reset chat"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </motion.header>

              <motion.div 
                variants={childVariants}
                className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                {messages.length === 0 ? (
                  <EmptyState onSend={(text) => handleSubmit(null, text)} />
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col">
                      <MessageBubble msg={msg} />
                      {msg.role === 'bot' && idx === messages.length - 1 && !isLoading && (
                        <FollowUpSuggestions lastUserMsg={lastUserMsg} onSend={(text) => handleSubmit(null, text)} />
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <NovoxLogo className="w-4 h-4" />
                    </div>
                    <TypingIndicator />
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-px shrink-0" />
              </motion.div>

              <motion.div 
                variants={childVariants}
                className="p-3 bg-white/[0.02] backdrop-blur-xl border-t border-white/5 shrink-0"
              >
                <form onSubmit={handleSubmit} className="relative flex items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-[14px] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-inner"
                    disabled={isLoading}
                    aria-label="Chat input"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all"
                  >
                    <Send className="w-3.5 h-3.5 -ml-0.5" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {onboardingStage === 'done' && (
        <motion.button
          layout
          initial={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          animate={isOpen ? { scale: 1, opacity: 1 } : { 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 10px 30px rgba(139,92,246,0.2)",
              "0 10px 50px rgba(139,92,246,0.4)",
              "0 10px 30px rgba(139,92,246,0.2)"
            ],
            opacity: 1
          }}
          transition={isOpen ? { type: "spring", stiffness: 400, damping: 12 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => !isOpen && setShowTeaser(true)}
          onMouseLeave={() => !isOpen && setShowTeaser(false)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className={`relative pointer-events-auto fixed md:absolute bottom-6 right-6 md:bottom-0 md:right-0 z-[100] focus:outline-none focus:ring-4 focus:ring-violet-500/50 transition-colors duration-300
            ${isOpen 
              ? 'w-14 h-14 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hidden md:flex items-center justify-center' 
              : 'w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center'
            }`}
        >
          {/* Radial purple flash when lands */}
          {showFlash && !isOpen && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              onAnimationComplete={() => setShowFlash(false)}
              className="absolute inset-0 bg-violet-400 rounded-full z-0 pointer-events-none"
            />
          )}

          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-violet-600/40 blur-xl animate-pulse" />
          )}

          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? <X className="w-6 h-6 text-white" /> : <NovoxLogo className="w-8 h-8 drop-shadow-lg shrink-0" />}
          </div>
        </motion.button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
}
