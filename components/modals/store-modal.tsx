"use client";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'

import { useStoreModal } from "@/hooks/use-store-modal";
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

//The zod schema that represents our form and its validation rules.
const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {

    //Custom hook to manage the State: This is the zustand state manager.
    const storeModal = useStoreModal();
    
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
        console.log(values);
        //TODO: Create Store.
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
                                variant="outline"
                                onClick={storeModal.onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
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