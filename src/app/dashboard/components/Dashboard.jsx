"use client";
import MdLoader from '@/components/spinner/MdLoader';
import apiHandler from '@/utils/apiHandler';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import DSHome from './student/DSHome';
import DIHome from './instructor/DIHome';
import DAHome from './Admin/DAHome';
import { AppContext } from '@/context/AppContext';

const Dashboard = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('tab');
    const { userData, setUserData } = useContext(AppContext);
    const [state, setState] = useState({ loading: true, error: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiHandler('/dashboard', "GET", true, null, {cache: 'no-store'});
                if (!response.success) throw new Error('Fetch failed');
                setUserData(response.data.userData);
                setState({ loading: false, error: false });
            } catch (error) {
                setState({ loading: false, error: true });
            }
        };

        fetchData();
    }, [token]);

    if (state.error) {
        redirect('/login');
    }

    if (state.loading) {
        return (
            <div className='w-full h-[90vh] flex justify-center items-center bg-richblack-900'>
                <MdLoader />
            </div>
        );
    }

    if (!userData) {
        redirect('/login');
    }

    const ComponentMap = {
        Student: DSHome,
        Instructor: DIHome,
        Admin: DAHome,
    };

    const UserComponent = ComponentMap[userData.accountType] || (() => <div className='w-full h-[90vh] flex justify-center items-center bg-richblack-900 text-richblack-25 text-xl' >Please Refesh | Try again later</div>);
    return <UserComponent />;
};

export default Dashboard;