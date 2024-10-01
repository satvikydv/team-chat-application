import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {initialProfile} from "@/lib/initial-profile";

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
            <h1>Create a Server</h1>
        </div>
    )
}

export default SetupPage;