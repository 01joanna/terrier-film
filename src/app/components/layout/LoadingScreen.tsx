"use client"

import Image from "next/image"

type LoadingScreenProps = {
    progress: number
    exiting: boolean
}

export default function LoadingScreen({
    progress,
    exiting,
}: LoadingScreenProps) {
    return (
        <div
            className={`
                fixed
                inset-0
                z-[10000]
                bg-black
                flex
                flex-col
                items-center
                justify-center
                text-white
                transition-all
                duration-1000
                ease-[cubic-bezier(.22,1,.36,1)]
                ${
                    exiting
                        ? "opacity-0 scale-[1.03] blur-sm"
                        : "opacity-100 scale-100"
                }
            `}
        >
            <div
                className={`
                    transition-all
                    duration-1000
                    ease-[cubic-bezier(.22,1,.36,1)]
                    ${
                        exiting
                            ? "opacity-0 translate-y-3"
                            : "opacity-100 translate-y-0"
                    }
                `}
            >
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={400}
                    height={400}
                    priority
                    className="
                        w-[140px]
                        md:w-[220px]
                        h-auto
                    "
                />
            </div>

            <div
                className={`
                    mt-6
                    text-[10px]
                    md:text-xs
                    tracking-[0.3em]
                    font-roboto
                    font-light
                    opacity-70
                    transition-all
                    duration-700
                    ${
                        exiting
                            ? "opacity-0 translate-y-2"
                            : "opacity-70"
                    }
                `}
            >
                {progress}%
            </div>
        </div>
    )
}