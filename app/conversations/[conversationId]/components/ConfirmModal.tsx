'use client'

import ModalChat from "@/app/components/ModalChat"
import useConversation from "@/app/hooks/useConverdation"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"
import { FiAlertTriangle } from "react-icons/fi"
import { Dialog } from "@headlessui/react"
import ChatButton from "@/app/components/ChatButton"

interface ConfirmModalProps {
    isOpen?: boolean
    onClose: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
}) => {

    const router = useRouter()
    const { conversationId } = useConversation()
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = useCallback(() => {
        setIsLoading(true)

        axios.delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose()
                router.push('/conversations')
                router.refresh()
            })
            .catch(() => toast.error('Algo salió mal!'))
            .finally(() => setIsLoading(false))

    }, [conversationId, router, onClose])


    return (
        <ModalChat
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="sm:flex sm:items-start">
                <div className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    sm:mx-0
                    sm:h-10
                    sm:w-10
                ">
                    <FiAlertTriangle
                        className="h-6 w-6 text-red-600"
                    />
                </div>
                <div className="
                    mt-3
                    text-center
                    sm:ml-4
                    sm:mt-0
                    sm:text-left
                ">
                    <Dialog.Title
                        as="h3"
                        className="
                            text-base
                            font-semibold
                            leading-6
                            text-gray-600
                        "
                    >
                        Eliminar Chat
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            ¿Estás seguro de que quieres eliminar este chat? Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="
                mt-5
                sm:mt-4
                sm:flex
                sm:flex-row-reverse
            ">
                <ChatButton
                    disabled={isLoading}
                    danger
                    onClick={onDelete}
                >
                    Eliminar
                </ChatButton>
                <ChatButton
                    disabled={isLoading}
                    secondary
                    onClick={onClose}
                >
                    Cancelar
                </ChatButton>
            </div>
        </ModalChat>
    );
}

export default ConfirmModal;