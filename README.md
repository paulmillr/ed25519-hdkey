# micro-ed25519-hdkey

> [!WARNING]  
> The repository has been merged into [micro-key-producer](https://github.com/paulmillr/micro-key-producer). Please head to the new repo for updates.

    npm install micro-key-producer

---

Secure, minimal implementation of SLIP-0010 hierarchical deterministic (HD) wallets.

Sponsored by the Kin Foundation for [Kinetic](https://github.com/kin-labs/kinetic).

## Usage

> npm install micro-ed25519-hdkey

Or

> yarn add micro-ed25519-hdkey

The module exports a single class `HDKey`, which should be used like this:

```ts
import { HDKey } from 'micro-ed25519-hdkey';
const hdkey1 = HDKey.fromMasterSeed(seed);

// props
[hdkey1.depth, hdkey1.index, hdkey1.chainCode];
console.log(hdkey2.privateKey, hdkey2.publicKey);
console.log(hdkey3.derive("m/0/2147483647'/1'"));
const sig = hdkey3.sign(hash);
hdkey3.verify(hash, sig);
```

Note: `chainCode` property is essentially a private part
of a secret "master" key, it should be guarded from unauthorized access.

The full API is:

```ts
class HDKey {
  public static HARDENED_OFFSET: number;
  public static fromMasterSeed(seed: Uint8Array | string): HDKey;

  readonly depth: number = 0;
  readonly index: number = 0;
  readonly chainCode: Uint8Array | null = null;
  readonly parentFingerprint: number = 0;
  public readonly privateKey: Uint8Array;

  get fingerprint(): number;
  get fingerprintHex(): string;
  get parentFingerprintHex(): string;
  get pubKeyHash(): Uint8Array;
  get publicKey(): Uint8Array;
  get publicKeyRaw(): Uint8Array;

  derive(path: string, forceHardened = false): HDKey;
  deriveChild(index: number): HDKey;
  sign(hash: Uint8Array): Uint8Array;
  verify(hash: Uint8Array, signature: Uint8Array): boolean;
}
```

## Notes

- SLIP-0010 publicKey is 33 bytes (see [this issue](https://github.com/satoshilabs/slips/issues/1251)), if you want 32-byte publicKey, use `.publicKeyRaw` getter
- SLIP-0010 vectors fingerprint is actually `parentFingerprint`
- SLIP-0010 doesn't allow deriving non-hardened keys for Ed25519, however some other libraries treat non-hardened keys (`m/0/1`) as hardened (`m/0'/1'`). If you want this behaviour, there is a flag `forceHardened` in `derive` method

## License

[MIT License](./LICENSE)

Copyright (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com)
