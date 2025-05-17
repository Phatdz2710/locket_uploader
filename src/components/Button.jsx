const Button = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-700 border border-white/10 text-white text-sm font-semibold backdrop-blur-md transition-all duration-200"
    >
      {title}
    </button>
  );
};

export default Button;
