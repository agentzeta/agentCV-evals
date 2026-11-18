# AgentCV-evals

Standalone evaluation evidence and agent-commerce assessment tools. Includes the AgentCV addendum and a recipient-net invoice reconciliation product. Node.js 22+, no third-party dependencies. Private repository; the inherited AgentCV code retains its MIT notice.

## Run

```
npm test
npm run demo
npm run commerce-demo
node cli.js reconcile fixtures/reconcile.json reports.json
```

Open `dashboard.html` locally and select the resulting report. No upload or analytics occurs.

## Commands and contracts

`inspect`: input `{configuration,envelopes,trustedKeys,revocations,now}`. See `scripts/passport-demo.js` for complete generation with ephemeral Ed25519 keys. Key trust and revocation snapshots are operator supplied. No secret keys are stored in fixtures.

`run`: input `{agentId,endpoint,runLabel}`. Endpoint must be loopback HTTP and implement `POST {task,taskId}` returning `{output}`. The built-in ten-task routing suite is public and can be memorized. It measures only those responses.

`quote`: input `{request,response,clock}`. `invoice`: input `{request,response,options}` where options include raw integer-string `maxInput` and `invoiceAmount`. `quote-live`: input is a Uniswap quote request; set `UNISWAP_API_KEY` through the environment. Only same-chain CLASSIC preview semantics are supported by the normalization module. Live API access has not been validated with a production key.

`reconcile`: input `{invoice,events}`. Events are unique settlement records in their current state, not an append-only status transition stream. A reversal must be reflected in the current record. Conflicting duplicate ids are rejected; pending, reversed, mismatched or unsupported records are excluded. Net amounts are unsigned integer strings in token base units. A caller labeling a record `LEDGER_OBSERVED` does not authenticate it. Chain adapters and independent finality checks are not implemented.

## What this establishes

Signatures authenticate the declared issuer payload against a configured key. They do not establish legal identity, remote model identity, Sybil resistance or general competence. A matching configuration is declared, not attested. Evidence summaries keep evaluators and benchmark fixtures separate. Unknown status is not a pass.

Quote receipts use recipient `aggregatedOutputs[].minAmount` rather than the compatibility pre-fee headline minimum. Missing semantics require review. Gas, balances, authorization, approvals, transaction broadcasting, service fulfillment and tax treatment remain outside scope. The optional X-Agent-Info header is analytics attribution only.

## Pilot offering

Evaluation evidence pilot: one task family, two declared configurations, agreed test protocol and report of exclusions. Proposed price USD 2,500–5,000, to validate with customers. Invoice integration assessment: one network/token pair and permissioned ledger sample, USD 1,500–3,000 proposed. No favorable score is promised. Deliverables: reproducible input manifest, findings, uncertainty and remediation backlog. No customers or revenue are claimed.

## Sources

https://developers.uniswap.org/docs/trading/swapping-api/faqs

https://developers.uniswap.org/docs/trading/swapping-api/start-building/agent-attribution

Code adapted from https://github.com/agentzeta/AgentCV at the November 2026 addendum. The implementation is an assessment prototype, not a production spend gate.
