import LoginForm from "@/app/components/modalpages.jsx/Login";
import SignupForm from "@/app/components/modalpages.jsx/Signup";
import { useState } from "react";
import GuestForm from "./GuestForm";

export default function AuthOptions() {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: "login", title: "Log in", description: "Please log in" },
    {
      id: "create",
      title: "Create an account",
      description: "Don't have an account yet?",
    },
    {
      id: "guest",
      title: "Continue as a guest",
      description: "Place your order with your email address",
    },
  ];

  const handleSelect = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full rounded-md p-6">
        <h1 className="text-center text-2xl font-medium text-gray-900">
          Log in
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Please log in or continue as a guest
        </p>

        <div>
          {options.map((opt) => (
            <div
              key={opt.id}
              className="border-b border-gray-200 overflow-hidden"
            >
              <label
                className={`lg:p-10 p-6 flex items-start space-x-3 cursor-pointer transition ${
                  selected === opt.id
                    ? "border-gray-800 bg-gray-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected === opt.id}
                  onChange={() => handleSelect(opt.id)}
                  className="mt-1 h-4 w-4 text-gray-800 focus:ring-gray-700 border-gray-400"
                />
                <div>
                  <p className="font-medium text-gray-900">{opt.title}</p>
                  <p className="text-sm text-gray-600">{opt.description}</p>
                </div>
              </label>

              {/* Smooth expansion wrapper */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  selected === opt.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 lg:px-12 pb-4 border-t border-gray-200 bg-white">
                  {opt.id === "login" && <LoginForm />}
                  {opt.id === "create" && <SignupForm />}
                  {opt.id === "guest" && <GuestForm />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
