"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        async function checkUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push("/login");
            } else {
                setUser(data.user);
            }
        }

        checkUser();
    }, []);

    if (!user) return <p>Loading...</p>;

    return <>{children}</>;
}
