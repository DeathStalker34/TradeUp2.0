'use client'

import useCountries from "@/app/hooks/useCountries";
import { SafeUser, safeListings } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { AiOutlineLike } from "react-icons/ai";
import LikeButton from "../LikeButton";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Button from "../Button";
import { useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";

const Map = dynamic(() => import('../Map'), {
    ssr: false
})

interface ListingInfoProps {
    user: SafeUser
    description: string
    category: {
        icon: IconType
        label: string
        description: string
    } | undefined
    locationValue: string
    likes: string[]
    listing: safeListings
    currentUser?: SafeUser | null
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    category,
    locationValue,
    likes,
    listing,
    currentUser
}) => {

    const { getByValue } = useCountries()

    const router = useRouter()
    const nLikes = likes.length
    const coordinates = getByValue(locationValue)?.latlng

    const [isLoading, setIsLoading] = useState(false)
    const loginModal = useLoginModal()

    const handleClick = useCallback(() => {

        if (!currentUser) {
            return loginModal.onOpen()
        }

        setIsLoading(true)

        axios.post('/api/conversations', {
            userId: user.id
        })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`)
            })
            .finally(() => setIsLoading(false))
    }, [loginModal, currentUser, user, router])


    return (
        <div className="col-span-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="
                    text-xl
                    font-semibold
                    flex
                    
                    justify-between
                    items-center
                    gap-2
                ">
                    <div className="flex flex-row items-center gap-2">
                        <div>Servicio de {user?.name}</div>
                        <Avatar src={user?.image} />

                    </div>

                    <div className=" flex flex-row gap-2 items-center">
                        {nLikes}
                        <LikeButton
                            listing={listing}
                            currentUser={currentUser}
                        />

                    </div>

                </div>
                <div className="
                    flex
                    flex-row
                    items-center
                    gap-4
                    font-light
                    text-neutral-500
                ">
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <hr />
            <Map center={coordinates} />
            <hr />

            <Button
                label="Contactar con el usuario"
                disabled={isLoading}
                onClick={handleClick}
            />
        </div>
    );
}

export default ListingInfo;