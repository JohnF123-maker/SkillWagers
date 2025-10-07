import { useState } from 'react';

const items = [
  { id: 1, title: 'Create a Challenge', frontIcon: '🎯', desc: 'Set the game, rules, and stake. Your challenge appears to eligible opponents.' },
  { id: 2, title: 'Find an Opponent',   frontIcon: '🤝', desc: 'Match with a player at your skill level, agree to terms, and lock in.' },
  { id: 3, title: 'Submit Proof',       frontIcon: '📤', desc: 'Upload match evidence or connect supported game data once available.' },
  { id: 4, title: 'Automatic Settlement', frontIcon: '⚡', desc: 'Escrow resolves to the verified winner. Disputes follow clear steps.' },
];

function HowItWorksCard({ item, index }) {
  const [flipped, setFlipped] = useState(false);

  // Hover for desktop; click/tap toggles for mobile & accessibility
  const toggle = () => setFlipped(v => !v);

  // Optional accent ring colors
  const ringColors = {
    0: 'ring-blue-500/40',
    1: 'ring-brand/40', 
    2: 'ring-pink-500/40',
    3: 'ring-red-500/40'
  };

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      aria-pressed={flipped}
      className={`preserve-3d relative w-full aspect-square rounded-2xl bg-neutral-900 text-white ring-1 ring-white/10 ${ringColors[index]} overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all duration-300`}
    >
      <div className={`absolute inset-0 grid place-items-center transition-transform duration-300 backface-hidden ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{item.frontIcon}</span>
          <span className="text-lg font-semibold">{item.title}</span>
        </div>
      </div>

      <div className={`absolute inset-0 grid place-items-center px-4 text-center transition-transform duration-300 rotate-y-180 backface-hidden ${flipped ? '' : '-rotate-y-180'}`}>
        <p className="text-sm text-neutral-200">{item.desc}</p>
      </div>
    </button>
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