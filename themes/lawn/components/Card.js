const Card = ({ children, className }) => {
  return (
    <div
      className={`rounded-md p-4 bg-white dark:bg-lawn-black-gray dark:text-gray-300 shadow-sm overflow-hidden ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
