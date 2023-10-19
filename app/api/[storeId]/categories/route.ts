import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET (req: Request, { params }: { params: { storeId: string} }) {
    try {
       
        //Check If there is no storeId:
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // -- Core Work -- //

        //then Create a Billboard on the db.
        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(categories)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[CATEGORIES_GET]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}

export async function POST (req: Request, { params }: { params: { storeId: string} } ) {
    try {
        
        // -- Imports -- //

        //1 Destructure the user id from the auth middleware.
        const { userId } = auth();
        
        //2 Parse from text to json the body of the request.
        const body = await req.json();

        //3 Destructure the needed variables from the request's body object
        const { name, billboardId } = body;
        
        // -- Checks -- //

        //1 Check if we dont have an id.
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401});
        }
        
        //2 Check If there is no label:
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        
        //3 Check If there is no imgUrl:
        if (!billboardId) {
            return new NextResponse("Billboard is required", { status: 400 });
        }

        //4 Check If there is no storeId:
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        //5 Check If the relation: if the storeId correspond to the userId:
        
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

        //1 then Create a Billboard on the db.
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(category)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[CATEGORIES_POST]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}