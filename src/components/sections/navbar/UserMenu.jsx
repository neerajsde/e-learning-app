import ProfilePic from "@/components/common/ProfilePic";
import { AppContext } from "@/context/AppContext";
import apiHandler from "@/utils/apiHandler";
import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { IoMdArrowDropup } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import MdLoader from "@/components/spinner/MdLoader";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const navigation = useRouter();
  const { toast } = useToast();
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isActiveUsermenu, setisActiveUserMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userMenuRef = useRef(null);

  // Prevent hydration errors by ensuring the component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close the user menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setisActiveUserMenu(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function dashboardBtnHandler(){
    if(userData.accountType === "Instructor"){
      navigation.push(`/dashboard?tab=home`);
    }
    if(userData.accountType === "Student"){
      navigation.push(`/dashboard?tab=my-profile`)
    }
    if(userData.accountType === "Admin"){
      navigation.push(`/dashboard?tab=home`)
    }
  }

  const logOutHandler = async () => {
    setLoading(true);
    const res = await apiHandler("/user/logout", "GET", true);
    // console.log(res);
    if (res.success) {
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("StudyNotion");
    } 
    toast({
      title: res.success ? "Success" : "Uh oh! Something went wrong.",
      description: res.message,
    });
    setLoading(false);
  };
  

  return (
    <div>
      {isLoggedIn ? (
        <div
          onClick={() => setisActiveUserMenu(!isActiveUsermenu)}
          className="relative flex flex-col cursor-pointer"
          ref={userMenuRef}
        >
          <ProfilePic img_url={userData.user_img} />
          {isMounted && isActiveUsermenu && (
            <div
              key={`GFJRY&4$26X`}
              className="w-[200px] absolute translate-y-[50%] right-1 bg-richblack-50 p-3 rounded-sm shadow-xl shadow-richblack-900 z-[99999]"
            >
              <IoMdArrowDropup className=" text-5xl text-richblack-50 absolute translate-y-[-85%] -right-[11px] rounded-sm z-[9999]" />
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={dashboardBtnHandler}
                  className="w-full py-2 px-3 text-base font-semibold text-richblack-900 border border-richblack-700 hover:text-richblack-50 hover:bg-richblack-700 transition-all duration-200 ease-in"
                >
                  Dashboard
                </button>
                <button
                  onClick={logOutHandler}
                  className={`w-full h-[40px] flex items-center justify-center py-2 px-3 text-base font-semibold border ${loading ? 'bg-red-600 text-richblack-50 border-red-600' : 'text-red-600 border-red-600 hover:text-richblack-50 hover:bg-red-600 transition-all duration-200 ease-in'}`}
                >
                  {loading ? (<MdLoader/>) : (<span className="flex items-center justify-center gap-2"><LuLogOut /> Logout</span>)}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 md:gap-3">
          <Link
            href="/signup"
            className="text-sm md:text-lg border border-richblack-600 p-1 px-2 rounded-lg hover:text-richblack-50 hover:border-richblack-500 transition duration-200 ease-in"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="text-sm md:text-lg border border-richblack-600 p-1 px-2 rounded-lg hover:text-richblack-50 hover:border-richblack-500 transition duration-200 ease-in"
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;