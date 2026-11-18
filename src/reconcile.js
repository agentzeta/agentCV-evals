import {units} from './commerce-preview.js';
const address=/^0x[a-fA-F0-9]{40}$/;
// Assessment of supplied ledger records. No chain RPC or finality attestation.
export function reconcile(invoice, events) {
 if(!invoice || typeof invoice.id!=='string'||!invoice.id || !address.test(invoice.recipient)||!address.test(invoice.token)||!Number.isSafeInteger(invoice.chainId)||invoice.chainId<=0||units(invoice.amount)<=0n) throw Error('Invalid invoice');
 if(!Array.isArray(events))throw Error('Events must be an array');
 const ids=new Map(),issues=[],accepted=[];let pending=0n,settled=0n;
 for(const event of events){
  if(!event || typeof event.id!=='string'||!event.id)throw Error('Event id required');
  if(ids.has(event.id)) {if(JSON.stringify(ids.get(event.id))!==JSON.stringify(event))throw Error('Conflicting duplicate event');continue;}ids.set(event.id,event);
 }
 for(const e of ids.values()){
  if(!['SETTLED','PENDING','REVERSED'].includes(e.status))throw Error('Invalid event status');
  const amount=units(e.netAmount);
  if(e.invoiceId!==invoice.id||e.chainId!==invoice.chainId||e.token?.toLowerCase()!==invoice.token.toLowerCase()||e.recipient?.toLowerCase()!==invoice.recipient.toLowerCase()) {issues.push({id:e.id,reason:'SCOPE_MISMATCH'});continue;}
  if(e.status==='REVERSED'){issues.push({id:e.id,reason:'REVERSED_EXCLUDED'});continue;}
  if(e.status==='PENDING'){pending+=amount;continue;}
  if(e.evidenceType!=='LEDGER_OBSERVED'){issues.push({id:e.id,reason:'UNSUPPORTED_SETTLEMENT_CLAIM'});continue;}
  settled+=amount;accepted.push(e.id);
 }
 const due=units(invoice.amount);return {schema:'agentcv-invoice-reconciliation-v1',invoiceId:invoice.id,
  status:settled>=due?'COVERED_BY_SUPPLIED_RECORDS':'SHORTFALL',amountDue:due.toString(),settledNet:settled.toString(),pendingNet:pending.toString(),
  shortfall:(settled<due?due-settled:0n).toString(),surplus:(settled>due?settled-due:0n).toString(),acceptedEventIds:accepted,issues,
  fulfillment:'NOT_ASSESSED',assurance:'Supplied records only; settlement labels are not independently verified. No chain finality, service delivery, spend authority or tax conclusion.'};
}
