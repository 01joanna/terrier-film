
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

type LinkItem = {
    href: string
    label: string
}

type MobileHeaderProps = {
    links: LinkItem[]
    pathname: string
}

export default function MobileHeader({
    links,
    pathname,
}: MobileHeaderProps) {
    const [open, setOpen] = useState(false)
    const [closing, setClosing] = useState(false)

    const router = useRouter()

    const handleNavigation = (href: string) => {
        setClosing(true)

        setTimeout(() => {
            setOpen(false)
            setClosing(false)
            router.push(href)
        }, 500)
    }

    const toggleMenu = () => {
        if (open) {
            setClosing(true)

            setTimeout(() => {
                setOpen(false)
                setClosing(false)
            }, 500)

            return
        }

        setOpen(true)
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[10001] px-4 py-5 flex items-center justify-between mx-10">

                <Link
                    href="/"
                    onClick={(e) => {
                        if (open) {
                            e.preventDefault()
                            handleNavigation("/")
                        }
                    }}
                    className="relative z-[10002] block"
                >
                    <Image
                        src="/icon.png"
                        alt="Icon"
                        width={40}
                        height={40}
                        className="brightness-0 invert"
                    />
                </Link>

                <button
                    onClick={toggleMenu}
                    aria-label={
                        open
                            ? "Close menu"
                            : "Open menu"
                    }
                    className="
                        relative
                        z-[10002]
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                    "
                >
                    <span className="relative w-6 h-5 flex items-center justify-center">

                        <span
                            className={`
                                absolute
                                left-0
                                w-6
                                h-[1px]
                                bg-white
                                transition-all
                                duration-300
                                ease-out
                                ${
                                    open
                                        ? "rotate-45"
                                        : "-translate-y-2"
                                }
                            `}
                        />

                        <span
                            className={`
                                absolute
                                left-0
                                w-6
                                h-[1px]
                                bg-white
                                transition-all
                                duration-300
                                ease-out
                                ${
                                    open
                                        ? "opacity-0"
                                        : "opacity-100"
                                }
                            `}
                        />

                        <span
                            className={`
                                absolute
                                left-0
                                w-6
                                h-[1px]
                                bg-white
                                transition-all
                                duration-300
                                ease-out
                                ${
                                    open
                                        ? "-rotate-45"
                                        : "translate-y-2"
                                }
                            `}
                        />

                    </span>
                </button>
            </header>


            <div
                className={`
                    fixed
                    inset-0
                    z-[10000]
                    bg-black
                    text-white
                    transition-all
                    duration-700
                    ease-[cubic-bezier(.22,1,.36,1)]
                    ${
                        open && !closing
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                    }
                `}
            >
                <div className="h-full flex flex-col px-4 py-5">

                    <nav className="flex-1 flex items-center mx-10">

                        <ul className="w-full">

                            {links.map(
                                (link, index) => {

                                    const isActive =
                                        pathname ===
                                        link.href

                                    return (
                                        <li
                                            key={
                                                link.href
                                            }
                                            className={`
                                                border-b
                                                border-white/20
                                                transition-all
                                                duration-700
                                                ${
                                                    open &&
                                                    !closing
                                                        ? "opacity-100 translate-y-0"
                                                        : "opacity-0 translate-y-8"
                                                }
                                            `}
                                            style={{
                                                transitionDelay:
                                                    open &&
                                                    !closing
                                                        ? `${index * 80}ms`
                                                        : "0ms",
                                            }}
                                        >

                                            <button
                                                onClick={() =>
                                                    handleNavigation(
                                                        link.href
                                                    )
                                                }
                                                className="
                                                    relative
                                                    w-full
                                                    flex
                                                    items-center
                                                    py-6
                                                    text-left
                                                    font-plex
                                                    uppercase
                                                    text-2xl
                                                    font-light
                                                    tracking-wider
                                                    group
                                                "
                                            >

                                                <span
                                                    className={`
                                                        absolute
                                                        left-0
                                                        w-1.5
                                                        h-1.5
                                                        rounded-full
                                                        bg-white
                                                        transition-all
                                                        duration-300
                                                        ${
                                                            isActive
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        }
                                                    `}
                                                />

                                                <span
                                                    className={`
                                                        transition-all
                                                        duration-300
                                                        ${
                                                            isActive
                                                                ? "translate-x-5 opacity-100"
                                                                : "translate-x-0 opacity-60 group-hover:opacity-100"
                                                        }
                                                    `}
                                                >
                                                    {link.label}
                                                </span>

                                            </button>

                                        </li>
                                    )
                                }
                            )}

                        </ul>

                    </nav>

                    <div className="
                        text-xs
                        uppercase
                        tracking-[0.15em]
                        font-plex
                        opacity-50
                        mx-10
                        pb-5
                    ">
                        © Terrier {new Date().getFullYear()}
                    </div>

                </div>
            </div>
        </>
    )
}
