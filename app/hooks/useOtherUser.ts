
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | { users: User[] }, session: any) => {
    // const session = useSession();
    const otherUser = useMemo(() => {
        const currentUserEmail = session?.email;

        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

        return otherUser[0];
    }, [session?.email, conversation.users]);

    return otherUser
    //return JSON.parse(JSON.stringify(otherUser));
};

export default useOtherUser;