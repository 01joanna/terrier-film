"use client"

import { useRef, useState } from "react"

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks"

import { setActiveCarouselIndex } from "@/store/slices/projectsSlice"

export default function MobileHome() {
    const dispatch = useAppDispatch()

    const { items, activeCarouselIndex } =
        useAppSelector((state) => state.projects)

    const featured = items.filter(
        (project) => project.featured
    )

    const currentProject =
        featured[activeCarouselIndex]

    const [transitioning, setTransitioning] =
        useState(false)

    const touchStartY =
        useRef<number | null>(null)

    const nextIndex =
        featured.length > 0
            ? (activeCarouselIndex + 1) %
            featured.length
            : 0

    const previousIndex =
        featured.length > 0
            ? (activeCarouselIndex - 1 + featured.length) %
            featured.length
            : 0

            const nextProject = featured[nextIndex]
            const previousProject = featured[previousIndex]

    const changeProject = (index: number) => {
        if (
            index === activeCarouselIndex ||
            transitioning
        ) {
            return
        }

        setTransitioning(true)

        setTimeout(() => {
            dispatch(setActiveCarouselIndex(index))

            setTimeout(() => {
                setTransitioning(false)
            }, 50)
        }, 700)
    }

    const handleTouchStart = (
        event: React.TouchEvent
    ) => {
        touchStartY.current =
            event.touches[0].clientY
    }

    const handleTouchEnd = (
        event: React.TouchEvent
    ) => {
        if (
            touchStartY.current === null ||
            transitioning ||
            featured.length <= 1
        ) {
            return
        }

        const endY =
            event.changedTouches[0].clientY

        const difference =
            touchStartY.current - endY

        touchStartY.current = null

        if (Math.abs(difference) < 40) {
            return
        }

        if (difference > 0) {
            changeProject(nextIndex)
        } else {
            changeProject(previousIndex)
        }
    }

    const handleWheel = (
        event: React.WheelEvent
    ) => {
        if (
            transitioning ||
            featured.length <= 1
        ) {
            return
        }

        if (Math.abs(event.deltaY) < 20) {
            return
        }

        if (event.deltaY > 0) {
            changeProject(nextIndex)
        } else {
            changeProject(previousIndex)
        }
    }

    if (!currentProject) {
        return null
    }

    return (
        <main
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className="
                relative
                w-screen
                h-screen
                overflow-hidden
                bg-black
                touch-none
            "
        >
            <div className="absolute inset-0">
                <iframe
                    key={currentProject.id}
                    src={`${currentProject.video}?autoplay=1&muted=1&background=1`}
                    className={`
                        absolute
                        top-1/2
                        left-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-[177.78vh]
                        h-screen
                        border-0
                        transition-opacity
                        duration-700
                        ease-[cubic-bezier(.22,1,.36,1)]
                        ${transitioning
                            ? "opacity-0"
                            : "opacity-100"
                        }
                    `}
                    allow="autoplay; fullscreen"
                />

                {nextProject && (
                    <iframe
                        key={`next-${nextProject.id}`}
                        src={`${nextProject.video}?autoplay=1&muted=1&background=1`}
                        className="
                            absolute
                            top-1/2
                            left-1/2
                            -translate-x-1/2
                            -translate-y-1/2
                            w-[177.78vh]
                            h-screen
                            border-0
                            opacity-0
                            pointer-events-none
                        "
                        allow="autoplay; fullscreen"
                    />
                )}
            </div>

            <div
                className="
                    absolute
                    left-5
                    right-5
                    bottom-8
                    z-10
                    font-plex
                    uppercase
                "
            >
                <div className="flex flex-col gap-6">
                    {featured.map(
                        (project, index) => {
                            const isActive =
                                index ===
                                activeCarouselIndex

                            return (
                                <button
                                    key={project.id}
                                    onClick={() =>
                                        changeProject(index)
                                    }
                                    className="
                                        w-full
                                        text-left
                                    "
                                >
                                    <div
                                        className={`
                                            flex
                                            items-start
                                            transition-opacity
                                            duration-500
                                            ${isActive
                                                ? "opacity-100"
                                                : "opacity-35"
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                w-4
                                                shrink-0
                                                flex
                                                justify-start
                                                pt-[5px]
                                            "
                                        >
                                            <span
                                                className={`
                                                    block
                                                    w-1
                                                    h-1
                                                    rounded-full
                                                    bg-white
                                                    transition-opacity
                                                    duration-300
                                                    ${isActive
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    }
                                                `}
                                            />
                                        </div>

                                        <div className="flex flex-col uppercase">
                                            <span
                                                className="
                                                    text-sm
                                                    leading-none
                                                    font-light
                                                "
                                            >
                                                {project.titulo}
                                            </span>

                                            {(project.artista ||
                                                project.año) && (
                                                    <div
                                                        className="
                                                        flex
                                                        gap-2
                                                        mt-1
                                                        text-[10px]
                                                        leading-none
                                                        font-light
                                                        opacity-70
                                                    "
                                                    >
                                                        {project.artista && (
                                                            <span>
                                                                {project.artista}
                                                            </span>
                                                        )}

                                                        {project.artista &&
                                                            project.año && (
                                                                <span>
                                                                    ·
                                                                </span>
                                                            )}

                                                        {project.año && (
                                                            <span>
                                                                {project.año}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </button>
                            )
                        }
                    )}
                </div>
            </div>
        </main>
    )
}