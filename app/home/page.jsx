// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import { createClient } from "../utils/supabase/client"
// // import Dashboard from "../../components/dashboard/dashboard"
// // import { getDocsAPI } from "../endpoints/docs"
// // import DashboardSkeleton from "../../components/dashboard/dashboard-skeleton"

// // export default function Home() {
// //   const [user, setUser] = useState(null)
// //   const [data, setData] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const router = useRouter()

// //   useEffect(() => {
// //     const supabase = createClient()

// //     async function fetchUser() {
// //       try {
// //         setLoading(true)
// //         const { data: userData, error } = await supabase.auth.getUser()

// //         if (error || !userData.user) {
// //           router.push("/login")
// //           return
// //         }

// //         setUser(userData.user)
// //         const docs = await getDocsAPI(userData.user.id)
// //         setData(docs)
// //       } catch (error) {
// //         console.error("Error fetching user data:", error)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchUser()
// //   }, [router])

// //   if (loading) {
// //     return <DashboardSkeleton />
// //   }

// //   return <Dashboard data={data} user={user} />
// // }


// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "../utils/supabase/client";
// import Content from "./Content";
// import { getDocsAPI } from "../endpoints/docs";

// export default function Home() {
//     const [user, setUser] = useState(null);
//     const [data, setData] = useState(null);
//     const router = useRouter();

//     useEffect(() => {
//         const supabase = createClient();

//         async function fetchUser() {
//             const { data, error } = await supabase.auth.getUser();
//             if (error || !data.user) {
//                 router.push("/login");
//             } else {
//                 setUser(data.user);
//                 const docs = await getDocsAPI(data.user.id); // Fetch only user's files
//                 setData(docs);
//             }
//         }

//         fetchUser();
//     }, []);

//     if (!user) return <p>Loading...</p>;

//     return <Content data={data} user={user} />;
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import Content from "./Content";
import { getDocsAPI } from "../endpoints/docs";
import { Loader2, ShieldAlert } from "lucide-react";

export default function Home() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        async function fetchUser() {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error || !data.user) {
                    router.push("/login");
                    return;
                }
                
                setUser(data.user);
                
                try {
                    const docs = await getDocsAPI(data.user.id);
                    setData(docs);
                } catch (err) {
                    console.error("Error fetching documents:", err);
                    setError("Failed to load your files. Please try again later.");
                }
            } catch (err) {
                console.error("Authentication error:", err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your files...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md p-6 bg-destructive/5 rounded-lg">
                    <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) return null; // Router will handle redirect

    return (
        <div className="bg-background min-h-screen ">
            <Content data={data} user={user} />
        </div>
    );
}