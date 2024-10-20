'use client';

import { useWeb3Auth } from '@/context';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { copyTextToClipboard, shortString } from '@/utils';
import TonRPC from '@/utils/tonRpc';
import { Button } from '@nextui-org/react';
import { useLaunchParams, useMiniApp, useViewport } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import { AppLoading } from '../AppLoading';
import Footer from '../Footer';

export const Home = () => {
  const { connectWeb3Auth, isLoggedIn, provider } = useWeb3Auth();
  const { initDataRaw } = useLaunchParams() || {};
  const [tonAddress, setTonAddress] = useState<string | null>(null);
  const [tonRPC, setTonRPC] = useState<TonRPC | null>(null);
  const viewport = useViewport();
  const miniApp = useMiniApp();

  useTelegramMock();

  useEffect(() => {
    if (viewport) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    const loginWithTelegram = async () => {
      if (initDataRaw) {
        try {
          const idToken = await getIdTokenFromServer(initDataRaw);
          await connectWeb3Auth(idToken);

          if (provider) {
            const tonRPCInstance = new TonRPC(provider);
            setTonRPC(tonRPCInstance);

            const address = await tonRPCInstance.getAccounts();
            setTonAddress(address);
          }
        } catch (error) {
          console.error('Error during Web3Auth connection:', error);
        }
      }
    };

    if (initDataRaw && provider) {
      loginWithTelegram();
    }
  }, [initDataRaw, connectWeb3Auth, provider]);

  const copyAddress = () => {
    if (tonAddress) copyTextToClipboard(tonAddress);
  };

  const signMessage = async () => {
    if (tonRPC) {
      try {
        const signature = await tonRPC.signMessage('Hello, TON!');
        console.log('Message signed:', signature);
      } catch (error) {
        console.error('Error signing message:', error);
      }
    }
  };

  return (
    <div className="relative box-border flex h-full w-full flex-col items-center px-4 pb-10 pt-4">
      {!isLoggedIn ? (
        <AppLoading>Loading...</AppLoading>
      ) : (
        <div>
          <h1>Welcome to Web3Auth Telegram Mini App</h1>
          <div>Your TON Address: {shortString(tonAddress)}</div>
          <Button onClick={copyAddress}>Copy Address</Button>
          <Button onClick={signMessage}>Sign Message</Button>
        </div>
      )}
      <Footer />
    </div>
  );
};

const getIdTokenFromServer = async (initDataRaw: string) => {
  const response = await fetch('/auth/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initDataRaw }),
  });
  const data = await response.json();
  return data.token;
};

export default Home;
