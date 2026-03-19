"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
    const [user, setUser] = useState<any>(null)
    const pathname = usePathname()
    const isHome = pathname === "/"
    const isProjectPage = pathname.startsWith("/project/")
    const [showHeader, setShowHeader] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        await signOut(auth)
    }


    useEffect(() => {
        if (!isProjectPage) {
            setShowHeader(true)
            return
        }

        setShowHeader(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        const hideHeader = () => setShowHeader(false)

        timeoutRef.current = setTimeout(hideHeader, 2000)

        const handleMouseMove = () => {
            setShowHeader(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(hideHeader, 2000)
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [pathname, isProjectPage])

    const transitionClass = `transition-all duration-500 ease-out ${
        isProjectPage
            ? showHeader
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            : "opacity-100"
    }`


    if (isHome) {
        return (
            <header className={`absolute left-0 w-full h-full flex gap-10 items-center px-10 py-6 z-50 ${transitionClass}`}>
                <div>
                    <Link href={"/"}>
                        <Image src="/logo.png" alt="Logo" width={200} height={75} className="object-contain" />
                    </Link>
                </div>
                <nav>
                    <ul className="flex flex-col font-plex leading-4 text-white tracking-widest text-sm font-light uppercase gap-2">
                        <li><Link href="/work">Work</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><Link href="/">Talents</Link></li>
                    </ul>
                </nav>
            </header>
        )
    }

    return (
        <header className={`fixed top-0 left-0 mt-10 z-10 flex px-40 text-xs font-plex uppercase tracking-widest items-center gap-40 w-screen ${transitionClass}`}>
            <div>
                <Link href={"/"}>
                    <Image src="/logo.png" alt="Logo" width={200} height={75} className="object-contain" />
                </Link>
            </div>
            <nav>
                <ul className="flex gap-7 tracking-widest">
                    <li><Link href="/work">Work</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/">Talents</Link></li>
                </ul>
            </nav>
            {/* <div>
                {user ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <Link href="/admin/login">Login</Link>
                )}
            </div> */}
        </header>
    )
}