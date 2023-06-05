import prisma from '@/app/libs/prismadb'
import { use } from 'react'

export interface IListingsParams {
    userId?: string
    category?: string
    servicio?: string
    locationValue?: string
}

// listado de servicios ordenados por fecha de creación
export default async function GetListings(
    params: IListingsParams
) {
    try {
        const { userId, category, servicio, locationValue } = params

        let query: any = {}

        if (userId) {
            query.userId = userId
        }

        if (category) {
            query.category = category
        }

        if (servicio) {
            query.title = { contains: servicio, mode: 'insensitive' }
        }

        if (locationValue) {
            query.locationValue = locationValue
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        })
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString()
        }))

        return safeListings

    } catch (error: any) {
        throw new Error(error)
    }
}