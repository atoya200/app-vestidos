// app/admin/login/LoginForm.tsx

'use client';
import { useState } from "react";

export default function LoginForm({ csrf }: { csrf: string }) {
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const res = await fetch("/api/admin/login", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            try {
                const data = await res.json();
                setError(data.error || "Invalid credentials");
            } catch {
                setError("Server error");
            }
            return;
        }


        // Login ok → redirect
        window.location.href = "/admin";
    };



    return (
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="grid gap-6">
                <input type="hidden" name="csrf" value={csrf} />

                <input
                    name="username"
                    placeholder="Username"
                    className="rounded-xl border px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="rounded-xl border px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-fuchsia-600 text-white px-4 py-4 text-base font-semibold hover:bg-fuchsia-700 transition-colors"
                >
                    Sign in
                </button>

                <p className="text-sm text-slate-500 mt-2">Protected area. Authorized staff only.</p>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
}
