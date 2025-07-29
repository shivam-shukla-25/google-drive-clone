import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/login";
import { useState, type FormEvent } from "react";
import FormInput from "~/components/FormInput";
import Button from "~/components/Button";
import { useAuth } from "~/context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to Login Page!" },
  ];
}

interface LoginFormData {
  email: string;
  password: string;
}

const login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setinputValue] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Partial<LoginFormData>>({});
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setinputValue((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
    setSuccess("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = inputValue;

    if (!email || !password) {
      email === "" && setError((prev) => ({ ...prev, email: "Please fill the email!" }));
      password === "" && setError((prev) => ({ ...prev, password: "Please fill the password!", }));
      setSuccess("");
      return;
    }

    try {
      await login(email, password);
      setError({});
      setSuccess("Login Success!!!");

      localStorage.setItem("Login", "true"); // optional
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setSuccess("");
      setError({});
      throw new Error("Invalid credentials or network error.")
      // setError({
      //   general: "Invalid credentials or network error.",
      // });
    }

    // console.log({ message: "Success!!", email: email, password: password });
    // localStorage.setItem("Login", "true");

    // setError({});
    // setSuccess("Login Success!!!");
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
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Login
            </h1>
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
              </div>
            </div>
            <Button
              type="submit"
              text="Login"
              className="mt-5 cursor-pointer tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            />
            {success && <p className="text-green-600 text-center">{success}</p>}
            <p className="mt-6 text-sm text-gray-700 text-center">
              don't have account?
              <Link to={"/signup"} className="ml-2 text-blue-500 underline">
                Sign Up
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
};

export default login;
