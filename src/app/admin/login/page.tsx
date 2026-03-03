"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuthClient } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const auth = getAuthClient(); 
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin/dashboard"); 
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-10 flex flex-col gap-4 pt-40">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button className="bg-black text-white p-3">
                Entrar
            </button>
        </form>
    );
}
