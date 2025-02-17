"use client"
import React from 'react'
import { TypeAnimation } from 'react-type-animation'

const CodeTyping = ({codeblock, speed, color}) => {

    return (
        <div className="w-full flex items-start bg-[#0505055f] backdrop-blur-sm border border-richblack-400 p-4 rounded-lg shadow-lg z-50">
            {/* Line Numbers */}
            <div className="text-gray-500 pr-4 font-mono text-right select-none text-sm lg:text-base">
                {Array.from({ length: codeblock.split('\n').length }, (_, i) => (
                    <p key={i}>{i + 1}</p>
                ))}
            </div>
            
            {/* Animated Code Block */}
            <div className={`w-full text-sm lg:text-base font-mono ${color}`}>
                <TypeAnimation
                    sequence={[codeblock, speed, ""]}
                    repeat={Infinity}
                    speed={50}
                    omitDeletionAnimation={true}
                    style={{ display: 'block', whiteSpace: 'pre-line' }}
                    className="whitespace-pre-wrap"
                />
            </div>
        </div>
    );
}

export default CodeTyping;