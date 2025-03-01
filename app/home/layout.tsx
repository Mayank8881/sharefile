import Navigation from "../components/Navigation";
import AuthProvider from "../context/AuthProvider";
import Footer from "../components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* Authentication applied only to /home and its subroutes */}
      <Navigation />
      {children}
      <Footer/>
    </AuthProvider>
  );
}
