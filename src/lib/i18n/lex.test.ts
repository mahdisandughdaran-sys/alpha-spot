import assert from "node:assert/strict";
import test from "node:test";
import { msg, plain, setLocaleStore, tr } from "./lex.ts";

test("persian prefix stays exact and english is recoverable", () => {
  const fa = "جریمه 15 امتیاز و 4.50٪";
  const packed = msg(fa, "15 point penalty and 4.50%");
  assert.equal(plain(packed), fa);
  assert.match(packed, /جریمه 15 امتیاز/);
  assert.match(packed, /4\.50٪/);
  setLocaleStore("fa");
  assert.equal(tr(packed), fa);
  setLocaleStore("en");
  assert.equal(tr(packed), "15 point penalty and 4.50%");
  assert.equal(tr("میز", "Desk"), "Desk");
  setLocaleStore("fa");
  assert.equal(tr("میز", "Desk"), "میز");
  assert.equal(msg(packed, "again"), packed);
});
