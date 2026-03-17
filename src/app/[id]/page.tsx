"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Project } from "@/types/Project"
import Player from "@vimeo/player"
import { CiPause1, CiPlay1 } from "react-icons/ci"
import { BiSolidVolumeMute } from "react-icons/bi";
import { BiVolumeMute } from "react-icons/bi";

export default function ProjectPage() {
    const { id } = useParams() as { id: string }
    const [project, setProject] = useState<Project | null>(null)

    const [showUI, setShowUI] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const videoRef = useRef<HTMLIFrameElement | null>(null)
    const playerRef = useRef<Player | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const stillsRef = useRef<HTMLDivElement | null>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    const [panelMode, setPanelMode] = useState<"none" | "credits" | "stills">("none")
    const [isPlaying, setIsPlaying] = useState(true)
    const [progress, setProgress] = useState(0)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [videoProgress, setVideoProgress] = useState<number>(0)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(true)


    // FETCH PROJECT
    useEffect(() => {
        async function fetchProject() {
            const docRef = doc(db, "proyectos", id)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) return

            const data = docSnap.data() as Omit<Project, "id">
            setProject({ ...data, id: docSnap.id } as Project)
        }

        if (id) fetchProject()
    }, [id])

    // VIMEO PLAYER

    useEffect(() => {
        async function fetchProject() {
            const docRef = doc(db, "proyectos", id)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) return

            const data = docSnap.data() as Omit<Project, "id">
            setProject({ ...data, id: docSnap.id } as Project)
        }

        if (id) fetchProject()
    }, [id])


    useEffect(() => {
        if (!videoRef.current || !project) return
    
        const player = new Player(videoRef.current)
        playerRef.current = player
    
        player.ready().then(() => {
            player.setVolume(isMuted ? 0 : 1)
        })
    
        player.on("play", () => setIsPlaying(true))
        player.on("pause", () => setIsPlaying(false))
        player.on("ended", () => setIsPlaying(false))
    
        const interval = setInterval(async () => {
            if (!playerRef.current) return
            const time = await playerRef.current.getCurrentTime()
            const dur = await playerRef.current.getDuration()
            setCurrentTime(time)
            setDuration(dur)
            setVideoProgress(dur > 0 ? time / dur : 0)
        }, 200)
    
        return () => {
            clearInterval(interval)
            player.destroy()
        }
    }, [project])

    const togglePlay = async () => {
        if (!playerRef.current) return
        isPlaying ? await playerRef.current.pause() : await playerRef.current.play()
    }

    const toggleMute = async () => {
        if (!playerRef.current) return
        await playerRef.current.ready() 
        if (isMuted) {
            await playerRef.current.setVolume(1)
            setIsMuted(false)
        } else {
            await playerRef.current.setVolume(0)
            setIsMuted(true)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
    }

    // UI HOVER
    useEffect(() => {
        const handleMouseMove = () => {
            setShowUI(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setShowUI(false), 2000)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const creditsButtonRef = useRef<HTMLButtonElement>(null)
    const stillsButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node

            if (
                creditsButtonRef.current?.contains(target) ||
                stillsButtonRef.current?.contains(target)
            ) return

            if (selectedImage) {
                setSelectedImage(null)
                return
            }

            if (panelMode === "stills" && stillsRef.current && !stillsRef.current.contains(target)) {
                setPanelMode("none")
            }

            if (panelMode === "credits" && panelRef.current && !panelRef.current.contains(target)) {
                setPanelMode("none")
            }
        }

        window.addEventListener("mousedown", handleClickOutside)
        return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [panelMode, selectedImage])

    useEffect(() => {
        if (panelMode !== "stills") return
        const container = stillsRef.current
        if (!container) return

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true
            startX.current = e.pageX - container.offsetLeft
            scrollLeft.current = container.scrollLeft
            container.style.cursor = "grabbing"
        }

        const handleMouseLeave = () => {
            isDragging.current = false
            container.style.cursor = "grab"
        }

        const handleMouseUp = () => {
            isDragging.current = false
            container.style.cursor = "grab"
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            e.preventDefault()

            const x = e.pageX - container.offsetLeft
            const walk = (x - startX.current) * 1.5
            container.scrollLeft = scrollLeft.current - walk
        }

        container.addEventListener("mousedown", handleMouseDown)
        container.addEventListener("mouseleave", handleMouseLeave)
        container.addEventListener("mouseup", handleMouseUp)
        container.addEventListener("mousemove", handleMouseMove)

        return () => {
            container.removeEventListener("mousedown", handleMouseDown)
            container.removeEventListener("mouseleave", handleMouseLeave)
            container.removeEventListener("mouseup", handleMouseUp)
            container.removeEventListener("mousemove", handleMouseMove)
        }
    }, [panelMode])

    if (!project) return null

    return (
        <section className="relative w-screen h-screen bg-black overflow-hidden z-0">
            {/* VIDEO */}
            <iframe
                ref={videoRef}
                className="absolute w-full h-full"
                src={`${project.video}?autoplay=1&muted=1&background=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
            />

            {/* OVERLAY HOVER */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${showUI ? "opacity-30" : "opacity-0"
                    }`}
            />

            {/* BOTON PLAY/PAUSE */}
            <button
                onClick={togglePlay}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-6xl transition-opacity duration-100 z-100 cursor-poniter ${showUI ? "opacity-100" : "opacity-0"
                    }`}>
                {isPlaying ? <CiPause1 /> : <CiPlay1 />}
            </button>

            {panelMode === "stills" &&
                project.imagenes &&
                project.imagenes.length > 0 && (
                    <div
                        ref={stillsRef}
                        className={`absolute bottom-2 left-0 w-screen max-h-40 py-2 flex gap-4 overflow-x-auto scrollbar-hide px-4 z-100 cursor-grab active:cursor-grabbing select-none transition-opacity duration-500 
                        ${panelMode === "stills" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        {project.imagenes.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Still ${index + 1}`}
                                className="h-32 w-64 object-cover shrink-0 cursor-pointer rounded-md transition-transform duration-300 hover:scale-105"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedImage(img)
                                }}
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                            />
                        ))}
                    </div>
                )}

            <div className={`absolute bottom-2/9 z-100 left-20 right-20 flex flex-col gap-3 ${showUI ? "opacity-100" : "opacity-0"}`}>
                <div className="flex items-center justify-between">
                    <div className="text-white font-plex font-thin text-sm">
                        {formatTime(currentTime)} - {formatTime(duration)}
                    </div>

                    <button
                        className="text-gray-300 text-xl cursor-pointer"
                        onClick={toggleMute}
                    >
                        {isMuted ? <BiVolumeMute /> : <BiSolidVolumeMute />}
                    </button>
                </div>
                <div className="h-[0.6px] bg-gray-600 ">
                    <div
                        className="h-[0.6px] bg-white transition-all duration-200"
                        style={{ width: `${videoProgress * 100}%` }}
                    />
                </div>
            </div>


            <div className="absolute w-screen h-screen z-50 flex items-center justify-center px-20">
                <div className={`w-1/2 uppercase transition-opacity duration-300 ${showUI ? "opacity-100" : "opacity-0"
                    }`}>
                    <h1 className="text-6xl font-inter font-thin">
                        {project.titulo}
                        {project.artista ? `, ${project.artista}` : ""}
                    </h1>

                    <div className="flex gap-5 mt-2 font-plex font-thin">
                        <button
                            ref={creditsButtonRef}
                            onClick={() =>
                                setPanelMode(panelMode === "credits" ? "none" : "credits")
                            }
                            className="cursor-pointer"
                        >
                            CREDITOS
                        </button>

                        <button
                            ref={stillsButtonRef}
                            onClick={() =>
                                setPanelMode(panelMode === "stills" ? "none" : "stills")
                            }
                            className="cursor-pointer"
                        >
                            STILLS
                        </button>
                    </div>
                </div>


                <div className={`w-1/2 h-screen transition-transform duration-500 overflow-y-auto z-30 ${panelMode !== "none" ? "translate-x-0" : "translate-x-full"
                    }`}
                    ref={panelRef}>

                    {project.credits && (
                        <div
                            className={`fixed inset-0 z-[150] flex items-center justify-center bg-transparent transition-opacity duration-300 ${panelMode === "credits"
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                                }`}
                        >
                            <div className="text-sm font-thin font-plex uppercase flex flex-col justify-center items-center">
                                {project.credits.map((credit, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 justify-center items-start transition-opacity duration-300"
                                    >
                                        <p className="font-bold">{credit.role}</p>
                                        <div className="flex flex-col">
                                            {credit.people.map((person, i) => (
                                                <p key={i}>{person}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Expanded still"
                        className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl shadow-2xl transform opacity-0 scale-95 animate-fade-zoom"
                        style={{
                            opacity: 1,
                            transform: "scale(1)",
                            transition: "all 0.3s ease-out"
                        }}
                        onLoad={(e) => {
                            const imgEl = e.currentTarget
                            imgEl.classList.remove("opacity-0", "scale-95")
                        }}
                    />
                </div>
            )}
        </section>
    )
}   