
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "./Logo"
import { useEffect, useState } from "react"
import MobileHeader from "./MobileHeader"
import LoadingScreen from "./LoadingScreen"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
    const pathname = usePathname()
    const { user } = useAuth()

    const isHome = pathname === "/"
    const isProjectDetail = pathname.startsWith("/project/")

    const [loading, setLoading] = useState(true)
    const [exiting, setExiting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [pageReady, setPageReady] = useState(false)

    const links = [
        {
            href: "/",
            label: "Home",
        },
        {
            href: "/work",
            label: "Projects",
        },
        {
            href: "/about",
            label: "Contact",
        },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const alreadyLoaded = sessionStorage.getItem("site-loaded-once")
        if (alreadyLoaded) {
            setLoading(false)
            setProgress(100)

            setTimeout(() => {
                setPageReady(true)
            }, 100)

            return
        }

        const isMobile = window.innerWidth < 768

        let progressValue = 0
        let videoReady = !isMobile
        let minimumTimePassed = false
        let finished = false

        const MINIMUM_TIME = 2200
        const MAXIMUM_TIME = 8000

        const finishLoading = () => {
            if (
                finished ||
                !minimumTimePassed ||
                !videoReady
            ) {
                return
            }

            finished = true

            const finishInterval = setInterval(() => {
                progressValue += 1

                setProgress(
                    Math.min(
                        100,
                        Math.floor(progressValue)
                    )
                )

                if (progressValue >= 100) {
                    clearInterval(finishInterval)
                    sessionStorage.setItem("site-loaded-once", "true")

                    setExiting(true)

                    setTimeout(() => {
                        setLoading(false)

                        setTimeout(() => {
                            setPageReady(true)
                        }, 500)
                    }, 700)
                }
            }, 35)
        }

        const minimumTimer = setTimeout(() => {
            minimumTimePassed = true
            finishLoading()
        }, MINIMUM_TIME)

        const safetyTimer = setTimeout(() => {
            videoReady = true
            minimumTimePassed = true
            finishLoading()
        }, MAXIMUM_TIME)

        const progressInterval = setInterval(() => {
            if (progressValue < 85) {
                progressValue += 1

                setProgress(
                    Math.min(
                        85,
                        Math.floor(progressValue)
                    )
                )
            }
        }, 45)

        const handleVideoReady = () => {
            videoReady = true
            finishLoading()
        }

        if (isMobile) {
            window.addEventListener(
                "home-video-ready",
                handleVideoReady
            )
        }

        return () => {
            clearTimeout(minimumTimer)
            clearTimeout(safetyTimer)
            clearInterval(progressInterval)

            window.removeEventListener(
                "home-video-ready",
                handleVideoReady
            )
        }
    }, [mounted])

    if (isProjectDetail) return null

    if (!mounted) return null

    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    return (
        <header className="fixed inset-0 z-[9999] pointer-events-none">

            {loading && (
                <LoadingScreen
                    progress={progress}
                    exiting={exiting}
                />
            )}

            {pageReady && (
                <div className="relative z-[10001]">

                    {/* DESKTOP */}

                    <div
                        className="
                            hidden
                            md:block
                            pointer-events-none
                            fixed
                            inset-0
                            md:mx-30
                        "
                    >
                        <Logo />

                        <div
                            className={`
                                pointer-events-auto
                                absolute
                                right-40
                                transition-all
                                duration-1000
                                ease-[cubic-bezier(.22,1,.36,1)]
                                mix-blend-difference
                                ${isHome
                                    ? "top-1/2 -translate-y-1/2"
                                    : "top-10"
                                }
                            `}
                        >
                            <nav
                                className="
                                    uppercase
                                    text-xs
                                    text-white
                                    opacity-80
                                    font-plex
                                    font-light
                                    tracking-[0.1rem]
                                "
                            >
                                <ul className="flex gap-9">
                                    {links.map((link) => {
                                        const isActive = pathname === link.href

                                        return (
                                            <li
                                                key={link.href}
                                                className="
                    relative
                    flex
                    items-center
                "
                                            >
                                                {isActive && (
                                                    <span
                                                        className="
                            absolute
                            -left-3
                            top-1/2
                            -translate-y-1/2
                            w-1
                            h-1
                            rounded-full
                            bg-white
                        "
                                                    />
                                                )}

                                                <Link
                                                    href={link.href}
                                                    className={`
                        transition-all
                        duration-300
                        mix-blend-difference
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

                                    {user && (
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="
                    text-white
                    opacity-70
                    transition-all
                    duration-300
                    hover:opacity-100
                "
                                            >
                                                LOGOUT
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* MOBILE */}

                    <div
                        className="
                            md:hidden
                            pointer-events-auto
                            fixed
                            top-0
                            left-0
                            right-0
                        "
                    >
                        <MobileHeader
                            links={links}
                            pathname={pathname}
                        />
                    </div>

                </div>
            )}

        </header>
    )
}
