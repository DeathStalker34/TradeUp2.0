'use client'

import { useEffect, useState } from "react";

interface ClientONlyProps {
    children: React.ReactNode
}

const ClientOnly : React.FC<ClientONlyProps>= ({
    children
}) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return ( 
        <>
        {children}
        </>
     );
}
 
export default ClientOnly;