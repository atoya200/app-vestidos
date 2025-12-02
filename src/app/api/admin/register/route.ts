import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const username = (body.username || "").trim();
    const email = (body.email || "").trim();
    const password = (body.password || "").trim();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // Opcional: validaciones simples
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const checkQuery = `
      SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1
    `;
    const exists = await pool.query(checkQuery, [username, email]);

    if (exists.rowCount != null && exists.rowCount > 0) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const insertQuery = `
      INSERT INTO users (username, password_hash, email)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;

    const { rows } = await pool.query(insertQuery, [
      username,
      passwordHash,
      email,
    ]);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: rows[0],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
