import { Listing, User, Conversation, Message } from "@prisma/client";

export type safeListings = Omit<
    Listing,
    "createdAt"
> & {
    createdAt: string
}

export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string
    updatedAt: string
    emailVerified: string | null
}

export type FullMessageType = Message & {
    sender: User,
    seen: User[]
}

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[]
}