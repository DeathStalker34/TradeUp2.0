import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string
}

export async function POST(request:Request, {params}: {params:IParams}) {
    const curretUser = await getCurrentUser()

    if (!curretUser) {
        return NextResponse.error()
    }

    const {listingId} = params

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('ID no valido')
    }

    let favoriteIds = [...(curretUser.favoriteIds || [])]

    favoriteIds.push(listingId)

    const user = await prisma.user.update({
        where: {
            id: curretUser.id
        },
        data: {
            favoriteIds
        }
    })

    return NextResponse.json(user)
}

export async function DELETE(request:Request, {params}: {params: IParams}) {
    const curretUser = await getCurrentUser()

    if (!curretUser) {
        return NextResponse.error() 
    }

    const {listingId} = params

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('ID no valido')
    }

    let favoriteIds = [...(curretUser.favoriteIds || [])]

    favoriteIds = favoriteIds.filter((id) => id !== listingId)

    const user = await prisma.user.update({
        where: {
            id: curretUser.id
        },
        data: {
            favoriteIds
        }
    })

    return NextResponse.json(user)
}