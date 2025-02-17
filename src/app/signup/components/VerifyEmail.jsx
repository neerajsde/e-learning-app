import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { VscRefresh } from "react-icons/vsc";
import MdLoader from "@/components/spinner/MdLoader";
import apiHandler from "@/utils/apiHandler";

export default function VerifyEmail({ formData, userType, sendOtp }) {
  const router = useRouter();
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async () => {
    setError("");
    try {
      setLoading(true);
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.confirm_password,
        role: userType,
        otp: parseInt(code.join("")),
      };

      const data = await apiHandler("/user/signup", "POST", false, payload);
      if (data.success) {
        router.replace("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !code[index]) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="w-full max-w-sm flex flex-col gap-4 rounded-lg bg-richblack-900">
        <div className="w-full flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-richblack-5">
            Verify email
          </h1>
          <p className=" text-richblack-200">
            A verification code has been sent to you. Enter the code below.
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder="-"
              className="w-full p-3 bg-richblack-800 border-b-2 text-lg border-richblack-600 text-richblack-50 rounded-lg text-center outline-2 outline-none focus:ring focus:ring-yellow-200 focus:border-richblack-800"
            />
          ))}
        </div>
        <div className="w-full flex flex-col gap-1">
            <div className="w-full flex flex-col gap-1">
                {error && <p className="text-sm text-red-500 pl-2">{error}</p>}
                <button
                    onClick={submitHandler}
                    className="w-full h-[40px] flex items-center justify-center bg-yellow-50 text-black font-semibold py-3 rounded-lg hover:bg-yellow-200"
                >
                    {loading ? <MdLoader /> : "Verify email"}
                </button>
            </div>
          <div className="w-full flex items-center justify-between">
            <Link
              href="/login"
              className="w-full flex items-center justify-start text-richblack-50 gap-2 cursor-pointer hover:text-richblack-200 transition duration-200 ease-in"
            >
              <FaArrowLeftLong /> Back to login
            </Link>
            <button
              onClick={submitHandler}
              className="w-full flex items-center justify-end text-blue-100 gap-1 cursor-pointer hover:text-blue-200 transition duration-200 ease-in"
            >
              <VscRefresh />
              <span onClick={sendOtp}>Resend it</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
