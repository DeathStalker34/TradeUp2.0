import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListing from "../actions/getFavoriteListings";
import FavoritesClient from "./FavoritesClient";


const ListingPage =async () => {

    const listings = await getFavoriteListing()
    const currentUser = await getCurrentUser()

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No se han encontrado servicios"
                    subtitle="Parece que no has añadido ningun servicio a tu lista de favoritos"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings = {listings}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )

}

export default ListingPage