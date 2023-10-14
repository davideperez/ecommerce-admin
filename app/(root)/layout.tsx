import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"

export default async function SetupLayout ({ children }: { children: React.ReactNode }) {

    //-- Imports --//

    //Fetches the user.
    const { userId } = auth()
    
    //-- Checks --//

    //Checks if there is an user if so, continues.
    if (!userId) {
        redirect('/sign-in')
    }

    //-- Core Work --//

    //Fetches Billboards
    const billboard = await prismadb.billboard

    //Fetches the first store own by the user
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    })
    
    //Redirects the user to the store URL (if it exists)
    if (store) {
        redirect(`/${store.id}`)
    }

    //If theres no store:
    return (
        <>
            { children }        
        </>
    )
}