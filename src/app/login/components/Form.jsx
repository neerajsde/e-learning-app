"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RxEyeOpen, RxEyeNone } from "react-icons/rx";
import MdLoader from "@/components/spinner/MdLoader";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import apiHandler from "@/utils/apiHandler";

const Form = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { AuthUser } = useContext(AppContext);
  const [userType, setUserType] = useState("Student");
  const [isPassVisiable, setIsVisiable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function inputHandler(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await apiHandler("/user/login", "POST", false, { ...formData, userType })
      if (data.success) {
        localStorage.setItem('StudyNotion', data.data.token);
        await AuthUser();
        router.replace('/');
      } else {
        setError(data.message);
      }
      toast({
        title: data.success ? "Success" : "Uh oh! Something went wrong.",
        description: data.message,
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[300px] lg:w-[400px] font-inter flex flex-col gap-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-richblack-50">Welcome Back</h1>
        <p className="text-sm text-richblack-200">
          Build skills for today, tomorrow, and beyond.<br/>
          <span className="italic text-blue-400 font-edu-sa">Education to future-proof your career.</span>
        </p>
      </div>

      {/* User type toggle */}
      <div className="w-full flex justify-start items-start">
        <div className="bg-richblack-800 flex items-center justify-center p-1 rounded-full border-b border-richblack-600">
          <button
            onClick={() => setUserType("Student")}
            className={`px-3 lg:px-5 text-base py-1 md:py-2 rounded-full font-medium ${
              userType === "Student"
                ? "bg-richblack-900 text-richblack-50"
                : "bg-richblack-800 text-richblack-200"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => setUserType("Instructor")}
            className={`px-3 lg:px-5 text-base py-1 md:py-2 rounded-full font-medium ${
              userType === "Instructor"
                ? "bg-richblack-900 text-richblack-50"
                : "bg-richblack-800 text-richblack-200"
            }`}
          >
            Instructors
          </button>

          <button
            onClick={() => setUserType("Admin")}
            className={`px-3 lg:px-5 text-base py-1 md:py-2 rounded-full font-medium ${
              userType === "Admin"
                ? "bg-richblack-900 text-richblack-50"
                : "bg-richblack-800 text-richblack-200"
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col gap-4" onSubmit={submitHandler}>
        <div className="w-full flex flex-col gap-2">
          <label className="block text-sm text-richblack-50">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={inputHandler}
            required
            placeholder="Enter email address"
            className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
          />
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col gap-2 relative">
            <label className="block text-sm text-richblack-50">Password</label>
            <input
              type={isPassVisiable ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={inputHandler}
              placeholder="Enter password"
              required
              className="w-full p-3 pr-10 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
            />
            <div
              className="absolute bottom-4 right-3 text-xl cursor-pointer"
              onClick={() => setIsVisiable(!isPassVisiable)}
            >
              {isPassVisiable ? <RxEyeOpen /> : <RxEyeNone />}
            </div>
          </div>
          <div className="text-right">
            <Link href={"/reset-password"} className="text-sm text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full h-[40px] flex items-center justify-center bg-yellow-50 text-black font-semibold py-3 rounded-lg hover:bg-yellow-200"
          >
            {loading ? <MdLoader /> : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
