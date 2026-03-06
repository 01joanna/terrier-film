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

    // Estados del formulario
    const [project, setProject] = useState<Project | null>(null);
    const [direccion, setDireccion] = useState<string[]>([""]);
    const [produccion, setProduccion] = useState<string[]>([""]);
    const [direccionArte, setDireccionArte] = useState<string[]>([""]);
    const [direccionFoto, setDireccionFoto] = useState<string[]>([""]);
    const [editor, setEditor] = useState<string[]>([""]);
    const [imagenes, setImagenes] = useState<string[]>([""]);
    const [categoria, setCategoria] = useState<string[]>([]);
    const [otros, setOtros] = useState<string>("");
    const [reel, setReel] = useState<string>("");
    const [credits, setCredits] = useState<{ [role: string]: string[] }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar proyecto desde Firestore
    useEffect(() => {
        async function fetchProject() {
            if (!id) return;

            const docRef = doc(db, "proyectos", id);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data() as Project;

                setProject(data);
                setDireccion(data.direccion || [""]);
                setProduccion(data.produccion || [""]);
                setDireccionArte(data.direccionArte || [""]);
                setDireccionFoto(data.direccionFoto || [""]);
                setEditor(data.editor || [""]);
                setImagenes(data.imagenes || [""]);
                setCategoria(data.categoria || []);
                setOtros(data.otros || "");
                setReel(data.reel || "");
                setCredits(data.credits || {});
            } else {
                alert("Proyecto no encontrado");
                router.push("/");
            }
        }

        fetchProject();
    }, [id, router]);

    if (!user) {
        return (
            <section className="w-screen h-screen flex flex-col items-center justify-center text-center text-gray-400">
                <p className="text-lg uppercase mb-4">No autorizado</p>
                <p className="text-sm text-gray-500">
                    Solo el administrador puede acceder aquí.
                </p>
            </section>
        );
    }

    if (!project) {
        return <p className="p-10">Cargando proyecto...</p>;
    }

    // Funciones para arrays dinámicos
    const handleArrayChange = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
        setter((prev) => [...prev, ""]);

    const handleRemoveField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => setter((prev) => prev.filter((_, i) => i !== index));

    const handleAddImage = () => setImagenes((prev) => [...prev, ""]);
    const handleChangeImage = (index: number, value: string) => {
        const newImagenes = [...imagenes];
        newImagenes[index] = value;
        setImagenes(newImagenes);
    };
    const handleRemoveImage = (index: number) =>
        setImagenes((prev) => prev.filter((_, i) => i !== index));

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCategoria((prev) =>
            checked ? [...prev, name] : prev.filter((cat) => cat !== name)
        );
    };

    // Actualizar proyecto
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const docRef = doc(db, "proyectos", id);
            await updateDoc(docRef, {
                ...project,
                direccion,
                produccion,
                direccionArte,
                direccionFoto,
                editor,
                imagenes: imagenes.filter((img) => img !== ""),
                categoria,
                otros,
                reel,
                credits
            });

            alert("✅ Proyecto actualizado correctamente");
            router.push("/");
        } catch (err) {
            console.error(err);
            alert("❌ Error al actualizar proyecto");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cambiar nombre de una persona en un rol
    const handleCreditChange = (role: string, index: number, value: string) => {
        setCredits(prev => ({
            ...prev,
            [role]: prev[role].map((p, i) => i === index ? value : p)
        }));
    };

    // Añadir persona a un rol
    const addCreditPerson = (role: string) => {
        setCredits(prev => ({
            ...prev,
            [role]: [...(prev[role] || []), ""]
        }));
    };

    // Eliminar persona de un rol
    const removeCreditPerson = (role: string, index: number) => {
        setCredits(prev => ({
            ...prev,
            [role]: prev[role].filter((_, i) => i !== index)
        }));
    };

    // Añadir un rol nuevo
    const addCreditRole = (role: string) => {
        if (!role) return;
        setCredits(prev => ({
            ...prev,
            [role]: [""]
        }));
    };

    return (
        <section className="w-screen min-h-screen flex flex-col justify-start items-center gap-10 font-plex pt-24 pb-20">
            <h1 className="text-sm uppercase">EDITA EL PROYECTO</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-10">
                        <div>
                            <h2>Ficha</h2>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="TITULO"
                                    className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white"
                                    defaultValue={project.titulo}
                                    onChange={(e) => setProject({ ...project, titulo: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="año"
                                    placeholder="AÑO"
                                    className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white"
                                    defaultValue={project.año}
                                    onChange={(e) => setProject({ ...project, año: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="artista"
                                    placeholder="ARTISTA"
                                    className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white"
                                    defaultValue={project.artista}
                                    onChange={(e) => setProject({ ...project, artista: e.target.value })}
                                />
                            </div>

                            {[
                                { label: "Dirección", state: direccion, setter: setDireccion },
                                { label: "Jefe de producción", state: produccion, setter: setProduccion },
                                { label: "Dirección de fotografía", state: direccionFoto, setter: setDireccionFoto },
                                { label: "Dirección de arte", state: direccionArte, setter: setDireccionArte },
                                { label: "Editor", state: editor, setter: setEditor },
                            ].map((field, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <label className="text-xs text-gray-400">{field.label}</label>
                                    {field.state.map((v, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={v}
                                                onChange={(e) => handleArrayChange(field.setter, i, e.target.value)}
                                                className="input flex-1 bg-gray-800 text-white text-xs"
                                            />
                                            {field.state.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveField(field.setter, i)}
                                                    className="btn-delete"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddField(field.setter)}
                                        className="btn-add"
                                    >
                                        + Añadir {field.label.toLowerCase()}
                                    </button>
                                </div>
                            ))}

                            <textarea
                                value={otros}
                                onChange={(e) => setOtros(e.target.value)}
                                placeholder="Otros créditos (ej: montaje, sonido, etc)"
                                className="px-4 py-3 border border-gray-300 rounded text-xs text-white w-5/6 h-50"
                            />

                            <div className="flex flex-col gap-4">
                                <h2>Créditos</h2>
                                {Object.entries(credits).map(([role, people], idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400">{role}</label>
                                        {people.map((person, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={person}
                                                    onChange={e => handleCreditChange(role, i, e.target.value)}
                                                    className="input flex-1 bg-gray-800 text-white text-xs"
                                                />
                                                {people.length > 1 && (
                                                    <button type="button" onClick={() => removeCreditPerson(role, i)} className="btn-delete">
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addCreditPerson(role)} className="btn-add">
                                            + Añadir persona
                                        </button>
                                    </div>
                                ))}

                                {/* Añadir rol nuevo */}
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Nuevo rol"
                                        id="newRoleInput"
                                        className="px-2 py-1 border rounded text-xs flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById("newRoleInput") as HTMLInputElement;
                                            addCreditRole(input.value);
                                            input.value = "";
                                        }}
                                        className="btn-add"
                                    >
                                        + Añadir rol
                                    </button>
                                </div>
                            </div>
                        </div>



                        {/* Extras */}
                        <div className="flex flex-col gap-2">
                            <h2>Extras</h2>

                            {/* Imágenes */}
                            <div className="flex flex-col gap-2 mb-8">
                                <label className="text-xs uppercase text-gray-400">Imágenes</label>
                                {imagenes.map((img, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={img}
                                            placeholder="URL de la imagen"
                                            onChange={(e) => handleChangeImage(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded text-xs text-white"
                                        />
                                        {imagenes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="text-xs text-red-400 border border-red-400 px-2 py-1 rounded hover:bg-red-400 hover:text-white transition"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="text-xs text-blue-400 border border-blue-400 px-3 py-2 rounded uppercase hover:bg-blue-400 hover:text-white transition w-fit"
                                >
                                    + Añadir imagen
                                </button>
                            </div>

                            <input
                                type="text"
                                name="video"
                                placeholder="Video"
                                className="px-4 py-3 border border-gray-300 rounded text-xs uppercase text-white"
                                defaultValue={project.video}
                            />
                            <input
                                type="text"
                                name="reel"
                                placeholder="Reel"
                                className="px-4 py-3 border border-gray-300 rounded text-xs uppercase text-white"
                                value={reel}
                                onChange={(e) => setReel(e.target.value)}
                            />
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                className="px-4 py-3 border border-gray-300 rounded text-xs uppercase text-white h-50"
                                defaultValue={project.descripcion}
                            />

                            <p className="uppercase pt-10">Categoría</p>
                            <div className="text-sm uppercase flex flex-col gap-2">
                                {["Videoclip", "Publicidad", "Ficcion"].map((cat) => (
                                    <label key={cat}>
                                        <input
                                            type="checkbox"
                                            name={cat}
                                            checked={categoria.includes(cat)}
                                            onChange={handleCategoriaChange}
                                            className="mr-2"
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-blue-500 text-white rounded py-2 px-5 m-2 text-sm uppercase ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar proyecto"}
                    </button>
                </div>
            </form>
        </section>
    );
}