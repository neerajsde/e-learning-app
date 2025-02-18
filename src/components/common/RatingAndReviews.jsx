import { FaCircleUser } from "react-icons/fa6";
import timeAgo from '@/utils/TimeCalulate';
import { FaStar } from "react-icons/fa";
import apiHandler from '@/utils/apiHandler';
import Image from "next/image";

const RatingAndReviews = async () => {
    let AllReviews = null;
    
    const response = await apiHandler("/rating/all", "GET", false, null, { cache: 'no-store' });
    if(response.success){
        AllReviews = response.data.reviews
    }

    if(!AllReviews){
        return (
            <div></div>
        )
    }

    return (
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {
                AllReviews.map((item, index) => (
                    <div key={index} className='w-full min-h-[200px] bg-richblack-800 rounded-md p-4 gap-4 overflow-clip'>
                        <div className='w-full flex justify-start items-center gap-2'>
                            {
                                item.userImg ? 
                                (
                                    <Image src={item.userImg} alt="user" width={40} height={40} className="rounded-full object-cover" />
                                )
                                :
                                (
                                    <FaCircleUser className='text-richblack-200 text-4xl'/>
                                )
                            }
                            <div className='flex flex-col gap-0'>
                                <span className='text-base text-richblack-200 font-semibold'>{item.userName}</span>
                                <span className='text-sm text-richblack-500'>{timeAgo(item.date)}</span>
                            </div>
                        </div>
                        <p className="text-base text-richblack-300 text-clip">
                            {item.review.length > 130 ? `${item.review.slice(0, 123)}...` : item.review}
                        </p>
                        <div className='w-full flex items-center gap-2'>
                            <span className='text-lg font-semibold text-yellow-300'>{item.rating}</span>
                            <div className="flex items-center gap-0">
                                {[1, 2, 3, 4, 5].map((star, index) => (
                                    <FaStar
                                        key={`star-${index}`} // Ensure unique key
                                        className={`${star <= item.rating ? "text-yellow-200" : "text-richblack-500"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default RatingAndReviews;
