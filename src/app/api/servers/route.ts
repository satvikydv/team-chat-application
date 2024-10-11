import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";



import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        console.log("profile: ", profile);

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                inviteCode: uuidv4(),
                name,
                imageUrl,
                profileId: profile.id,
                channels: {
                    create: [
                        {
                            name: "general",
                            type: "TEXT",
                            profileId: profile.id,
                        },
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN,
                        }
                    ]
                }
            },
        });

        console.log({
            inviteCode: uuidv4(),
            name,
            imageUrl,
            profileId: profile.id,
            channels: [{ name: "general", type: "TEXT", profileId: profile.id }],
            members: [{ profileId: profile.id, role: MemberRole.ADMIN }]
          });
          

        return NextResponse.json(server);
        
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}