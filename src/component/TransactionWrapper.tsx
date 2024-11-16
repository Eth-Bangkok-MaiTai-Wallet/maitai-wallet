'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { Address, ContractFunctionParameters, encodeFunctionData, parseEther } from 'viem';

export default function TransactionWrapper({ onStatus, chainId, address, abi, functionName, args, value }: { onStatus: any, chainId: number, address: Address, abi: any, functionName: string, args: any, value?: bigint }) {
  
  const contracts = [
    {
      address: address,
      abi: abi,
      functionName: functionName,
      args: args,
    },
  ] as unknown as ContractFunctionParameters[];

  const encodedStoreData = encodeFunctionData({
    abi: abi,
    functionName: functionName,
    args: [2]
  });

  // address = "0x38F4152654AaBFA65f0de2296327927FBBA8a381";

  const calls = [
    {
      to: address,
      data: encodedStoreData,
      // value: parseEther("0.0001")
    },
  ];

  const handleError = (err: TransactionError) => {
    console.log(err)
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  return (
    <div className="flex w-[450px]">
      <Transaction
        contracts={contracts}
        // calls={calls}
        className="w-[450px]"
        chainId={chainId}
        onError={handleError}
        onSuccess={handleSuccess}
        onStatus={onStatus}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
