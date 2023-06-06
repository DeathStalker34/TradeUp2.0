import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { SafeUser, safeListings } from "../types";

import useLoginModal from "./useLoginModal";

interface IUseLike {
    listing: safeListings
    currentUser?: SafeUser | null
}

const useLike = ({
    listing,
    currentUser
}: IUseLike) => {
    const router = useRouter()
    const logiModal = useLoginModal()

    const hasLiked = useMemo(() => {

        const list = listing.likeIds || []
        const userId = currentUser?.id || ""

        return list.includes(userId)

    }, [currentUser, listing])

    console.log(hasLiked)

    const toggleLike = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation()

        if (!currentUser) {
            return logiModal.onOpen()
        }

        try {
            let request
            let respuesta
            if (hasLiked) {
                request = () => axios.delete(`/api/likes/${listing.id}`)
                respuesta = "Like eliminado"
            } else {
                request = () => axios.post(`/api/likes/${listing.id}`)
                respuesta = "Like"
            }

            await request()
            router.refresh()
            toast.success(respuesta)
        } catch (error) {
            toast.error('Algo salió mal')
        }
    }, [currentUser, hasLiked, listing, logiModal, router])

    return {
        hasLiked,
        toggleLike
    }
}

export default useLike