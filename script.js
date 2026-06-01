const $ = (s) => document.querySelector(s);
const curriculum = $('#curriculum');
const optatives = $('#optatives');
const legend = $('#legend');
const modal = $('#modal');
const modalContent = $('#modalContent');
const search = $('#search');
const yearFilter = $('#yearFilter');
const blockFilter = $('#blockFilter');

Object.entries(BLOCKS).forEach(([key,b])=>{
  const el=document.createElement('span'); el.innerHTML=`<i class="dot" style="background:${b.color}"></i>${b.name}`; legend.appendChild(el);
  if(key!=='opt') blockFilter.insertAdjacentHTML('beforeend',`<option value="${key}">${b.name}</option>`);
});
[1,2,3,4,5].forEach(y=>yearFilter.insertAdjacentHTML('beforeend',`<option value="${y}">${y}º año</option>`));

function courseMatches(c){
 const q=search.value.trim().toLowerCase();
 const yearOk=yearFilter.value==='all'||String(c.year)===yearFilter.value;
 const blockOk=blockFilter.value==='all'||c.block===blockFilter.value;
 const text=(c.name+' '+(c.contents||[]).join(' ')).toLowerCase();
 return yearOk&&blockOk&&(!q||text.includes(q));
}
function kpi(label,value){return `<div><strong>${value ?? '—'}</strong><span>${label}</span></div>`}
function openCourse(c){
 const block=BLOCKS[c.block]||BLOCKS.opt;
 modalContent.innerHTML=`<div class="modal-title"><p class="eyebrow" style="color:${block.color}">${block.name}</p><h2>${c.name}</h2></div>
 <div class="modal-kpis">${kpi('Año',c.year?c.year+'º':'Optativa')}${kpi('Cuatrimestre',c.term||'2')}${kpi('Horas totales',c.hours)}</div>
 <div class="modal-kpis">${kpi('Horas semanales',c.weekly)}${kpi('Tipo',c.block==='opt'?'Optativa':'Obligatoria')}${kpi('Bloque',block.name)}</div>
 ${c.note?`<p class="note">${c.note}</p>`:''}
 <h3>Contenidos mínimos</h3><ul class="content-list">${(c.contents||[]).map(x=>`<li>${x}</li>`).join('')}</ul>`;
 modal.showModal();
}
function card(c){
 const b=BLOCKS[c.block]||BLOCKS.opt;
 const btn=document.createElement('button');
 btn.className='course-card'; btn.style.setProperty('--accent',b.color);
 btn.innerHTML=`<b>${c.name}</b><div class="meta"><span class="tag">${c.hours} h</span>${c.weekly?`<span class="tag">${c.weekly} h/sem</span>`:''}<span class="tag">${b.name}</span></div>`;
 btn.addEventListener('click',()=>openCourse(c));
 return btn;
}
function render(){
 curriculum.innerHTML='';
 const filtered=COURSES.filter(courseMatches);
 [1,2,3,4,5].forEach(year=>{
   const yearCourses=filtered.filter(c=>c.year===year);
   if(!yearCourses.length) return;
   const box=document.createElement('article'); box.className='year';
   const total=yearCourses.reduce((a,c)=>a+(c.hours||0),0);
   box.innerHTML=`<div class="year-head"><div class="year-title">${year}º año</div><div class="year-hours">${total} h visibles</div></div><div class="terms"></div>`;
   const terms=box.querySelector('.terms');
   [['1','Primer cuatrimestre'],['2','Segundo cuatrimestre'],['-','Requisitos']].forEach(([term,label])=>{
     const termCourses=yearCourses.filter(c=> term==='1' ? String(c.term).startsWith('1') : c.term===term);
     if(!termCourses.length) return;
     const t=document.createElement('div'); t.className='term'; t.innerHTML=`<h3>${label}</h3><div class="course-list"></div>`;
     termCourses.forEach(c=>t.querySelector('.course-list').appendChild(card(c)));
     terms.appendChild(t);
   });
   curriculum.appendChild(box);
 });
 if(!curriculum.children.length) curriculum.innerHTML='<p class="intro-card">No se encontraron asignaturas con esos filtros.</p>';
 optatives.innerHTML='';
 OPTATIVES.filter(c=>{
  const q=search.value.trim().toLowerCase(); const blockOk=blockFilter.value==='all'||blockFilter.value==='opt';
  return blockOk&&(!q||(c.name+' '+c.contents.join(' ')).toLowerCase().includes(q));
 }).forEach(c=>optatives.appendChild(card({...c,year:null,term:'2'})));
}
[search,yearFilter,blockFilter].forEach(el=>el.addEventListener('input',render));
$('.close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{ if(e.target===modal) modal.close(); });
render();
