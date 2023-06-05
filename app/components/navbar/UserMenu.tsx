'use client'

import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from '../Avatar';
import { useCallback, useState } from 'react';
import MenuItem from './MenuItem';
import useRegisterModel from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';
import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';
import { IoAddCircleOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation';
import { IoMdAddCircle } from 'react-icons/io';
import SettingsModal from '../sidebar/SettingsModal';

interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {

    const router = useRouter()

    const registerModal = useRegisterModel()
    const loginModal = useLoginModal()
    const rentModal = useRentModal()
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false)

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        rentModal.onOpen()
    }, [currentUser, loginModal, rentModal])

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />
            <div className="relative">
                <div className="flex flex-row items-center gap-3">

                    <div
                        onClick={onRent}
                        className='
                hidden 
                font-semibold 
                sm:flex 
                flex-row 
                items-center 
                gap-1 
                cursor-pointer 
                rounded-full 
                hover:drop-shadow-lg
                transition 
                px-3 
                py-1 
                bg-violet-500
                text-neutral-100'
                    >
                        <div className='hidden md:block'>
                            Añadir servicio
                        </div>

                        <div className="text-3xl">
                            <IoMdAddCircle />
                        </div>
                    </div>


                    <div
                        onClick={toggleOpen}
                        className="
                    border-[1px]
                    border-neutral-300
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition"
                    >
                        <div>
                            <Avatar src={currentUser?.image} />
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div
                        className='
                    absolute
                    rounded-xl
                    shadow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white
                    overflow-hidden
                    right-0
                    top-15
                    text-sm
                '
                    >
                        <div className='flex flex-col cursor-pointer'>
                            {currentUser ? (
                                <>
                                    <MenuItem
                                        onClick={() => router.push('/users')}
                                        label="Mis mensajes"
                                    />
                                    <MenuItem
                                        onClick={() => router.push('/favoritos')}
                                        label="Favoritos"
                                    />
                                    <MenuItem
                                        onClick={() => router.push('/propiedades')}
                                        label="Mis servicios"
                                    />
                                    <MenuItem
                                        onClick={rentModal.onOpen}
                                        label="Añadir servicio"
                                    />
                                    <MenuItem
                                        onClick={() => setIsOpenModal(true)}
                                        label="Editar perfil"
                                    />
                                    <hr />
                                    <MenuItem
                                        onClick={() => signOut()}
                                        label="Cerrar sesión"
                                    />
                                </>
                            ) : (
                                <>
                                    <MenuItem
                                        onClick={loginModal.onOpen}
                                        label="Iniciar sesión"
                                    />
                                    <MenuItem
                                        onClick={registerModal.onOpen}
                                        label="Registrarse"
                                    />
                                </>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserMenu;