import { useState } from 'react';

const items = [
  { id: 1, title: 'Create a Challenge', frontIcon: '🎯', desc: 'Set the game, rules, and stake. Your challenge appears to eligible opponents.' },
  { id: 2, title: 'Find an Opponent',   frontIcon: '🤝', desc: 'Match with a player at your skill level, agree to terms, and lock in.' },
  { id: 3, title: 'Submit Proof',       frontIcon: '📤', desc: 'Upload match evidence or connect supported game data once available.' },
  { id: 4, title: 'Automatic Settlement', frontIcon: '⚡', desc: 'Escrow resolves to the verified winner. Disputes follow clear steps.' },
];

function HowItWorksCard({ item, index }) {
  const [flipped, setFlipped] = useState(false);

  // Toggle for mobile tap and keyboard
  const toggle = () => setFlipped(v => !v);

  // Optional accent ring colors
  const ringColors = {
    0: 'ring-blue-500/40',
    1: 'ring-brand/40', 
    2: 'ring-pink-500/40',
    3: 'ring-red-500/40'
  };

  return (
    <div 
      className={`card w-full aspect-square ${flipped ? 'flipped' : ''}`}
      style={{ perspective: '1000px' }}
    >
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        aria-expanded={flipped}
        className={`card-inner relative w-full h-full rounded-2xl bg-neutral-900 text-white ring-1 ring-white/10 ${ringColors[index]} focus:outline-none focus:ring-2 focus:ring-brand/50`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front face */}
        <div 
          className="card-face card-front absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <span className="text-4xl">{item.frontIcon}</span>
          <span className="text-lg font-semibold">{item.title}</span>
        </div>

        {/* Back face */}
        <div 
          className="card-face card-back absolute inset-0 flex items-center justify-center px-4 text-center rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-sm text-neutral-200">{item.desc}</p>
        </div>
      </button>
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