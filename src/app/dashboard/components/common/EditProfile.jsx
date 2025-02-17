import { AppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import contryCode from "../../../../../public/data/countrycode.json";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MdLoader from "@/components/spinner/MdLoader";
import apiHandler from "@/utils/apiHandler";
import apiImgSender from "@/utils/apiImageHandler";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const EditProfile = () => {
  const { toast } = useToast();
  const { userData, setUserData } = useContext(AppContext);
  const [isVisiablePassword, setIsVisiablePassword] = useState(false);
  const [isVisiablePassword2, setIsVisiablePassword2] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: userData.name || "",
    profession: userData.profession || "",
    dateOfBirth: userData.dateOfBirth || "",
    gender: userData.gender || "Other",
    contryCode: userData.contryCode || "+91",
    mobileNo: userData.contactNumber || "",
    about: userData.about || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formXData = new FormData();
    formXData.append("img", file);

    try {
      const response = await apiImgSender(
        "/profile/picture",
        "PUT",
        true,
        formXData
      ); // Pass formData directly

      if (response.success) {
        setUserData((prevState) => ({
          ...prevState,
          user_img: response.data.user_img,
        }));
      }

      toast({
        title: response.success ? "Success" : "Uh oh! Something went wrong.",
        description: response.message,
        status: response.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveImage = async () => {
    const response = await apiHandler("/profile/picture", "DELETE", true);
    if (response.success) {
      setUserData((prevState) => ({
        ...prevState,
        user_img: response.data.user_img,
      }));
    }

    toast({
      title: response.success ? "Success" : "Uh oh! Something went wrong.",
      description: response.message,
      status: response.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  function inputHandler(e) {
    const { name, value } = e.target;
    if (name === "mobileNo" && value.length > 10) return;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function inputRadioBtnHandler(val) {
    setFormData((prevState) => ({
      ...prevState,
      gender: val,
    }));
  }

  const backBtn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    router.push(`?${params.toString()}`);
  };

  const saveHandler = async () => {
    try {
      setLoading(true);
      const payload = {
        username: formData.name,
        dateOfBirth: formData.dateOfBirth,
        profession: formData.profession,
        about: formData.about,
        countryCode: formData.contryCode,
        contactNumber: formData.mobileNo,
        gender: formData.gender,
      };
      const response = await apiHandler("/profile", "PUT", true, {
        ...payload,
      });
      toast({
        title: response.success ? "Success" : "Uh oh! Something went wrong.",
        description: response.message,
      });
      // update user data
      if (response.success) {
        setUserData(response.data.updatedData);
      }

      if (formData.currentPassword && formData.newPassword) {
        const changePassword = await apiHandler(
          "/user/password/change",
          "POST",
          true,
          {
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }
        );
        toast({
          title: changePassword.success
            ? "Success"
            : "Uh oh! Something went wrong.",
          description: changePassword.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountHandler = async () => {
    try {
      const response = await apiHandler("/profile", "DELETE", true);
      toast({
        title: response.success ? "Success" : "Uh oh! Something went wrong.",
        description: response.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-8 text-white">
      <div className="w-full flex items-center justify-start gap-2 text-richblack-25">
        <IoMdArrowRoundBack
          onClick={backBtn}
          className="text-2xl cursor-pointer"
        />
        <h2 className="text-xl lg:text-2xl font-semibold">Edit Profile</h2>
      </div>

      <div className="w-full flex items-center flex-col gap-4">
        <div className="w-full lg:w-10/12 flex flex-col border border-richblack-600 bg-richblack-800 rounded-md p-2 md:p-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            {userData?.user_img ? (
              <Image
                src={userData?.user_img}
                alt="user"
                width={72}
                height={72}
                className=" w-14 h-14 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] rounded-full object-cover"
              />
            ) : (
              <FaCircleUser className="text-7xl text-richblack-500" />
            )}
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="text-base text-richblack-200">
                Change Profile Picture
              </span>
              <div className="flex items-center gap-2 md:gap-4">
                <label
                  htmlFor="fileInput"
                  className="py-1 px-3 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-100 text-richblack-900 rounded-md text-base hover:bg-yellow-300 transition-all duration-200 ease-in cursor-pointer"
                >
                  Change
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={handleRemoveImage}
                  className="py-1 px-3 flex items-center justify-center gap-1 bg-richblack-700 border border-richblack-600 text-richblack-100 rounded-md text-base hover:bg-richblack-700 transition-all duration-200 ease-in"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-10/12 flex flex-col border border-richblack-600 bg-richblack-800 rounded-md p-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Profile Information</h2>
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Name */}
            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-richblack-200"
              >
                Display Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="name"
                value={formData.name}
                onChange={inputHandler}
                required
                placeholder="Johe Doe"
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Name entered above will be used for all issued certificates.
              </p>
            </div>

            {/* Profession */}
            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="profession"
                className="text-sm font-medium text-richblack-100"
              >
                Profession
              </label>
              <Select
                defaultValue={formData.profession}
                onValueChange={(value) =>
                  setFormData({ ...formData, profession: value })
                }
              >
                <SelectTrigger className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <SelectValue placeholder="Select a profession" />
                </SelectTrigger>
                <SelectContent className="bg-richblack-800 text-white rounded-lg shadow-lg">
                  <SelectGroup>
                    <SelectLabel className="px-4 py-2 text-richblack-300">
                      Select Profession
                    </SelectLabel>
                    <SelectItem
                      value="developer"
                      className="px-4 py-2 hover:bg-richblack-700 cursor-pointer rounded-lg"
                    >
                      Developer
                    </SelectItem>
                    <SelectItem
                      value="designer"
                      className="px-4 py-2 hover:bg-richblack-700 cursor-pointer rounded-lg"
                    >
                      Designer
                    </SelectItem>
                    <SelectItem
                      value="manager"
                      className="px-4 py-2 hover:bg-richblack-700 cursor-pointer rounded-lg"
                    >
                      Manager
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-richblack-200"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={inputHandler}
                required
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div className="w-full flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Gender<span className="text-red-600">*</span>
              </label>

              <div className="w-full flex justify-around items-center p-3 bg-gray-800 border border-gray-600 text-white rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="hidden peer"
                    checked={formData.gender === "Male"}
                    onChange={() => inputRadioBtnHandler("Male")}
                  />
                  <div className="w-5 h-5 border-2 border-yellow-100 rounded-full flex justify-center items-center peer-checked:bg-yellow-100 transition">
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-0 peer-checked:opacity-100 transition"></div>
                  </div>
                  <span>Male</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="hidden peer"
                    checked={formData.gender === "Female"}
                    onChange={() => inputRadioBtnHandler("Female")}
                  />
                  <div className="w-5 h-5 border-2 border-yellow-100 rounded-full flex justify-center items-center peer-checked:bg-yellow-100 transition">
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-0 peer-checked:opacity-100 transition"></div>
                  </div>
                  <span>Female</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    className="hidden peer"
                    checked={formData.gender === "Other"}
                    onChange={() => inputRadioBtnHandler("Other")}
                  />
                  <div className="w-5 h-5 border-2 border-yellow-100 rounded-full flex justify-center items-center peer-checked:bg-yellow-100 transition">
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-0 peer-checked:opacity-100 transition"></div>
                  </div>
                  <span>Other</span>
                </label>
              </div>
            </div>

            {/* Phone Number */}
            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-richblack-200"
              >
                Phone Number<span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={formData.contryCode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, contryCode: value })
                  }
                >
                  <SelectTrigger className="w-[80px] h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="bg-richblack-800 text-white rounded-lg shadow-lg">
                    <SelectGroup>
                      {contryCode.map((item) => (
                        <SelectItem
                          value={item.code}
                          className="px-4 py-2 hover:bg-richblack-700 cursor-pointer rounded-lg"
                        >
                          {item.code}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input
                  type="tel"
                  id="phone"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={inputHandler}
                  required
                  className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="12345 67890"
                />
              </div>
            </div>

            {/* About */}
            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-richblack-200"
              >
                About
              </label>
              <input
                id="about"
                name="about"
                value={formData.about}
                onChange={inputHandler}
                placeholder="Enter Bio Details"
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="w-full lg:w-10/12 flex flex-col border border-richblack-600 bg-richblack-800 rounded-md p-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Password</h2>
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full relative flex flex-col space-y-2">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-richblack-200"
              >
                Current Password<span className="text-red-600">*</span>
              </label>
              <input
                type={isVisiablePassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={inputHandler}
                placeholder="*********"
                required
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                onClick={() => setIsVisiablePassword(!isVisiablePassword)}
                className="absolute bottom-3 right-3 text-2xl cursor-pointer"
              >
                {isVisiablePassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </span>
            </div>
            <div className="w-full relative flex flex-col space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-richblack-200"
              >
                New Password<span className="text-red-600">*</span>
              </label>
              <input
                type={isVisiablePassword2 ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={inputHandler}
                placeholder="*********"
                required
                className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                onClick={() => setIsVisiablePassword2(!isVisiablePassword2)}
                className="absolute bottom-3 right-3 text-2xl cursor-pointer"
              >
                {isVisiablePassword2 ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </span>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-10/12 flex justify-start items-start border border-red-600 border-opacity-30 bg-red-800 bg-opacity-30 rounded-md p-2 md:p-4 gap-2 md:gap-4">
          <div className="w-12 h-12 rounded-full flex justify-center items-center bg-red-500 bg-opacity-30">
            <RiDeleteBin5Line className="text-2xl text-red-500" />
          </div>
          <div className="w-full flex flex-col items-start gap-1">
            <span className="text-base md:text-lg">Delete Account</span>
            <span className="text-sm md:text-base text-red-300">
              Would you like to delete account? <br />
              This account contains Paid Courses. Deleting your account will
              remove all the contain associated with it.
            </span>
            <button
              onClick={deleteAccountHandler}
              className="border-none outline-none text-base italic text-red-600"
            >
              I want to delete my account.
            </button>
          </div>
        </div>

        <div className="w-full lg:w-10/12 flex items-center justify-end gap-6 pt-4 pb-14">
          <button
            onClick={backBtn}
            className="w-24 h-10 flex items-center justify-center gap-1 bg-richblack-700 border border-richblack-600 text-richblack-50 rounded-md text-base font-semibold hover:bg-richblack-800 transition-all duration-200 ease-in"
          >
            Cancel
          </button>

          <button
            onClick={saveHandler}
            className="w-24 h-10 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in"
          >
            {isLoading ? <MdLoader /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
