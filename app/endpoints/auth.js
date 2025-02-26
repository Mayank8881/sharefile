"use client"
import { createClient} from '../utils/supabase/client'

const supabase =createClient()

export const signupAPI = async (val) =>{
    const res=await supabase.auth.signUp({
        email: val.email,
        password: val.password
    })

    if(!res.error){
        const {error}=await supabase.from('user').insert([
            {id: res.data.user.id,name: val.name,email: val.email}
        ])
        return error;
    }
}

export const logoutAPI = async () => await supabase.auth.signOut()

export const loginAPI = async (val) =>{
    const res=await supabase.auth.signInWithPassword({
        email: val.email,
        password: val.password
    })
    return res.error;
}
// export const signupAPI = async (val) => {
//     const supabase = createClient(); // Ensure the client is initialized properly
  
//     const { data, error } = await supabase.auth.signUp({
//       email: val.email,
//       password: val.password,
//     });
  
//     console.log("Signup Response:", data, error); // Debugging
  
//     if (error) {
//       console.error("Signup Error:", error.message);
//       return error;
//     }
  
//     if (data.user) {
//       const { error: insertError } = await supabase.from("user").insert([
//         { id: data.user.id, name: val.name, email: val.email },
//       ]);
  
//       if (insertError) {
//         console.error("Database Insert Error:", insertError.message);
//       }
  
//       return insertError;
//     }
//   };
  