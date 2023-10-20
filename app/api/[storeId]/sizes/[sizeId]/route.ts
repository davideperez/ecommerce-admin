import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET (
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        // -- Checks -- //

        //1 check if there is a size
        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        // -- Imports -- //
        
        const { userId } = auth()
        const body = await req.json()

        const { name, value } = body

        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a label
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        //3 check if there is an image
        if (!value) {
            return new NextResponse("Value is required", { status: 400 })
        }

        //4 check if there is a size
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
        }

        //5 Check the relation: if the storeId correspond to the userId:

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        // -- Core Work -- //
        
        //Updates a Billboard or  in the db.
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function DELETE (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth()
        
        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a size
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
        }

        //3 Check the relation: if the storeId correspond to the userId:

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        //Updates the store?? Why does he calls
        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}