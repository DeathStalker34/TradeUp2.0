'use client'

import Avatar from "@/app/components/AvatarChat"
import useOtherUser from "@/app/hooks/useOtherUser"
import { SafeUser } from "@/app/types"
import { Conversation, User } from "@prisma/client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2"
import ProfileDrawer from "./ProfileDrawer"
import AvatarGroup from "@/app/components/AvatarGroup"
import useActiveList from "@/app/hooks/useActiveList"

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    },
    currentUser?: SafeUser | null
}

const Header: React.FC<HeaderProps> = ({
    conversation,
    currentUser,
}) => {

    const otherUser = useOtherUser(conversation, currentUser)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { members } = useActiveList()
    const isActive = members.indexOf(otherUser?.email!) !== -1

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} miembros`
        }

        return isActive ? 'Activo' : 'Desconectado'
    }, [conversation, isActive])

    const SafeOtherUser = {
        ...otherUser,
        createdAt: otherUser.createdAt.toString(),
        updatedAt: otherUser.updatedAt.toString(),
        emailVerified: otherUser.emailVerified?.toString() || null
    }

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentUser={currentUser}
            />
            <div className="
            bg-white
            w-full
            flex
            border-b-[1px]
            sm:px-4
            py-3
            px-4
            lg:px-6
            justify-between
            items-center
            shadow-sm
        ">
                <div className="flex gap-3 items-center">
                    <Link href="/conversations" className="
                    lg:hidden
                    block
                    text-violet-500
                    hover:text-violet-600
                    transition
                    cursor-pointer
                ">
                        <HiChevronLeft size={32} />
                    </Link>
                    {conversation.isGroup ?
                        (
                            <AvatarGroup users={conversation.users} />
                        ) :
                        (
                            <Avatar user={SafeOtherUser} />
                        )}

                    <div className="flex flex-col">
                        <div>
                            {conversation.name || SafeOtherUser.name}
                        </div>
                        <div className="
                        text-sm
                        font-light
                        text-neutral-500
                    ">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="
                    text-violet-500
                    cursor-pointer
                    hover:text-violet-600
                    transition
                "
                />
            </div>
        </>

    )
}

export default Header