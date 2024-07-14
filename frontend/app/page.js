"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { publicClient } from "@/utils/client";
import { parseAbiItem } from "viem";

import { I4TKnetworkAddress, I4TKnetworkABI, I4TKTokenAddress, I4TKTokenABI } from "@/constants";
// const stats = [
//   { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
//   { id: 2, name: 'Assets under holding', value: '$119 trillion' },
//   { id: 3, name: 'New users annually', value: '46,000' },
// ]

export default function Home() {
  const { address, isConnected } = useAccount();

  const [eventsPublish, setEventsPublish] = useState([]);
  const [eventsRegister, setEventsRegister] = useState([]);
  const [eventsRevoke, setEventsRevoke] = useState([]);

  const [stats, setStats] = useState([]);

  const getEventsContentPublished = async () => {
    const proposeEvents = await publicClient.getLogs({
      address: I4TKnetworkAddress,
      event: parseAbiItem(
        "event contentPublished(address indexed creator, uint256 indexed tokenId, string tokenURI, uint256 date)",
      ),
      fromBlock: 6309800n,
      toBlock: "latest",
    });

    setEventsPublish(proposeEvents);
  };

  const getEventsRegister = async () => {
    const proposeEvents = await publicClient.getContractEvents({
      address: I4TKnetworkAddress,
      abi: I4TKnetworkABI,
      eventName: "memberRegistered",
      fromBlock: 6309800n,
      toBlock: "latest",
    });

    setEventsRegister(proposeEvents);
    console.log(proposeEvents);
  };

  const getEventsRevoke = async () => {
    const proposeEvents = await publicClient.getLogs({
      address: I4TKnetworkAddress,
      event: parseAbiItem("event memberRevoked(address addr)"),
      fromBlock: 6309800n,
      toBlock: "latest",
    });

    setEventsRevoke(proposeEvents);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== "undefined") {
        await getEventsContentPublished();
        await getEventsRegister();
        await getEventsRevoke();
      }
    };
    getAllEvents();
  }, []);

  useEffect(() => {
    if (eventsPublish !== "undefined") {
      setStats([
        { id: 1, name: "Content Validated", value: eventsPublish.length },
        { id: 2, name: "Members", value: eventsRegister.length - eventsRevoke.length },
      ]);
    }
  }, [eventsPublish, eventsRegister, eventsRevoke]);

  return (
    <>
      <div>
        <div className="mx-auto max-w-2xl py-24 sm:py-26 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to I4T knowledge network Library
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Trusted Library for an Internet for Trust</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/library"
                className="rounded-md bg-green-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                let&lsquo;s start exploring I4TK contents
              </a>
              <a
                href="https://sites.google.com/i4tknowledge.net/i4tknowledge2024wd/home"
                target="_blank"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more about I4Tk network <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      <div className="bg-white py-18 sm:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
