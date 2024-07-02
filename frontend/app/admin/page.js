'use client'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import RegisterMember from "@/components/shared/RegisterMember";
import { useState } from "react";



const page = () => {

    const [openTab, setOpenTab] = useState("New_Member");

    return (
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
                    
                </TabsContent>
                <TabsContent value="member_profile">
                    
                </TabsContent>

            </Tabs>

        </>
    )
}

export default page