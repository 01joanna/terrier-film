import { Credit } from "./Credit";

export type Project = {
    id?: string;
    titulo: string;
    año: string;
    artista?: string;

    direccion?: string[];
    produccion?: string[];
    direccionFoto?: string[];
    direccionArte?: string[];
    editor?: string[];

    imagenes?: string[];
    categoria: string[];

    descripcion?: string;
    video?: string;
    reel?: string;

    credits?: Credit[];
};