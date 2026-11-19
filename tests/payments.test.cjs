// Compile only our TypeScript modules in-memory; no extra test runner is needed.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {
  compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},
}).outputText,filename);
const {test,after} = require('node:test');
const assert = require('node:assert/strict');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mypanel-payment-tests-'));
process.env.NODE_ENV='test';process.env.PAYMENTS_DATA_DIR=dir;
process.env.PAYMENT_ADMIN_PASSWORD='test-only-owner-password-7358';process.env.PAYMENTS_ENABLED='true';
const {createOrder,customerOrder,submitReceipt,reviewOrder}=require('../src/lib/payments/service.ts');
const {requireAdmin,makeSession,rateLimit,sameOrigin}=require('../src/lib/payments/security.ts');
const {detectMime}=require('../src/lib/payments/checks.ts');
const {readRecord,writeRecord}=require('../src/lib/payments/store.ts');
const image=(suffix)=>Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.from(suffix)]);
const fields=(ref)=>({account:'001021031868',amount:'2700.00',currency:'LKR',date:'2026-11-20',time:'12:20',reference:ref});
after(()=>{console.log('Temporary test data (contains synthetic receipts only): '+dir);});

test('server pricing ignores client amount and rejects unsupported device/method',async()=>{
  const result=await createOrder({productId:'starter-100',device:'Android',method:'bank',amountMinor:1});
  assert.equal(result.order.amountMinor,270000);assert.equal(result.order.status,'awaiting_payment');
  assert.equal(result.order.accessHash,undefined);assert.equal(result.token.length,43);
  await assert.rejects(createOrder({productId:'starter-100',device:'PC',method:'bank'}));
  await assert.rejects(createOrder({productId:'starter-100',device:'Android',method:'__proto__'}));
});
test('customer order requires its own access token',async()=>{
  const a=await createOrder({productId:'starter-100',device:'Android',method:'ezcash'});
  const b=await createOrder({productId:'starter-100',device:'Android',method:'binance'});
  assert.equal(b.order.amountMinor,900);assert.equal(b.order.currency,'USDT');
  await assert.rejects(customerOrder(a.order.id,b.token));
  assert.equal((await customerOrder(a.order.id,a.token)).value.id,a.order.id);
});
test('even matching / fabricated OCR never approves a payment',async()=>{
  const a=await createOrder({productId:'starter-100',device:'Android',method:'bank'});
  const f=fields('REF-TEST-001');
  const o=await submitReceipt(a.order.id,a.token,image('one'),f,'001021031868 LKR 2700.00 2026-11-20 12:20 REF-TEST-001');
  assert.equal(o.status,'pending_review');assert.equal(o.receipt.checks.length,4);
  await assert.rejects(reviewOrder(a.order.id,'approved',false,'Looks real'));
  const approved=await reviewOrder(a.order.id,'approved',true,'Matched incoming bank ledger entry REF-TEST-001');
  assert.equal(approved.status,'approved');assert.equal(approved.decision.confirmedInProvider,true);
  await assert.rejects(reviewOrder(a.order.id,'rejected',false,'Second reviewer'));
});
test('duplicate file and reference are refused across orders',async()=>{
  const make=()=>createOrder({productId:'starter-100',device:'Android',method:'bank'});
  const [a,b,c]=await Promise.all([make(),make(),make()]);
  await submitReceipt(a.order.id,a.token,image('duplicate'),fields('REF-DUP-001'),'');
  await assert.rejects(submitReceipt(b.order.id,b.token,image('duplicate'),fields('REF-DUP-002'),''),/already submitted/);
  await assert.rejects(submitReceipt(c.order.id,c.token,image('different'),fields('REF-DUP-001'),''),/already submitted/);
});
test('racing submissions of same reference allow only one order',async()=>{
  const make=()=>createOrder({productId:'starter-100',device:'Android',method:'bank'});
  const [a,b]=await Promise.all([make(),make()]);
  const results=await Promise.allSettled([
    submitReceipt(a.order.id,a.token,image('race-a'),fields('REF-RACE-001'),''),
    submitReceipt(b.order.id,b.token,image('race-b'),fields('REF-RACE-001'),''),
  ]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
});
test('file signature and size are enforced on server',async()=>{
  assert.equal(detectMime(Buffer.from('<svg onload="evil()">')),null);
  const a=await createOrder({productId:'starter-100',device:'Android',method:'bank'});
  await assert.rejects(submitReceipt(a.order.id,a.token,Buffer.from('<script>'),fields('BADTYPE'),''));
  await assert.rejects(submitReceipt(a.order.id,a.token,Buffer.alloc(3*1024*1024+1),fields('TOOBIG'),''));
});
test('owner cookie resists tampering and expired sessions',()=>{
  assert.throws(()=>requireAdmin(new Request('https://example.com')));
  requireAdmin(new Request('https://example.com',{headers:{cookie:'payment_admin='+makeSession()}}));
  assert.throws(()=>requireAdmin(new Request('https://example.com',{headers:{cookie:'payment_admin='+makeSession()+'tamper'}})));
  assert.throws(()=>requireAdmin(new Request('https://example.com',{headers:{cookie:'payment_admin=1.any'}})));
  assert.throws(()=>sameOrigin(new Request('https://example.com',{headers:{origin:'https://evil.example'}})));
});
test('conditional writes and rate limiting work concurrently',async()=>{
  const writes=await Promise.all(Array.from({length:6},()=>writeRecord('claims/atomic',1,{onlyIfNew:true})));
  assert.equal(writes.filter(Boolean).length,1);
  const entry=await readRecord('claims/atomic');
  assert.equal(await writeRecord('claims/atomic',2,{onlyIfMatch:'wrong'}),false);
  assert.equal(await writeRecord('claims/atomic',2,{onlyIfMatch:entry.etag}),true);
  const req=new Request('https://example.com');
  await rateLimit(req,'test',2,15);await rateLimit(req,'test',2,15);
  await assert.rejects(rateLimit(req,'test',2,15),/Too many/);
});
test('disabled checkout fails closed',async()=>{
  process.env.PAYMENTS_ENABLED='false';
  await assert.rejects(createOrder({productId:'starter-100',device:'Android',method:'bank'}),/being set up/);
  process.env.PAYMENTS_ENABLED='true';
});
test('one owner password enables checkout by default, but no password fails closed',async()=>{
  delete process.env.PAYMENTS_ENABLED;
  const order=await createOrder({productId:'starter-100',device:'Android',method:'bank'});
  assert.equal(order.order.status,'awaiting_payment');
  const password=process.env.PAYMENT_ADMIN_PASSWORD;
  delete process.env.PAYMENT_ADMIN_PASSWORD;
  await assert.rejects(createOrder({productId:'starter-100',device:'Android',method:'bank'}),/not been configured/);
  process.env.PAYMENT_ADMIN_PASSWORD=password;
  process.env.PAYMENTS_ENABLED='true';
});
