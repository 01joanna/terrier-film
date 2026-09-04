"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full h-screen justify-center items-center">
            <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-700 p-3 w-[20%] rounded-sm text-xs"
            />

            <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 border-gray-700 w-[20%] rounded-sm text-xs"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
                type="submit"
                className="uppercase text-white border text-xs py-3 px-20 rounded-sm border-gray-700"
            >
                Entrar
            </button>
        </form>
    );
}