"use client"
import { createClient} from '../utils/supabase/client'

const supabase =createClient()

// export const signupAPI = async (val) => {
//     const { data, error } = await supabase.auth.signUp({
//         email: val.email,
//         password: val.password,
//     });

//     if (error) return error; // Return error if sign-up fails

//     if (data.user) {
//         const { error: insertError } = await supabase.from("user").insert([
//             { id: data.user.id, name: val.name, email: val.email },
//         ]);
//         return insertError;
//     }

//     return null; // No errors
// };


export const logoutAPI = async () => await supabase.auth.signOut()

// export const loginAPI = async (val) =>{
//     const res=await supabase.auth.signInWithPassword({
//         email: val.email,
//         password: val.password
//     })
//     return res.error;
// }


export const loginAPI = async (val) => {
    const {  error } = await supabase.auth.signInWithPassword({
        email: val.email,
        password: val.password,
    });

    if (error) return error;

    // Ensure session is active
    await supabase.auth.refreshSession();
    return null;
};

export const signupAPI = async (val) => {
    const { data, error } = await supabase.auth.signUp({
        email: val.email,
        password: val.password,
    });

    if (error) return error; // Return error if sign-up fails

    if (data.user) {
        const { error: insertError } = await supabase.from("user").insert([
            { id: data.user.id, name: val.name, email: val.email },
        ]);
        return insertError;
    }

    return null;
};
