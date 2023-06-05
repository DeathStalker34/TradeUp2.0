'use client'

import getCurrentUser from "@/app/actions/getCurrentUser";
import Avatar from "@/app/components/AvatarChat";
import { FullMessageType, SafeUser } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";


interface MessageBoxProps {
    data: FullMessageType
    isLast?: boolean
    currentUser?: SafeUser | null
}
const MessageBox: React.FC<MessageBoxProps> = ({
    data,
    isLast,
    currentUser
}) => {

    const session = currentUser
    const [imageModalOpen, setImageModalOpen] = useState(false)

    const isOwn = session?.email === data?.sender?.email
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(', ')

    const container = clsx(
        "flex gap-3 p-4",
        isOwn && "justify-end"
    )

    const avatar = clsx(isOwn && "order-2")

    const body = clsx(
        "flex flex-col gap-2",
        isOwn && "items-end"
    )

    const message = clsx(
        "text-sm w-fit overflow-hidden",
        isOwn ? 'bg-violet-500 text-white' : 'bg-gray-100',
        data.image ? 'rounded-md p-0' : 'rounded-lg py-2 px-3'
    )

    const SafeSender = {
        ...data.sender,
        createdAt: data.sender.createdAt.toString(),
        updatedAt: data.sender.updatedAt.toString(),
        emailVerified: data.sender.emailVerified?.toString() || null
    }

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={SafeSender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'Pp')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="image"
                            height={288}
                            width={288}
                            src={data.image}
                            className="
                                object-cover
                                cursor-pointer
                                hover:scale-110
                                transition
                                translate
                            "
                        />
                    ) : (
                        <div>
                            {data.body}
                        </div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="
                        text-xs
                        font-light
                        text-gray-500
                    ">
                        {`Visto por ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBox;