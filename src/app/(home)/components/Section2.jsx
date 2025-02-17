import Link from "next/link"
import CodeTyping from "./CodeTyping"

const Section2 = () => {
    const codeblock = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Example</title>
    </head>
    <body>
        <h1>
            <a href="/">Counting</a>
        </h1>
        <img src="./banner.jpg"/>
    </body>
    </html>`;
  return (
    <div className="w-full flex flex-col md:flex-row justify-around items-center gap-8 lg:px-8 mt-24">
        <div className="w-full md:w-[300px] lg:w-[500px] flex flex-col justify-between items-between">
            <div className="w-full flex flex-col gap-4">
                <h1 className="text-xl md:text-xl lg:text-3xl font-semibold text-richblack-25">Unlock your <span className="gradient-text">coding potential</span> <br/>with our online courses.</h1>
                <p className="text-sm md:text-base text-richblack-200">Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.</p>
            </div>
            <div className="w-full flex justify-start items-center gap-4 mt-5 lg:mt-20">
                <Link href='/' className='yellow-btn'>Try it Yourself</Link>
                <Link href='/' className='common-btn'>Learn more</Link>
            </div>
        </div>
        <div className="w-full md:w-[300px] lg:w-[500px] flex justify-center items-center relative">
            <div className="absolute top-0 lg:top-[-80px] left-[-80px] radial-gradiant w-full h-full lg:w-[450px] lg:h-[450px] z-20"></div>
            <CodeTyping codeblock={codeblock} speed={1000} color={"text-pink-300"}/>
        </div>
    </div>
  )
}

export default Section2