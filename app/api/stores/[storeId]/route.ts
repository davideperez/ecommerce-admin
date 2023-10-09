import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()
        const { body } = await req.json()
        console.log('This is data from [storeId] on PATCH function', body)

        const { name } = body

        //case: if we dont have a user id
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //case: if we dont have a name
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        //case: if we dont have a params.storeId
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function DELETE (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()

        //case: if we dont have a user id
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //case: if we dont have a params.storeId
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            },
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}