import { useState } from "react";

export default function GuestForm() {
  const [email, setEmail] = useState("");

  const isValid = email;

  const handleSubmit = () => {
    console.log("Guest checkout with", { email });
  };

  return (
    <div className="space-y-4 pt-10 pb-10">
      <div className="flex flex-col ">
        <label className="text-sm text-gray-700">* Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b p-3 border-gray-300 focus:outline-none focus:border-gray-600"
        />
      </div>
      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`w-full rounded-md py-2 text-center ${
          isValid
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
