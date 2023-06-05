import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages"
import EmptyStateChat from "@/app/components/EmptyStateChat"
import Header from "./components/Header"
import getCurrentUser from "@/app/actions/getCurrentUser"
import Body from "./components/Body"
import Form from "./components/Form"

interface IParams {
    conversationId: string
}

const ConversationId = async ({ params }: { params: IParams }) => {

    const conversation = await getConversationById(params.conversationId)
    const messages = await getMessages(params.conversationId)
    const currentUser = await getCurrentUser()

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyStateChat />
                </div>
            </div>
        )
    }

    return (
        <div className="lg:pl-80 h-screen">
            <div className="h-screen flex flex-col ">
                <Header conversation={conversation} currentUser={currentUser} />
                <Body initialMessages={messages} currentUser={currentUser} />
                <Form />
            </div>
        </div>
    )
}

export default ConversationId