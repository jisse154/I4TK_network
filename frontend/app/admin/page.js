'use client'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";


import RegisterMember from "@/components/shared/RegisterMember";
import RevokeMember from "@/components/shared/RevokeMember";
import NotAuthorized from "@/components/shared/NotAuthorized";
import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/appContext";
import { I4TKnetworkABI } from "@/constants";
import { useWriteContract } from "wagmi";


const page = () => {

    const {
        address,
        isConnected,
        profile

    } = useAppContext();

    const [openTab, setOpenTab] = useState("New_Member");

    return (
        <>
        { (profile == 3 && isConnected) ? (
            <>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="mb-4 text-3xl md:text-4xl font-heading font-bold">Administration</h2>
                </div>
                <Tabs defaultValue="New_Member" className="w-full" value={openTab} onValueChange={setOpenTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="New_Member">Register new Member</TabsTrigger>
                        <TabsTrigger value="revoke">Revoke Member</TabsTrigger>
                        <TabsTrigger value="member_profile">Member profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="New_Member">
                        <RegisterMember />
                    </TabsContent>
                    <TabsContent value="revoke">
                        <RevokeMember />
                    </TabsContent>
                    <TabsContent value="member_profile">

                    </TabsContent>

                </Tabs>
            </>) : (
                <NotAuthorized/>
            )

        }

        </>
    )
}

export default page