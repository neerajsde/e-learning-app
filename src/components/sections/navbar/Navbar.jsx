"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import UserMenu from "./UserMenu";
import { NavbarLinks } from "../../../../public/data/navbar-links";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import Catalogs from "./Catalogs";
import Logo from "../../../../public/assets/Logo/Logo-Full-Light.png";

const Navbar = () => {
  const pathname = usePathname();
  const [isActiveCatalogs, setIsActiveCatalog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors by ensuring the component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="w-full h-12 md:h-16 font-inter px-2 md:px-4 flex justify-between items-center text-richblack-200 bg-richblack-900 border-b border-richblack-700 sticky top-0 left-0 z-[9999]">
      <Link href="/">
        <Image
          src={Logo}
          alt="LOGO"
          width={150}
          height={100}
          priority
          className="w-[100px] h-auto md:w-[150px] object-contain"
        />
      </Link>
      
      <div className="hidden md:flex lg:flex justify-center items-center gap-2 lg:gap-4">
        {NavbarLinks &&
          NavbarLinks.map((item, index) => (
            item.title === "Catalog" ? (
              <div
                key={`G53HG67-${index}`}
                onMouseEnter={() => setIsActiveCatalog(true)}
                onMouseLeave={() => setIsActiveCatalog(false)}
                className={` relative flex flex-col ${
                  item.path === pathname.split('/').at(1) ? 'text-yellow-50' : 'text-richblack-100 hover:text-richblack-5 transition duration-200 ease-in'
                }`}
              >
                <div className="text-base lg:text-lg font-normal flex items-center gap-1">{item.title} <FaChevronDown className="text-base"/></div>
                
                {/* Only render the Catalogs component after the component is mounted */}
                {isMounted && isActiveCatalogs && (<div key={`GFJRY&4-${index}`}><Catalogs /></div>)}
              </div>
            ) : (
              <Link
                key={`navlink-${index}`}
                href={item.path}
                className={`text-base lg:text-lg font-normal ${
                  item.path === pathname
                    ? "text-yellow-50"
                    : "text-richblack-100 hover:text-richblack-5 transition duration-200 ease-in"
                }`}
              >
                {item.title}
              </Link>
            )
          ))}
      </div>

      <div className="flex justify-center items-center gap-2">
        <IoSearch className="text-base md:text-xl lg:text-2xl hover:text-richblack-50 transition duration-200 ease-in cursor-pointer" />
        <IoCartOutline className="text-base md:text-xl lg:text-2xl hover:text-richblack-50 transition duration-200 ease-in cursor-pointer" />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
