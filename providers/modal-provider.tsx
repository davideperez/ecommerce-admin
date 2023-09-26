"use client"

//Global Imports
import { useEffect, useState } from "react";

//Local Imports
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [ isMounted, setIsMounted ] = useState(false)

    //To further learn: This logic is to be sure that a hydration error does not ocur.
    useEffect(()=> {
        setIsMounted(true);
    },[])
    
    if(!isMounted) {
        return null;
    }

    return (
        <StoreModal />
    );
};