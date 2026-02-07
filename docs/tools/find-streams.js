#!/usr/bin/env node
// Simple diagnostic: query radio-browser for station entries and test candidate stream URLs
// Usage: node tools/find-streams.js RTL WFMU

const stationNames = process.argv.slice(2);
if(!stationNames.length){
  console.log('Usage: node tools/find-streams.js <station1> <station2> ...');
  process.exit(1);
}

const API_HOSTS = ['https://at1.api.radio-browser.info','https://de1.api.radio-browser.info','https://fr1.api.radio-browser.info'];
const fetchWithTimeout = async (url, opts = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), timeout);
  try{
    const res = await fetch(url, {...opts, signal: controller.signal});
    clearTimeout(id);
    return res;
  }catch(e){ clearTimeout(id); throw e; }
};

(async ()=>{
  for(const name of stationNames){
    console.log('\n=== Station:', name, '===');
    let entries = [];
    for(const host of API_HOSTS){
      try{
        const q = encodeURIComponent(name);
        const url = `${host}/json/stations/byname/${q}`;
        const res = await fetchWithTimeout(url, {method:'GET'}, 8000);
        if(!res.ok) continue;
        const arr = await res.json();
        if(Array.isArray(arr) && arr.length) entries = entries.concat(arr);
      }catch(e){ /* ignore host errors */ }
    }
    // fallback: try searching by name term
    if(!entries.length){
      try{
        const host = API_HOSTS[0];
        const url = `${host}/json/stations/search?name=${encodeURIComponent(name)}`;
        const res = await fetchWithTimeout(url, {method:'GET'}, 8000);
        if(res.ok){ const arr = await res.json(); if(Array.isArray(arr)) entries = entries.concat(arr); }
      }catch(e){}
    }

    if(!entries.length){
      console.log('No radio-browser entries found for', name);
      continue;
    }

    // Collect candidate URLs
    const urls = new Map();
    for(const e of entries){
      const u = e.url_resolved || e.url;
      if(!u) continue;
      if(!u.startsWith('http')) continue;
      // prefer https
      if(!u.startsWith('https://')) continue;
      urls.set(u, (urls.get(u)||0)+1);
    }

    if(!urls.size){
      console.log('No HTTPS candidates found in radio-browser entries for', name);
      // try non-https as last resort
      for(const e of entries){ const u = e.url_resolved || e.url; if(u && u.startsWith('http')) urls.set(u, (urls.get(u)||0)+1); }
    }

    if(!urls.size){
      console.log('No candidates at all for', name);
      continue;
    }

    // Test top candidates (by frequency)
    const candidates = Array.from(urls.entries()).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).slice(0,10);
    for(const c of candidates){
      try{
        console.log('\nTesting', c);
        // Try a HEAD first
        let res;
        try{ res = await fetchWithTimeout(c, {method:'HEAD', redirect:'follow'}, 5000); }
        catch(e){
          // HEAD failed, try GET with byte range
          try{ res = await fetchWithTimeout(c, {method:'GET', redirect:'follow', headers:{Range:'bytes=0-0'}}, 5000); }catch(e2){ throw e2; }
        }
        console.log('  status:', res.status);
        const ct = res.headers.get('content-type');
        const ac = res.headers.get('access-control-allow-origin');
        const location = res.headers.get('location');
        console.log('  content-type:', ct);
        console.log('  access-control-allow-origin:', ac);
        if(location) console.log('  location:', location);
      }catch(e){
        console.log('  request failed:', e.message || e);
      }
    }
  }
})();