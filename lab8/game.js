const EMOJIS = ['🦁','🐯','🦊','🐺','🦝','🐸','🦋','🐙','🦄','🐲','🦀','🐬','🦜','🦩','🐊','🦈','🦚','🐠','🦑','🐝','🦔','🎃','🌮','🍕'];
const DIFF = { easy: 180, normal: 120, hard: 60 };
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const parseGrid = v => { const [r,c] = v.split('x').map(Number); return {rows:r,cols:c,pairs:r*c/2}; };
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };

const mkState = cfg => ({
  cfg, moves:0, locked:false, finished:false,
  player:0, pPairs:[0,0], flipped:[],
  matched: new Set(),
  deck: shuffle([...EMOJIS.slice(0,cfg.pairs),...EMOJIS.slice(0,cfg.pairs)])
         .map((v,i)=>({id:i,v})),
  timeLeft: DIFF[cfg.diff],
  t0: Date.now()
});

// ── State ──────────────────────────────────────────────────────
let S=null, timer=null, round=1, roundLog=[], settings={
  players:1, diff:'easy', names:['Гравець 1','Гравець 2']
};

// ── Timer ──────────────────────────────────────────────────────
const stopTimer = () => { clearInterval(timer); timer=null; };
const startTimer = () => {
  stopTimer();
  timer = setInterval(()=>{
    if(!S||S.finished) return;
    S.timeLeft--;
    updStats();
    if(S.timeLeft<=0){ stopTimer(); endRound(true); }
  },1000);
};

// ── Game flow ──────────────────────────────────────────────────
function startGame(){
  stopTimer();
  const cfg = {
    ...parseGrid(document.getElementById('gs').value),
    diff: settings.diff,
    players: settings.players,
    rounds: +document.getElementById('rc').value||1
  };
  settings.names = [
    document.getElementById('p1').value||'Гравець 1',
    document.getElementById('p2').value||'Гравець 2'
  ];
  S = mkState(cfg); round=1; roundLog=[];
  document.getElementById('hdr').textContent = `Раунд ${round}/${cfg.rounds}`;
  render(); startTimer();
}

function restartGame(){
  if(!S){ startGame(); return; }
  stopTimer(); S=mkState(S.cfg); render(); startTimer();
}

function nextRound(){
  closeModal();
  if(round>=S.cfg.rounds){ startGame(); return; }
  round++; stopTimer();
  S=mkState(S.cfg);
  document.getElementById('hdr').textContent=`Раунд ${round}/${S.cfg.rounds}`;
  render(); startTimer();
}

// ── Card click ─────────────────────────────────────────────────
function clickCard(id){
  if(!S||S.locked||S.finished) return;
  const card = S.deck.find(c=>c.id===id);
  if(!card||S.matched.has(id)||S.flipped.includes(id)||S.flipped.length>=2) return;

  S.flipped.push(id); 
  document.querySelector(`[data-id="${id}"] .ci`).closest('.card').classList.add('flipped');

  if(S.flipped.length<2){ updStats(); return; }

  S.locked=true; S.moves++;
  const [a,b] = S.flipped.map(i=>S.deck.find(c=>c.id===i));

  setTimeout(()=>{
    if(a.v===b.v){
      S.matched.add(a.id); S.matched.add(b.id);
      S.pPairs[S.player]++;
      S.flipped=[];
      [a.id,b.id].forEach(i=>document.querySelector(`[data-id="${i}"]`).classList.add('matched'));
      S.locked=false;
      updStats(); updTurns();
      if(S.matched.size===S.deck.length){ stopTimer(); S.finished=true; setTimeout(()=>endRound(false),400); }
    } else {
      const ids=[...S.flipped];
      ids.forEach(i=>{ const el=document.querySelector(`[data-id="${i}"]`); el.classList.add('wrong'); });
      if(S.cfg.players===2) S.player^=1;
      setTimeout(()=>{
        ids.forEach(i=>{ const el=document.querySelector(`[data-id="${i}"]`); el.classList.remove('wrong','flipped'); });
        S.flipped=[]; S.locked=false;
        updStats(); updTurns();
      },500);
    }
  },400);
  updStats();
}

function endRound(timedOut){
  S.finished=true;
  const res={round,moves:S.moves,time:Math.floor((Date.now()-S.t0)/1000),timedOut,pPairs:[...S.pPairs]};
  roundLog.push(res);
  showModal(res, round>=S.cfg.rounds, timedOut);
}

// ── Modal ──────────────────────────────────────────────────────
function showModal(res, isLast, timedOut){
  document.getElementById('mTitle').textContent = timedOut ? '⏰ Час вийшов!' : '🎉 Раунд завершено!';
  document.getElementById('mNext').textContent = isLast ? '↺ Нова гра' : `Раунд ${round+1} ▶`;
  const names = settings.names;
  const two = S.cfg.players===2;

  if(isLast){
    document.getElementById('mSub').textContent = two
      ? (res.pPairs[0]>res.pPairs[1]?`Переможець: ${names[0]} 🏆`:res.pPairs[1]>res.pPairs[0]?`Переможець: ${names[1]} 🏆`:'Нічия!')
      : `${names[0]} завершив гру!`;
    document.getElementById('mStats').innerHTML = roundLog.map(r=>
      `<div class="rr"><span>Раунд ${r.round}</span><span>${r.moves} ходів • ${fmt(r.time)}</span></div>`+
      (two?`<div class="rr" style="padding-left:10px"><span>${names[0]}</span><span>${r.pPairs[0]} пар</span></div>
            <div class="rr" style="padding-left:10px"><span>${names[1]}</span><span>${r.pPairs[1]} пар</span></div>`:'')
    ).join('');
  } else {
    document.getElementById('mSub').textContent = `Раунд ${res.round}/${S.cfg.rounds}`;
    document.getElementById('mStats').innerHTML =
      `<div class="rr"><span>Ходів</span><span>${res.moves}</span></div>
       <div class="rr"><span>Час</span><span>${fmt(res.time)}</span></div>`+
      (two?`<div class="rr"><span>${names[0]}</span><span>${res.pPairs[0]} пар</span></div>
             <div class="rr"><span>${names[1]}</span><span>${res.pPairs[1]} пар</span></div>`:'');
  }
  document.getElementById('ov').classList.add('show');
}

const closeModal = () => document.getElementById('ov').classList.remove('show');

function render(){
  document.getElementById('stats').style.display='flex';
  document.getElementById('turns').style.display='flex';
  const two = S.cfg.players===2;
  document.getElementById('pt2').style.display = two?'':'none';
  document.getElementById('pn1').textContent = settings.names[0];
  document.getElementById('pn2').textContent = settings.names[1];

  const grid = document.getElementById('grid');
  grid.style.gridTemplateColumns=`repeat(${S.cfg.cols},1fr)`;
  grid.innerHTML = S.deck.map(c=>`
    <div class="card" data-id="${c.id}" onclick="clickCard(${c.id})">
      <div class="ci"><div class="cf cb"></div><div class="cf cf2">${c.v}</div></div>
    </div>`).join('');
  updStats(); updTurns();
}

function updStats(){
  if(!S) return;
  document.getElementById('sM').textContent=S.moves;
  document.getElementById('sT').textContent=fmt(S.timeLeft);
  document.getElementById('sP').textContent=S.matched.size/2;
  document.getElementById('sR').textContent=`${round}/${S.cfg.rounds}`;
  document.getElementById('tbox').classList.toggle('warn',S.timeLeft<=20);
}

function updTurns(){
  if(!S) return;
  document.getElementById('pt1').classList.toggle('active',S.player===0);
  document.getElementById('pt2').classList.toggle('active',S.player===1);
  document.getElementById('ps1').textContent=`${S.pPairs[0]} пар`;
  document.getElementById('ps2').textContent=`${S.pPairs[1]} пар`;
}

function resetSettings(){
  settings={players:1,diff:'easy',names:['Гравець 1','Гравець 2']};
  document.getElementById('gs').value='4x4';
  document.getElementById('rc').value=1;
  document.getElementById('p1').value='Гравець 1';
  document.getElementById('p2').value='Гравець 2';
  document.getElementById('p2').style.display='none';
  document.querySelectorAll('#pgr .rb').forEach(b=>b.classList.toggle('active',b.dataset.val==='1'));
  document.querySelectorAll('.db').forEach(b=>b.classList.toggle('active',b.dataset.d==='easy'));
}

document.querySelectorAll('#pgr .rb').forEach(b=>b.addEventListener('click',()=>{
  settings.players=+b.dataset.val;
  document.querySelectorAll('#pgr .rb').forEach(x=>x.classList.toggle('active',x===b));
  document.getElementById('p2').style.display=b.dataset.val==='2'?'block':'none';
}));

document.querySelectorAll('.db').forEach(b=>b.addEventListener('click',()=>{
  settings.diff=b.dataset.d;
  document.querySelectorAll('.db').forEach(x=>x.classList.toggle('active',x===b));
}));
