const fs=require('fs'),vm=require('vm');
for(const file of ['index.html','login.html']){const html=fs.readFileSync(file,'utf8');for(const [i,m] of [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].entries()){if(m[1].trim())new vm.Script(m[1],{filename:`${file}:inline-${i}`});}}
for(const file of ['config.js','pwa.js','sw.js','src/main.js'])new vm.Script(fs.readFileSync(file,'utf8').replace(/^export\s+/gm,''),{filename:file});
console.log('JavaScript syntax: all files passed');
