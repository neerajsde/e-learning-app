"use client"
import React, { useState } from "react";
import SideMenu from "../common/SideMenu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiBookMarkedLine } from "react-icons/ri";
import { LuBookmark } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa6";
import SubMenu from "../common/SubMenu";
import { useSearchParams } from "next/navigation";
import UserProfie from "../common/UserProfie";

const menuItems = [
  [
    { id: "_PMA54H3", name: "My Profile", link: "my-profile", icon: FaRegUser },
    {
      id: "_PMA54H2",
      name: "Enrolled Courses",
      link: "enrolled-courses",
      icon: RiBookMarkedLine,
    },
    { id: "_PMA54H4", name: "Wishlist", link: "wishlist", icon: LuBookmark },
    {
      id: "_PMA54H5",
      name: "Purchase History",
      link: "purchase-history",
      icon: IoCartOutline,
    },
    { id: "_PMA54H6", name: "Courses", link: "courses", icon: FaGraduationCap },
  ],
  [
    {
      id: "_PMA54H7",
      name: "Settings",
      link: "settings",
      icon: IoSettingsOutline,
    },
    { id: "_PMA54H8", name: "Log Out", link: "logout", icon: FiLogOut },
  ],
];

const DSHome = () => {
  const searchParams = useSearchParams();
  const [isActiveSideMenu, setIsActiveSideMenu] = useState(true);

  return (
    <div className="relative w-full h-[90vh] font-inter overflow-hidden">
      {/* Side Menu */}
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-richblack-900 border-r border-richblack-700 transition-transform duration-500 ease-in-out ${
          isActiveSideMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SideMenu menuItems={menuItems} />
      </div>

      {/* Main Content */}
      <div
        className={`h-full transition-all duration-500 ease-in-out ${
          isActiveSideMenu ? 'ml-64' : 'ml-0'
        }`}
      >
        <SubMenu
          isActiveSideMenu={isActiveSideMenu}
          setIsActiveSideMenu={setIsActiveSideMenu}
        />
        <div className="w-full h-full overflow-y-scroll p-4 flex flex-col bg-richblack-900 gap-2">
          <div className="w-full flex flex-col">
            {searchParams.get("tab") === menuItems[0][0].link && <UserProfie />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSHome;
