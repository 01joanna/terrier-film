import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <header className="absolute mt-10 z-10 flex px-40 text-xs font-plex uppercase tracking-widest items-center justify-between w-screen">
            <div>
                <Link href={"/"}>Terrier</Link>
            </div>
            <div>
                <nav>
                    <ul  className="flex gap-4">
                        <Link
                        href={"/work"}>
                            Work
                        </Link>
                        <Link
                        href={"/contact"}>
                            Contact
                        </Link>
                        <Link
                        href={"/admin/login"}>
                            Login
                        </Link>
                        
                    </ul>
                </nav>
            </div>
        </header>
    )
}