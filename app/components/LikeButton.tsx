'use client'

import { AiFillHeart, AiFillLike, AiOutlineHeart, AiOutlineLike } from "react-icons/ai";
import { SafeUser, safeListings } from "../types";
import useFavorite from "../hooks/useFavorite";
import useLike from "../hooks/useLike"

interface LikeButtonProps {
    listing: safeListings
    currentUser?: SafeUser | null
}

const LikeButton: React.FC<LikeButtonProps> = ({
    listing,
    currentUser
}) => {

    const { hasLiked, toggleLike } = useLike({
        listing,
        currentUser
    })

    return (
        <div
            onClick={toggleLike}
            className="
                relative
                hover:opacity-80
                transition
                cursor-pointer
            "
        >
            <AiOutlineLike
                size={34}
                className="
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                "
            />
            <AiFillLike
                size={30}
                className={
                    hasLiked ? 'fill-blue-500' : 'fill-neutral-500/70'
                }
            />
        </div>
    );
}

export default LikeButton;