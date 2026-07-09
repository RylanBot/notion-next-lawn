const ColorDots = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-teal-400/10" />
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-blue-400/10" />
      <div className="absolute top-24 -right-8 w-20 h-20 rounded-full bg-purple-400/10" />
      <div className="absolute bottom-32 left-10 w-6 h-6 rounded-full bg-green-400/10" />
      <div className="absolute bottom-10 left-4 w-10 h-10 rounded-full bg-pink-400/10" />
      <div className="absolute bottom-0 right-6 w-12 h-12 rounded-full bg-orange-400/10" />
    </div>
  );
};

export default ColorDots;
