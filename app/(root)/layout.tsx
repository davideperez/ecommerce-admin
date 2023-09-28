import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"

export default async function SetupLayout ({ children }: { children: React.ReactNode }) {

    //Fetches the user.
    const { userId } = auth()
    
    //Checks if there is an user if so, continues.
    if (!userId) {
        redirect('/sign-in')
    }

    //Fetches the first store own by the user
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    })
    
    //Validates there is a store, if so
    if (store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
            { children }        
        </>
    )
}