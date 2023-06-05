import bcrypt from 'bcrypt'
import prisma from "@/app/libs/prismadb"
import { NextResponse } from 'next/server'

export async function POST(
    request: Request
) {
    const body = await request.json()
    const {
        email,
        name,
        password
    } = body

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        console.log("Email no valido")
        return new NextResponse('El formato del correo electrónico es incorrecto', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    })

    return NextResponse.json(user)
}