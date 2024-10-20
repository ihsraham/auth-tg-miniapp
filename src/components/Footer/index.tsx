import { useUtils } from '@telegram-apps/sdk-react';

const Footer = () => {
  const utils = useUtils();
  return <div className="fixed bottom-0 left-0 right-0 flex h-10 w-full items-center justify-center bg-white"></div>;
};

export default Footer;
