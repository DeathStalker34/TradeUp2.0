'use client'
import useConversation from "@/app/hooks/useConverdation";
import { FullConversationType, SafeUser } from "@/app/types";
import { Conversation, User } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItems: FullConversationType[]
    currentUser?: SafeUser | null
    users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    currentUser,
    users
}) => {
    const [items, setItems] = useState(initialItems)
    const [isModalOpe, setIsModalOpen] = useState(false)
    const router = useRouter()
    const { conversationId, isOpen } = useConversation()


    const pusherKey = useMemo(() => {
        return currentUser?.email
    }, [currentUser?.email])

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };
                }

                return currentConversation;
            }));
        }

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }

                return [conversation, ...current]
            });
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((convo) => convo.id !== conversation.id)]
            });

            if (conversationId === conversation.id) {
                router.push('/conversations')
            }
        }

        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:new', newHandler)
        pusherClient.bind('conversation:remove', removeHandler)
    }, [pusherKey, router, conversationId]);

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpe}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx(`
            fixed
            inset-y-0
            pb-20
            lg:pb-0
            lg:left-20
            lg:w-80
            lg:block
            overflow-y-auto
            border-r
            border-gray-200
            block
            w-full
            left-0
            bg-white
        `,
                isOpen ? "hidden" : 'block w-full left-0'
            )}>
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="
                        text-2xl
                        font-bold
                        text-neutral-800
                    ">
                            Mensajes
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="
                        rounded-full
                        p-2
                        bg-gray-100
                        text-gray-600
                        cursor-pointer
                        hover:opacity-75
                        transition
                    ">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}

export default ConversationList;