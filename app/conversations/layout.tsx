import getConversations from "../actions/getConversations"
import Sidebar from "../components/sidebar/Sidebar"
import ConversationList from "./components/ConversationList"
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'
import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";

interface Props {
    session: Session | null
}

export default async function ConversationsLayout({ children }: {
    children: React.ReactNode
}) {
    const currentUser = await getCurrentUser()
    const conversations = await getConversations()
    const users = await getUsers()

    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className="h-full z-20 relative">
                <ConversationList
                    users={users}
                    initialItems={conversations}
                    currentUser={currentUser}
                />
                {children}
            </div>
        </Sidebar>
    )
}