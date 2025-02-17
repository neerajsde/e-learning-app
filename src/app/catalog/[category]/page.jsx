import apiHandler from "@/utils/apiHandler";
import CategoryInfo from "./components/CategoryInfo";
import SuggestCourse from "./components/SuggestCourse";
import RelatedCourse from "./components/RelatedCourse";

const category = async ({ params }) => {
  const {category} = await params;
  // get page data
  const response = await apiHandler(`/course/category/${category.trim()}`);

  if (!response.success) {
    return <div className="w-full h-[90vh] flex justify-center items-center bg-richblack-900 text-richblack-100 text-2xl">Some thing went wrong</div>;
  }
  const data = response.data;
  return (
    <div className="w-full flex flex-col font-inter">
      <CategoryInfo data={data.categoryDetails} />

      <div className="w-full flex flex-col p-4 md:p-6 lg:p-10 gap-10 bg-richblack-900">

        {/* Courses to get you started */}
        <SuggestCourse
          popular={data.popular}
          newCourse={data.new}
          others={data.other}
          heading='Courses to get you started'
          isTab={true}
        />

        <RelatedCourse
          related={data.related}
          heading='Frequently Bought Together'
          categoryUrl={data.categoryDetails.slugUrl}
        />

      </div>
    </div>
  );
};

export default category;
