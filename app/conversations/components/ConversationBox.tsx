'use client'

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns"
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType, SafeUser } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/AvatarChat";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean,
    currentUser?: SafeUser | null
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected,
    currentUser
}) => {

    const sesssion = currentUser
    const otherUser = useOtherUser(data, sesssion)
    const router = useRouter()

    const SafeSender = {
        ...otherUser,
        createdAt: otherUser.createdAt.toString(),
        updatedAt: otherUser.updatedAt.toString(),
        emailVerified: otherUser.emailVerified?.toString() || null
    }

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const message = data.messages || []

        return message[message.length - 1]
    }, [data.messages])

    const userEmail = useMemo(() => {
        return sesssion?.email
    }, [sesssion?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false
        }

        const seenArray = lastMessage.seen || []

        if (!userEmail) {
            return false
        }

        return seenArray.filter((user) => user.email === userEmail).length !== 0

    }, [lastMessage, userEmail])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Imagen enviada'
        }

        if (lastMessage?.body) {
            return lastMessage.body
        }

        return "Conversación empezada"
    }, [lastMessage])

    return (
        <div
            onClick={handleClick}
            className={clsx(`
                w-full
                relative
                flex
                items-center
                space-x-3
                hover:bg-neutral-100
                rounded-lg
                transition
                cursor-pointer
                p-3
            `,
                selected ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            {data.isGroup ?
                (
                    <AvatarGroup users={data.users} />
                ) :
                (
                    <Avatar user={SafeSender} />
                )}

            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-1
                    ">
                        <p className="
                            text-md
                            font-medium
                            text-gray-900

                        ">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="
                                text-xs
                                text-gray-400
                                font-light
                            ">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`
                        truncate
                        text-sm
                    `,
                        hasSeen ? 'text-gray-500' : 'text-black font-medium'
                    )}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ConversationBox;