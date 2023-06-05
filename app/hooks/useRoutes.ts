import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi"
import {
    HiArrowLeftOnRectangle,
    HiUser
} from "react-icons/hi2"
import { signOut } from "next-auth/react";
import useConversation from "./useConverdation";

const useRoutes = () => {
    const pathname = usePathname()
    const { conversationId } = useConversation()
    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === "/conversations" || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUser,
            active: pathname === "/users"
        },
        {
            label: 'Sign Out',
            href: '/',
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle,
        }
    ], [pathname, conversationId])

    return routes
}

export default useRoutes