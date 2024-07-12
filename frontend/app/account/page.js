'use client'
import { useState, useEffect } from "react";
import { publicClient } from "@/utils/client";
import Piechar from "@/components/shared/Piechar";


import { I4TKnetworkAddress, I4TKnetworkABI, I4TKTokenAddress, I4TKTokenABI } from "@/constants";
import { parseAbiItem } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseBase64DataURL, timestampToDateString } from "@/utils/utils";





const page = () => {

    const { address } = useAccount();

    const [balances, setBalances] = useState([]);

    const [ownedToken, setOwnedToken] = useState([]);
    const [myTotalBalance, setMyTotalBalance] = useState();
    const [networkTotalBalance, setNetworkTotalBalance] = useState();




    const { data: lastTokenId, isSuccess: isLastTokenidSucess } = useReadContract({
        address: I4TKTokenAddress,
        abi: I4TKTokenABI,
        functionName: 'lastTokenId'
    });

    const { data: totalSupply, isSuccess: totalSupplySucess } = useReadContract({
        address: I4TKTokenAddress,
        abi: I4TKTokenABI,
        functionName: 'totalSupply'
    });


    const getbalance = async (_address, _lastTokenId) => {



        const addressArray = Array(Number(_lastTokenId) + 1).fill(_address);
        const tokenIdArray = [];
        for (let i = 0; i < Number(_lastTokenId) + 1; i++) {
            tokenIdArray.push(i);
        };

        const data = await publicClient.readContract({
            address: I4TKTokenAddress,
            abi: I4TKTokenABI,
            functionName: 'balanceOfBatch',
            args: [addressArray, tokenIdArray]
        })

        setBalances(data);

    }

    const getTokenUri = async (_balances, _lastTokenId) => {

        for (let i = 0; i < Number(_lastTokenId) + 1; i++) {
            if (_balances[i] !== BigInt(0)) {
                const URI = await publicClient.readContract({
                    address: I4TKTokenAddress,
                    abi: I4TKTokenABI,
                    functionName: 'uri',
                    args: [BigInt(i)]
                })

                const tokenURIJson = parseBase64DataURL(URI);

                setOwnedToken((e) => [...e, { tokenId: i, balance: _balances[i], tokenURIJson: tokenURIJson }]);

            }
        }

    }


    useEffect(() => {
        const getAllbalance = async () => {
            if (address !== 'undefined' && lastTokenId !== undefined) {
                await getbalance(address, lastTokenId);
            }
        }
        getAllbalance();

    }, [lastTokenId])


    useEffect(() => {
        
            if (address !== 'undefined' && totalSupply !== undefined) {
                setNetworkTotalBalance(Number(totalSupply));

            }
   
    }, [totalSupplySucess])

    useEffect(() => {
        const getOwnToken = async () => {

            if (balances !== 'undefined') {
                await getTokenUri(balances, lastTokenId);
            }
        }

        getOwnToken();



    }, [balances])


    useEffect(() => {

        if (ownedToken !== 'undefined') {

            let myBalance=0 ;

            for (let i= 0; i< ownedToken.length;i++) { // 

                myBalance=myBalance + Number(ownedToken[i].balance);

            }

            setMyTotalBalance(Number(myBalance));

        }

    }, [ownedToken])



    return (

        <>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-0 py-0 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Statistics</h2>
                    <Piechar myBalance={myTotalBalance} totalSupply={networkTotalBalance}/>
                </div>
                <div className="mx-auto max-w-2xl px-2 py-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Ownership</h2>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {ownedToken.map((ownedToken, index) => (
                            <div key={index} className="group relative">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img
                                        src="/images/I4T_NFT.jpg"
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <a href="#">
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {ownedToken.tokenURIJson.name}
                                            </a>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{ownedToken.tokenURIJson.properties.title}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">ownership: {Number(ownedToken.balance) / 1000000} %</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <>
                {/* {ownedToken.map((ownedToken, index) => {
                    return (
                        <I4T_NFT key={index} />)
                })} */}

            </>
        </>
    )
}

export default page