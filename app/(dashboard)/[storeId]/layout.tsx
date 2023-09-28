import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout ({
    children, 
    params 
} : { 
    children: React.ReactNode;
    params: { storeId: string }
}) {
    //1 Checks if user is logged in:
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    //2 Fetches the store indicated in the url.
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })
    
    //3 Checks if the store fetched actually exists
    //3.1 If not, redirects to home.
    if (!store) {
        redirect('/')
    }
    //3.2 If there is a store, then it returns the following:
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}