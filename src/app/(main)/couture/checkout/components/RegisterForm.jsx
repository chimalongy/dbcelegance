import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email && password;

  const handleSubmit = () => {
    console.log("Register with", { email, password });
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">* Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">* Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>
      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`w-full rounded-md py-2 text-center ${
          isValid
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
