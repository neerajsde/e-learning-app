import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaGoogle, FaInstagram, FaTwitter } from "react-icons/fa";
import { FooterLink2 } from "../../../public/data/footer-links";

const Footer = () => {
  const Resourses = ['Articles', 'Blog', 'Chart Sheet', 'Code challenges', 'Docs', 'Projects', 'Videos', 'Workspaces'];
  const Plans = ['Paid memberships', 'For students', 'Business solutions '];
  const Community = ['Forums', 'Chapters', 'Events'];

  return (
    <div className="w-full font-inter bg-richblack-800 p-4 md:p-8 lg:px-20 lg:py-10">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 pb-4 gap-y-4">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 border-b lg:border-b-transparent lg:border-r border-richblack-700 gap-y-8">
          <div className="w-full col-span-2 md:col-span-1 flex flex-col text-sm lg:text-base gap-1 lg:gap-2">
            <Link href="/">
              <Image
                src={"/assets/Logo/Logo-Full-Light.png"}
                alt="LOGO"
                width={150}
                height={100}
                layout="intrinsic"
              />
            </Link>
            <h4 className="text-sm md:text-base text-richblack-100">Company</h4>
            <Link
              href="/about"
              className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
            >
              About
            </Link>
            <Link
              href="/career"
              className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
            >
              Career
            </Link>
            <Link
              href="/affiliates"
              className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
            >
              Affiliates
            </Link>
            <div className="flex items-center text-xl gap-2">
              <Link href='/google'>
                <FaGoogle className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in" />
              </Link>
              <Link href='/facebook'>
                <FaFacebook className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in" />
              </Link>
              <Link href='/instagram'>
                <FaInstagram className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in" />
              </Link>
              <Link href="/twitter">
                <FaTwitter className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in" />
              </Link>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-1 lg:gap-2">
              <h3 className="text-base lg:text-lg text-richblack-100 font-semibold">Resourses</h3>
              {
                Resourses.map((item) => (
                  <Link
                    href={`/${item.toLowerCase().replace(' ','-')}`}
                    className="text-sm lg:text-base text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
                  >
                    {item}
                  </Link>
                ))
              }
            </div>
            <div className="w-full flex flex-col gap-1 lg:gap-2 pb-8 lg:pb-0">
              <h3 className="text-base lg:text-lg text-richblack-100 font-semibold">Support</h3>
                <Link
                  href={`/help-center`}
                  className="text-sm lg:text-base text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
                >
                  Help Center
                </Link>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-1 lg:gap-2">
              <h3 className="text-base lg:text-lg text-richblack-100 font-semibold">Plans</h3>
              {
                Plans.map((item) => (
                  <Link
                    href={`/${item.toLowerCase().replace(' ','-')}`}
                    className="text-sm lg:text-base text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
                  >
                    {item}
                  </Link>
                ))
              }
            </div>
            <div className="w-full flex flex-col gap-1 lg:gap-2">
              <h3 className="text-base lg:text-lg text-richblack-100 font-semibold">Community</h3>
              {
                Community.map((item) => (
                  <Link
                    href={`/${item.toLowerCase().replace(' ','-')}`}
                    className="text-sm lg:text-base text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
                  >
                    {item}
                  </Link>
                ))
              }
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-y-8">
          {
            FooterLink2.map((menu, idx) => (
              <div key={idx} className={`w-full flex flex-col gap-1 lg:gap-2 ${idx !== 2 ? 'lg:pl-4': 'col-span-2 md:col-span-1'}`}>
                <h3 className="text-base md:text-lg text-richblack-100 font-semibold">{menu.title}</h3>
                {
                  menu.links.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="text-sm md:text-base text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
                    >
                      {item.title}
                    </Link>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>

      <div className="w-full h-[1px] bg-richblack-700"></div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-y-2 pt-4">
        <div className="flex items-center text-sm md:text-base gap-2">
          <Link
            href="/privacy-policy"
            className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
          >
            Privacy Policy
          </Link>
          <div className="w-[1px] h-5 bg-richblack-700"></div>
          <Link
            href="/cookie-policy"
            className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
          >
            Cookie Policy
          </Link>
          <div className="w-[1px] h-5 bg-richblack-700"></div>
          <Link
            href="/terms"
            className="text-richblack-500 cursor-pointer hover:text-richblack-200 transition-all duration-200 ease-in"
          >
            Terms
          </Link>
        </div>

        <p className=" text-xs max-sm:text-center md:text-base text-richblack-500">
          Made with <span className="text-red-600">♥</span> <a href="https://www.neerajprajapati.in/" target="_blank">Neeraj Prajapati</a> © 2025 Studynotion
        </p>
      </div>
    </div>
  );
};

export default Footer;
