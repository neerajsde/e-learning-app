import { AppContext } from "@/context/AppContext";
import apiHandler from "@/utils/apiHandler";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";

const SideMenu = ({ menuItems }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {setIsLoggedIn, setUserData} = useContext(AppContext);

  const logOutHandler = async () => {
    const res = await apiHandler("/user/logout", "GET", true);
    if (res.success) {
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("StudyNotion");
      redirect('/login');
    } 
  };  

  const handleClick = (link) => {
    if(link === "logout"){
        logOutHandler();
        return;
    }
    const params = new URLSearchParams(searchParams);
    params.set("tab", link);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full pt-5 flex flex-col bg-richblack-900">
      {menuItems.map((section, index) => (
        <div key={index} className="w-full flex flex-col">
          {section.map((menuItem) => (
            <button
              key={menuItem.id}
              onClick={() => handleClick(menuItem.link)}
              className={`w-full py-2 px-8 flex items-center justify-start gap-2 text-base border-l-2 border-transparent ${menuItem.link === searchParams.get("tab") ? 'bg-[#e7be0922] border-yellow-100 text-yellow-200' : 'text-richblack-200 transition-all duration-200 ease-in hover:text-yellow-200'}`}
            >
              {menuItem.icon && <menuItem.icon className="text-lg" />}
              <span>{menuItem.name}</span>
            </button>
          ))}
          <div className="w-full py-3 flex justify-center">
            <div className="w-10/12 h-[1px] bg-richblack-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
