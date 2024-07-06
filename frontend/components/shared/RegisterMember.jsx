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
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { I4TKnetworkABI, I4TKnetworkAddress } from "@/constants";
import { isAddress } from 'viem'


const RegisterMember = () => {


  const { address } = useAccount();

  const [profileStr, setProfileStr] = useState('');
  const [addr, setAddr] = useState('');



  const { toast } = useToast();


  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const { data: _profile, isSuccess, refrech: refrechProfile } = useReadContract(
    {
      abi: I4TKnetworkABI,
      address: I4TKnetworkAddress,
      functionName: 'getProfilesValueByKey',
      args: [profileStr],
    }
  )

  const register = () => {

    console.log(addr);
    if (!isNaN(addr) && isAddress(addr)) {
      writeContract({
        address: I4TKnetworkAddress,
        abi: I4TKnetworkABI,
        functionName: 'registerMember',
        account: address,
        args: [addr, _profile]
      })

    }
    else {
      toast({
        title: "Error",
        description: "Please enter a correct address",
        className: 'bg-red-600'
      });
    }

  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed) {

      setAddr('');
      setProfileStr('');
      toast({
        title: "transaction validated",
        description: "address " + addr + " registered as " + profileStr +" !!",
        className: 'bg-green-600'
      });

    }

  }, [isConfirmed])

  useEffect(() => {
    refrechProfile?.();


  }, [profileStr]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Register new member</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Address</Label>
              <Input id="name" placeholder="member address" onChange={(e) => setAddr(e.target.value)} value={addr} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="profile">Profile</Label>
              <Select value={profileStr} onValueChange={(val) => setProfileStr(val)}>
                <SelectTrigger id="profile">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="labs">Labs</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">

        <Button onClick={register}>Register</Button>
      </CardFooter>
    </Card>
  )
}

export default RegisterMember;