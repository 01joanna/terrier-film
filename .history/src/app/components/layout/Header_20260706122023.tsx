"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "./Logo"
import { useEffect, useState } from "react"

export default function Header() {
    const pathname = usePathname()

    const isHome = pathname === "/"
    const isProjectDetail = pathname.startsWith("/project/")

    const [loading, setLoading] = useState(true)
    const [exiting, setExiting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

useEffect(() => {
    const already = sessionStorage.getItem("site-loaded-once")

    if (already) {
        setLoading(false)
        setProgress(100)
        return
    }

    let value = 0

    const interval = setInterval(() => {
        value += Math.random() * 7

        if (value >= 99) {
            value = 100
            setProgress(100)
            clearInterval(interval)

            setExiting(true)
            setTimeout(() => {
                setLoading(false)
                sessionStorage.setItem("site-loaded-once", "true")
            }, 600)
        }
        setProgress(Math.min(100, Math.floor(value)))
    }, 80)

    return () => clearInterval(interval)
}, [mounted])


    const links = [
        { href: "/", label: "Home" },
        { href: "/work", label: "Projects" },
        { href: "/about", label: "About" },
    ]

    if (isProjectDetail) return null
    if (!mounted) return null

    return (
        <header className="fixed inset-0 z-[9999] pointer-events-none mx-20">
            {(loading || exiting) && (
                <div
                    className={`
                        fixed inset-0 bg-black flex flex-col items-center justify-center text-white
                        transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]
                        ${exiting ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0"}
                    `}
                >
                    {/* LOGO CENTRADO */}
                    <div
                        className={`
                            transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]
                            ${exiting ? "opacity-0 translate-y-2" : "opacity-100"}
                        `}
                    >
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={400}
                            height={400}
                        />
                    </div>

                    {/* PORCENTAJE */}
                    <div
                        className={`
                            text-xs tracking-[0.3em] font-roboto font-light mt-6 opacity-80
                            transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]
                            ${exiting ? "opacity-0 translate-y-2" : "opacity-80"}
                        `}
                    >
                        {progress}%
                    </div>
                </div>
            )}  

                        {/* 🔥 HEADER REAL */}
                        <div
                className={`fixed inset-0 mx-30
                    transition-all duration-700 ease-in-out
                    ${loading ? "opacity-0 scale-105" : "opacity-100 scale-100"}
                `}
            >


            {/* LOGO */}
            <Logo />

            {/* NAV */}
            <div
                className={`
        pointer-events-auto absolute right-40
        transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] mix-blend-difference
        ${isHome
                        ? "top-1/2 -translate-y-1/2"
                        : "top-10 translate-y-0 "
                    }
    `}
            >
                <nav className="uppercase text-xs text-white opacity-80 font-plex font-light tracking-[0.1rem]">
                    <ul className="flex gap-9">
                        {links.map(link => {
                            const isActive = pathname === link.href

                            return (
                                <li key={link.href} className="relative flex items-center ">
                                    {isActive && (
                                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
                                    )}

                                    <Link
                                        href={link.href}
                                        className={`
                                            transition-all duration-300 mix-blend-difference
                                            ${isActive
                                                ? "text-white opacity-100"
                                                : "text-white opacity-70"
                                            }
                                        `}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                </div>
            </div>
        </header>
    )
}