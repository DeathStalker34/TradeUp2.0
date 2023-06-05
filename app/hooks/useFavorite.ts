import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
    listingId: string
    currentUser?: SafeUser | null
}

const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter()
    const logiModal = useLoginModal()

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || []

        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (
        e:React.MouseEvent<HTMLDivElement>
        ) => {
        e.stopPropagation()

        if (!currentUser) {
            return logiModal.onOpen()
        }

        try {
            let request
            let respuesta
            if (hasFavorited) {
                request = () => axios.delete(`/api/favorites/${listingId}`)
                respuesta = "Eliminado de favoritos"
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`)
                respuesta = "Añadido a favoritos"
            }

            await request()
            router.refresh()
            toast.success(respuesta)
        } catch (error) {
            toast.error('Algo salió mal')
        }
    }, [currentUser, hasFavorited, listingId, logiModal, router])

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite