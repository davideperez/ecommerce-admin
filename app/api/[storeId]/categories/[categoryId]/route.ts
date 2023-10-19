import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { categoryId: string } }
) {
    try {
        // -- Checks -- //

        //1 check if there is a category
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        // -- Imports -- //
        
        const { userId } = auth()
        const body = await req.json()

        const { name, billboardId } = body

        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a name
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        //3 check if there is a billboard id
        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
        }

        //4 check if there is a category
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
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
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function DELETE (
    req: Request, //this req MUST be here even if its not used, because params needs to be always the second parameter.
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth()
        
        // -- Checks -- //

        //1 check if there is a userId
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        //2 check if there is a billboard
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
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

        //Updates the category 
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            },
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}