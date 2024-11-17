'use client';
// import React from 'react';
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

export default function TransactionWrapper({ onStatus, chainId, address, abi, functionName, args, value, disabled }: { onStatus: any, chainId: number, address: Address, abi: any, functionName: string, args: any, value?: bigint, disabled: boolean }) {
  
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
    args: args
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
        // contracts={contracts}
        calls={calls}
        className="w-[450px]"
        chainId={chainId}
        onError={handleError}
        onSuccess={handleSuccess}
        onStatus={onStatus}
      >
        <TransactionButton disabled={disabled} className="mt-4 w-[450px] max-w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
