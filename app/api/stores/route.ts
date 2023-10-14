import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST (req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;
        
        //If we dont have an id.
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401});
        }
        
        //If we dont have a name:
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        //Creates a Store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse("Internal Error", { status: 500});
    }
}