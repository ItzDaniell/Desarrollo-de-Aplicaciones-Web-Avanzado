"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (result?.ok) {
      router.push("/dashboard");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Sign In
        </h1>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
        >
          <FaGoogle />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
