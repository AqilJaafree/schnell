import { type Address } from 'viem';
import { Chain } from 'tempo.ts/viem';

export const alphaUsd = "0x20c0000000000000000000000000000000000001" as Address;

// Must use Chain.define from tempo.ts/viem (not viem's defineChain)
// This adds Tempo-specific formatters, serializers, and gas estimation
export const tempoModerato = Chain.define({
  id: 42431,
  name: 'Tempo Moderato',
  nativeCurrency: { name: 'AlphaUSD', symbol: 'aUSD', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.moderato.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' },
  },
  testnet: true,
})({ feeToken: alphaUsd });
