"use client";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { uploadImage } from "@/services/storage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { addProject } from "@/services/fireAdmin";
import { Project } from "@/types/Project";
import { useAuth } from "@/hooks/useAuth";


export default function New() {
    const { user, loading } = useAuth();

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
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleCategoriaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCategoria((prev) =>
            checked ? [...prev, name] : prev.filter((cat) => cat !== name)
        );
    };

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

    const handleCreditChange = (role: string, index: number, value: string) => {
        setCredits((prev) => {
            const updatedRole = prev[role] ? [...prev[role]] : [""];
            updatedRole[index] = value;
            return { ...prev, [role]: updatedRole };
        });
    };

    const handleAddCreditField = (role: string) => {
        setCredits((prev) => {
            const updatedRole = prev[role] ? [...prev[role], ""] : [""];
            return { ...prev, [role]: updatedRole };
        });
    };

    const handleRemoveCreditField = (role: string, index: number) => {
        setCredits((prev) => {
            const updatedRole = prev[role].filter((_, i) => i !== index);
            return { ...prev, [role]: updatedRole };
        });
    };

    const handleAddRole = (role: string) => {
        if (!role) return;
        setCredits((prev) => ({ ...prev, [role]: [""] }));
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const projectData: Project = {
            titulo: formData.get("titulo") as string,
            año: formData.get("año") as string,
            artista: formData.get("artista") as string,
            direccion,
            produccion,
            direccionArte,
            direccionFoto,
            editor,
            otros,
            reel: formData.get("reel") as string,
            video: formData.get("video") as string,
            descripcion: formData.get("descripcion") as string,
            imagenes: imagenes.filter(img => img !== ""),
            categoria,
            credits
        };




        try {
            if (!projectData.titulo || !projectData.año) {
                alert("⚠️ Título y año son obligatorios");
                setIsSubmitting(false);
                return;
            }
            await addProject(projectData);
            alert("✅ Proyecto añadido correctamente!");

            formRef.current?.reset();
            setDireccion([""]);
            setProduccion([""]);
            setDireccionArte([""]);
            setDireccionFoto([""]);
            setEditor([""]);
            setOtros("");
            setReel("");
            setImagenes([""]);
            setCategoria([]);
        } catch (err) {
            console.error("Error al añadir proyecto:", err);
            alert("❌ Error al guardar el proyecto");
        } finally {
            setIsSubmitting(false);
        }
    };


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
    return (
        <section className="w-screen min-h-screen flex flex-col justify-start items-center gap-10 font-plex pt-24 pb-20">
            <h1 className="text-sm uppercase">CREA UN NUEVO PROYECTO</h1>
            <form onSubmit={handleSubmit} ref={formRef}>

                <div className="flex flex-col gap-10">
                    <div className="flex gap-10">
                        <div>
                            <h2>Ficha</h2>
                            <div className="flex gap-3">
                                <input type="text" name="titulo" placeholder="TITULO" className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white" />
                                <input type="text" name="año" placeholder="AÑO" className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white" />
                                <input type="text" name="artista" placeholder="ARTISTA" className="px-4 py-3 my-2 border border-gray-300 rounded text-xs text-white"
                                />
                            </div>


                            {/* DIRECCIÓN */}
                            {[
                                { label: "Dirección", state: direccion, setter: setDireccion },
                                { label: "jefe de  producción", state: produccion, setter: setProduccion },
                                { label: "Dirección de fotografía", state: direccionFoto, setter: setDireccionFoto },
                                { label: "Dirección de arte", state: direccionArte, setter: setDireccionArte },
                                { label: "Editor", state: editor, setter: setEditor },
                            ].map((field, idx) => (

                                <div key={idx} className="flex flex-col gap-3">
                                    <label className="text-xs  text-gray-400">{field.label}</label>
                                    {field.state.map((v, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={v}
                                                onChange={e => handleArrayChange(field.setter, i, e.target.value)}
                                                className="input flex-1 bg-gray-800 text-white text-xs"
                                            />
                                            {field.state.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveField(field.setter, i)} className="btn-delete">Eliminar</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddField(field.setter)} className="btn-add">+ Añadir {field.label.toLowerCase()}</button>
                                </div>
                            ))}

                            <div className="flex flex-col gap-3">
                                <h2>Créditos</h2>

                                {/* Renderizar cada rol */}
                                {Object.entries(credits).map(([role, names]) => (
                                    <div key={role} className="flex flex-col gap-2 border-b border-gray-700 pb-2">
                                        <label className="text-xs text-gray-400">{role}</label>
                                        {names.map((name, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => handleCreditChange(role, i, e.target.value)}
                                                    className="flex-1 px-3 py-2 text-xs bg-gray-800 text-white rounded"
                                                />
                                                {names.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveCreditField(role, i)} className="btn-delete">Eliminar</button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddCreditField(role)} className="btn-add text-xs">+ Añadir persona</button>
                                    </div>
                                ))}

                                {/* Añadir nuevo rol */}
                                <div className="flex gap-2 mt-2">
                                    <input type="text" placeholder="Nuevo rol" id="newRole" className="flex-1 px-3 py-2 text-xs bg-gray-800 text-white rounded" />
                                    <button type="button" onClick={() => {
                                        const input = document.getElementById("newRole") as HTMLInputElement;
                                        handleAddRole(input.value);
                                        input.value = "";
                                    }} className="btn-add text-xs">+ Añadir rol</button>
                                </div>
                            </div>
                        </div>

                        {/* --- Extras --- */}
                        <div className="flex flex-col gap-2">
                            <h2>Extras</h2>

                            {/* Imagenes dinámicas */}
                            <div className="flex flex-col gap-2 mb-8">
                                <label className="text-xs uppercase text-gray-400">
                                    Imágenes
                                </label>
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
                            />
                            <input
                                type="text"
                                name="reel"
                                placeholder="Reel"
                                className="px-4 py-3 border border-gray-300 rounded text-xs uppercase text-white"
                            />
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                className="px-4 py-3 border border-gray-300 rounded text-xs uppercase text-white h-50"
                            />
                            <p className="uppercase pt-10">Categoría</p>
                            <div className="text-sm uppercase flex flex-col gap-2">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="Videoclip"
                                        checked={categoria.includes("Videoclip")}
                                        onChange={handleCategoriaChange}
                                        className="mr-2"
                                    />
                                    Videoclip
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="Publicidad"
                                        checked={categoria.includes("Publicidad")}
                                        onChange={handleCategoriaChange}
                                        className="mr-2"
                                    />
                                    Publicidad
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="Ficcion"
                                        checked={categoria.includes("Ficcion")}
                                        onChange={handleCategoriaChange}
                                        className="mr-2"
                                    />
                                    Ficción
                                </label>
                            </div>
                        </div>
                    </div>

                    <br />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-blue-500 text-white rounded py-2 px-5 m-2 text-sm uppercase ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? "Enviando..." : "Añadir proyecto"}
                    </button>
                </div>
            </form>
        </section>
    );
}
