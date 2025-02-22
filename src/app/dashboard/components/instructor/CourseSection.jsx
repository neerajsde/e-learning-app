"use client";
import React, { useEffect, useState } from "react";
import { MdOndemandVideo } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

const CourseSection = ({ data }) => {
  const [openSections, setOpenSections] = useState([]);
  const [openSubsections, setOpenSubsections] = useState({});

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
    <div className="w-full mt-4 flex flex-col rounded-lg">
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
              <div className="flex items-center">
                <button 
                    className='p-1 rounded-md text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800 transition duration-200'
                >
                    <MdEdit className='text-lg'/>
                </button>
                <button 
                    className='p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-200 transition duration-200'
                >
                    <RiDeleteBinLine className='text-lg'/>
                </button>
              </div>
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
                    <div className="flex items-center">
                      <button 
                          className='p-1 rounded-md text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800 transition duration-200'
                      >
                          <MdEdit className='text-lg'/>
                      </button>
                      <button 
                          className='p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-200 transition duration-200'
                      >
                          <RiDeleteBinLine className='text-lg'/>
                      </button>
                    </div>
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
              <div>
                <button
                  className='h-10 py-2 px-2 flex items-center justify-center border border-yellow-100 text-yellow-100 text-base font-semibold gap-1 rounded-lg transition-all duration-200 ease-in hover:bg-yellow-100 hover:text-richblack-800'
                >
                  <FaPlus/> Add Lecture
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CourseSection;
