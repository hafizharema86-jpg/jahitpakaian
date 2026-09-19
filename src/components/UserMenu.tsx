"use client";

import { useState, useEffect, useRef } from "react";

export default function UserMenu() {
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check both user and admin endpoints
    Promise.all([
      fetch("/api/auth/me").then(res => res.ok ? res.json() : null).catch(() => null),
      fetch("/api/auth/user/me").then(res => res.ok ? res.json() : null).catch(() => null)
    ]).then(([adminRes, userRes]) => {
      if (adminRes && adminRes.admin) {
        setUser({ ...adminRes.admin, role: "ADMIN" });
      } else if (userRes && userRes.user) {
        setUser({ ...userRes.user, role: "USER" });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="text-[#475569] hover:text-[#c7646b] transition-colors font-semibold text-sm"
      >
        Login
      </a>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center hover:scale-105 transition-transform"
      >
        <div className="w-10 h-10 rounded-full bg-[#06371c] text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
          {user.name.substring(0, 1)}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          {user.role === "ADMIN" && (
            <a href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#06371c] transition-colors">
              Dashboard Admin
            </a>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
