import React from 'react';

const Topbar = ({ name = "User" }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md px-8 py-5 border-b border-slate-100 sticky top-0 z-10 flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        Good morning, {name}! <span className="animate-bounce">👋</span>
      </h1>
      <p className="text-sm text-slate-500 font-medium">Let's continue your learning journey today.</p>
    </header>
  );
};

export default Topbar;