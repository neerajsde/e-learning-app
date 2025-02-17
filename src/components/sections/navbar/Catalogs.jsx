import React, { useEffect, useState } from "react";
import apiHandler from "@/utils/apiHandler";
import { MdOutlineArrowDropUp } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Catalogs = () => {
  const pathname = usePathname();
  const [data, setData] = useState(null); // Set initial state to null

  async function getItems() {
    const response = await apiHandler("/course/categories");
    if (response.success) {
      setData(response.data.result || []);
    } else {
      console.error("API Error:", response.message);
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  // ** Prevent rendering mismatches **
  if (data === null) {
    return null; // Do not render anything until data is available
  }

  return (
    <div className="w-[250px] min-h-[100px] absolute top-11 -left-16 flex flex-col bg-richblack-700 p-2 rounded-lg shadow-xl shadow-richblack-900 z-[99999]">
      <MdOutlineArrowDropUp className="absolute -top-7 left-[120px] text-richblack-700 text-5xl" />
      {data.length > 0 ? (
        data.map((item) => (
          <Link
            key={`${item.name}_${item.id}`}
            href={`/catalog/${item.slugUrl}`}
            prefetch={true}
            className={`w-full text-base py-1 px-2 text-white ${
              item.slugUrl === pathname.split("/").at(-1)
                ? "bg-richblack-900"
                : "hover:bg-richblack-800 transition-all duration-200 ease-in"
            }`}
          >
            {item.name}
          </Link>
        ))
      ) : (
        <p className="text-white p-4">No categories available.</p>
      )}
    </div>
  );
};

export default Catalogs;
