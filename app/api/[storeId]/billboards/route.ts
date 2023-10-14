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
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(billboards)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[BILLBOARDS_GET]', error)
        
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
        const { label, imageUrl } = body;
        
        // -- Checks -- //

        //1 Check if we dont have an id.
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401});
        }
        
        //2 Check If there is no label:
        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }
        
        //3 Check If there is no imgUrl:
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(billboard)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[BILLBOARDS_POST]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}