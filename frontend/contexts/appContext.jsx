'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { contractAddress, contractAbi } from "@/constants";
import { useAccount, useReadContract } from 'wagmi'

const AppContext = createContext({});


export const AppContextProvider =  ({ children }) => {

    const { address } = useAccount()

    const [voters, setVoters] = useState('');

    const { data: voter , isSuccess, refetch : refetchProjects} = useReadContract({
        abi: contractAbi,
        address: contractAddress,
        functionName: 'getVoter',
        account: address,
        args: [address]
    });

    const { data: owner } = useReadContract({
        abi: contractAbi,
        address: contractAddress,
        functionName: 'owner',
    });


    const { data: voteStatus, refetch } = useReadContract({
        abi: contractAbi,
        address: contractAddress,
        functionName: 'workflowStatus'
    });

    let isRegistered = false;
    let hasVoted = false;
    if (voter !== undefined) {isRegistered = voter.isRegistered } ;
    if (voter !== undefined) {hasVoted = voter.hasVoted } ;

    //const hasVoted=voter.hasVoted;


    let isOwner = false;
    if (owner == address) { isOwner = true };


    return (
        <AppContext.Provider value={{
            address,
            hasVoted,
            isRegistered,
            isOwner,
            voteStatus,
            refetch

        }}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);