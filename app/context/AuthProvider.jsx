"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        async function checkUser() {
            try {
                const { data: session, error } = await supabase.auth.getSession();
                console.log("Session data:", session);

                if (error || !session?.session) {
                    router.replace("/login");
                } else {
                    setUser(session.session.user);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        checkUser();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}
