import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDropzone } from "react-dropzone";
import { IoIosCloudUpload } from "react-icons/io";
import MdLoader from "@/components/spinner/MdLoader";
import apiImgSender from "@/utils/apiImageHandler";
import { toast } from "@/hooks/use-toast";

const Lecture = ({ data, setLectureTabOpen, getSectionData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const { getRootProps, getInputProps } = useDropzone({
      accept: "video/*",
      maxSize: 1024 * 1024 * 1024, // 6MB for images
      onDrop: (acceptedFiles) => {
        setFile(acceptedFiles[0]);
      },
    });
    const [lectureData, setLectureData] = useState({
      title:"",
      hour:"",
      minute:"",
      second:"",
      description:""
    });

    useEffect(() => {
      if (data.isEdit) {
        const newData = data.data;
        const duration = newData.timeDuration ? newData.timeDuration.split(':') : [];
    
        setLectureData({
          title: newData.title || "",
          hour: duration.length >= 3 ? duration.at(-3) : "00",  // Ensure hour is not undefined
          minute: duration.length >= 2 ? duration.at(-2) : "00", // Ensure minute is not undefined
          second: duration.length >= 1 ? duration.at(-1) : "00", // Ensure second is not undefined
          description: newData.description || ""
        });
      }
    }, [data]);    
  
    const handleBrowseClick = () => {
      fileInputRef.current.click();
    };

    function inputHandler(e){
      const {name, value} = e.target;
      if(name === "hour" && (value < 0 || value > 5)){
        alert("Please enter between 0 to 5");
        return;
      }
      if (["minute", "second"].includes(name) && (value < 0 || value > 60)){
        alert("Please enter between 0 to 60");
        return;
      }
      setLectureData((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }

    async function addSubSection() {
      if (!file) {
          alert("No video file selected.");
          return;
      }
  
      setIsLoading(true);
      const formData = new FormData();
      formData.append("sectionId", data.data.id);
      formData.append("video", file);
      formData.append("title", lectureData.title);
      formData.append("description", lectureData.description);
      formData.append("hour", lectureData.hour);
      formData.append("minute", lectureData.minute);
      formData.append("second", lectureData.second);
  
      try {
          const response = await apiImgSender("/course/subsection", "POST", true, formData);
          if(response.success){
            getSectionData();
            setLectureTabOpen({ isActive: false, isEdit: false, data:null });
          }
          toast({
            title: response.success ? "Success" :  "Uh oh! Something went wrong.",
            description: response.message || "Failed to authenticate. Please try again.",
          });
      } catch (error) {
          console.error("Upload error:", error);
          alert(error.message);
      } finally {
          setIsLoading(false);
      }
    }

    async function updateSubSection() {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("subSectionId", data.data.id);
      formData.append("video", file);
      formData.append("title", lectureData.title);
      formData.append("description", lectureData.description);
      formData.append("hour", lectureData.hour);
      formData.append("minute", lectureData.minute);
      formData.append("second", lectureData.second);
      formData.append("oldVideoUrl", data.data.videoURL);
  
      try {
          const response = await apiImgSender("/course/subsection", "PUT", true, formData);
          if(response.success){
            getSectionData();
            setLectureTabOpen({ isActive: false, isEdit: false, data:null });
          }
          toast({
            title: response.success ? "Success" :  "Uh oh! Something went wrong.",
            description: response.message || "Failed to authenticate. Please try again.",
          });
      } catch (error) {
          console.error("Upload error:", error);
          alert(error.message);
      } finally {
          setIsLoading(false);
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if(data.isEdit){
        await updateSubSection();
      }
      else{
        if (!file) {
          alert("Please select a video file");
          return;
        }
        await addSubSection();
      }
    };

  return (
    <div className="w-full h-full flex justify-center overflow-y-scroll scroll-smooth my-8">
        <div className="w-full max-w-[600px] border border-richblack-600 rounded-2xl shadow-md flex flex-col">
        <div className="w-full flex justify-between items-center p-4 bg-richblack-700 rounded-t-2xl">
          <h2 className="text-xl text-richblack-5 font-semibold">
            {data.isEdit ? "Edit Lecture" : "Add Lecture"}
          </h2>
          <IoClose
            onClick={() =>
              setLectureTabOpen({ isActive: false, isEdit: false, data:null })
            }
            className="text-2xl text-richblack-5 cursor-pointer"
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col p-6 gap-4 bg-richblack-800 rounded-b-2xl">
          <div className="w-full flex flex-col gap-1">
            <label className="block text-sm font-medium text-richblack-200">
              {data.isEdit ? "Replace Lecture Video" : "Lecture Video"}<span className="text-red-600">*</span>
            </label>
            <div
              {...getRootProps()}
              onClick={handleBrowseClick}
              className="w-full border-2 border-dashed border-richblack-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-900 text-richblack-300 h-[200px] hover:border-yellow-400"
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <div className="text-yellow-400 text-4xl">
                <IoIosCloudUpload />
              </div>
              <p className="text-sm mt-2">
                Drag and drop an image, or{" "}
                <span className="text-yellow-400 cursor-pointer">Browse</span>
              </p>
              <p className="text-xs text-gray-400">
                Max 1GB Video
              </p>
              <p className="text-xs text-gray-400">• Aspect ratio 16:9</p>
              <p className="text-xs text-gray-400">• Recommended size 1024×576</p>
              {file && <p className="text-green-400 text-sm mt-2">{file.name}</p>}
            </div>
          </div>

          {/* Lecture Title  */}
          <div className="w-full flex flex-col gap-1">
            <label className="block text-sm font-medium text-richblack-200">
              Lecture Title<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={lectureData.title}
              onChange={inputHandler}
              required
              placeholder="Enter lecture title"
              className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Video Playback time  */}
          <div className="w-full flex flex-col gap-1">
            <label className="block text-sm font-medium text-richblack-200">
              Video Playback Time<span className="text-red-600">*</span>
            </label>
            <div className="w-full flex justify-between gap-4 items-center">
              <input
                type="number"
                name="hour"
                value={lectureData.hour}
                onChange={inputHandler}
                required
                placeholder="HH"
                min="0"
                max="5"
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="minute"
                value={lectureData.minute}
                onChange={inputHandler}
                required
                placeholder="MM"
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="second"
                value={lectureData.second}
                onChange={inputHandler}
                required
                placeholder="SS"
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lecture Description  */}
          <div className="w-full flex flex-col gap-1">
            <label className="block text-sm font-medium text-richblack-200">
              Lecture Description<span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={lectureData.description}
              onChange={inputHandler}
              rows={4}
              required
              placeholder="Enter lecture title"
              className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Buttons  */}
          <div className="w-full flex items-center justify-end gap-6 ">
            <button
              onClick={() => setLectureTabOpen({ isActive: false, isEdit: false, data:null })}
              className="w-24 h-10 flex items-center justify-center gap-1 bg-richblack-700 border border-richblack-600 text-richblack-50 rounded-md text-base font-semibold hover:bg-richblack-800 transition-all duration-200 ease-in"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-24 h-10 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in"
            >
              {isLoading ? <MdLoader /> : data.isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Lecture;
