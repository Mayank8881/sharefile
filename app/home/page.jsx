"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import Content from "./Content";
import { getDocsAPI } from "../endpoints/docs";

export default function Home() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push("/login");
            } else {
                setUser(data.user);
                const docs = await getDocsAPI(data.user.id); // Fetch only user's files
                setData(docs);
            }
        }

        fetchUser();
    }, []);

    if (!user) return <p>Loading...</p>;

    return <Content data={data} user={user} />;
}
