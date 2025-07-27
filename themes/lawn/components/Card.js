const Card = ({ children, className }) => {
  return (
    <div
      className={`rounded-md p-4 bg-white dark:bg-lawn-black-gray dark:text-gray-300 border dark:border-zinc-500 ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
