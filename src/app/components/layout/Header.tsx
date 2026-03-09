"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Image from "next/image"

export default function Header() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })

        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        await signOut(auth)
    }

    return (
        <header className="fixed top-0 left-0 mt-10 z-10 flex px-40 text-xs font-plex uppercase tracking-widest items-center gap-10 w-screen">
            <div>
                <Link href={"/"}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={300}
                        height={75}
                        className="object-contain"
                    /></Link>
            </div>

            <nav className="">
                <ul className="flex gap-4 tracking-widest">
                    <li>
                        <Link href="/work">Work</Link>
                    </li>

                    <li>
                        <Link href="/contact">Contact</Link>
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