// Radio PWA — app logic (ES module)
const STATIONS_JSON = './stations.json';

const audio = document.getElementById('audio');
const stationsEl = document.getElementById('stations');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const volumeEl = document.getElementById('volume');
const stationNameEl = document.getElementById('stationName');
const metaInfoEl = document.getElementById('metaInfo');


let stations = [];
let currentIndex = -1;

async function loadStations(){
  const res = await fetch(STATIONS_JSON);
  stations = await res.json();
  renderStations();
  // Streams must be declared in stations.json; auto-resolution is disabled to avoid external API calls.
} 

function renderStations(){
  stationsEl.innerHTML = '';
  stations.forEach((s, i)=>{
    const btn = document.createElement('button');
    btn.className = 'station-btn';
    btn.setAttribute('data-index', i);
    btn.innerHTML = `
      <img src="${s.logo || '/assets/logos/placeholder.svg'}" alt="${s.name} logo" loading="lazy">
      <div class="label">${s.name}</div>
    `;
    btn.addEventListener('click', ()=>selectStation(i));
    stationsEl.appendChild(btn);
  });
} 

// Auto-resolution via Radio-Browser has been removed. Provide a direct `stream` URL in `stations.json` for each station instead.


async function selectStation(idx){
  if(idx === currentIndex){ togglePlay(); return; }
  currentIndex = idx;
  const s = stations[idx];
  updateUIForStation(s);
  if(!s.stream){ showToast('Stream URL not found for this station. Try editing stations.json or check network.'); return; }
  audio.src = s.stream;
  audio.crossOrigin = 'anonymous';
  audio.play().catch(err=>{ showToast('Playback blocked or failed. Tap play to allow audio.'); console.warn(err); });
} 

function updateUIForStation(s){
  stationNameEl.textContent = s.name;
  metaInfoEl.textContent = '';
} 

function togglePlay(){
  if(audio.paused){
    audio.play().catch(e=>showToast('Playback failed: ' + (e.message||e)));
    playPauseBtn.textContent = '⏸';
  }else{
    audio.pause();
    playPauseBtn.textContent = '►';
  }
}

stopBtn.addEventListener('click', ()=>{audio.pause(); audio.currentTime = 0; playPauseBtn.textContent = '►';});
playPauseBtn.addEventListener('click', ()=>togglePlay());
volumeEl.addEventListener('input', (e)=>{audio.volume = parseFloat(e.target.value)});


function showToast(msg){
  const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),5000);
}

// Service worker registration for PWA offline support
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js').then(()=>console.log('SW registered')).catch(e=>console.warn('SW register failed',e));
}

// Media Session (for lock screen / background) — best-effort
if('mediaSession' in navigator){
  navigator.mediaSession.setActionHandler('play', ()=>audio.play());
  navigator.mediaSession.setActionHandler('pause', ()=>audio.pause());
}

// initial load
loadStations().catch(e=>showToast('Failed to load stations list'));

// keep UI updated with play/pause state
audio.addEventListener('play', ()=>playPauseBtn.textContent='⏸');
audio.addEventListener('pause', ()=>playPauseBtn.textContent='►');
audio.addEventListener('error', (ev)=>{ showToast('Stream failed to load. Check station or network.'); console.error(ev); });

// Beforeunload: pause audio to avoid weird background playback when closing
window.addEventListener('beforeunload', ()=>{ try{ audio.pause(); }catch(e){} });