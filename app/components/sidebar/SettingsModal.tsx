'use client'

import { SafeUser } from "@/app/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import ModalChat from "../ModalChat"
import Input from "../inputs/InputChat"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import Button from "../ChatButton"

interface SettingsModalProps {
    isOpen?: boolean
    onClose: () => void
    currentUser?: SafeUser | null
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser,
}) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },

    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        },
    })

    const image = watch('image')

    const handleUpload = (result: any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const onSumbit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        axios.post('/api/settings', data)
            .then(() => {
                router.refresh()
                onClose()
            })
            .catch(() => toast.error("Algo salió mal!"))
            .finally(() => setIsLoading(false))
    }

    return (
        <ModalChat isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSumbit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Perfil
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Edita tu perfil.
                        </p>

                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                disabled={isLoading}
                                label="Nombre"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                            />
                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-gray-900
                                ">
                                    Foto
                                </label>
                                <div className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-x-3
                                ">
                                    <Image
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                        src={image || currentUser?.image || '/images/placeholder.jpg'}
                                        alt="Avatar"
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onUpload={handleUpload}
                                        uploadPreset="ljpekefw"
                                    >
                                        <Button
                                            disabled={isLoading}
                                            secondary
                                            type="button"
                                        >
                                            Cambiar
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="
                        mt-6
                        flex
                        items-center
                        justify-end
                        gap-x-6
                    ">
                        <Button
                            disabled={isLoading}
                            secondary
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="submit"
                        >
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </ModalChat>
    );
}

export default SettingsModal;