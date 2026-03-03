import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/firebase";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let auth;
        try {
            auth = getAuthClient();
        } catch (e) {
            console.warn("Firebase Auth solo funciona en el cliente");
            setLoading(false);
            return;
        }

        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { user, loading };
};