"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Footer from "./components/Footer"
import {
  UploadCloud,
  Share2,
  Download,
  Shield,
  Cloud,
  Zap,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  Clock,
  BarChart,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}
      <nav
        className={`w-full z-50 transition-all duration-300 border-b ${isScrolled ? "fixed bg-background/95 backdrop-blur-sm shadow-sm" : "relative bg-background"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <div className="bg-primary rounded-md p-1.5">
                  <UploadCloud className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
              <span className="text-2xl font-bold text-foreground">ShareFile</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
              <Link href="/login">
                <Button variant="outline" className="mr-2">
                  Log in
                </Button>
              </Link>
              <Link href="/home">
                <Button>Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <div className="flex space-x-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/home" className="flex-1">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-br from-primary/90 to-blue-600 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-6">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Secure File Sharing Made Simple
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Share Files <span className="text-violet-300 text-5xl">Securely</span> With Anyone
              </h1>

              <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto md:mx-0">
                Upload, share, and manage your files with enterprise-grade security. No size limits, no complications.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/home">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black hover:bg-white/10 hover:text-white w-full sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="text-sm opacity-80 pt-2">No credit card required • Free plan available</div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 p-2 transform rotate-1 hover:-rotate-6 transition-transform duration-500">
                <Image
                  src="/logo8.jpg"
                  width={800}
                  height={900}
                  alt="FileShare Dashboard"
                  className="rounded shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-300" />
                  <div>
                    <div className="font-medium">End-to-End Encrypted</div>
                    <div className="text-sm opacity-80">Your files are protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      {/* <section className="py-8 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Files Shared", value: "10M+" },
              { label: "Active Users", value: "500K+" },
              { label: "Countries", value: "150+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <Badge variant="outline" className="mb-4">
        Simple Process
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">How FileShare Works</h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Share your files in three simple steps, no technical knowledge required.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 relative">
      {/* Connection lines (only visible on md and up) */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent -z-10 transform -translate-y-1/2"></div>

      {[
        {
          title: "Upload Your Files",
          desc: "Drag & drop or select files to upload securely to our platform.",
          icon: <UploadCloud size={32} />,
          step: 1,
        },
        {
          title: "Generate Secure Link",
          desc: "Create password-protected links with expiration dates.",
          icon: <Share2 size={32} />,
          step: 2,
        },
        {
          title: "Recipients Download",
          desc: "Share the link with anyone who needs access to your files.",
          icon: <Download size={32} />,
          step: 3,
        },
      ].map((item, index) => (
        <Card
          key={index}
          className="border-0 group relative overflow-hidden hover:shadow-blue-200 dark:hover:shadow-blue-900/20 hover:translate-y-[-5px] transition-all duration-300"
        >
          {/* Animated border effect - top */}
          <div className="absolute top-0 left-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-700 ease-in-out"></div>
          {/* Animated border effect - right (delayed) */}
          <div className="absolute top-0 right-0 w-0.5 h-0 bg-blue-800 group-hover:h-full transition-all duration-700 ease-in-out delay-700"></div>
          {/* Animated border effect - bottom (more delayed) */}
          <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-700 ease-in-out delay-1400"></div>
          {/* Animated border effect - left (most delayed) */}
          <div className="absolute bottom-0 left-0 w-0.5 h-0 bg-blue-800 group-hover:h-full transition-all duration-700 ease-in-out delay-2100"></div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-primary-foreground transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <Badge variant="outline" className="bg-muted border border-blue-600 dark:border-blue-800">
                Step {item.step}
              </Badge>
            </div>
            <CardTitle className="text-xl group-hover:text-blue-900 dark:group-hover:text-blue-600 transition-colors duration-300">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mt-12 text-center">
      <Link href="/home">
        <Button className="group bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-800 transition-all duration-300">
          Start Sharing Now
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  </div>
</section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              FileShare combines security, ease of use, and powerful features to make file sharing simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "End-to-End Encryption",
                desc: "Your files are encrypted before they leave your device and can only be decrypted by recipients.",
                icon: <Shield className="h-10 w-10 text-blue-500" />,
              },
              {
                title: "Cloud Storage",
                desc: "Store your files securely in the cloud and access them from any device, anywhere.",
                icon: <Cloud className="h-10 w-10 text-blue-500" />,
              },
              {
                title: "Fast & Reliable",
                desc: "Enjoy high-speed uploads and downloads with our globally distributed network.",
                icon: <Zap className="h-10 w-10 text-blue-500" />,
              },
              {
                title: "Password Protection",
                desc: "Add an extra layer of security with password-protected links.",
                icon: <Shield className="h-10 w-10 text-blue-500" />,
              },
              {
                title: "Expiration Dates",
                desc: "Set links to expire after a certain time or number of downloads.",
                icon: <Clock className="h-10 w-10 text-blue-500" />,
              },
              {
                title: "File Analytics",
                desc: "Track who viewed and downloaded your files with detailed analytics.",
                icon: <BarChart className="h-10 w-10 text-blue-500" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-blue-200 dark:hover:shadow-blue-900/20 hover:translate-y-[-5px] transition-all duration-300 overflow-hidden border bg-background"
              >
                <div className="absolute h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-0 group-hover:w-full transition-all duration-500 top-0 left-0"></div>
                <CardHeader>
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who trust FileShare for their file sharing needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Marketing Director",
                review:
                  "FileShare has transformed how our team shares assets with clients. The security features give us peace of mind, and the interface is intuitive.",
                avatar: "/boy.png",
              },
              {
                name: "Sarah Smith",
                role: "Freelance Designer",
                review:
                  "As a freelancer, I need to share large design files daily. FileShare makes it simple and professional. The password protection is a game-changer!",
                avatar: "/woman.png",
              },
              {
                name: "Michael Johnson",
                role: "IT Manager",
                review:
                  "The end-to-end encryption and detailed access logs meet our strict security requirements. FileShare is now our company standard for file sharing.",
                avatar: "/gamer.png",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground italic">"{testimonial.review}"</p>
                  <div className="mt-6 flex items-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/90 to-blue-600 text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Sharing?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust FileShare for secure, fast, and reliable file sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">No credit card required • Free plan available • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage

