import Image from "next/image"
import { usePathname } from "next/navigation"


export default function Logo() {
    const pathname = usePathname()

    const isHome = pathname === "/"
    return (
        <div
                className={`
        pointer-events-auto absolute left-20
        transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]
        ${
            isHome
                ? "top-1/2 -translate-y-1/2 scale-100"
                : "top-10 translate-y-0 scale-100"
        }
                    
    `}
            >
                <Image src="/logo.png" alt="logo" width={200} height={200} />
            </div>
    )
}