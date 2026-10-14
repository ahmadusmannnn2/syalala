"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  return <LoginForm />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6203b]/5 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6203b] mb-4 shadow-lg shadow-[#e6203b]/30">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Syalala</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Masuk</h2>
          <p className="text-sm text-gray-500 mb-5">Login untuk mengelola menu dan konten.</p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Masuk
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Syalala Admin Panel © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
