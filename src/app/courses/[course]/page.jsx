import apiHandler from "@/utils/apiHandler";
import Link from "next/link";
import React, { Suspense } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import TimeCalculate from "@/utils/TimeCalulate";
import Image from "next/image";
import { IoMdTime } from "react-icons/io";
import { RxCursorArrow } from "react-icons/rx";
import { CiMobile3 } from "react-icons/ci";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import CourseContent from "./components/CourseContent";
import RatingAndReviews from '@/components/common/RatingAndReviews'
import SkeletonCards from '@/components/common/SkeletonCards';
import { IoIosShareAlt } from "react-icons/io";

export async function generateMetadata({ params }) {
  const { course } = await params;
  const response = await apiHandler(`/course/c/${course}`);

  if (!response.success) {
    return {
      title: "Course Not Found",
      description: response.message,
    };
  }

  return {
    title: response.data.data.course.courseName || "Course Details",
    description:
      response.data.data.course.courseDescription ||
      "Explore this course in detail.",
  };
}

const formatCurrency = (amount) => {
  return `Rs. ${new Intl.NumberFormat("en-IN").format(amount)}`;
};

const Course = async ({ params }) => {
  const { course } = await params;
  const response = await apiHandler(`/course/c/${course}`);

  if (!response.success) {
    return (
      <div className="w-screen h-[90vh] font-inter flex justify-center items-center bg-richblack-900 text-richblack-25 text-2xl font-medium">
        {response.message}
      </div>
    );
  }

  const data = response.data.data;
  const ratings = await apiHandler(
    `/course/avg-rating/${data.course.id}`,
    "GET"
  );

  return (
    <div className="w-screen font-inter flex flex-col px-4 md:px-8 lg:px-20 pb-10 bg-richblack-900">
      <div className="w-full grid grid-col-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px] gap-4 text-white">
        {/* Left Menu  */}
        <div className="w-full flex flex-col pb-20">
          <div className="w-full flex flex-col lg:border-r border-richblack-600 pr-0 md:pr-2 my-6 gap-1 md:gap-2">
            <div className="w-full flex justify-start items-center gap-1 md:gap-2 text-richblack-300 text-base md:text-lg">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/courses">Courses</Link>
              <span>/</span>
              <span className="text-yellow-100">{data.course.category}</span>
            </div>

            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
              {data.course.courseName}
            </h1>

            <p className="text-sm md:text-base text-richblack-400">
              {data.course.courseDescription}
            </p>

            <div className="w-full flex flex-col md:flex-row items-start justify-start md:items-center gap-2">
              <div className="flex items-center gap-x-2">
                <span className="text-base text-yellow-200">
                  {ratings.data.avgRating}
                </span>
                <div className="flex items-center gap-0">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <FaStar
                      key={`star-${index}`} // Ensure unique key
                      className={`${
                        star <= ratings.data.avgRating
                          ? "text-yellow-100"
                          : "text-richblack-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-richblack-300">
                ({ratings.data.totalReviews} ratings){" "}
                <span>{ratings.data.students} students</span>
              </span>
            </div>

            <div className="text-base md:text-lg text-richblack-100">
              Created by{" "}
              <span className="text-richblack-100">
                {data.course.instructorName}
              </span>
            </div>

            <div className="w-full flex items-center gap-1 text-sm md:text-base lg:text-lg text-richblack-200">
              <IoMdInformationCircleOutline className="text-xl" /> Created at{" "}
              <span>{TimeCalculate(data.course.created_at)}</span>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="w-full flex flex-col border border-richblack-600 p-4 my-4 lg:my-8 rounded-sm">
            <h2 className="text-xl md:text-2xl text-richblack-25">
              What you'll learn
            </h2>
            <div className="text-base text-richblack-200">
              {data.course.whatYouWillLearn}
            </div>
          </div>

          {/* course content */}
          <div className="w-full">
            <CourseContent allData={data}/>
          </div>

          {/* Author Details */}
          <div className="w-full flex flex-col mt-5 gap-2">
            <h2 className="text-xl text-center md:text-left md:text-2xl font-semibold text-richblack-100">Author</h2>

            <div className="w-full flex justify-center md:justify-start items-center gap-2">
              {data.course.instructorImage &&
                <Image
                  src={data.course.instructorImage}
                  alt="InstructorImg"
                  width={50}
                  height={50}
                  className=" w-11 h-11 rounded-full object-cover"
                />
              }
              <span className="text-base md:text-lg text-richblack-100">{data.course.instructorName}</span>
            </div>

            <span className="text-sm text-justify md:text-left text-richblack-300">{data.course.instructorDesc}</span>
          </div>
        </div>

        {/* RightMenu */}
        <div className="w-full flex flex-col my-0 md:my-6 rounded-lg">
          <Image
            src={`${data.course.thumbnail}`}
            alt="Thumbnail"
            width={400}
            height={300}
            className="w-full h-auto rounded-t-lg object-cover"
          />
          <div className="w-full bg-richblack-700 rounded-b-lg flex flex-col p-4 gap-4">
            <span className="text-2xl text-richblack-50 font-semibold">
              {formatCurrency(data.course.price)}
            </span>
            <div className="w-full flex flex-col gap-4">
              <button className="yellow-btn">Add to Cart</button>
              <button className="common-btn">Buy now</button>
              <span className="text-sm text-richblack-300 text-center">
                30-Day Money-Back Guarantee
              </span>
            </div>
            <div className="w-full flex flex-col gap-1">
              <p>This course includes:</p>
              <span className="flex items-center text-sm text-teal-600 gap-2">
                <IoMdTime /> 8 hours on-demand video
              </span>
              <span className="flex items-center text-sm text-teal-600 gap-2">
                <RxCursorArrow /> Full Lifetime access
              </span>
              <span className="flex items-center text-sm text-teal-600 gap-2">
                <CiMobile3 /> Access on Mobile and TV
              </span>
              <span className="flex items-center text-sm text-teal-600 gap-2">
                <HiOutlineDocumentCheck /> Certificate of completion
              </span>
            </div>

            <button className="w-full flex justify-center items-center gap-2 text-base text-richblack-100">
              <IoIosShareAlt/> Share
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className='w-full flex flex-col mt-5 gap-5 lg:gap-10'>
        <h2 className='text-center text-xl md:text-2xl lg:text-3xl text-richblack-25'>Reviews from other learners</h2>
        <Suspense fallback={<SkeletonCards/>}>
            <RatingAndReviews/>
        </Suspense>
      </div>

    </div>
  );
};

export default Course;
