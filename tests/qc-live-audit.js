const { chromium } = require('playwright');
const assert = require('node:assert');
const BASE = process.env.BASE_URL || 'https://pos-enterprise-clean.pages.dev';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const results=[];
 try {
  for (const [name,width,height] of [['desktop',1440,900],['mobile390',390,844],['mobile345',345,800]]) {
   const page=await browser.newPage({viewport:{width,height}, reducedMotion:'reduce'});
   const errors=[]; const failed=[];
   page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
   page.on('pageerror',e=>errors.push(e.message));
   page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
   await page.goto(BASE+'/login.html?qc='+Date.now(),{waitUntil:'networkidle',timeout:60000});
   const login=await page.evaluate(()=>({title:document.title,sw:document.documentElement.scrollWidth,vw:innerWidth,form:!!document.querySelector('#login-form'),errorLive:document.querySelector('#error')?.getAttribute('aria-live'),active:document.activeElement?.id}));
   await page.click('#login-btn');
   const validation=await page.evaluate(()=>({emailInvalid:!document.querySelector('#email').checkValidity(),passwordInvalid:!document.querySelector('#password').checkValidity()}));
   await page.fill('#email','not-an-email');
   const emailTypeInvalid=await page.$eval('#email',e=>!e.checkValidity());
   await page.goto(BASE+'/?qc='+Date.now(),{waitUntil:'networkidle',timeout:60000});
   await page.waitForTimeout(1500);
   const app=await page.evaluate(()=>({url:location.pathname,title:document.title,sw:document.documentElement.scrollWidth,vw:innerWidth,loginRedirect:location.pathname.includes('login')}));
   results.push({name,login,validation,emailTypeInvalid,app,errors,failed});
   await page.close();
  }
  console.log(JSON.stringify(results,null,2));
  for(const r of results){assert.equal(r.login.sw,r.login.vw);assert.ok(r.login.form);assert.equal(r.login.errorLive,'polite');assert.ok(r.validation.emailInvalid&&r.validation.passwordInvalid);assert.ok(r.emailTypeInvalid);assert.ok(r.app.loginRedirect);}
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
