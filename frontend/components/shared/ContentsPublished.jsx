"use client";

import { useState, useEffect } from "react";
import { publicClient } from "@/utils/client";

import ContentPost from "./ContentPost";
import { I4TKnetworkAddress, I4TKnetworkABI } from "@/constants";
import { parseAbiItem } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseBase64DataURL, timestampToDateString } from "@/utils/utils";

const ContentsPublished = () => {
  const { address } = useAccount();
  const [events, setEvents] = useState([]);

  const [contents, setContents] = useState([]);

  const getEvents = async () => {
    const publishEvents = await publicClient.getLogs({
      address: I4TKnetworkAddress,
      event: parseAbiItem(
        "event contentPublished(address indexed creator, uint256 indexed tokenId, string tokenURI, uint256 date)",
      ),
      fromBlock: 0n,
      toBlock: "latest",
    });

    setEvents(publishEvents);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== "undefined") {
        await getEvents();
      }
    };
    getAllEvents();
  }, []);

  useEffect(() => {
    if (events.length !== 0) {
      events.map((e) => {
        console.log(e);
        const tokenURIJson = parseBase64DataURL(e.args.tokenURI);
        const postBy = e.args.creator;
        const date = new Date(Number(e.args.date) * 1000);
        const dateString = date.toDateString();
        const token = Number(e.args.tokenId);
        setContents((e) => [
          ...e,
          { tokenId: token, tokenURIJson: tokenURIJson, postedBy: postBy, publishedDate: dateString },
        ]);
      });
    }
  }, [events]);

  return (
    <>
      {contents.map((content, index) => {
        return <ContentPost key={index} content={JSON.stringify(content)} />;
      })}
    </>
  );
};

export default ContentsPublished;
