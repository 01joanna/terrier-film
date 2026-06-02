import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import projectsReducer from "./slices/projectsSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        projects: projectsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch