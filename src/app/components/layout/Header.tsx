"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname()

    const isHome = pathname === "/"
    const isProjectDetail = pathname.startsWith("/project/")


    const links = [
        { href: "/", label: "Home" },
        { href: "/work", label: "Projects" },
        { href: "/about", label: "About" },
        { href: "/talents", label: "Talents" }
    ]

    if (isProjectDetail) return null

    return (
        <header
            className={`
        fixed inset-0 z-[9999] pointer-events-none mx-20
        transition-all duration-700 ease-in-out
    `}
        >

            {/* LOGO */}
            <div
                className={`
        pointer-events-auto absolute left-20
        transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]
        ${
            isHome
                ? "top-1/2 -translate-y-1/2 scale-100"
                : "top-10 translate-y-0 scale-140"
        }
                    
    `}
            >
                <Image src="/logo.png" alt="logo" width={200} height={200} />
            </div>

            {/* NAV */}
            <div
                className={`
        pointer-events-auto absolute right-20
        transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]
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
                                <li key={link.href} className="relative flex items-center">
                                    {isActive && (
                                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
                                    )}

                                    <Link
                                        href={link.href}
                                        className={`
                                            transition-all duration-300
                                            ${isActive
                                                ? "text-white opacity-100"
                                                : "text-white/60 opacity-70"
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
        </header>
    )
}