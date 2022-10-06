import { HDKey } from '../esm/index.js';
import { deepStrictEqual, throws } from 'assert';
import { should } from 'micro-should';
import { bytesToHex } from '@noble/hashes/utils';
import { fixtures } from './slip-0010.fixture.mjs';
import * as a from './bip39.test.mjs';

// https://github.com/satoshilabs/slips/blob/master/slip-0010.md

for (let i = 0; i < fixtures.length; i++) {
  const t = fixtures[i];
  should(`vector(${i})`, () => {
    const hd = HDKey.fromMasterSeed(t.seed);
    const child = hd.derive(t.path);
    deepStrictEqual(child.parentFingerprintHex, t.fingerprint, 'fingerprint');
    deepStrictEqual(bytesToHex(child.chainCode), t.chainCode, 'chainCode');
    deepStrictEqual(bytesToHex(child.privateKey), t.privateKey, 'privateKey');
    deepStrictEqual(bytesToHex(child.publicKey), t.publicKey, 'publicKey');
  });
}

should('throw on derivation of non-hardened keys', () => {
  const hd = HDKey.fromMasterSeed('000102030405060708090a0b0c0d0e0f');
  throws(() => hd.derive('m/0'));
  deepStrictEqual(hd.derive('m/0', true), hd.derive("m/0'"));
});

should('signing', () => {
  const msgA = new Uint8Array(32);
  const msgB = new Uint8Array(32).fill(8);
  const hdkey = HDKey.fromMasterSeed('000102030405060708090a0b0c0d0e0f').derive("m/0'");
  const sigA = hdkey.sign(msgA);
  const sigB = hdkey.sign(msgB);
  deepStrictEqual(
    bytesToHex(sigA),
    '9280d4802b67760fb56274dcb43db877c4888e958831cb4a0d689cde7c3183b655d3a622c08ab0255a1f09c637b145776cb3327c9c2c776eb7aa464a241ce907'
  );
  deepStrictEqual(
    bytesToHex(sigB),
    '2e44bdc615588392118b5d80d990660e55633f7dd21bb366a32d8445fba187ba35f1cbbdf96a0ab117eaadd9a0106a340d6028be455cf6851217dad6b9b23e06'
  );
  deepStrictEqual(hdkey.verify(msgB, sigB), true);
  deepStrictEqual(hdkey.verify(new Uint8Array(32), new Uint8Array(64)), false);
  deepStrictEqual(hdkey.verify(msgA, sigB), false);
  deepStrictEqual(hdkey.verify(msgB, sigA), false);
  throws(() => hdkey.verify(new Uint8Array(99), sigA));
  throws(() => hdkey.verify(msgA, new Uint8Array(99)));
});

should('throw on small seed', () => {
  throws(() => HDKey.fromMasterSeed('00'));
  throws(() => HDKey.fromMasterSeed('000102030405060708090a0b0c0d0e'));
});

should('throw on derivation of wrong indexes', () => {
  const hdkey = HDKey.fromMasterSeed('000102030405060708090a0b0c0d0e0f');
  const invalid = ["m/0'/ 1' /2'", "m/0'/1.5'/2'", "m/0'/331e100'/2'", "m/0'/3e'/2'", "m/0'/'/2'"];
  for (const t of invalid) throws(() => hdkey.derive(t));
});

should.run();
