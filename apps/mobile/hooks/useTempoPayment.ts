import { useState, useCallback } from 'react';
import { useEmbeddedEthereumWallet } from '@privy-io/expo';
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseUnits,
  stringToHex,
  walletActions,
  type Address,
} from 'viem';
import { tempoActions } from 'tempo.ts/viem';
import { tempoModerato, alphaUsd } from '../constants/chains';

interface UseTempoPaymentReturn {
  send: (to: Address, amount: string, memo?: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  txHash: string | null;
  reset: () => void;
}

export function useTempoPayment(): UseTempoPaymentReturn {
  const { wallets } = useEmbeddedEthereumWallet();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setTxHash(null);
    setIsSending(false);
  }, []);

  const send = useCallback(
    async (to: Address, amount: string, memo?: string) => {
      const wallet = wallets?.[0];
      if (!wallet) {
        setError('No embedded wallet found');
        return;
      }

      setIsSending(true);
      setError(null);
      setTxHash(null);

      try {
        // Get the EIP-1193 provider from Privy embedded wallet
        const provider = await wallet.getProvider();

        // Switch chain to Tempo Moderato
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${tempoModerato.id.toString(16)}` }],
        });

        // Public client for reads (HTTP transport)
        const publicClient = createPublicClient({
          chain: tempoModerato,
          transport: http('https://rpc.moderato.tempo.xyz'),
        }).extend(tempoActions());

        // Wallet client for writes (Privy provider)
        const client = createWalletClient({
          account: wallet.address as Address,
          chain: tempoModerato,
          transport: custom(provider),
        })
          .extend(walletActions)
          .extend(tempoActions());

        // Get token metadata for decimals
        const metadata = await publicClient.token.getMetadata({
          token: alphaUsd,
        });

        // Send TIP-20 transfer via Tempo's transferSync
        const { receipt } = await client.token.transferSync({
          to,
          amount: parseUnits(amount, metadata.decimals),
          memo: stringToHex(memo || 'Schnell order'),
          token: alphaUsd,
        });

        setTxHash(receipt.transactionHash);
      } catch (err: any) {
        setError(err?.shortMessage ?? err?.message ?? 'Payment failed');
      } finally {
        setIsSending(false);
      }
    },
    [wallets],
  );

  return { send, isSending, error, txHash, reset };
}
