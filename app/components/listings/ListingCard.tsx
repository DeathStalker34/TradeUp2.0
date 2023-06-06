'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import useCountries from "@/app/hooks/useCountries";
import {
  safeListings,
  SafeUser
} from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";
import ClientOnly from "../ClientOnly";
import { AiFillLike } from "react-icons/ai";

interface ListingCardProps {
  data: safeListings;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const nLikes = data.likeIds.length

  let titulo = ""

  if (data.title.length >= 50) {

    titulo = data.title.slice(0, 50) + "...";

  } else {

    titulo = data.title

  }

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  const price = useMemo(() => {
    return data.price;
  }, [data.price]);

  return (
    <div
      onClick={() => router.push(`/serveis/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="
            absolute
            top-3
            right-3
          ">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {titulo}
        </div>
        <div className="flex justify-between">
          <div className="font-light text-neutral-500">
            {data.category}
          </div>
          <div className="flex flex-row gap-2">
            {nLikes}
            <AiFillLike size={20} />
          </div>

        </div>
        {data.price != 0 && (
          <div className="flex flex-row items-center gap-1">
            <div className="font-semibold">
              {price} €
            </div>
          </div>
        )}

        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ListingCard;