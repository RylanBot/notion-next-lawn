const PAPER_DOTS = [
  { className: 'top-5 right-8 h-3.5 w-3.5 bg-emerald-300' },
  { className: 'top-16 right-5 h-2.5 w-2.5 bg-lime-400' },
  { className: 'top-10 right-20 h-2 w-2 bg-teal-300' },
  { className: 'bottom-24 right-10 h-3 w-3 bg-teal-700' },
  { className: 'bottom-16 left-24 h-2 w-2 bg-teal-400' },
  { className: 'top-28 left-6 h-2.5 w-2.5 bg-green-400' }
];

const ColorDots = () => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {PAPER_DOTS.map((dot) => (
        <div key={dot.className} className={`lawn-card-dot absolute rounded-full ${dot.className}`} />
      ))}
    </div>
  );
};

export default ColorDots;
