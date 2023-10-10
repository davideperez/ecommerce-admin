import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [ mounted, setMounted ] = useState(false)
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    //If the app initializes..
    useEffect(()=>{
        setMounted(true)
    }, [])
    
    // If the app does not initializes, send an empty object. 
    if(!mounted) {
        return '';
    }
    //... send origin.
    return origin;
}