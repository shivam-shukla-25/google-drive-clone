import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface FormInputProps {
  name: keyof FormData;
  type: string;
  inputValue: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: Partial<FormData>;
  showToggle?: boolean;
  show?: boolean;
  setShow?: (v: boolean) => void;
}

interface FormData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

function FormInput({ name, type, showToggle, show, setShow, inputValue, handleChange, error }: FormInputProps) {
  return (
    <>
      <div className="relative">
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          id={name}
          name={name}
          value={inputValue[name]}
          onChange={handleChange}
          placeholder={name}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
        />
        {showToggle && setShow && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 top-5 end-5 cursor-pointer flex items-center text-gray-500"
          >
            {show ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        )}
      </div>
      {error[name] && <p className="text-red-600">{error[name]}</p>}
    </>
  );
}

export default FormInput;
