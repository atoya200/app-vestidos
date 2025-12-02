import { NextResponse } from "next/server";
import { setAdminSession, verifyCsrfToken } from "@/lib/CsrfSessionManagement";
import { getUserByUsername } from "@/lib/dao/userDao";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const csrf = form.get("csrf")?.toString() ?? null;
    if (!verifyCsrfToken(csrf)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 400 });
    }

    const username = (form.get("username") || "").toString();
    const password = (form.get("password") || "").toString();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 🔍 Llamada al DAO
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔐 Crear sesión
    await setAdminSession();

    // Redirección al admin
    return NextResponse.redirect(new URL("/admin", req.url));
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
