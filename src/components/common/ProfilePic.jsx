import Image from "next/image";
import React from "react";
import { FaCircleUser } from "react-icons/fa6";

const ProfilePic = ({ img_url }) => {
  return (
    <div className="text-3xl rounded-full border-2 border-yellow-200">
      {
        img_url ? 
        (
          <Image src={img_url} alt="user" width={40} height={40} className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full object-cover" />
        )
        :
        (
          <FaCircleUser className="text-4xl"/>
        )
      }
    </div>
  );
};

export default ProfilePic;
