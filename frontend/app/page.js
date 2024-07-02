'use client'
import Image from "next/image";


import { useAccount } from "wagmi";
import registerMember from "@/components/shared/RegisterMember";

export default function Home() {

  const { isConnected } = useAccount();
  return (
    <>
    

    </>

  );
}
