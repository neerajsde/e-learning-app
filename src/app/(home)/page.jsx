import Link from "next/link";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import Section8 from "./components/Section8";

export default function Home() {
  return (
    <div className="w-screen flex flex-col font-inter">
      <div className="w-full flex flex-col items-center bg-richblack-900 p-4 md:p-6 lg:p-8">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </div>

      <div className="w-full h-[100px] md:h-[150px] lg:h-[250px] bg-[url('/assets/Images/bghome.svg')] bg-repeat-x">
        <div className="w-full h-full flex justify-center items-center gap-4 md:pt-10">
          <Link href='/' className="yellow-btn">Explore Full Catalog</Link>
          <Link href='/' className="common-btn">Learn More</Link>
        </div>
      </div>

      <div className="w-full flex flex-col items-center bg-slate-50 p-4 md:py-6 md:px-4 lg:py-10 lg:px-20">
        <Section5/>
        <Section6/>
      </div>

      <div className="w-full flex flex-col items-center bg-richblack-900 p-4 md:py-6 md:px-4 lg:py-10 lg:px-20">
        <Section7/>
        {/* Ratings and reviews */}
        <Section8/>
      </div>
    </div>
  );
}
