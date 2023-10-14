import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { billboardId: string } }
) {
    try {
        // -- Checks -- //

        //1 check if there is a billboard
        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        // -- Imports -- //
        
        const { userId } = auth()
        const body = await req.json()

        const { label, imageUrl } = body

        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a label
        if (!label) {
            return new NextResponse("Name is required", { status: 400 })
        }

        //3 check if there is an image
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 })
        }

        //4 check if there is a billboard
        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
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
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function DELETE (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth()
        
        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a billboard
        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
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
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            },
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}