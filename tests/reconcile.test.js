import test from 'node:test';import assert from 'node:assert/strict';import {reconcile} from '../src/reconcile.js';
const i={id:'invoice-1',chainId:1,token:'0x'+'1'.repeat(40),recipient:'0x'+'2'.repeat(40),amount:'100'};
const e={id:'tx:0',invoiceId:i.id,chainId:1,token:i.token,recipient:i.recipient,netAmount:'99',status:'SETTLED',evidenceType:'LEDGER_OBSERVED'};
test('net shortfall and duplicates',()=>{assert.equal(reconcile(i,[e,e]).shortfall,'1');});
test('pending reversed and self reported do not count',()=>{for(const ev of [{...e,status:'PENDING'},{...e,status:'REVERSED'},{...e,evidenceType:'SELF_REPORTED'}])assert.equal(reconcile(i,[ev]).settledNet,'0');});
test('wrong network or recipient excluded',()=>{assert.equal(reconcile(i,[{...e,chainId:2}]).settledNet,'0');});
test('conflicting duplicate rejected',()=>assert.throws(()=>reconcile(i,[e,{...e,netAmount:'100'}])));
test('coverage never asserts delivery',()=>{const r=reconcile(i,[{...e,netAmount:'101'}]);assert.equal(r.surplus,'1');assert.equal(r.fulfillment,'NOT_ASSESSED');});
test('integer validation',()=>assert.throws(()=>reconcile(i,[{...e,netAmount:99}])));
