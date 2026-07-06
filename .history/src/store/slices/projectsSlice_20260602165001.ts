import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Project } from "@/types/Project"
import { CAROUSEL_ELEMENTS } from "@/config/carousel"

type ProjectsState = {
    items: Project[]
    activeCarouselIndex: number
}

const initialState: ProjectsState = {
    items: [],
    activeCarouselIndex: 0
}

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects: (state, action: PayloadAction<Project[]>) => {
            state.items = action.payload
            state.activeCarouselIndex = 0
        },

        setActiveCarouselIndex: (state, action: PayloadAction<number>) => {
            state.activeCarouselIndex = action.payload
        },

        setNext: (state) => {
            const max = CAROUSEL_ELEMENTS.length
            state.activeCarouselIndex =
                (state.activeCarouselIndex + 1) % max
        },

        setPrev: (state) => {
            const max = CAROUSEL_ELEMENTS.length
            state.activeCarouselIndex =
                (state.activeCarouselIndex - 1 + max) % max
        }
    }
})

export const {
    setProjects,
    setActiveCarouselIndex,
    setNext,
    setPrev
} = projectsSlice.actions

export default projectsSlice.reducer