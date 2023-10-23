import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST (req: Request, { params }: { params: { storeId: string} } ) {
    try {
        
        // -- Imports -- //

        const { userId } = auth();
        const body = await req.json();

        const { 
            name, 
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived 
        } = body;
        
        // -- Checks -- //

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401});
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("Size  id is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

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
        //??review how the below code works, spetialy the images property.
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived, 
                storeId: params.storeId, 
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[BILLBOARDS_POST]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}

export async function GET (req: Request, { params }: { params: { storeId: string} }) {
    try {
        //?? further understand this, whats that URL object and the searchParams.
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        //Check If there is no storeId:
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // -- Core Work -- //

        //then Create a Billboard on the db.
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // -- Success Output -- //

        return NextResponse.json(products)

    } catch (error) {

        // If any other error not mentioned above
        console.log('[PRODUCTS_GET]', error)
        
        // -- Error Output -- //
        
        return new NextResponse("Internal Error", { status: 500});
    }
}