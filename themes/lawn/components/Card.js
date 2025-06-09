const Card = ({ children, headerSlot, className }) => {
  return (
    <div className={className}>
      <>{headerSlot}</>
      <section className="rounded-lg p-4 bg-white dark:bg-lawn-black-gray dark:text-gray-300 border dark:border-black">
        {children}
      </section>
    </div>
  );
};

export default Card;
