'use client';

import { NextUIProvider } from '@nextui-org/react';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { useEffect, type PropsWithChildren } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { Toaster } from 'sonner';
import { AppLoading } from '../AppLoading';

function App(props: PropsWithChildren) {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <NextUIProvider>
      <Toaster richColors position="bottom-center" expand={false} closeButton duration={2000} />
      <div className="box-border w-screen">{props.children}</div>
    </NextUIProvider>
  );
}

function RootInner({ children }: PropsWithChildren) {
  useTelegramMock(); // Hook is now called unconditionally

  const debug = useLaunchParams().startParam === 'debug';

  useEffect(() => {
    import('eruda').then((lib) => lib.default.init());
  }, [debug]);

  return (
    <SDKProvider acceptCustomStyles debug={debug}>
      <App>{children}</App>
    </SDKProvider>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <AppLoading>
      <div className="text-gray-400">Loading...</div>
    </AppLoading>
  );
}
