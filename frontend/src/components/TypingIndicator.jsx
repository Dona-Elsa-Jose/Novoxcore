import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm w-fit shadow-md backdrop-blur-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-secondary/80 animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-1.5 h-1.5 rounded-full bg-secondary/80 animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-1.5 h-1.5 rounded-full bg-secondary/80 animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default TypingIndicator;
