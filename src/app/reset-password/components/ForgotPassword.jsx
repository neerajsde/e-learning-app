"use client"
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import MdLoader from "@/components/spinner/MdLoader";
import apiHandler from "@/utils/apiHandler";

const ForgotPassword = () => {
    const { toast } = useToast();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSentEmail, setIsSentEmail] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const res = await apiHandler("/user/password/reset", "POST", false, {email})
            const data = res;
            toast({
                title: data.success ? "Success" : "Uh oh! Something went wrong.",
                description: data.message,
            });
        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4 min-h-[90vh] flex justify-center items-center bg-richblack-900">
            {isSentEmail ? (
                <div className="w-full md:w-[400px] flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-1">
                        <h1 className="text-2xl text-richblack-50 font-semibold">Check Email</h1>
                        <p className="text-sm text-richblack-200">
                            We have sent the reset email to {email}
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button
                            onClick={submitHandler}
                            disabled={loading}
                            className="w-full h-[40px] flex items-center justify-center bg-yellow-50 text-black font-semibold py-3 rounded-lg hover:bg-yellow-200"
                        >
                            {loading ? (<MdLoader/>) : "Resend Email"}
                        </button>
                        <Link href="/login" className="w-full flex items-center justify-start text-richblack-50 gap-2 cursor-pointer hover:text-richblack-200 transition duration-200 ease-in">
                            <FaArrowLeftLong /> Back to login
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="w-[400px] flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-1">
                        <h1 className="text-2xl text-richblack-50 font-semibold">Reset Your Password</h1>
                        <p className="text-sm text-richblack-200">
                            Have no fear. We’ll email you instructions to reset your password. If you don't have access to your email, we can try account recovery.
                        </p>
                    </div>
                    <form onSubmit={submitHandler} className="w-full flex flex-col gap-6">
                        <div className="w-full flex flex-col gap-2">
                            <label className="block text-sm text-richblack-50">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter email address"
                                className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-50 placeholder:text-richblack-200 outline-none rounded-lg text-base"
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[40px] flex items-center justify-center bg-yellow-50 text-black font-semibold py-3 rounded-lg hover:bg-yellow-200"
                            >
                                {loading ? (<MdLoader/>) : "Reset Password"}
                            </button>
                            <Link href="/login" className="w-full flex items-center justify-start text-richblack-50 gap-2 cursor-pointer hover:text-richblack-200 transition duration-200 ease-in">
                                <FaArrowLeftLong /> Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;