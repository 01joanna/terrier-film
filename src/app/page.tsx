
"use client"

import { useAppSelector } from "@/store/hooks"
import Carousel from "@/app/components/layout/Carousel"
import MobileHome from "@/app/components/layout/MobileHome"

export default function Home() {
    const {
        items,
        activeCarouselIndex,
    } = useAppSelector(
        state => state.projects
    )

    const featured = items.filter(
        project => project.featured
    )

    const currentProject =
        featured[activeCarouselIndex]

    if (!currentProject) {
        return (
            <div className="w-screen h-screen bg-black" />
        )
    }

    return (
        <>
            {/* DESKTOP */}

            <div className="hidden md:block">

                <div className="
                    relative
                    w-screen
                    h-screen
                    overflow-hidden
                    bg-black
                ">
                    <iframe
                        key={currentProject.id}
                        src={`${currentProject.video}?autoplay=1&muted=1&background=1`}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                    />
                </div>

                <div className="
                    pointer-events-auto
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                ">
                    <Carousel />
                </div>

            </div>


            {/* MOBILE */}

            <div className="md:hidden">
                <MobileHome />
            </div>
        </>
    )
}
