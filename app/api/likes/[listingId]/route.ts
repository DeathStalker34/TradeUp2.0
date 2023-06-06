import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getListingById from "@/app/actions/getListingById";

interface IParams {
    listingId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
    const curretUser = await getCurrentUser()

    if (!curretUser) {
        return NextResponse.error()
    }

    const { listingId } = params

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('ID no valido')
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
        }
    });

    if (!listing) {
        throw new Error('Servicio no encontrado')
    }

    let likeIds = [...(listing.likeIds || [])]

    likeIds.push(curretUser.id)

    const updatedListing = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            likeIds
        }
    })

    return NextResponse.json(updatedListing)
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    const curretUser = await getCurrentUser()

    if (!curretUser) {
        return NextResponse.error()
    }

    const { listingId } = params

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('ID no valido')
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
        }
    });

    if (!listing) {
        throw new Error('Servicio no encontrado')
    }

    let likeIds = [...(listing.likeIds || [])]

    likeIds = likeIds.filter((id) => id !== curretUser.id)

    const updatedListing = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            likeIds
        }
    })

    return NextResponse.json(updatedListing)
}