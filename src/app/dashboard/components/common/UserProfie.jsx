import Image from "next/image";
import React, { useContext } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";

const UserProfie = () => {
    const { userData } = useContext(AppContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = () => {
      const params = new URLSearchParams(searchParams);
      params.set("edit", true);
      router.push(`?${params.toString()}`, { scroll: false });
    };
    
    if(searchParams.get("edit")){
        return <EditProfile/>
    }
  return (
    <div className="w-full flex flex-col gap-4 md:gap-8">
      <h2 className="text-xl md:text-2xl font-semibold text-richblack-25">My Profile</h2>
      <div className="w-full flex items-center flex-col gap-4">
        <div className="w-full md:w-[400px] lg:w-[700px] border border-richblack-600 bg-richblack-800 rounded-md p-2 md:p-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4">
              {userData.user_img ? (
                <Image
                  src={userData.user_img}
                  alt="user"
                  width={72}
                  height={72}
                  className=" w-14 h-14 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] object-cover rounded-full"
                />
              ) : (
                <FaCircleUser className="text-7xl text-richblack-500" />
              )}
              <div className="flex flex-col">
                <span className="text-base md:text-lg lg:text-xl font-semibold text-richblack-25">
                  {userData.name}
                </span>
                <span className="text-xs md:text-sm lg:text-base text-richblack-300">
                  {userData.email}
                </span>
              </div>
            </div>
            <button onClick={handleClick} className="py-1 md:py-2 px-2 md:px-2 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-sm md:text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in">
              <FaEdit /> Edit
            </button>
          </div>
        </div>

        <div className="w-full md:w-[400px] lg:w-[700px] flex flex-col border border-richblack-600 bg-richblack-800 rounded-md p-2 md:p-4 gap-2 md:gap-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-lg md:text-xl font-medium text-richblack-25">
              Personal Details
            </span>
            <button onClick={handleClick} className="py-1 md:py-2 px-2 md:px-2 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-sm md:text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in">
              <FaEdit /> Edit
            </button>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-2">
            <div className="w-6/12 flex flex-col">
                <span className="text-sm text-richblack-400">First Name</span>
                <span className="text-base text-richblack-25">{userData.name.trim().split(' ').at(0)}</span>
            </div>
            <div className="w-6/12 flex flex-col">
                <span className="text-sm text-richblack-400">Last Name</span>
                <span className="text-base text-richblack-25">{userData.name.trim().split(' ')?.at(1)}</span>
            </div>
            <div className="w-6/12 flex flex-col">
                <span className="text-sm text-richblack-400">Email</span>
                <span className="text-base text-richblack-25">{userData.email}</span>
            </div>
            <div className="w-6/12 flex flex-col">
                <span className="text-sm text-richblack-400">Phone Number</span>
                <span className="text-base text-richblack-25">{userData?.contactNumber || "Update your details"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfie;
