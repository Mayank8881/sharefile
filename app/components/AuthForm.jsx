"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAPI, signupAPI } from "../endpoints/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
const AuthForm = ({ isLogin = true }) => {
    const router=useRouter();
    const[val,setVal]=useState({name:"",email:"",password:""});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleChange=(e)=>{
        setVal({...val,[e.target.name]:e.target.value});
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      if (isLogin) {
          const error = await loginAPI(val);
          if (!error) {
              setSuccess("Login successful! Redirecting...");
              setTimeout(() => router.push('/home'), 1000);
          } else {
              setError(error.message || "Invalid credentials. Please try again.");
          }
      } else {
          const error = await signupAPI(val);
          if (!error) {
              setSuccess("Signup successful! Redirecting...");
              setTimeout(() => router.push('/home'), 1000);
          } else {
              setError(error.message || "Signup failed. Please try again.");
          }
      }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl border-0">
        {/* Left: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-white rounded-l-lg">
          <CardHeader className="mb-4">
            <CardTitle className="text-3xl font-bold mb-2 text-left bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <p className="text-muted-foreground text-base mb-4">
              {isLogin ? "Login to your ShareFile account" : "Sign up to start sharing files securely."}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">Username</Label>
                  <Input
                    className="mt-1"
                    id="name"
                    name="name"
                    type="text"
                    value={val.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email" className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">Email</Label>
                <Input
                  className="mt-1"
                  id="email"
                  name="email"
                  type="email"
                  value={val.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">Password</Label>
                <Input
                  className="mt-1"
                  id="password"
                  name="password"
                  type="password"
                  value={val.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mt-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mt-2">
                  {success}
                </div>
              )}
              <button className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-md py-2 transition-colors text-lg shadow">
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <div className="text-center text-sm mt-2">
                {isLogin ? (
                  <span>
                    New user?{' '}
                    <Link href="/signup" className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">Register</Link>
                  </span>
                ) : (
                  <span>
                    Have an account?{' '}
                    <Link href="/login" className=" bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">Login</Link>
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </div>
        {/* Right: Illustration/Branding */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-r-lg relative">
          <div className="flex flex-col items-center justify-center w-full h-full p-8">
            {/* <Image src="/next.svg" alt="ShareFile Logo" width={80} height={80} className="mb-6 drop-shadow-lg" /> */}
            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">ShareFile</h2>
            <p className="text-blue-100 text-lg text-center max-w-xs mb-6">Secure, fast, and reliable file sharing for everyone.</p>
            <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center">
              <Image src="/auth.png" alt="File Illustration" width={100} height={100} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;