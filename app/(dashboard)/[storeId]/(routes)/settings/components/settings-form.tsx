"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { 
    Form, 
    FormItem, 
    FormLabel,
    FormField,
    FormControl,
    FormMessage, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
})

// This is so we dont have to write the following line every time. 
type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues> ({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            console.log('This is params.storeId from settings-form.tsx on Submit function', params.storeId)
            console.log('This is data from settings-form.tsx on Submit function', data)
            
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated.")
            
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title="Settings"
                    description="Manage store preferences"
                    />
                <Button
                    disabled={loading} 
                    variant="destructive"
                    size="sm"
                    onClick={()=> setOpen(true)}
                    >
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator />
            <Form {...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Store name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
        </> 
     );
}
 
export default SettingsForm;