'use client'
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
import { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

import { useWriteContract, useWaitForTransactionReceipt, useAccount , useReadContract} from 'wagmi'


import { contractAddress, contractAbi } from "@/constants";
import { isAddress } from 'viem'

const RevokeMember = () => {



  const [profile, setProfile] = useState("");
  const [addr, setAddr] = useState("");

  const { address } = useAccount();

  const { toast } = useToast();


  useEffect(() => {
    //console.log(profile);
  },[profile]);

  const revoke=  () =>{

    if (!isNaN(addr) && isAddress(addr)) {
    //   writeContract({
    //       address: contractAddress,
    //       abi: contractAbi,
    //       functionName: 'addVoter',
    //       account: address,
    //       args: [addr]
    //   })

  }
  else {
      toast({
          title: "Error",
          description: "Please enter a correct address",
          className: 'bg-red-600'
      });
  }
    console.log(profile);

  };

  return (
    <Card>
    <CardHeader>
      <CardTitle>Revoke a member</CardTitle>
      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Address</Label>
            <Input id="name" placeholder="member address" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      
      <Button onClick={revoke}>Revoke</Button>
    </CardFooter>
  </Card>
  )
}

export default RevokeMember;