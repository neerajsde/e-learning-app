import GradientButton from "@/components/common/GradientButton";
import apiHandler from "@/utils/apiHandler";
import React from "react";

const CoursesLink = async () => {
  const response = await apiHandler("/course/categories");

  if (!response.success) {
    return <div>{response.message}</div>;
  }
  const data = response.data.result;

  return (
    <div className="w-full flex flex-col md:hidden mt-10 gap-4 text-white">
        <h2 className="text-2xl font-semibold text-center text-richblack-50">Catalog</h2>
      {data.map((item) => (
        <GradientButton key={`qk56YG66h${item.id}`} text={item.name} link={`/catalog/${item.slugUrl}`}/>
      ))}
    </div>
  );
};

export default CoursesLink;
