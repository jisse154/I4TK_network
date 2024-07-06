'use client'
import '@rainbow-me/rainbowkit/styles.css';


import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider,createConfig } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


export const config1 = createConfig({
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545/'),
    [sepolia.id]: http(process.env.RPC),
  },
})

export const config = getDefaultConfig({
    appName: 'I4TK Natwork',
    projectId: 'fe7c9cd24a73011c6497348e95371757',
    chains: [hardhat,sepolia],
     transports: {
       [hardhat.id]: http('http://127.0.0.1:8545/'),
       [sepolia.id]: http(process.env.RPC)
     },
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndWagmiProvider