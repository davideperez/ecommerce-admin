import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params,
}) => {
    //User validation
    const { userId } = auth()

    if (!userId) {
        redirect('/sign-in')
    }

    //Fetching the store.
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    //In case there is no store (this is because the user could add any id in the url)
    if (!store) {
        redirect('/')
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm
                    initialData={store}
                />
            </div>
        </div>
    )
}
 
export default SettingsPage;