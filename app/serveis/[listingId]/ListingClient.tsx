'use client'

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { categories } from "@/app/components/navbar/Categories";
import { SafeUser, safeListings } from "@/app/types";
import { useMemo } from "react";

interface ListingClientProps {
    listing: safeListings & {
        user: SafeUser
    }
    currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    currentUser
}) => {
    // Obtener categoria
    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto bg-slate-100 rounded-lg p-10 border border-slate-300 drop-shadow-xl py-32">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                    ">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            locationValue={listing.locationValue}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ListingClient;