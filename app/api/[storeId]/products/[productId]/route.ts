import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET (
    req: Request, 
    { params }: { params: { productId: string } }
) {
    try {
        // -- Checks -- //  

        //1 check if there is a product
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 })
        }

        //Updates the store?? Why does he calls
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            //??why this requirements here and no in billboards, sizes, colors etc etc...
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        // -- Imports -- //
        
        const { userId } = auth()
        const body = await req.json()

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
            return new NextResponse("Unauthenticated", { status: 401 })
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
        
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 })
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
        
        //Updates a Product or  in the db.
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived

            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()
        
        // -- Checks -- //

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 })
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

        //Updates the store?? Why does he calls
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}