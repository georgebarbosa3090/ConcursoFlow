import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ erro: "Dados incompletos. Preencha todos os campos." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ erro: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ erro: "Este e-mail já está em uso." }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT"
      }
    });

    return NextResponse.json({ sucesso: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ erro: "Falha interna ao tentar criar a conta." }, { status: 500 });
  }
}
