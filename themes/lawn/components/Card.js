const Card = ({ children, headerSlot, className }) => {
  return (
    <div className={className}>
      <>{headerSlot}</>
      <section className="card shadow-md dark:text-gray-300 border dark:border-black rounded-xl p-4 bg-white dark:bg-lawn-black-gray">
        {children}
      </section>
    </div>
  );
};

export default Card;
