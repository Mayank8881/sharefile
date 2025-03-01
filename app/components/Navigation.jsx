"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import {logoutAPI} from '../endpoints/auth';
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    router.replace('/');
  }

  return (
    <nav className="bg-white text-black py-5 px-10 flex justify-between items-center">
      <Link href="/">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-md p-1.5">
            <UploadCloud className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">ShareFile</span>
        </div>
      </div>
      </Link>
      
      <ul className="flex space-x-4">
        {user ?(
          <li>
            <Button onClick={handleLogout} variant="outline" className="mr-2">
              Logout
            </Button>
          </li>
        ):(
          <>
          <li>
          <Link href="/login">
            <Button variant="outline" className="mr-2">
              Log in
            </Button>
          </Link>
          </li>
          <li>
            <Link href="/signup">
              <Button variant="outline" className="mr-2">
                Sign-Up
              </Button>
            </Link>
          </li>
          </>
        )}
        
        
      </ul>
    </nav>
  );
};

export default Navigation;