'use client'

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import qs from "query-string"
import Heading from "../Heading";
import Input from "../inputs/Input";
import { FieldValues, useForm } from "react-hook-form";

enum STEPS {
    LOCATION = 0,
    INFO = 1
}

const SearchModal = () => {

    const router = useRouter()
    const params = useSearchParams()
    const searchModal = useSearchModal()

    const [step, setStep] = useState(STEPS.LOCATION)
    const [location, setLocation] = useState<CountrySelectValue>()
    const [servicio, setServicio] = useState()



    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location])

    const onBack = useCallback(() => {
        setStep((value) => value - 1)
    }, [])

    const onNext = useCallback(() => {
        setStep((value) => value + 1)
    }, [])

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext()
        }

        let currentQuery = {}

        if (params) {
            currentQuery = qs.parse(params.toString())
        }
        const servicio = (document.getElementById("servicio") as HTMLInputElement).value

        let updateQuery: any

        if (servicio) {
            updateQuery = {
                ...currentQuery,
                locationValue: location?.value,
                servicio
            }
        } else {
            updateQuery = {
                ...currentQuery,
                locationValue: location?.value,
            }
        }


        const url = qs.stringifyUrl({
            url: '/',
            query: updateQuery
        }, { skipNull: true })

        setStep(STEPS.LOCATION)
        searchModal.onClose()
        router.push(url)
    }, [
        step,
        searchModal,
        location,
        onNext,
        params,
        router,
    ])


    const actionLabel = useMemo(() => {

        if (step === STEPS.INFO) {
            return 'Buscar'
        }

        return 'Siguiente'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined
        }

        return 'Atrás'
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="¿Que servicio buscas?"
                subtitle="Encuentra lo que necesitas!"
            />
            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Busque su servicio!"
                    subtitle="¿Que necesitat?"
                />
                <div className="w-full relative">
                    <input
                        id="servicio"
                        type="text"
                        className='
                            peer
                            w-full
                            p-4
                            pt-6
                            font-light
                            bg-white
                            border-2
                            rounded-md
                            outline-none
                            transition
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                            pl-4
                            border-neutral-300
                            focus:border-black'
                    />
                    <label
                        className='
                            absolute
                            text-md
                            duration-150
                            transform
                            -translate-y-3
                            top-5
                            z-10
                            origin-[0]
                            left-4
                            peer-placeholder-shown:scale-100
                            peer-placeholder-shown:translate-y-0
                            peer-focus:scale-75
                            peer-focus:-translate-y-4
                            text-zinc-400'
                    >
                        Servicio
                    </label>
                </div>
            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filtros"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModal;