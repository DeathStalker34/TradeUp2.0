'use client'

import clsx from "clsx"
import useConversation from "../hooks/useConverdation"
import EmptyStateChat from "../components/EmptyStateChat"

const Home = () => {
    const { isOpen } = useConversation()
    return (
        <div className={clsx(
            "lg:pl-80 h-full lg:block",
            isOpen ? 'block' : 'hidden'
        )}>
            <EmptyStateChat />
        </div>
    )
}

export default Home