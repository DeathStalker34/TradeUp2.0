'use client'

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    IMAGES = 2,
    DESCRIPTION = 3,
    PRICE = 4

}

const RentModal = () => {
    const router = useRouter()
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            imageSrc: '',
            price: null,
            title: '',
            description: ''
        }
    })

    const category = watch('category')
    const location = watch('location')
    const imageSrc = watch('imageSrc')

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1)
    }

    const onNext = () => {
        setStep((value) => value + 1)
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext()
        }

        setIsLoading(true)

        axios.post('/api/listings', data)
            .then(() => {
                toast.success('Servicio creado!')
                router.refresh()
                reset()
                setStep(STEPS.CATEGORY)
                rentModal.onClose()
            })
            .catch(() => {
                toast.error('Algo salió mal. Revisa que todos los campos esten rellenados')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Crear'
        }

        return 'Siguiente'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }

        return 'Atrás'
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="¿Qué categoría describe mejor tu servicio?"
                subtitle="Seleccione una categoría"
            />
            <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
                max-h-[50vh]
                overflow-y-auto
            "
            >
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="¿Donde estás ubicado?"
                    subtitle="Ayuda a los usuarios encontrarte!"
                />

                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />

                <Map
                    center={location?.latlng}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Añade una imagen de tu servicio"
                    subtitle="Muestra a los demás usuarios que sabes hacer!"
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="¿Como describirias tu servicio?"
                    subtitle="Cuentanos de que eres capaz!"
                />
                <Input
                    id="title"
                    label="Título"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input
                    id="description"
                    label="Descripción"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="¿Deseas añadir un precio?"
                    subtitle="Añade una segunda alternativa para contratar tu servicio!"
                />
                <Input
                    id="price"
                    label="Precio"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Tu espacio de tradeUP!"
            body={bodyContent}
        />
    );
}

export default RentModal;