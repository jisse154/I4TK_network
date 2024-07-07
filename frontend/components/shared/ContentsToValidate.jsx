'use client'

import { useState, useEffect } from "react";
import { publicClient } from "@/utils/client"

import ContentNotValidated from "../../components/shared/ContentNotValidated";
import { I4TKnetworkAddress, I4TKnetworkABI } from "@/constants";
import { parseAbiItem } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseBase64DataURL, timestampToDateString } from "@/utils/utils";



const ContentsToValidate = () => {

    const { address } = useAccount()
    const [events, setEvents] = useState([])

    const [contents, setContents] = useState([])

    const getEvents = async () => {
        const proposeEvents = await publicClient.getLogs({
            address: I4TKnetworkAddress,
            event: parseAbiItem('event contentProposed(address indexed addr, uint256 indexed tokenId, string tokenURI, uint256 date)'),
            fromBlock: 0n,
            toBlock: 'latest'
        });

        setEvents(proposeEvents);
    }

    useEffect(() => {
        const getAllEvents = async () => {
            if (address !== 'undefined') {
                await getEvents();
            }
        }
        getAllEvents();

    }, [])


    useEffect(() => {


        if (events.length !== 0) {

            console.log(events);

            console.log(events[0].args.tokenURI)
            const tokenURIJson = parseBase64DataURL(events[0].args.tokenURI);
            console.log(tokenURIJson);
            let i=0;
            events.map((e) => {
                i++;
                console.log(i);
                const tokenURIJson = parseBase64DataURL(e.args.tokenURI);
                const postBy = e.args.addr;
                const dateString = timestampToDateString(Number(e.args.date));
                const token = Number(e.args.tokenId);
                setContents((e) => [...e, {tokenId: token, tokenURIJson: tokenURIJson, postedBy: postBy, proposedDate: dateString }])

            })

        }
    }, [events])


    return (
        <>
            {contents.map((content, index) => {
                return(
                <ContentNotValidated key={index} content={JSON.stringify(content)} />)
            })}



        </>
    )
}

export default ContentsToValidate