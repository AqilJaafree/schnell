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

const MAX_PAYMENT_AMOUNT = 10_000; // aUSD
const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

function sanitizeError(err: any): string {
  const msg = err?.shortMessage ?? err?.message ?? '';
  if (msg.includes('insufficient funds') || msg.includes('exceeds balance'))
    return 'Insufficient balance. Please top up your wallet.';
  if (msg.includes('user rejected') || msg.includes('User denied'))
    return 'Transaction was cancelled.';
  if (msg.includes('gas'))
    return 'Transaction failed due to gas estimation. Please try again.';
  if (msg.includes('nonce'))
    return 'Transaction conflict. Please wait a moment and try again.';
  return 'Payment failed. Please try again.';
}

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

      // Validate payment amount
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        setError('Invalid payment amount');
        return;
      }
      if (numericAmount > MAX_PAYMENT_AMOUNT) {
        setError(`Amount exceeds maximum of ${MAX_PAYMENT_AMOUNT} aUSD`);
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

        const hash = receipt.transactionHash;
        if (TX_HASH_REGEX.test(hash)) {
          setTxHash(hash);
        } else {
          setError('Transaction completed but returned an invalid hash.');
        }
      } catch (err: any) {
        setError(sanitizeError(err));
      } finally {
        setIsSending(false);
      }
    },
    [wallets],
  );

  return { send, isSending, error, txHash, reset };
}
