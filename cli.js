import {readFile,writeFile} from 'node:fs/promises';
import {inspectEvidence} from './src/evidence-passport.js';
import {quoteReceipt,invoiceFundingPreview,fetchQuote} from './src/commerce-preview.js';
import {reconcile} from './src/reconcile.js';
import {executeIndependentRun} from './src/independent-runner.js';
const [command,inputPath,outputPath]=process.argv.slice(2);
try {
 if(!command||!inputPath)throw Error('Usage: node cli.js inspect|quote|invoice|reconcile|run|quote-live input.json [output.json]');
 const data=JSON.parse(await readFile(inputPath,'utf8')); let result;
 if(command==='inspect')result=inspectEvidence(data);
 else if(command==='quote')result=quoteReceipt(data.request,data.response,data.clock);
 else if(command==='invoice')result=invoiceFundingPreview(data.request,data.response,data.options);
 else if(command==='reconcile')result=reconcile(data.invoice,data.events);
 else if(command==='run')result=await executeIndependentRun(data,[{id:data.agentId}]);
 else if(command==='quote-live')result=await fetchQuote(data,{apiKey:process.env.UNISWAP_API_KEY});
 else throw Error('Unknown command');
 const text=JSON.stringify(result,null,2)+'\n';if(outputPath)await writeFile(outputPath,text,{mode:0o600});else process.stdout.write(text);
} catch(e){console.error(e.message);process.exitCode=1;}
