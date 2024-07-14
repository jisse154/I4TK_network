"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";

import { I4TKnetworkABI, I4TKnetworkAddress } from "@/constants";

import { isAddress } from "viem";

const RevokeMember = () => {
  const { address } = useAccount();

  const [addr, setAddr] = useState("");

  const { toast } = useToast();

  const { data: hash, isPending, isError, error, writeContract } = useWriteContract();

  const revoke = () => {
    if (!isNaN(addr) && isAddress(addr)) {
      writeContract({
        address: I4TKnetworkAddress,
        abi: I4TKnetworkABI,
        functionName: "revokeMember",
        account: address,
        args: [addr],
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a correct address",
        className: "bg-red-600",
      });
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "transaction validated",
        description: "address " + addr + " has been revoked !!",
        className: "bg-green-600",
      });
      setAddr("");
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isConfirming) {
      toast({
        title: "transaction in progress",
        description: "tx hash :" + hash,
        className: "bg-orange-200",
      });
    }
  }, [isConfirming]);

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
              <Input id="name" placeholder="member address" onChange={(e) => setAddr(e.target.value)} value={addr} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={revoke}>Revoke</Button>
      </CardFooter>
    </Card>
  );
};

export default RevokeMember;
