'use client';

import { getHttpEndpoint } from '@orbs-network/ton-access';
import type { CustomChainConfig } from '@web3auth/base';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3Auth, decodeToken } from '@web3auth/single-factor-auth';
import { createContext, useContext, useEffect, useState } from 'react';

const Web3AuthContext = createContext<{
  provider: any;
  isLoggedIn: boolean;
  connectWeb3Auth: (idToken: string) => Promise<void>;
}>({
  provider: null,
  isLoggedIn: false,
  connectWeb3Auth: async () => {},
});

export const Web3AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [web3authSfa, setWeb3authSfa] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [web3AuthInitialized, setWeb3AuthInitialized] = useState(false);

  const clientId = 'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';
  const verifier = 'w3a-telegram-demo';

  useEffect(() => {
    const initializeWeb3Auth = async () => {
      const testnetRpc = await getHttpEndpoint({ network: 'testnet' });
      const chainConfig: CustomChainConfig = {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: 'testnet',
        rpcTarget: testnetRpc,
        displayName: 'TON Testnet',
        blockExplorerUrl: 'https://testnet.tonscan.org',
        ticker: 'TON',
        tickerName: 'TON',
      };

      const privateKeyProvider = new CommonPrivateKeyProvider({
        config: {
          chainConfig,
        },
      });

      const web3authInstance: Web3Auth = new Web3Auth({
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        privateKeyProvider,
      });

      setWeb3authSfa(web3authInstance);
      await web3authInstance.init();
      setWeb3AuthInitialized(true);
    };

    initializeWeb3Auth();
  }, []);

  const connectWeb3Auth = async (idToken: string) => {
    if (web3authSfa && web3AuthInitialized) {
      const { payload } = decodeToken(idToken) as { payload: { sub: string } };
      await web3authSfa.connect({
        verifier,
        verifierId: payload.sub,
        idToken: idToken,
      });

      setProvider(web3authSfa.provider);
      setIsLoggedIn(true);
    }
  };

  return (
    <Web3AuthContext.Provider value={{ provider, isLoggedIn, connectWeb3Auth }}>{children}</Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
