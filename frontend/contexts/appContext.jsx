'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { I4TKnetworkAddress, I4TKnetworkABI } from "@/constants";
import { useAccount, useReadContract, useAccountEffect} from 'wagmi';
import {watchAccount} from '@wagmi/core';
import { config1 } from "@/app/RainbowKitAndWagmiProvider";
import { ethers } from "ethers";

const AppContext = createContext();

// async function getMember(_address) {
//     const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/iBWOg76BlGKnGoRyxmH9yQ-LaeuyRuQi');
//     const contract = new ethers.Contract(I4TKnetworkAddress, I4TKnetworkABI, provider);

//     const x = await contract.callstatic.Members(_address);
//     return x
// }

export const AppContextProvider = ({ children }) => {

    const [profile, setProfile] = useState('');

    const { _address } = useAccount()

    const [address, setAddress] = useState(_address);

    

    const unwatch = watchAccount(config1, {
        onChange(data) {
          setAddress(data.address);
        },
      });


    const { data: member, isSuccess, refetch: refetchProjects } = useReadContract({
        abi: I4TKnetworkABI,
        address: I4TKnetworkAddress,
        functionName: 'Members',
        args: [address],
        account: address,
    });



    useEffect(() => {

        console.log(member);
        if (member !== undefined) { setProfile(member[0]) };

    }, [isSuccess, address]);

    return (
        <AppContext.Provider value={{
            address,
            profile,

        }}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);