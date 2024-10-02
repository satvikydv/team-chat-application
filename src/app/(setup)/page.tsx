import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {initialProfile} from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    // Type guard to check if 'profile' is of the expected type
    if (!('id' in profile)) {
        throw new Error('Invalid profile data');
    }

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(server){
        redirect(`/server/${server.id}`);
    }
    return (
        <div>
            <InitialModal />
        </div>
    )
}

export default SetupPage;