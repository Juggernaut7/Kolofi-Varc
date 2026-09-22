# Kolofi – Smart Group Savings on Arc Mainnet

**Kolofi** is a decentralized community savings protocol built natively for **Arc Mainnet** (Chain ID: `5042`).

Kolofi empowers communities and individuals with two core savings primitives powered by native USDC gas:
1. **Rotating Savings Circles (Esusu / Ajo / ROSCA):** Peer-to-peer rotating savings groups where members contribute fixed amounts of native USDC every round, and the accumulated pot rotates automatically to the designated recipient in line.
2. **Solo Goal Vaults:** Timelocked personal savings vaults where users lock native USDC toward an emergency fund, purchase, or deadline—with instant unlock upon hitting their target goal.

---

## 🚀 Live Arc Mainnet Deployments

| Contract | Address | Network | Explorer |
| :--- | :--- | :--- | :--- |
| **ArcVault** | `0xa7Bb4C5EE3aB4601f38aFDB34823EeD376684a8E` | Arc Mainnet (5042) | [View on Explorer](https://explorer.arc.io/address/0xa7Bb4C5EE3aB4601f38aFDB34823EeD376684a8E) |
| **ArcCircle** | `0x772668c219B6D35168DA2389cbda5Ca37827d604` | Arc Mainnet (5042) | [View on Explorer](https://explorer.arc.io/address/0x772668c219B6D35168DA2389cbda5Ca37827d604) |

- **RPC URL:** `https://rpc.mainnet.arc.io`
- **Native Gas Token:** USDC (18 decimals)

---

## 💡 Why Arc?

- **Zero-Approval Savings:** Arc uses native USDC for gas fees (`msg.value`). Users don't have to perform separate token approval transactions or hold volatile gas tokens—savings and transaction fees share one unified asset.
- **Ultra-low Gas Fees:** Circle contributions and goal deposits cost pennies or less.
- **Non-Custodial Transparency:** Automated round advancement, member queue lineup, and pot claims execute directly on-chain without intermediaries.

---

## 📁 Repository Structure

```text
Kolofi/
├── contracts/             # Solidity smart contracts & Hardhat tests
│   ├── contracts/
│   │   ├── ArcVault.sol   # Goal-based personal savings
│   │   └── ArcCircle.sol  # Rotating group ROSCA lineup
│   └── test/              # 100% passing contract test suites
│
└── Kolofi-client/         # Next.js 16 App Router frontend
    ├── src/
    │   ├── app/           # Next.js pages: dashboard, vaults, circles, profile
    │   ├── components/    # Web3 wallet connect, UI components, dashboard widgets
    │   └── lib/web3/      # Arc chain configuration, ABIs, formatters
```

---

## 🛠 Local Development

### 1. Smart Contracts

```bash
cd contracts
npm install
npm test
```

### 2. Frontend Client

```bash
cd Kolofi-client
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and connect your wallet switched to Arc Mainnet (5042).

---

## 📜 License

MIT
