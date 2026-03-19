"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
    const [user, setUser] = useState<any>(null)
    const pathname = usePathname()
    const isHome = pathname === "/"
    const [visible, setVisible] = useState(true)

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
        setVisible(false)
    
        const timeout = setTimeout(() => {
            setVisible(true)
        }, 150) 
    
        return () => clearTimeout(timeout)
    }, [pathname])

    const transitionClass = `transition-all duration-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`

    return isHome ? (
        <header className={`absolute left-0 w-full h-full flex gap-10 items-center px-10 py-6 z-20 ${transitionClass}`}>
            <div>
                <Link href={"/"}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={75}
                        className="object-contain"
                    />
                </Link>
            </div>
    
            <nav>
                <ul className="flex flex-col font-plex leading-4 text-white tracking-widest text-sm font-light uppercase gap-2">
                    <li>
                        <Link href="/work" className="hover:opacity-70 transition">
                            Work
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="hover:opacity-70 transition">
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/login" className="hover:opacity-70 transition">
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    ) : (
        <header className={`fixed top-0 left-0 mt-10 z-10 flex px-40 text-xs font-plex uppercase tracking-widest items-center gap-40 w-screen ${transitionClass}`}>
            <div>
                <Link href={"/"}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={75}
                        className="object-contain"
                    />
                </Link>
            </div>
    
            <nav>
                <ul className="flex  gap-2 tracking-widest">
                    <li>
                        <Link href="/work">Work</Link>
                    </li>
    
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link href="/">Talents</Link>
                    </li>
    
                    <li>
                        {user ? (
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link href="/admin/login">
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    )
                        }