"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { TiTick } from "react-icons/ti";
import { BiSolidError } from "react-icons/bi";
import MdLoader from "@/components/spinner/MdLoader";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner/Spinner";
import apiHandler from "@/utils/apiHandler";

const ResetPassword = ({token}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdated, setIsUpdated] = useState({ flag: false, data: null });
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
 
  useEffect(() => {
    setIsLoading(true);
  }, [])

  const validatePassword = (password) => {
    const requirements = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };
    setPasswordRequirements(requirements);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    const allRequirementsMet = Object.values(passwordRequirements).every(
      (requirement) => requirement
    );
    if (!allRequirementsMet) {
      setError("Please fulfill all password requirements!");
      return;
    }
    try {
      setLoading(true);
      const res = await apiHandler("/user/password/update", "POST", false, {token, newPassword: confirmPassword})
      const decryptedData = res;

      if (decryptedData.success) {
        setIsUpdated({ flag: true, emailFirstLetter: decryptedData.data.email[0] });
      } else {
        setError(decryptedData.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if(!isloading){
    return(
      <div className={`w-full min-h-screen flex items-center justify-center bg-richblack-900`}>
        <Spinner/>
      </div>
    )
  }

  if (isUpdated.flag && isloading) {
    return (
      <div
        className={`w-full min-h-screen p-4 flex items-center justify-center bg-richblack-900`}
      >
        <div className="w-[400px]">
          <h1 className="text-2xl text-richblack-50 font-semibold mb-2">
            Reset complete!
          </h1>
          <p className="text-sm text-richblack-300 mb-6">
            {`All done! We have sent an email to ${isUpdated.emailFirstLetter}***********@gmail.com to confirm`}
          </p>

          <button
            onClick={() => router.replace("/login")}
            className="w-full h-[40px] bg-yellow-50 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-200 flex justify-center items-center"
          >
            {loading ? <MdLoader /> : "Return to login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen p-4 flex items-center justify-center bg-richblack-900`}
    >
      <div className="w-full md:w-[350px] lg:w-[450px]">
        <h1 className="text-2xl text-richblack-50 font-semibold mb-2">
          Choose New Password
        </h1>
        <p className="text-sm text-richblack-300 mb-6">
          Almost done. Enter your new password and you're all set.
        </p>
        {error && (
          <div className="w-full text-red-500 mb-2 border border-red-500 px-2 py-1 text-sm flex items-center justify-start gap-1 rounded-sm">
            <BiSolidError className="text-lg text-yellow-400" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="newPassword"
              className="text-sm text-richblack-50 font-medium"
            >
              New password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-50 placeholder:text-richblack-200 outline-none rounded-lg text-base"
              placeholder="Enter new password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm text-richblack-50 font-medium"
            >
              Confirm new password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-50 placeholder:text-richblack-200 outline-none rounded-lg text-base"
              placeholder="Confirm new password"
            />
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 text-sm text-richblack-300">
            <div className="flex gap-1 items-center">
              <div
                className={`w-[15px] h-[15px] rounded-full  text-richblack-900 flex justify-center items-center ${
                  passwordRequirements.hasLowercase
                    ? "bg-green-500"
                    : "bg-richblack-200"
                }`}
              >
                <TiTick />
              </div>
              <span
                className={`${
                  passwordRequirements.hasLowercase ? "text-green-500" : ""
                }`}
              >
                One lowercase character
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <div
                className={`w-[15px] h-[15px] rounded-full text-richblack-900 flex justify-center items-center ${
                  passwordRequirements.hasUppercase
                    ? "bg-green-500"
                    : "bg-richblack-200"
                }`}
              >
                <TiTick />
              </div>
              <span
                className={`${
                  passwordRequirements.hasUppercase ? "text-green-500" : ""
                }`}
              >
                One uppercase character
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <div
                className={`w-[15px] h-[15px] rounded-full text-richblack-900 flex justify-center items-center ${
                  passwordRequirements.hasNumber
                    ? "bg-green-500"
                    : "bg-richblack-200"
                }`}
              >
                <TiTick />
              </div>
              <span
                className={`${
                  passwordRequirements.hasNumber ? "text-green-500" : ""
                }`}
              >
                One number
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <div
                className={`w-[15px] h-[15px] rounded-full text-richblack-900 flex justify-center items-center ${
                  passwordRequirements.hasSpecialChar
                    ? "bg-green-500"
                    : "bg-richblack-200"
                }`}
              >
                <TiTick />
              </div>
              <span
                className={`${
                  passwordRequirements.hasSpecialChar ? "text-green-500" : ""
                }`}
              >
                One special character
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <div
                className={`w-[15px] h-[15px] rounded-full text-richblack-900 flex justify-center items-center ${
                  passwordRequirements.hasMinLength
                    ? "bg-green-500"
                    : "bg-richblack-200"
                }`}
              >
                <TiTick />
              </div>
              <span
                className={`${
                  passwordRequirements.hasMinLength ? "text-green-500" : ""
                }`}
              >
                8 character minimum
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-[40px] bg-yellow-50 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-200 flex justify-center items-center"
          >
            {loading ? <MdLoader /> : "Reset Password"}
          </button>
        </form>
        <Link
          href="/login"
          className="mt-4 flex items-center text-richblack-50 hover:text-richblack-300 gap-2"
        >
          <FaArrowLeftLong /> Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;