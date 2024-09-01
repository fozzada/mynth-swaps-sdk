import { Transaction } from "@dcspark/cardano-multiplatform-lib-nodejs";
import test from "ava";
import { Builder, loadLucid } from "mynth-swaps-sdk";
import { address, tokens } from "./wallet";

test("can create limit order", async (t) => {
  const lucid = (await loadLucid(address)).assert();
  const builder = (await Builder.create(lucid)).assert();

  const tx = (await builder.limit(100, tokens.one, tokens.two, 1.5)).assert();
  const cbor = (await tx.complete()).assert().toCBOR();
  const transaction = Transaction.from_cbor_hex(cbor);
  t.true(transaction.is_valid());
  t.is(transaction.body().mint()?.policy_count(), 1);
  t.is(transaction.body().outputs().len(), 2);
});

test("can create multiple limit orders", async (t) => {
  const lucid = (await loadLucid(address)).assert();
  const builder = (await Builder.create(lucid)).assert();

  (await builder.limit(100, tokens.one, tokens.two, 1.3)).assert();
  const tx = (await builder.limit(100, tokens.one, tokens.two, 1.5)).assert();
  const cbor = (await tx.complete()).assert().toCBOR();
  const transaction = Transaction.from_cbor_hex(cbor);
  t.true(transaction.is_valid());
  t.is(transaction.body().mint()?.policy_count(), 1);
  t.is(transaction.body().outputs().len(), 3);
});
