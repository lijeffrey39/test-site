import { ethers, Contract } from 'ethers';
import { PageProps } from "gatsby";
import React, { useState, useEffect } from "react";

import MoodyMartian from '../MoodyMartian.json';
import MintButton from '../components/buttons/MintButton';

const IndexPage: React.FC<PageProps> = pageProps => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);

  useEffect(() => {
    const setupWeb3Info = async () => {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const martianContract = new Contract(
        MoodyMartian.address,
        MoodyMartian.abi,
        signer
      );

      setContract(martianContract);
      setAccount(signerAddress);
    }

    if (window.ethereum) {
      setupWeb3Info();
    }
  }, []);

  return (
    <MintButton
      accountAddress={account}
      contract={contract}
    />
  );
}

export default IndexPage;
