import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaStar } from "react-icons/fa";

const Card = ({ data }) => {

  const formatCurrency = (amount) => {
    return `Rs. ${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  return (
    <Link href={`/courses/${data.slugUrl}`} prefetch={true} className="w-full flex flex-col gap-2">
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.thumbnail}`}
        width={100}
        height={200}
        className="w-full h-[200px] object-cover rounded-md"
      />
      <div className="w-full flex flex-col text-richblack-200">
        <span className="w-full text-base font-medium text-richblack-25">{data.courseName}</span>
        <span className="text-sm">{data.instructor_name}</span>

        <div className="w-full flex justify-start items-center gap-2">
          <span className="text-base text-yellow-200">{data.avg_ratings}</span>
          <div className="flex items-center gap-0">
            {[1, 2, 3, 4, 5].map((star, index) => (
              <FaStar
                key={`star-${index}`} // Ensure unique key
                className={`${
                  star <= data.avg_ratings
                    ? "text-yellow-100"
                    : "text-richblack-500"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-richblack-300">({data.review_count}) Reviews</span>
        </div>

        <span className="text-lg text-semibold text-richblack-5">{formatCurrency(data.price)}</span>
      </div>
    </Link>
  );
};

export default Card;
