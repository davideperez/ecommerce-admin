"use client";
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast'

import { 
    Form,
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Modal } from "@/components/ui/modal";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStoreModal } from "@/hooks/use-store-modal";

//The zod schema that represents our form and its validation rules.
const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {

    //This line listens to the useStoreModal useEffect.
    const storeModal = useStoreModal();

    //state to block the UI once submit button is pressed.
    const [ loading, setLoading ] = useState(false)
    
    //Initializes and configurates the form: using react-hook-form, and configurates it using zodResolver 
    // to link it with the previous defined zod schema, as validator.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });
    
    //Form's submit button: its behaviour.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            
            const response = await axios.post("/api/stores", values);

            //Using window assign instead of the router of next navigation
            //to ensure the app refreshes before showing the page, and the 
            //store is 100% certainly created on the db.
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
    <Modal
        title="Create Store"
        description="Add a new store to manage products and categories."
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
            <div className='space-y-4 py-2 pb-4 '>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                     <FormLabel>Name</FormLabel>
                                     <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='E-Commerce'
                                            {...field}
                                        />
                                     </FormControl>
                                     <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button 
                                disabled={loading}
                                variant="outline"
                                onClick={storeModal.onClose}>
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
    )
}