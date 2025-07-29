interface ButtonProps {
  text: string | React.ReactElement;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  className?: string;
  handleClick?: any;
}

function Button({
  text,
  type,
  disabled = false,
  className = "",
  handleClick = () => {},
}: ButtonProps) {
  return (
    <button
      type={type}
      className={ className || "font-semibold text-3xl cursor-pointer disabled:opacity-50" }
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default Button;
