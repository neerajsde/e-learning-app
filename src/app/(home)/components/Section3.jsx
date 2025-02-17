import Link from "next/link"
import CodeTyping from "./CodeTyping"

const Section3 = () => {
    const codeblock = `#include<iostream>
    using namespace std;

    void fun(int num){
        cout << "Printing number: " << num << endl;
    }
    int main(){
        cout << "Hello Learner!"
        return 0;
    }`;
  return (
    <div className="w-full flex flex-col md:flex-row-reverse justify-around items-center gap-8 lg:px-8 mt-10 lg:mt-24">
        <div className="w-full md:w-[300px] lg:w-[500px] flex flex-col justify-between items-between">
            <div className="w-full flex flex-col gap-4">
                <h1 className="text-3xl font-semibold text-richblack-25">Start <span className="gradient-text">coding in seconds</span></h1>
                <p className="text-base text-richblack-200">Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.</p>
            </div>
            <div className="w-full flex justify-start items-center gap-4 mt-5 lg:mt-20">
                <Link href='/' className='yellow-btn'>Continue Lession</Link>
                <Link href='/' className='common-btn'>Learn More</Link>
            </div>
        </div>
        <div className="w-full md:w-[300px] lg:w-[500px] flex justify-center items-center relative">
            <div className="absolute top-0 lg:top-[-80px] left-[-80px] radial-gradiant2 w-full h-full lg:w-[450px] lg:h-[450px] z-20"></div>
            <CodeTyping codeblock={codeblock} speed={2000} color={"text-blue-200"}/>
        </div>
    </div>
  )
}

export default Section3