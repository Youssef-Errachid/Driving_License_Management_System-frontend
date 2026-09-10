import LoginIllustration from "../components/LoginIllustration";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <main className="min-h-screen flex bg-gray-50">
      <LoginIllustration />

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <LoginForm />
      </section>
    </main>
  );
};

export default Login;
