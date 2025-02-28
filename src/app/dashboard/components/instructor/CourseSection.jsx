"use client";
import React, {useEffect, useState } from "react";
import { MdOndemandVideo } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import apiHandler from "@/utils/apiHandler";
import { toast } from "@/hooks/use-toast";

const CourseSection = ({ data, getSectionData, setLectureTabOpen }) => {
  const [openSections, setOpenSections] = useState([]);
  const [openSubsections, setOpenSubsections] = useState({});
  const [editSection, setEditSection] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const temp = data.map((section) => ({ flag: false, value: section.sectionName }));
      // console.log("Temp: ", temp);
      setEditSection(temp);
    }
  }, [data]);   

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSubsection = (sectionIndex, subIndex) => {
    setOpenSubsections((prev) => ({
      ...prev,
      [`${sectionIndex}-${subIndex}`]: !prev[`${sectionIndex}-${subIndex}`],
    }));
  };

  async function deleteSubSection(subsectionId) {
    const response = await apiHandler( `/course/subsection/${subsectionId}`, "DELETE", true);
    toast({
      title: response.success ? "Success" :  "Uh oh! Something went wrong.",
      description: response.message || "Failed to authenticate. Please try again.",
    });
    if(response.success){
      await getSectionData();
    }
  }

  function editSectionOpen(index) {
    setEditSection((prev) => {
        if (!prev[index]) return prev; // Prevent undefined access
        const temp = [...prev];
        temp[index] = { ...temp[index], flag: !temp[index].flag }; // Toggle flag safely
        return temp;
    });
  }

  async function editSectionHandler(index, sectionId, sectionName) {
    const payload = {
      sectionId: sectionId,
      sectionName: sectionName
    }
    const response = await apiHandler( "/course/section", "PUT", true, payload);
    toast({
      title: response.success ? "Success" :  "Uh oh! Something went wrong.",
      description: response.message || "Failed to authenticate. Please try again.",
    });
    if(response.success){
      setEditSection((prev) => {
        const temp = [...prev];
        temp[index].flag = false;
        return temp;
      });
      await getSectionData();
    }
  }

  async function deleteSectionHandler(sectionId) {
    const response = await apiHandler( `/course/section/${sectionId}`, "DELETE", true);
    toast({
      title: response.success ? "Success" :  "Uh oh! Something went wrong.",
      description: response.message || "Failed to authenticate. Please try again.",
    });
    if(response.success){
      await getSectionData();
    }
  }

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
                {
                  editSection[index]?.flag ? (
                    <input
                      type="text"
                      value={editSection[index].value}
                      onChange={(e) => setEditSection((prev) => {
                        const temp = [...prev];
                        temp[index].value = e.target.value;
                        return temp;
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          editSectionHandler(index, section.id, e.target.value);
                        }
                      }}
                      className="w-full h-8 bg-richblack-800 border border-richblack-500 text-white rounded-lg px-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {section.sectionName}
                    </span>
                  )
                }
              </span>
              <div className="flex items-center">
                <button
                    onClick={() => editSectionOpen(index)} 
                    className='p-1 rounded-md text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800 transition duration-200'
                >
                    <MdEdit className='text-lg'/>
                </button>
                <button 
                    onClick={() => deleteSectionHandler(section.id)}
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
                          onClick={() => setLectureTabOpen({isActive: true, isEdit: true, data:subsection})}
                          className='p-1 rounded-md text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800 transition duration-200'
                      >
                          <MdEdit className='text-lg'/>
                      </button>
                      <button 
                          onClick={() => deleteSubSection(subsection.id)}
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
                  onClick={() => setLectureTabOpen({isActive: true, isEdit: false, data:section})}
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
