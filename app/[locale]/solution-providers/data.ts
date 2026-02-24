export type MacroCategory =
  | "Infrastructure & Nodes"
  | "Custody & Wallets"
  | "DeFi & Trading"
  | "Tokenization & RWA"
  | "Staking"
  | "Security & Auditing"
  | "Data & Analytics"
  | "Compliance & Legal"
  | "Consulting & Advisory"
  | "Developer Tools"

export type Region =
  | "Americas"
  | "Europe"
  | "APAC"
  | "MENA"
  | "Global"
  | "Decentralized"

export interface SolutionProvider {
  name: string
  macroCategory: MacroCategory
  subCategory: string
  region: Region[]
  url?: string
}

export const MACRO_CATEGORIES: MacroCategory[] = [
  "Infrastructure & Nodes",
  "Custody & Wallets",
  "DeFi & Trading",
  "Tokenization & RWA",
  "Staking",
  "Security & Auditing",
  "Data & Analytics",
  "Compliance & Legal",
  "Consulting & Advisory",
  "Developer Tools",
]

export const REGIONS: Region[] = [
  "Americas",
  "Europe",
  "APAC",
  "MENA",
  "Global",
  "Decentralized",
]

export const solutionProviders: SolutionProvider[] = [
  {
    name: "Aave",
    macroCategory: "DeFi & Trading",
    subCategory: "DeFi Protocol",
    region: ["Decentralized"],
    url: "https://aave.com",
  },
  {
    name: "Alchemy",
    macroCategory: "Developer Tools",
    subCategory: "Developer Platform",
    region: ["Americas"],
    url: "https://alchemy.com",
  },
  {
    name: "Ankr",
    macroCategory: "Infrastructure & Nodes",
    subCategory: "Node Infrastructure",
    region: ["Global"],
    url: "https://ankr.com",
  },
  {
    name: "BitGo",
    macroCategory: "Custody & Wallets",
    subCategory: "Custody",
    region: ["Americas"],
    url: "https://bitgo.com",
  },
  {
    name: "Centrifuge",
    macroCategory: "Tokenization & RWA",
    subCategory: "RWA Protocol",
    region: ["Decentralized"],
    url: "https://centrifuge.io",
  },
  {
    name: "Chainalysis",
    macroCategory: "Compliance & Legal",
    subCategory: "Compliance",
    region: ["Global"],
    url: "https://chainalysis.com",
  },
  {
    name: "Chainlink",
    macroCategory: "Infrastructure & Nodes",
    subCategory: "Oracles & Data Feeds",
    region: ["Global"],
    url: "https://chainlinklabs.com",
  },
  {
    name: "Circle",
    macroCategory: "Tokenization & RWA",
    subCategory: "Stablecoins & Payments",
    region: ["Global"],
    url: "https://circle.com",
  },
  {
    name: "Coinbase Prime",
    macroCategory: "DeFi & Trading",
    subCategory: "Trading & Custody",
    region: ["Americas"],
    url: "https://prime.coinbase.com",
  },
  {
    name: "Compound",
    macroCategory: "DeFi & Trading",
    subCategory: "Lending Protocol",
    region: ["Decentralized"],
    url: "https://compound.finance",
  },
  {
    name: "Consensys",
    macroCategory: "Infrastructure & Nodes",
    subCategory: "Infrastructure",
    region: ["Global"],
    url: "https://consensys.io",
  },
  {
    name: "Copper",
    macroCategory: "Custody & Wallets",
    subCategory: "Custody",
    region: ["Europe"],
    url: "https://copper.co",
  },
  {
    name: "Deloitte",
    macroCategory: "Consulting & Advisory",
    subCategory: "Consulting",
    region: ["Global"],
    url: "https://deloitte.com",
  },
  {
    name: "Dune Analytics",
    macroCategory: "Data & Analytics",
    subCategory: "Analytics",
    region: ["Global"],
    url: "https://dune.com",
  },
  {
    name: "EigenLayer",
    macroCategory: "Staking",
    subCategory: "Restaking",
    region: ["Decentralized"],
    url: "https://eigenlayer.xyz",
  },
  {
    name: "Elliptic",
    macroCategory: "Compliance & Legal",
    subCategory: "Compliance",
    region: ["Europe"],
    url: "https://elliptic.co",
  },
  {
    name: "EY",
    macroCategory: "Consulting & Advisory",
    subCategory: "Consulting",
    region: ["Global"],
    url: "https://ey.com",
  },
  {
    name: "Fireblocks",
    macroCategory: "Custody & Wallets",
    subCategory: "Custody & Wallets",
    region: ["Global"],
    url: "https://fireblocks.com",
  },
  {
    name: "Infura",
    macroCategory: "Infrastructure & Nodes",
    subCategory: "Node Infrastructure",
    region: ["Global"],
    url: "https://infura.io",
  },
  {
    name: "Lido",
    macroCategory: "Staking",
    subCategory: "Liquid Staking",
    region: ["Decentralized"],
    url: "https://lido.fi",
  },
  {
    name: "MakerDAO/Sky",
    macroCategory: "DeFi & Trading",
    subCategory: "Stablecoin Protocol",
    region: ["Decentralized"],
    url: "https://sky.money",
  },
  {
    name: "Maple",
    macroCategory: "DeFi & Trading",
    subCategory: "Institutional Lending",
    region: ["Decentralized"],
    url: "https://maple.finance",
  },
  {
    name: "Nansen",
    macroCategory: "Data & Analytics",
    subCategory: "Analytics",
    region: ["Europe"],
    url: "https://nansen.ai",
  },
  {
    name: "Ondo",
    macroCategory: "Tokenization & RWA",
    subCategory: "Tokenized Treasuries",
    region: ["Americas"],
    url: "https://ondo.finance",
  },
  {
    name: "OpenZeppelin",
    macroCategory: "Security & Auditing",
    subCategory: "Security",
    region: ["Global"],
    url: "https://openzeppelin.com",
  },
  {
    name: "PwC",
    macroCategory: "Consulting & Advisory",
    subCategory: "Consulting",
    region: ["Global"],
    url: "https://pwc.com",
  },
  {
    name: "Securitize",
    macroCategory: "Tokenization & RWA",
    subCategory: "Tokenization Platform",
    region: ["Americas"],
    url: "https://securitize.io",
  },
  {
    name: "The Graph",
    macroCategory: "Data & Analytics",
    subCategory: "Data Indexing",
    region: ["Decentralized"],
    url: "https://thegraph.com",
  },
  {
    name: "Trail of Bits",
    macroCategory: "Security & Auditing",
    subCategory: "Auditing",
    region: ["Americas"],
    url: "https://trailofbits.com",
  },
  {
    name: "Uniswap",
    macroCategory: "DeFi & Trading",
    subCategory: "DEX",
    region: ["Decentralized"],
    url: "https://uniswap.org",
  },
]
