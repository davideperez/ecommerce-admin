import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;
    
    //1. Construct the stripe event??
    try{
        event = stripe.webhooks.constructEvent(
            body, 
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
            )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400})
    }
    
    //2. ??
    const session = event.data.object as Stripe.Checkout.Session;

    //3. Customer addressString array construction.
    const address= session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line1,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ]

    const addressString = addressComponents.filter((c) => c !== null).join(', ');
    
    //4. Once checkout is completed, updates the order with client address, paid status as paid, and include??
    if(event.type === "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                //in which cases do you add the optional ?.
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems:true,
            }
        })
        
        //5. This will archive or rest from stock the products that had been just bought.
        //5.1 First creates an arrays with the ids of this order.
        const productIds = order.orderItems.map((orderItem) => orderItem.productId);
        //5.2. Then it updates the products whos ids are included on the productIds array, and sets archived as true.
        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds]
                }
            },
            data: {
                isArchived: true,
            }
        })
    }

    return new NextResponse(null, { status: 200 })
}