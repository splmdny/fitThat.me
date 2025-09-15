import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-700 text-center p-4 text-zinc-500 text-sm">
      <p>
        Created with Google AI © 2025 | Developed by{' '}
        <a 
          href="https://github.com/splmdny" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-amber-500 hover:text-amber-400 transition-colors"
        >
          splmdny
        </a>
      </p>
    </footer>
  );
};
