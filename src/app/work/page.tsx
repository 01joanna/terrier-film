
"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore"
import { Project } from "@/types/Project"
import {
    getAuth,
    onAuthStateChanged,
} from "firebase/auth"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

type Filter = "all" | "direction" | "production"

const filters: { label: string; value: Filter }[] = [
    { label: "See All", value: "all" },
    { label: "Direction", value: "direction" },
    { label: "Production", value: "production" },
]

export default function Work() {
    const [projects, setProjects] = useState<Project[]>([])
    const [active, setActive] = useState<Filter>("all")
    const [hovered, setHovered] = useState<Project | null>(null)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [user, setUser] = useState<any>(null)
    const [leaving, setLeaving] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const auth = getAuth()

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        async function fetchProjects() {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "proyectos")
                )

                const data: Project[] = querySnapshot.docs.map((document) => {
                    const d = document.data()

                    return {
                        id: document.id,
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
                        featured: d.featured ?? false,
                    }
                })

                setProjects(data)
            } catch (error) {
                console.error("Error fetching projects:", error)
            }
        }

        fetchProjects()
    }, [])

    const filteredProjects = projects
        .filter((project) => {
            if (active === "all") return true
            if (active === "direction") {
                return project.categoria.includes("Direction")
            }
            if (active === "production") {
                return project.categoria.includes("Production")
            }
            return true
        })
        .sort((a, b) => Number(b.año) - Number(a.año))

    async function deleteProject(id: string) {
        if (!confirm("Delete this project?")) return

        try {
            await deleteDoc(doc(db, "proyectos", id))
            setProjects((prev) =>
                prev.filter((project) => project.id !== id)
            )
        } catch (error) {
            console.error("Error deleting:", error)
        }
    }

    const goToProject = (id?: string) => {
        if (!id) return

        setLeaving(true)

        setTimeout(() => {
            router.push(`/project/${id}`)
        }, 500)
    }

    const formatDirector = (directors?: string[]) => {
        if (!directors?.length) return ""

        const normalized = [...directors].sort().join(",")
        const terrierDirectors = ["Alejo Ayala", "Arturo Casaú"]
            .sort()
            .join(",")

        if (normalized === terrierDirectors) {
            return "Terrier"
        }

        return directors.join(", ")
    }

    return (
        <section
            onMouseMove={(e) =>
                setCursorPos({
                    x: e.clientX,
                    y: e.clientY,
                })
            }
            className="relative w-full min-h-screen px-4 md:px-10 pb-20 flex flex-col justify-end overflow-hidden"
        >
            <div className="hidden md:block">
                {hovered?.imagenes?.[0] && (
                    <img
                        src={hovered.imagenes[0]}
                        alt={hovered.titulo}
                        className="fixed w-[400px] h-[200px] object-cover pointer-events-none rounded shadow-lg z-50"
                        style={{
                            left:
                                cursorPos.x + 420 > window.innerWidth
                                    ? cursorPos.x - 420
                                    : cursorPos.x + 20,
                            top:
                                cursorPos.y + 220 > window.innerHeight
                                    ? cursorPos.y - 220
                                    : cursorPos.y + 20,
                        }}
                    />
                )}
            </div>

            <nav className="mb-20 hidden lg:block">
                <ul className="flex gap-10 text-xl tracking-wide uppercase font-plex">
                    {filters.map(({ label, value }) => {
                        const isActive = active === value

                        return (
                            <li
                                key={value}
                                onClick={() => setActive(value)}
                                className={`cursor-pointer transition ${
                                    isActive
                                        ? "opacity-100 font-light"
                                        : "opacity-60 font-thin hover:opacity-100"
                                }`}
                            >
                                {label}
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="hidden md:block">
                <div
                    className={`grid ${
                        user ? "grid-cols-6" : "grid-cols-5"
                    } w-full text-sm uppercase tracking-widest opacity-60 pb-4 font-thin font-plex`}
                >
                    <span>Project</span>
                    <span>Client</span>
                    <span>Director</span>
                    <span>Year</span>
                    <span>Category</span>
                    {user && <span>Admin</span>}
                </div>

                <div>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{
                                opacity: 0,
                                y: 40,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 0.7,
                                delay: leaving
                                    ? index * 0.02
                                    : index * 0.04,
                                ease: [0.76, 0, 0.24, 1],
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                        >
                            <div
                                onClick={() =>
                                    goToProject(project.id)
                                }
                                onMouseEnter={() =>
                                    setHovered(project)
                                }
                                onMouseLeave={() =>
                                    setHovered(null)
                                }
                                className={`grid ${
                                    user
                                        ? "grid-cols-6"
                                        : "grid-cols-5"
                                } w-full transition cursor-pointer font-plex font-thin text-sm ${
                                    leaving
                                        ? "pointer-events-none"
                                        : ""
                                }`}
                            >
                                <span>{project.titulo}</span>
                                <span>{project.artista}</span>
                                <span>
                                    {formatDirector(
                                        project.direccion
                                    )}
                                </span>
                                <span>{project.año}</span>
                                <span>
                                    [{project.categoria.join(", ")}]
                                </span>

                                {user && (
                                    <span className="flex gap-3 text-xs">
                                        <button
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                router.push(
                                                    `/admin/edit/${project.id}`
                                                )
                                            }}
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                deleteProject(
                                                    project.id!
                                                )
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
            </div>

            <div className="md:hidden pt-[25vh]">
    <div className="flex flex-col">
                    {filteredProjects.map((project, index) => (
                        <motion.article
                            key={project.id}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.04,
                                ease: [0.76, 0, 0.24, 1],
                            }}
                            onClick={() =>
                                goToProject(project.id)
                            }
                            className="cursor-pointer mb-8"
                        >
                            {project.imagenes?.[0] && (
                                <div className="w-full aspect-[16/9] overflow-hidden mb-3">
                                    <img
                                        src={project.imagenes[0]}
                                        alt={project.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-[1fr_auto_auto] gap-4 w-full font-plex font-thin text-sm">
                                <span>{project.titulo}</span>
                                <span>{project.artista}</span>
                                <span>{project.año}</span>
                            </div>

                            {user && (
                                <div
                                    className="flex gap-4 mt-2 text-xs"
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/admin/edit/${project.id}`
                                            )
                                        }
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteProject(
                                                project.id!
                                            )
                                        }
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
