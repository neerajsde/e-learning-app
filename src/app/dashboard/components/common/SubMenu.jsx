import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import { FaAnglesRight } from "react-icons/fa6";

const SubMenu = ({isActiveSideMenu, setIsActiveSideMenu}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Start with the "Home" link
            const pathItems = window.location.pathname.split('/').filter(Boolean);
            const pathLinks = [
                { name: 'Home', link: '/' }, // Add Home as the first item
                ...pathItems.map((item, index) => ({
                    name: item,
                    link: `/${pathItems.slice(0, index + 1).join('/')}`,
                })),
            ];

            // Handle the "tab" query parameter
            const tab = searchParams.get("tab");
            if (tab) {
                const tabItem = {
                    name: tab.trim().replaceAll('-', ' '),
                    link: `${window.location.pathname}?tab=${tab}`,
                };
                setItems([...pathLinks, tabItem]);
            } else {
                setItems(pathLinks);
            }
        }
    }, [router.pathname, searchParams]);

    return (
        <div className='w-full bg-richblack-900 p-2  md:p-4 flex items-center justify-start gap-1 md:gap-2 border-b border-richblack-700'>
            {setIsActiveSideMenu && <button onClick={() => setIsActiveSideMenu(!isActiveSideMenu)} className='text-richblack-200 border border-richblack-300 rounded-md px-2 py-1 transition-all duration-200 ease-in hover:bg-richblack-800 cursor-pointer'>
                <HiMenuAlt2 className='text-xl'/>
            </button>}
            {items.map((tab, index) => (
                <Link
                    key={`submenu-${index}`}
                    href={tab.link}
                    className='text-sm md:text-base text-richblack-300 flex gap-1 md:gap-2 items-center'
                    aria-label={`Navigate to ${tab.name}`}
                >
                    <span className={`capitalize font-medium ${items.length - 1 === index && 'text-yellow-200'}`}>{tab.name}</span>
                    <span className={`${items.length - 1 === index ? 'hidden' : 'visible'}`}><FaAnglesRight/></span>
                </Link>
            ))}
        </div>
    );
};

export default SubMenu;