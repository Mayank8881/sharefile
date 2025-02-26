"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import {logoutAPI} from '../endpoints/auth';

const Navigation = () => {
  const router=useRouter();
  const supabase=createClient();
  const [user, setUser] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? false);
    });
  }, []);

  const handleLogout=async()=>{
    await logoutAPI();
    router.replace('/login');
  }

  return (
    <nav className="bg-slate-800 text-white py-5 px-10 flex justify-between items-center">
      <Link href="/">
        <h3 className="font-bold text-xl">FileShare</h3>
      </Link>
      <ul className="flex space-x-4">
        {user ?(
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ):(
          <>
          <li>
          <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/signup">Signup</Link>
          </li>
          </>
        )}
        
        
      </ul>
    </nav>
  );
};

export default Navigation;