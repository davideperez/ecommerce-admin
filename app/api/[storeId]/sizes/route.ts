import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST (req: Request, { params }: { params: { storeId: string} } ) {
    try {
        
        // -- Imports -- //

        //1 Destructure the user id from the auth middleware.
        const { userId } = auth();
        
        //2 Parse from text to json the body of the request.
        const body = await req.json();

        //3 Destructure the needed variables from the request's body object
        const { name, value } = body;
        
        // -- Checks -- //

        //1 Check if we dont have an id.
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401});
        }
        
        //2 Check If there is no name:
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        
        //3 Check If there is no imgUrl:
        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
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
        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(size)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[SIZES_POST]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}

export async function GET (req: Request, { params }: { params: { storeId: string} }) {
    try {
       
        //Check If there is no storeId:
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // -- Core Work -- //

        //then Create a Billboard on the db.
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })

        // -- Success Output -- //

        return NextResponse.json(sizes)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[SIZES_GET]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}

