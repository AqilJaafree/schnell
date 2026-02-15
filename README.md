# Schnell

> Shop smarter with your AI twin — try on clothes in 3D and pay with crypto.

Schnell is a mobile-first fashion e-commerce app that generates a personalized 3D avatar from your selfie using Google Gemini AI, lets you virtually try on clothing with real-time Three.js rendering, and processes payments on the Tempo blockchain using AlphaUSD stablecoins. Authentication and embedded wallets are handled seamlessly by Privy — no seed phrases, no extensions, just tap and go.

Built with React Native (Expo), Three.js, Google Gemini AI, Privy authentication, and Tempo blockchain.

## Features

### AI-Powered 3D Avatar
- Upload a selfie to generate a personalized full-body avatar using **Google Gemini** (gemini-2.5-flash-image)
- Real-time 3D rendering with **React Three Fiber** and **Three.js**
- Virtual clothing try-on with layered top/bottom overlays and subtle rotation animation

### Tempo Blockchain Payments
- Integrated checkout with **Tempo Moderato** chain (Chain ID: 42431)
- TIP-20 token transfers using **AlphaUSD (aUSD)** with 6 decimal precision
- Uses `tempo.ts/viem` with `Chain.define` for proper Tempo transaction formatting, serialization, and gas estimation
- `tempoActions()` extends viem clients for `token.transferSync()` and `token.getMetadata()`
- Transaction confirmation with explorer links (`explore.tempo.xyz`)
- Embedded Ethereum wallet auto-created on login via Privy

### Authentication
- **Privy** embedded wallet auth with email OTP, Google OAuth, and Apple Sign-In
- Auto-creates Ethereum + Solana embedded wallets for all users
- Auth guard with onboarding flow enforcement

### Shopping Experience
- Browse clothing catalog by category (tops, bottoms, shoes, accessories)
- Cart management with size selection
- Checkout with shipping form validation
- Order history and tracking on user profile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo 54 + Expo Router 6 |
| 3D | Three.js 0.182 + React Three Fiber 9.5 |
| AI | Google Generative AI SDK (Gemini 2.5 Flash) |
| Auth | Privy (@privy-io/expo) |
| Blockchain | Viem 2.45 + tempo.ts 0.11 |
| Storage | Expo Secure Store (native), localStorage (web) |
| Language | TypeScript 5.9 |

## Project Structure

```
schnell/
├── apps/mobile/             # Expo app
│   ├── app/                 # File-based routing (Expo Router)
│   │   ├── (tabs)/          # Home, Search, Wardrobe, Profile
│   │   ├── onboarding/      # Height/Weight, Selfie, Avatar
│   │   ├── cart/            # Cart + Checkout
│   │   └── _layout.tsx      # Root layout (Privy + auth guard)
│   ├── components/          # UI components + Avatar3DScene
│   ├── hooks/               # useTempoPayment, useAvatarStorage, etc.
│   ├── services/            # Gemini AI integration
│   ├── constants/           # Theme, Tempo chain config
│   └── data/                # Mock catalog data
├── netlify.toml             # Web deployment config
└── pnpm-workspace.yaml
```

## Tempo Integration Details

### Chain Configuration

The Tempo Moderato chain is defined using `Chain.define` from `tempo.ts/viem` (not viem's `defineChain`). This is required because it adds:

- **Custom `prepareTransactionRequest`** for Tempo-specific gas estimation
- **Custom transaction serializers** for Tempo tx type (`0x76`)
- **Custom formatters** handling `feeToken`, `calls`, `feePayerSignature`

```typescript
import { Chain } from 'tempo.ts/viem';

export const tempoModerato = Chain.define({
  id: 42431,
  name: 'Tempo Moderato',
  nativeCurrency: { name: 'AlphaUSD', symbol: 'aUSD', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.moderato.tempo.xyz'] },
  },
  testnet: true,
})({ feeToken: alphaUsd });
```

### Payment Flow

1. Privy embedded wallet provider switches to Tempo Moderato
2. Public client (HTTP transport) fetches token metadata via `tempoActions()`
3. Wallet client (Privy provider) sends TIP-20 transfer via `client.token.transferSync()`
4. Transaction confirmed and explorer link displayed

### Key Dependencies

- `tempo.ts@0.11.1` — last version with the `./viem` subpath export (`tempoActions`, `Chain.define`)
- `viem@2.45.3` — Ethereum client library
- `buffer` polyfill required in React Native entry point for Privy SDK compatibility

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_PRIVY_APP_ID=your-privy-app-id
EXPO_PUBLIC_PRIVY_CLIENT_ID=your-privy-client-id
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### Development

```bash
# Start Expo dev server
pnpm --filter @schnell/mobile start

# Platform-specific
pnpm --filter @schnell/mobile android
pnpm --filter @schnell/mobile ios
pnpm --filter @schnell/mobile web
```

### Build for Web

```bash
pnpm --filter @schnell/mobile build:web
```

Output is in `apps/mobile/dist/`.

### Deploy to Netlify

The `netlify.toml` at the repo root is pre-configured. Connect the repo to Netlify and set the environment variables in the Netlify dashboard.

## Web Platform

Native-only dependencies have `.web.tsx`/`.web.ts` alternatives that Metro resolves automatically:

| Native | Web Alternative |
|--------|----------------|
| `expo-three` / `expo-asset` (texture loading) | `THREE.TextureLoader` |
| `expo-secure-store` + `expo-file-system` (avatar storage) | `localStorage` |
| `expo-image-picker` (selfie capture) | `<input type="file" accept="image/*">` |
| `expo-file-system` `File` (file reading) | `fetch()` + `FileReader` |

## License

MIT
