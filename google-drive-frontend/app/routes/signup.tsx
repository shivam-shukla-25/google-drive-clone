import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import type { Route } from "./+types/signup";
import { useAuth } from "~/context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SignUp" },
    { name: "description", content: "Welcome to SignUp Page!" },
  ];
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setinputValue] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<Partial<SignUpFormData>>({});
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setinputValue((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
    setSuccess("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, confirmPassword } = inputValue;

    if ( !email || !password || !confirmPassword) {
      email === "" && setError((prev) => ({ ...prev, email: "Please fill the email!" }));
      password === "" && setError((prev) => ({ ...prev, password: "Please fill the password!", }));
      confirmPassword === "" && setError((prev) => ({ ...prev, confirmPassword: "Please fill the confirm password!", }));
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Both Passwords should be same!",
      }));
      setSuccess("");
      return;
    }


    try {
      await signup(email, password);
      setError({});
      setSuccess("Register Success!!!");

      localStorage.setItem("Login", "true"); // optional
      navigate("/");
    } catch (err: any) {
      console.error("Register error:", err);
      setSuccess("");
      setError({});
      throw new Error("Invalid credentials or network error.")
      // setError({
      //   general: "Invalid credentials or network error.",
      // });
    }
    // console.log({
    //   message: "Success!!",
    //   email: email,
    //   password: password,
    // });
    // localStorage.setItem("SignUp", "true");

    // setError({});
    // setSuccess("SignUp Success!!!");
    // navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <Link to={"/"} className="text-3xl font-extrabold text-center text-indigo-500">
            Drive Clone
          </Link>
          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col w-full justify-center items-center"
          >
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-full">
                <FormInput
                  name="email"
                  type="email"
                  inputValue={inputValue}
                  handleChange={handleChange}
                  error={error}
                />
                <FormInput
                  name="password"
                  type="password"
                  inputValue={inputValue}
                  handleChange={handleChange}
                  error={error}
                  showToggle
                  show={showPassword}
                  setShow={setShowPassword}
                />
                <FormInput
                  name="confirmPassword"
                  type="password"
                  inputValue={inputValue}
                  handleChange={handleChange}
                  error={error}
                  showToggle
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                />
              </div>
            </div>
            <Button
              type="submit"
              text="SignUp"
              className="mt-5 cursor-pointer tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            />
            {success && <p className="text-green-600 text-center">{success}</p>}
            <p className="mt-6 text-sm text-gray-700 text-center">
              already have account?
              <Link to={"/login"} className="ml-2 text-blue-500 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="mx-12 my-auto xl:mx-16 w-full bg-contain bg-center bg-no-repeat">
            <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
