"use client";
import Card from "@/components/course/Card";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SuggestCourse = ({ heading, isTab, popular, newCourse, others }) => {
  const tabs = [
    { id: "AYY687KJ", name: "Most popular", data: popular },
    { id: "NBHJH687", name: "New", data: newCourse },
    { id: "HJK86BJI", name: "Others", data: others },
  ];
  const [currTab, setCurrTab] = useState(tabs[0]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-medium text-richblack-25">{heading}</h2>
        {isTab && (
          <div className="w-full flex justify-start items-center border-b border-richblack-500">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrTab(item)}
                className={`text-sm md:text-base py-1 px-3 border-b-2 ${
                  item.id === currTab.id
                    ? " border-yellow-100 text-yellow-100"
                    : "border-transparent text-richblack-200 hover:text-richblack-50 transition-all duration-200 ease-in"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-full pr-8">
        <Carousel
            opts={{
            align: "start",
            slidesToShow: 3, // Set the number of visible slides to 3
            }}
            className="w-full"
        >
            <CarouselContent>
            {currTab.data &&
                currTab.data.map((item, index) => (
                <CarouselItem
                    key={`KJ_H76PG${item.id}${index}`}
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                    {" "}
                    {/* Each item takes up 1/3 of the width */}
                    <Card data={item} />
                </CarouselItem>
                ))}
            </CarouselContent>
            {/* <CarouselPrevious /> */}
            <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default SuggestCourse;
