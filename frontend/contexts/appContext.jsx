'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { I4TKnetworkAddress, I4TKnetworkABI } from "@/constants";
import { useAccount, useReadContract, useAccountEffect} from 'wagmi';
import {watchAccount} from '@wagmi/core';
import { config1 } from "@/app/RainbowKitAndWagmiProvider";
import { ethers } from "ethers";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {


    const { address, isConnected } = useAccount()
    const [profile, setProfile] = useState('');

 

    

    const [_address, setAddress] = useState(address);

    

    // const unwatch = watchAccount(config1, {
    //     onChange(data) {
    //       setAddress(data.address);
    //     },
    //   });


    const { data: member, isSuccess, refetch: refetchProjects } = useReadContract({
        abi: I4TKnetworkABI,
        address: I4TKnetworkAddress,
        functionName: 'Members',
        args: [_address],
        account: _address,
    });

   console.log(_address);

    useEffect(() => {
        refetchProjects?.();
        console.log(member);
        if (member !== undefined) { setProfile(member[0]) };

    }, [isSuccess]);

    useEffect(() => {

        setAddress(address);

    }, [address]);

    return (
        <AppContext.Provider value={{
            _address,
            isConnected,
            profile,

        }}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);