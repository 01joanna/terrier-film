"use client"
import { useAppSelector } from "@/store/hooks"
import { CAROUSEL_ELEMENTS } from "@/config/carousel"
import Carousel from "@/app/components/layout/Carousel"


export default function Home() {
    const { items, activeCarouselIndex } = useAppSelector(
        state => state.projects
    )

    const globalIndex = CAROUSEL_ELEMENTS[activeCarouselIndex]
    const currentProject = items[globalIndex]

    if (!currentProject) {
        return <div className="w-screen h-screen bg-black" />
    }

    return (
      <>
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            <iframe
                key={currentProject.id}
                src={`${currentProject.video}?autoplay=1&muted=1&background=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
            />
        </div>

                    {/* CENTER */}
                    <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Carousel />
            </div>
        </>
    )
}