import prisma from "@/app/libs/prismadb";
import { getSession } from "./getCurrentUser";

const getUsers = async () => {
    const session = await getSession()

    if (!session?.user?.email) {
        return []
    }

    try {
        // Obtenemos todos los usuarios menos a el mismo
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        })

        return JSON.parse(JSON.stringify(users))
    } catch (error: any) {
        return []
    }
}

export default getUsers