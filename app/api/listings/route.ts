import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(request: Request) {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }

    const body = await request.json()
    const {
        title,
        description,
        imageSrc,
        category,
        location,
        price
    } = body

    if (imageSrc.length === 0 || location.length === 0 || category.length === 0) {
        return new NextResponse('Campos vacios', { status: 400 })
    }

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    })

    return NextResponse.json(listing)
}