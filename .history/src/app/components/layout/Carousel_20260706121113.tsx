"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveCarouselIndex } from "@/store/slices/projectsSlice"
import { useRouter } from "next/navigation"

export default function Carousel() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const { items, activeCarouselIndex } = useAppSelector(
        state => state.projects
    )
        console.log("hola")
    const featured = items.filter(project => project.featured)

    const center = (featured.length - 1) / 2
    const radiusX = 220
    const radiusY = 250

    return (
        <div className="relative w-[300px] h-[500px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg width="400" height="420" viewBox="0 0 320 520">
                    <path
                        d="M 200 40 A 220 250 0 0 0 200 480"
                        fill="none"
                        stroke="white"
                    />
                </svg>
            </div>

            {featured.map((project, index) => {
                const offsetIndex = index - center
                const angleStep = Math.PI / (featured.length - 1)
                const angle = offsetIndex * angleStep

                const x = -Math.cos(angle) * radiusX
                const y = Math.sin(angle) * radiusY

                const isActive = activeCarouselIndex === index

                return (
                    <button
                        key={project.id}
                        onClick={() => router.push(`/project/${project.id}`)}
                        onMouseEnter={() =>
                            dispatch(setActiveCarouselIndex(index))
                        }
                        className="absolute left-1/2 top-1/2 transition-all duration-700"
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                        }}
                    >
                        <span
                            className={`
                                relative uppercase font-light text-xs tracking-[0.3em]
                                transition-all duration-700
                                ${
                                    isActive
                                        ? "text-white opacity-100"
                                        : "text-white/70 opacity-70"
                                }
                            `}
                        >
                            {isActive && (
                                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
                            )}

                            {project.titulo}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}