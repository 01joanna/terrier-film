"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Project } from "@/types/Project"

export default function ProjectPage() {
    const { id } = useParams() as { id: string }
    const [project, setProject] = useState<Project | null>(null)

    const [showUI, setShowUI] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        async function fetchProject() {
            const docRef = doc(db, "proyectos", id)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) return

            setProject({
                id: docSnap.id,
                ...docSnap.data(),
            } as Project)
        }

        if (id) fetchProject()
    }, [id])

    // Detectar movimiento de mouse
    useEffect(() => {
        const handleMouseMove = () => {
            setShowUI(true)

            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setShowUI(false), 2000) // desaparece tras 2s de inactividad
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    if (!project) return null

    return (
        <section className="relative w-screen h-screen bg-black overflow-hidden">
            {/* VIDEO FULLSCREEN */}
            <iframe
                className="absolute w-full h-full"
                src={
                    project.video +
                    "?autoplay=1&mute=1&controls=0&loop=1&playlist=SNy4e9wRvCk&playsinline=1&modestbranding=1&rel=0"
                }
                allow="autoplay; fullscreen"
                allowFullScreen
            />

            {/* OVERLAY OSCURO SUAVE */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${showUI ? "opacity-30" : "opacity-0"
                    }`}
            />

            {/* UI DEL TÍTULO */}
            <div
                className={`absolute top-20 left-1/2 font-plex uppercase font-thin -translate-x-1/2 transition-opacity duration-500 ${showUI ? "opacity-100" : "opacity-0"
                    }`}
            >
                <h1 className="text-xl font-light">
                    {project.titulo}, {project.artista}
                </h1>
                <div className="flex gap-10 uppercase items-center justify-center mt-2">
                    <p>Creditos</p>
                    <p>Stills</p>
                </div>
            </div>
        </section>
    )
}