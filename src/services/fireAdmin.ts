import { collection, addDoc, serverTimestamp, query, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Project } from "@/types/Project";

// --- CREATE ---
export const addProject = async (project: Project): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "proyectos"), {
            ...project,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
};

// --- READ ---
export const getProjects = async (): Promise<(Project & { id: string })[]> => {
    const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...(doc.data() as Project), id: doc.id }));
};

// --- UPDATE ---
export const updateProject = async (id: string, project: Partial<Project>) => {
    try {
        const projectRef = doc(db, "proyectos", id);
        await updateDoc(projectRef, {
            ...project,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

// --- DELETE ---
export const deleteProject = async (id: string) => {
    try {
        const projectRef = doc(db, "proyectos", id);
        await deleteDoc(projectRef);
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};