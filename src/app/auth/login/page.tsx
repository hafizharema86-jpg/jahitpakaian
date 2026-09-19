"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "checking">("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(res => res.ok ? res.json() : null).catch(() => null),
      fetch("/api/auth/user/me").then(res => res.ok ? res.json() : null).catch(() => null)
    ]).then(([adminRes, userRes]) => {
      if (adminRes) {
        window.location.href = "/admin";
      } else if (userRes) {
        const redirect = searchParams.get("redirect");
        if (redirect === "whatsapp") {
          window.location.href = "https://wa.me/6281234567890?text=Halo%20JahitPakaian,%20saya%20ingin%20konsultasi";
        } else if (redirect) {
          window.location.href = redirect;
        } else {
          router.push("/");
        }
      } else {
        setStatus("idle");
      }
    });
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const endpoint = isLogin ? "/api/auth/user/login" : "/api/auth/user/register";
    const body = isLogin 
      ? { email, password } 
      : { email, password, name, phone };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "ADMIN") {
          window.location.href = "/admin";
          return;
        }
        
        // Redirect to whatsapp if specified
        const redirect = searchParams.get("redirect");
        if (redirect === "whatsapp") {
          window.location.href = "https://wa.me/6281234567890?text=Halo%20JahitPakaian,%20saya%20ingin%20konsultasi";
        } else if (redirect) {
          window.location.href = redirect;
        } else {
          router.push("/");
        }
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Gagal masuk");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Tidak dapat terhubung ke server");
    }
  };

  if (status === "checking") {
    return (
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md mx-4 min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c7646b] mb-4"></div>
        <p className="text-gray-500 font-medium">Memeriksa sesi Anda...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md mx-4">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isLogin 
            ? "Silakan masuk untuk melanjutkan pemesanan Anda." 
            : "Daftar untuk mulai memesan pakaian custom Anda."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#c7646b] focus:ring-1 focus:ring-[#c7646b] transition-all"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Nomor WhatsApp (Opsional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#c7646b] focus:ring-1 focus:ring-[#c7646b] transition-all"
                placeholder="0812..."
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#c7646b] focus:ring-1 focus:ring-[#c7646b] transition-all"
            placeholder="email@contoh.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#c7646b] focus:ring-1 focus:ring-[#c7646b] transition-all"
            placeholder="••••••••"
          />
        </div>

        {status === "error" && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#c7646b] hover:bg-[#b0585e] text-white font-bold py-3.5 rounded-xl transition-all mt-4 disabled:opacity-50"
        >
          {status === "loading" ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#c7646b] font-semibold hover:underline"
        >
          {isLogin ? "Daftar di sini" : "Masuk di sini"}
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f7f4] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 h-96 flex items-center justify-center text-gray-500">Memuat...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
