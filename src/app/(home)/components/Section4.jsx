import { HomePageExplore } from "../../../../public/data/homepage-explore";
import { HiUsers } from "react-icons/hi2";
import { FaSitemap } from "react-icons/fa6";

const Section4 = () => {
  return (
    <div className="w-full h-auto md:h-[300px] flex flex-col mt-28 gap-8 lg:gap-20">
      <div className="w-full flex flex-col items-center gap-2">
        <h2 className="text-center text-xl md:text-2xl lg:text-4xl text-richblack-25 font-semibold">
          Unlock the <span className=" text-blue-100">Power of Code</span>
        </h2>
        <p className="text-center text-richblack-300 text-sm  md:text-base">
          Learn to Build Anything You Can Imagine
        </p>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-8">
        {HomePageExplore[0].courses.map((item) => (
          <div className={`w-full lg:w-[300px] h-[250px] flex flex-col justify-between z-50 ${item.heading === "Learn HTML" ? 'bg-white shadow-[9px_9px_0_0_#E7C009] mb-4' : ' bg-richblack-800'}`}>
            <div className="w-full flex flex-col p-4 gap-1">
              <h3 className={`text-lg font-semibold ${item.heading === "Learn HTML" ? ' text-richblack-800' :' text-richblack-25'}`}>{item.heading}</h3>
              <p className={`text-sm ${item.heading === "Learn HTML" ? ' text-richblack-500' :' text-richblack-300'}`}>{item.description}</p>
            </div>
            <div className="w-full flex justify-between items-center p-4 border-t-2 border-dashed border-richblack-100">
              <div className={`flex items-center gap-1 font-semibold ${item.heading === "Learn HTML" ? 'text-blue-200' : ' text-richblack-300'}`}><HiUsers/>{item.level}</div>
              <div className={`flex items-center gap-1 font-semibold ${item.heading === "Learn HTML" ? 'text-blue-200' : ' text-richblack-300'}`}><FaSitemap/>{item.lessionNumber} Lessons</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section4;
