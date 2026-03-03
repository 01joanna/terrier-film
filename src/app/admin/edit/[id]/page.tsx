"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/types/Project";
import { useAuth } from "@/hooks/useAuth";

export default function EditProject() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // cargar proyecto
    useEffect(() => {
        async function fetchProject() {
            const docRef = doc(db, "proyectos", id);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                setProject(snapshot.data() as Project);
            } else {
                alert("Proyecto no encontrado");
                router.push("/");
            }
        }

        if (id) fetchProject();
    }, [id, router]);

    if (!user) {
        return <p className="p-10 text-center text-gray-400">No autorizado</p>;
    }

    if (!project) {
        return <p className="p-10">Cargando proyecto...</p>;
    }

    // actualizar
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const docRef = doc(db, "proyectos", id);

            await updateDoc(docRef, {
                ...project,
            });

            alert("✅ Proyecto actualizado correctamente");
            router.push("/");
        } catch (error) {
            console.error(error);
            alert("❌ Error al actualizar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-screen min-h-screen flex flex-col items-center pt-24 pb-20">
            <h1 className="text-sm uppercase mb-10">EDITAR PROYECTO</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-6">

                {/* TÍTULO */}
                <input
                    type="text"
                    value={project.titulo}
                    onChange={(e) =>
                        setProject({ ...project, titulo: e.target.value })
                    }
                    className="input"
                />

                {/* AÑO */}
                <input
                    type="text"
                    value={project.año}
                    onChange={(e) =>
                        setProject({ ...project, año: e.target.value })
                    }
                    className="input"
                />

                {/* ARTISTA */}
                <input
                    type="text"
                    value={project.artista}
                    onChange={(e) =>
                        setProject({ ...project, artista: e.target.value })
                    }
                    className="input"
                />

                {/* VIDEO */}
                <input
                    type="text"
                    value={project.video}
                    onChange={(e) =>
                        setProject({ ...project, video: e.target.value })
                    }
                    className="input"
                />

                {/* REEL */}
                <input
                    type="text"
                    value={project.reel}
                    onChange={(e) =>
                        setProject({ ...project, reel: e.target.value })
                    }
                    className="input"
                />

                {/* DESCRIPCIÓN */}
                <textarea
                    value={project.descripcion}
                    onChange={(e) =>
                        setProject({ ...project, descripcion: e.target.value })
                    }
                    className="input h-40"
                />

                {/* OTROS */}
                <label className="text-sm text-gray-500">Otros</label>
                <textarea
                    value={project.otros}
                    onChange={(e) =>
                        setProject({ ...project, otros: e.target.value })
                    }
                    className="input h-40"
                />

                {/* IMÁGENES */}
                {project.imagenes.map((img, index) => (
                    <input
                        key={index}
                        type="text"
                        value={img}
                        onChange={(e) => {
                            const newImages = [...project.imagenes];
                            newImages[index] = e.target.value;
                            setProject({ ...project, imagenes: newImages });
                        }}
                        className="input"
                    />
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white rounded py-2 px-5"
                >
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
            </form>
        </section>
    );
}