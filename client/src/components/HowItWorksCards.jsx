import { useState } from 'react';

const items = [
  { id: 1, title: 'Create a Challenge', frontIcon: '🎯', desc: 'Set the game, rules, and stake. Your challenge appears to eligible opponents.' },
  { id: 2, title: 'Find an Opponent',   frontIcon: '🤝', desc: 'Match with a player at your skill level, agree to terms, and lock in.' },
  { id: 3, title: 'Submit Proof',       frontIcon: '📤', desc: 'Upload match evidence or connect supported game data once available.' },
  { id: 4, title: 'Automatic Settlement', frontIcon: '⚡', desc: 'Escrow resolves to the verified winner. Disputes follow clear steps.' },
];

function HowItWorksCard({ item, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Toggle for mobile tap
  const toggleFlip = () => setIsFlipped(prev => !prev);

  // Handle keyboard events for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  // Optional accent ring colors
  const ringColors = {
    0: 'ring-blue-500/40',
    1: 'ring-brand/40', 
    2: 'ring-pink-500/40',
    3: 'ring-red-500/40'
  };

  return (
    <div 
      className="how-card w-full aspect-square cursor-pointer"
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`How it works card: ${item.title}`}
    >
      <div 
        className={`how-card-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}
      >
        {/* Front face */}
        <div 
          className={`how-card-face how-card-front absolute w-full h-full rounded-2xl bg-gray-800 text-white ring-1 ring-white/10 ${ringColors[index]} flex flex-col items-center justify-center gap-2`}
        >
          <span className="text-4xl">{item.frontIcon}</span>
          <span className="text-lg font-semibold text-center px-2">{item.title}</span>
        </div>

        {/* Back face */}
        <div 
          className={`how-card-face how-card-back absolute w-full h-full rounded-2xl bg-gray-800 text-white flex flex-col items-center justify-center px-4 text-center ring-1 ring-white/10 ${ringColors[index]}`}
        >
          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksCards() {
  return (
    <section aria-labelledby="how-it-works" className="mx-auto max-w-6xl px-4">
      <h2 id="how-it-works" className="mb-6 text-2xl font-bold text-brand">How it works</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, index) => (
          <HowItWorksCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}