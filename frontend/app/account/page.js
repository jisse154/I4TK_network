'use client'
import I4T_NFT from "@/components/shared/NFT_Tile"
import { useState, useEffect } from "react";
import { publicClient } from "@/utils/client"


import { I4TKnetworkAddress, I4TKnetworkABI, I4TKTokenAddress, I4TKTokenABI } from "@/constants";
import { parseAbiItem } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseBase64DataURL, timestampToDateString } from "@/utils/utils";





const page = () => {

    const { address } = useAccount();

    const [balances, setBalances] = useState([]);

    const [ownedToken, setOwnedToken] = useState([]);



    const { data: lastTokenId, isSuccess: isLastTokenidSucess } = useReadContract({
        address: I4TKTokenAddress,
        abi: I4TKTokenABI,
        functionName: 'lastTokenId'
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
                console.log('boucle')
                const URI = await publicClient.readContract({
                    address: I4TKTokenAddress,
                    abi: I4TKTokenABI,
                    functionName: 'uri',
                    args: [BigInt(i)]
                })

                const tokenURIJson = parseBase64DataURL(URI);
                console.log(tokenURIJson);

                setOwnedToken((e) => [...e, { tokenId: i, balance: _balances[i],  tokenURIJson: tokenURIJson } ]);

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
        const getOwnToken = async () => {

            if (balances !== 'undefined') {
                console.log("balance", balances);
                console.log("lastToken", lastTokenId);
                await getTokenUri(balances, lastTokenId);

                console.log("token", ownedToken);
            }
        }

        getOwnToken();



    }, [balances])


    useEffect(() => {

        if (ownedToken !== 'undefined') {
            console.log("token", ownedToken);

        }

    }, [ownedToken])



    return (

        <>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">My contents</h2>

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
                                    <p className="text-sm font-medium text-gray-900">ownership: {Number(ownedToken.balance)/1000000} %</p>
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