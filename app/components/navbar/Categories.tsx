'use client'

import Container from "../Container";
import {MdComputer, MdOutlineCleaningServices} from 'react-icons/md'
import {BsBricks} from 'react-icons/bs'
import {TbCar, TbDog} from 'react-icons/tb'
import {FaBaby, FaChalkboardTeacher} from 'react-icons/fa'
import {GiGardeningShears} from 'react-icons/gi'
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
    {
        label: 'Informàtica',
        icon: MdComputer,
        description: 'Reparación, asistencia y otros'
    },
    {
        label: 'Bricolaje',
        icon: BsBricks,
        description: 'Montaje, reparación y otros'
    },
    {
        label: 'Mecánica',
        icon: TbCar,
        description: 'Reparación, intercambio de piezas y otros'
    },
    {
        label: 'Niñera',
        icon: FaBaby,
        description: 'Cuidado de niños'
    },
    {
        label: 'Mascotas',
        icon: TbDog,
        description: 'Cuidado de mascotas'
    },
    {
        label: 'Amo/a de casa',
        icon: MdOutlineCleaningServices,
        description: 'Limpieza, reparación y otros'
    },
    {
        label: 'Jardinería',
        icon: GiGardeningShears,
        description: 'Cuidados del jardín'
    },
    {
        label: 'Cursos particulares',
        icon: FaChalkboardTeacher,
        description: 'Profesor particular'
    }

]

const Categories = () => {
    const params = useSearchParams()
    const category = params?.get('category')
    const pathname = usePathname()

    const isMainPage = pathname === '/'

    if (!isMainPage) {
        return null
    }

    return ( 
        <Container>
            <div
            className="
                pt-4
                flex
                felx-row
                items-center
                justify-between
                overflow-x-auto
            "
            >
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
     );
}
 
export default Categories;