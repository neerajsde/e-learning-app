import MdLoader from "@/components/spinner/MdLoader";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloudUpload } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "../common/TextEditor";
import apiHandler from "@/utils/apiHandler";
import apiImgSender from "@/utils/apiImageHandler";
import { toast } from "@/hooks/use-toast";


const CourseInfo = ({setSteps, setCurrStep, setCourseId}) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const [courseCategory, setCourseCategory] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    maxSize: 6 * 1024 * 1024, // 6MB for images
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: "",
  });

  const getCategoryData = async () => {
    const response = await apiHandler('/course/categories', "GET");
    if(response.success){
      setCourseCategory(response?.data?.result);
    }
  }
  useEffect(() => {
    getCategoryData();
  },[])

  function inputHandler(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const submitHandler = async(e) => {
    e.preventDefault();
    if(!content){
      toast({
        title: "Fill required fields",
        description: "Failed to authenticate. Please try again.",
      });
      return;
    }
    try{
      setIsLoading(true);
      const payload = {
        courseName: formData.title,
        courseDescription: formData.description,
        whatYoutWillLearn: content,
        price: formData.price,
        category: formData.category,
        tags: formData.tags
      }

      const response = await apiHandler("/course/create", "POST", true, payload);
      if(response.success){
        const formXdata = new FormData();
        formXdata.append("img", file);
        const addThumbnail = await apiImgSender(`/course/update/thumbnail?id=${response.data.courseId}`, "PUT", true, formXdata);
        if(!addThumbnail.success){
          toast({
            title: "Uh oh! Something went wrong.",
            description: addThumbnail.message || "Failed to upload thubnail. Please try again.",
          });
        }
        else{
          setCourseId(response.data.courseId);
          setSteps((prevState) => 
            prevState.map((step, index) => 
                index === 0 ? { ...step, isFilled: true } : step
            )
          ); 
          setCurrStep(2);       
        }
      }
      toast({
        title: response.success ? "Success" :  "Uh oh! Something went wrong.",
        description: response.message || "Failed to authenticate. Please try again.",
      });
    } catch(err){
      toast({
        title: "Uh oh! Something went wrong.",
        description: err.message || "Failed to authenticate. Please try again.",
      });
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submitHandler} className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-1">
        <label className="block text-sm font-medium text-richblack-200">
          Course Title<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={inputHandler}
          required
          placeholder="Enter course title"
          className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <label className="block text-sm font-medium text-richblack-200">
          Course Description<span className="text-red-600">*</span>
        </label>
        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={inputHandler}
          required
          rows={5}
          placeholder="Enter course description"
          className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="w-full flex gap-2">
        <div className="w-full flex flex-col gap-1">
          <label className="block text-sm font-medium text-richblack-200">
            Price<span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={inputHandler}
            required
            placeholder="Enter course title"
            className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="block text-sm font-medium text-richblack-200">
            Category<span className="text-red-600">*</span>
          </label>
          <Select
            defaultValue={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <SelectValue placeholder="Select course category" />
            </SelectTrigger>
            <SelectContent className="bg-richblack-800 text-white rounded-lg shadow-lg">
              <SelectGroup>
                <SelectLabel className="px-4 py-2 text-richblack-300">
                  Select Category
                </SelectLabel>
                {
                  courseCategory && courseCategory.map((item, index) => (
                    <SelectItem
                      key={`_876gfGYTYU!${item.id}${index}`}
                      value={item.name}
                      className="px-4 py-2 hover:bg-richblack-700 cursor-pointer rounded-lg"
                    >
                      {item.name}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        <label className="block text-sm font-medium text-richblack-200">
          Tags<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={inputHandler}
          required
          placeholder="#tag1 #tag2 #tag3"
          className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <label className="block text-sm font-medium text-richblack-200">
          Course Thumbnail<span className="text-red-600">*</span>
        </label>
        <div
          {...getRootProps()}
          onClick={handleBrowseClick}
          className="w-full border-2 border-dashed border-richblack-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-900 text-richblack-300 h-[200px] hover:border-yellow-400"
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <div className="text-yellow-400 text-4xl"><IoIosCloudUpload/></div>
          <p className="text-sm mt-2">
            Drag and drop an image, or{" "}
            <span
              className="text-yellow-400 cursor-pointer"
            >
              Browse
            </span>
          </p>
          <p className="text-xs text-gray-400">
            Max 6MB each (12MB for videos)
          </p>
          <p className="text-xs text-gray-400">• Aspect ratio 16:9</p>
          <p className="text-xs text-gray-400">• Recommended size 1024×576</p>
          {file && <p className="text-green-400 text-sm mt-2">{file.name}</p>}
        </div>
      </div>

      {/* Course Benefits */}
      <div  className="w-full flex flex-col gap-1">
        <label className="block text-sm font-medium text-richblack-200">
          Benefits of the course<span className="text-red-600">*</span>
        </label>
        <TextEditor setContent={setContent}/>
      </div>

      <div className="w-full flex items-center justify-end gap-4 ">
        <button 
          type="submit"
          className="w-24 h-10 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in"
        >
          {isLoading ? <MdLoader /> : "Next"}
        </button>
      </div>
    </form>
  );
};

export default CourseInfo;
