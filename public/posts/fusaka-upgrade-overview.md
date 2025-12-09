---
title: Fusaka upgrade&#58; Ethereum is securely scaling 
datePublished: 2025-12-09
---

***Status***: Live & stable on Mainnet  
***Date***: December 3, 2025

* Ethereum’s Fusaka upgrade was successfully executed while maintaining 100% uptime, as all independent client teams implemented the Osaka (execution) and Fulu (consensus) protocol specifications.  
* The second network upgrade of 2025, Fusaka delivers a structural shift in the Ethereum network’s capacity without compromising security or decentralization.  
* Fusaka resolves critical barriers to adoption: user experience, data capacity constraints, custodial complexity, and costs. 

*Learn more about the Ethereum Improvement Proposals (EIPs) deployed in Fusaka [here](https://forkcast.org/upgrade/fusaka), and about the EIPs under consideration for Glamsterdam, the next network upgrade, [here](https://forkcast.org/upgrade/glamsterdam).* 

## Fusaka: Key technical improvements

<br /> 

**Expanding data availability**: *An 8x increase in settlement data capacity significantly reduces L2 transaction costs* 

* Previously, nodes were required to download all blobs (settlement data objects) to verify them  
* With Peer Data Availability Sampling (PeerDAS, [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594)), nodes now sample small fragments of data to verify integrity  
* This change effectively introduces distributed data verification, increasing data availability throughput by up to 8x without increasing the hardware burden on individual nodes  
* Massively reducing data settlement overhead for Layer 2s translates to stable, low fees for users and high-volume enterprise applications

<br /> 

**Easier, faster onboarding**: *Universal support for common cryptography standards unlocks secure mobile authentication like "Passkeys" (FaceID/TouchID)* 

* Ethereum now includes a native standard for the secp256r1 (P-256) elliptic curve ([EIP-7951](https://eips.ethereum.org/EIPS/eip-7951)), the NIST-compliant cryptography used by traditional HSMs, Apple Secure Enclave, Android Keystore, and WebAuthn  
* The support allows smart accounts and wallets to verify signatures directly from HSMs and secure mobile enclaves, eliminating the custom "middleware" or complex key management workarounds previously required to bridge the gap between Ethereum’s native cryptography (k1 curve) and standard banking-grade hardware  
* Wallets can now efficiently add support for users to authenticate via biometrics like FaceID, unlocking a mainstream mobile-native app experience while maintaining security

<br />

**Expanding transaction capacity**: *Allows the network to process \~33% more transactions on Layer 1 immediately, with a mechanism to safely and gradually ramp up capacity*

* The network has increased the per-block limit on computational effort by \~33% (from \~45M to 60M gas), allowing Mainnet to settle a significantly higher volume of transactions per block   
* Configurable data parameters: blob-parameter-only (BPO) forks ([EIP-7892](https://eips.ethereum.org/EIPS/eip-7892)) allow the network to adjust data capacity via standard configuration updates for agility outside of major protocol upgrades 

<br />

**Operational efficiency:** *Ensuring infrastructure stability as the network scales and improving transaction confirmations*

* Advance data on the network’s next next block proposer ([EIP-7917](https://eips.ethereum.org/EIPS/eip-7917)) means applications can integrate ‘based preconfirmations,’ reducing transaction pre-confirmation latency to provide 'instant-feel' payment and settlement UX   
* Updates to history expiry ([EIP-7642](https://eips.ethereum.org/EIPS/eip-7642)) and node requirements make full syncs faster and use less GB of storage per node, preventing infrastructure bloat while keeping home validator infra operations sustainable and cost-effective 


## Forward outlook: Glamsterdam (2026)

<br /> 

With the data layer scaled via Fusaka, the next scheduled upgrade, Glamsterdam, will focus on Layer 1 execution and neutrality.

Primary objective: Internalizing block production ([Enshrined Proposer-Builder Separation (ePBS)](https://eips.ethereum.org/EIPS/eip-7732))

* ePBS eliminates reliance on third-party relays (middleware) to facilitate block production, removing a counterparty layer and further decentralizing the network   
* Glamsterdam will further solidify Ethereum as a neutral settlement layer where transaction inclusion is guaranteed by the protocol itself, not by third-parties

Learn more about the EIPs being considered for Glamsterdam [here](https://forkcast.org/upgrade/glamsterdam). 