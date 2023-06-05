import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id
    }
  });

  return NextResponse.json(listing);
}

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const {
      title,
      description,
      imageSrc,
      category,
      locationValue,
      price
    } = body

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const updateService = await prisma.listing.update({
      where: {
        id: currentUser.id //poner id del servicio
      },
      data: {
        title,
        description,
        imageSrc,
        category,
        locationValue,
        price,
      }
    })

    return NextResponse.json(updateService)

  } catch (error: any) {
    console.log(error, 'ERROR_SERVICE')
    return new NextResponse('InternalError', { status: 500 })
  }
}