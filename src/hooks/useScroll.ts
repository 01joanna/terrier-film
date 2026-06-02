import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setNext, setPrev } from "@/store/slices/projectsSlice"

export default function useScroll() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                dispatch(setNext())
            } else {
                dispatch(setPrev())
            }
        }

        window.addEventListener("wheel", handleWheel, { passive: true })

        return () => window.removeEventListener("wheel", handleWheel)
    }, [dispatch])
}