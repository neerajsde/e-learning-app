import Card from "@/components/course/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const RelatedCourse = ({ related, heading, categoryUrl }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl font-medium text-richblack-25">{heading}</h2>
      <div className="w-full pr-8">
        <Carousel
          opts={{
            align: "start",
            slidesToShow: 3, // Set the number of visible slides to 3
          }}
          className="w-full"
        >
          <CarouselContent>
            {related &&
              related.map((item, index) => (
                <CarouselItem
                  key={`KJ_H76PG${item.id}${index}`}
                  className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                  {" "}
                  {/* Each item takes up 1/3 of the width */}
                  <Card data={item} categoryUrl={categoryUrl} />
                </CarouselItem>
              ))}
          </CarouselContent>
          {/* <CarouselPrevious /> */}
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default RelatedCourse;
