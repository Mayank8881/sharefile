import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <div className="text-black">
    <AuthForm isLogin={false} />;
    </div>
  )
}