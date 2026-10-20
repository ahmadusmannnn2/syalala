"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { UtensilsCrossed, Eye, EyeOff, CheckCircle2, ArrowLeft, Lock } from "lucide-react";

export default function AdminLoginPage() {
  return <LoginForm />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("Syalala");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("restaurant_settings")
      .select("logo_url, name")
      .single()
      .then(({ data }) => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
        if (data?.name) setRestaurantName(data.name);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data?.session) {
        setError(authError?.message || "Email atau password salah. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      setSuccess("Login berhasil! Mengalihkan ke dashboard admin...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header Seragam dengan Customer */}
      <header className="sticky top-0 z-40 bg-[#e6203b] text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center text-[#e6203b] overflow-hidden border border-white/20">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <UtensilsCrossed className="h-4.5 w-4.5 stroke-[2.5]" />
              )}
            </div>
            <span className="font-black text-lg text-white tracking-tight">{restaurantName}</span>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          {/* Card Login Seragam Merah Mewah */}
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#e6203b] via-[#c41833] to-[#8b0f22] p-6 text-white text-center relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/20 mb-3 shadow-inner">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight">Masuk Admin</h1>
              <p className="text-xs text-white/85 mt-1">
                Kelola menu, harga, dan promo Syalala
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@syalala.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e6203b]/30 focus:border-[#e6203b] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Lihat password"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-2xl font-bold mt-2 shadow-lg shadow-[#e6203b]/25"
                  isLoading={loading}
                >
                  Masuk ke Dashboard
                </Button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Syalala Digital Menu © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
