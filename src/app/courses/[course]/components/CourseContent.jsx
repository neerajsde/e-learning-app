"use client";
import React, { useEffect, useState } from "react";
import { MdOndemandVideo } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const CourseContent = ({ allData }) => {
  const data = allData.allSections;
  const [openSections, setOpenSections] = useState([true]);
  const [openSubsections, setOpenSubsections] = useState({"0-0": true});
  const [countSections, setCountSections] = useState(0);
  const [collapesAllSectionsOpen, setCollapesAllSectionsOpen] = useState(false);

  useEffect(() => {
    const count = data.reduce((acc, curr) => acc + curr.subSections.length, 0);
    setCountSections(count);
  }, [data]);

  const collapesAllSections = (flag) => {
    setCollapesAllSectionsOpen(flag);
    setOpenSections(() => {
      return data.map(() => flag);
    });
    setOpenSubsections(() => {
      const newState = {};
      data.forEach((section, index) => {
        section.subSections.forEach((_, subIndex) => {
          newState[`${index}-${subIndex}`] = flag;
        });
      });
      return newState;
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSubsection = (sectionIndex, subIndex) => {
    setOpenSubsections((prev) => ({
      ...prev,
      [`${sectionIndex}-${subIndex}`]: !prev[`${sectionIndex}-${subIndex}`],
    }));
  };

  return (
    <div className="w-full mt-4 flex flex-col">
      <div className="w-full flex flex-col gap-2 pb-2">
        <h3 className="text-xl text-center md:text-left md:text-2xl text-richblack-25 font-semibold">
          Course Content
        </h3>

        <div className="w-full flex flex-col lg:flex-row items-start justify-between lg:items-center">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-1 text-richblack-300 text-sm">
            <span className="flex items-center gap-1"><GoDotFill className="lg:hidden"/> {data.length} sections</span>
            <GoDotFill className="hidden lg:flex"/>
            <span className="flex items-center gap-1"><GoDotFill className="lg:hidden"/>{countSections} lectures</span>
            <GoDotFill className="hidden lg:flex"/>
            <span className="flex items-center gap-1"><GoDotFill className="lg:hidden"/> {allData.courseDuration} total length</span>
          </div>

          <button onClick={() => collapesAllSections(!collapesAllSectionsOpen)} className="hidden lg:flex text-sm text-yellow-100 transition-all duration-200 ease-in hover:text-yellow-200">
            Collapes all sections
          </button>
        </div>
      </div>
      {data &&
        data.map((section, index) => (
          <div key={`section-${index}`} className="w-full flex flex-col border border-richblack-700">
            {/* Section Header */}
            <div
              className="w-full flex justify-between items-center border-b border-richblack-500 p-2 lg:p-4 bg-richblack-700 cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              <span className="flex items-center gap-2 text-sm lg:text-base w-[200px] md:w-[280px] lg:w-auto">
                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    openSections[index] ? "rotate-180" : ""
                  }`}
                />
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {section.sectionName}
                </span>
              </span>
              <span className="text-sm text-yellow-200">
                {section.subSections.length || 5} lectures
              </span>
            </div>

            {/* Section Content */}
            <div
              className={`w-full flex flex-col gap-4 transition-all duration-300 overflow-hidden ${
                openSections[index]
                  ? "max-h-[500px] p-4 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {section.subSections.map((subsection, idx) => (
                <div
                  key={`subsection-${idx}`}
                  className="w-full flex flex-col gap-1"
                >
                  {/* Subsection Header */}
                  <div
                    className="flex justify-between items-center text-richblack-100 text-sm cursor-pointer"
                    onClick={() => toggleSubsection(index, idx)}
                  >
                    <span className="text-xs md:text-sm lg:text-base flex items-center gap-1 w-[200px] md:w-[280px] lg:w-auto">
                      <MdOndemandVideo />
                      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{subsection.title}</span>
                      <FaAngleDown
                        className={`transition-transform duration-300 ${
                          openSubsections[`${index}-${idx}`] ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                    <span className="text-xs md:text-sm lg:text-base ">{subsection.timeDuration}</span>
                  </div>

                  {/* Subsection Description */}
                  <div
                    className={`px-4 text-sm text-richblack-300 transition-all duration-300 overflow-hidden ${
                      openSubsections[`${index}-${idx}`]
                        ? "max-h-[200px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {subsection.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CourseContent;
