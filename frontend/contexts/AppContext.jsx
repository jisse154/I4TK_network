"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { I4TKnetworkAddress, I4TKnetworkABI } from "@/constants";
import { useAccount, useReadContract, useAccountEffect } from "wagmi";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState("");

  const [_address, setAddress] = useState(address);

  const {
    data: member,
    isSuccess,
    refetch: refetchProjects,
  } = useReadContract({
    abi: I4TKnetworkABI,
    address: I4TKnetworkAddress,
    functionName: "Members",
    args: [_address],
    account: _address,
  });

  useEffect(() => {
    refetchProjects?.();
    if (member !== undefined) {
      setProfile(member[0]);
      console.log(member);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (address !== undefined) {
      console.log("address connected :", address);
      setAddress(address);
    }
  }, [address]);

  return (
    <AppContext.Provider
      value={{
        _address,
        isConnected,
        profile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const UseAppContext = () => useContext(AppContext);
