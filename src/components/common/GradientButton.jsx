import Link from "next/link";

const GradientButton = ({ text, link }) => {
  return (
    <Link
      href={link}
      className="relative inline-block rounded-lg bg-gradient-to-r from-purple-500 to-orange-500 p-0.5 transition-all duration-300 hover:shadow-[0_0_15px_-3px_rgba(109,40,217,0.5)] before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-transparent before:bg-gradient-to-r before:from-purple-500 before:to-orange-500 before:animate-borderGlow before:opacity-0 hover:before:opacity-100"
    >
      <span className="relative z-10 block rounded-[calc(0.5rem-2px)] bg-black px-6 py-3 font-semibold text-white">
        {text}
      </span>
    </Link>
  );
};

export default GradientButton;
