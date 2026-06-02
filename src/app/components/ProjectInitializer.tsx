"use client"

import { useEffect, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useAppDispatch } from "@/store/hooks"
import { setProjects } from "@/store/slices/projectsSlice"
import { Project } from "@/types/Project"

export default function ProjectInitializer() {
    const dispatch = useAppDispatch()
    const loaded = useRef(false)

    useEffect(() => {
        if (loaded.current) return
        loaded.current = true

        async function fetchProjects() {
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
                    direccionFoto: d.direccionFoto ?? [],
                    direccionArte: d.direccionArte ?? [],
                    editor: d.editor ?? [],
                    categoria: d.categoria ?? [],
                    video: d.video ?? "",
                    imagenes: d.imagenes ?? [],
                }
            })

            dispatch(setProjects(data))
        }

        fetchProjects()
    }, [dispatch])

    return null
}