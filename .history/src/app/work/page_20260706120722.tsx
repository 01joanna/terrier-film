"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, getFirestore, deleteDoc, doc } from "firebase/firestore"
import { Project } from "@/types/Project"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion, Variants } from "framer-motion"
import { useRouter } from "next/navigation"

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function Work() {
    const [projects, setProjects] = useState<Project[]>([])
    const [active, setActive] = useState<"all" | "direction" | "production">("all")
    const [hovered, setHovered] = useState<Project | null>(null)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [user, setUser] = useState<any>(null)

    const router = useRouter()
    const [leaving, setLeaving] = useState(false)

    useEffect(() => {
        const auth = getAuth()

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u)
        })

        return () => unsubscribe()
    }, [])

    console.log("User:", user)

    useEffect(() => {
        async function fetchProjects() {
            try {
                const querySnapshot = await getDocs(collection(db, "proyectos"))

                const data: Project[] = querySnapshot.docs.map((doc) => {
                    const d = doc.data()

                    return {
                        id: doc.id,
                        titulo: d.titulo ?? "",
                        año: d.año ?? "",
                        artista: d.artista ?? "",
                        direccion: d.direccion ?? [],
                        produccion: d.produccion ?? [],
                        direccionArte: d.direccionArte ?? [],
                        direccionFoto: d.direccionFoto ?? [],
                        editor: d.editor ?? [],
                        otros: d.otros ?? "",
                        video: d.video ?? "",
                        reel: d.reel ?? "",
                        descripcion: d.descripcion ?? "",
                        imagenes: d.imagenes ?? [],
                        categoria: d.categoria ?? [],
                    }
                })

                setProjects(data)
                console.log("Docs:", querySnapshot.size)
            } catch (error) {
                console.error("Error fetching projects:", error)
            }
        }

        fetchProjects()
    }, [])

    const filteredProjects = projects.filter((project) => {
        if (active === "all") return true
        if (active === "direction") return project.categoria.includes("Direction")
        if (active === "production") return project.categoria.includes("Production")
        return true
    })
        .sort((a, b) => Number(b.año) - Number(a.año))

    async function deleteProject(id: string) {
        if (!confirm("Delete this project?")) return

        try {
            await deleteDoc(doc(db, "proyectos", id))
            setProjects((prev) => prev.filter((p) => p.id !== id))
        } catch (error) {
            console.error("Error deleting:", error)
        }
    }

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const item: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                // delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1],
            },

        },
    }

    const goToProject = (id?: string) => {
        if (!id) return

        setLeaving(true)

        setTimeout(() => {
            router.push(`/project/${id}`)
        }, 500)
    }

    const formatDirector = (directors?: string[]) => {
        if (!directors) return ""
    
        const joined = directors.join(", ")
    
        if (joined === "Alejo Ayala, Arturo Casaú") {
            return "Terrier"
        }
    
        return joined
    }

    return (
        <section
            onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
            className="relative w-screen min-h-screen px-10 pb-20 flex flex-col justify-end overflow-hidden">

            {/* IMAGEN DE FONDO */}
            {hovered?.imagenes?.[0] && (
                <img
                    src={hovered.imagenes[0]}
                    alt={hovered.titulo}
                    className="fixed w-[400px] h-[200px] object-cover pointer-events-none rounded shadow-lg z-50 transition-all duration-150"
                    style={{
                        left:
                            cursorPos.x + 220 > window.innerWidth
                                ? cursorPos.x - 220 + "px"
                                : cursorPos.x + 20 + "px",
                        top:
                            cursorPos.y + 220 > window.innerHeight
                                ? cursorPos.y - 220 + "px"
                                : cursorPos.y + 20 + "px",
                    }}
                />
            )}

            {/* FILTROS */}
            <nav className="mb-20">
                <ul className="flex gap-10 text-xl tracking-wide uppercase font-plex">

                    <li
                        onClick={() => setActive("all")}
                        className={`
        cursor-pointer uppercase
        ${active === "all"
                                ? "opacity-100"
                                : "opacity-60 hover:opacity-100"}
    `}
                    >
                        See All
                    </li>

                    <li
                        onClick={() => setActive("direction")}
                        className={`cursor-pointer transition 
                ${active === "direction"
                                ? "text-white font-light"
                                : "opacity-70 font-thin hover:opacity-100"}
            `}
                    >
                        Direction
                    </li>

                    <li
                        onClick={() => setActive("production")}
                        className={`cursor-pointer transition 
                ${active === "production"
                                ? "text-white font-light"
                                : "opacity-70 font-thin hover:opacity-100"}
            `}
                    >
                        Production
                    </li>

                </ul>
            </nav>

            <div
                className={`grid ${user ? "grid-cols-6" : "grid-cols-5"
                    } text-sm uppercase tracking-widest opacity-60 pb-4 font-thin font-plex`}
            >
                <span>Project</span>
                <span>Client</span>
                <span>Director</span>
                <span>Year</span>
                <span>Category</span>
            </div>

            <div>
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                            duration: 0.7,
                            delay: leaving ? index * 0.02 : index * 0.04,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div
                            onClick={() => goToProject(project.id)}
                            onMouseEnter={() => setHovered(project)}
                            onMouseLeave={() => setHovered(null)}
                            className={`grid ${user ? "grid-cols-6" : "grid-cols-5"
                                } transition cursor-pointer font-plex font-thin text-sm ${leaving ? "pointer-events-none" : ""
                                }`}
                        >
                            <span>{project.titulo}</span>
                            <span>{project.artista}</span>
                            <span>{formatDirector(project.direccion)}</span>
                            <span>{project.año}</span>
                            <span>[{project.categoria.join(", ")}]</span>

                            {user && (
                                <span className="flex gap-3 text-xs">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            window.location.href = `/admin/edit/${project.id}`
                                        }}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            deleteProject(project.id!)
                                        }}
                                    >
                                        <MdDelete />
                                    </button>
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

        </section>
    )
}