const $ = (s) => document.querySelector(s);
const curriculum = $('#curriculum');
const modal = $('#modal');
const modalContent = $('#modalContent');
const search = $('#search');
const yearFilter = $('#yearFilter');

[1,2,3,4,5].forEach(y=>yearFilter.insertAdjacentHTML('beforeend',`<option value="${y}">${y}º año</option>`));

function courseMatches(c){
 const q=search.value.trim().toLowerCase();
 const yearOk=yearFilter.value==='all'||String(c.year)===yearFilter.value;
 const text=(c.name+' '+(c.contents||[]).join(' ')).toLowerCase();
 return yearOk&&(!q||text.includes(q));
}
function kpi(label,value){return `<div><strong>${value ?? '—'}</strong><span>${label}</span></div>`}
function openCourse(c){
 modalContent.innerHTML=`<div class="modal-title"><p class="eyebrow">${c.year ? c.year+'º año · '+labelForTerm(c.term) : 'Trayecto optativo'}</p><h2>${c.name}</h2></div>
 <div class="modal-kpis">${kpi('Año',c.year?c.year+'º':'—')}${kpi('Cuatrimestre',labelForTerm(c.term))}${kpi('Horas totales',c.hours)}</div>
 <div class="modal-kpis single">${kpi('Horas semanales',c.weekly)}</div>
 ${c.note?`<p class="note">${c.note}</p>`:''}
 <h3>Contenidos mínimos</h3><ul class="content-list">${(c.contents||[]).map(x=>`<li>${x}</li>`).join('')}</ul>`;
 modal.showModal();
}
function labelForTerm(term){
 if(String(term).startsWith('1')) return '1º cuatrimestre';
 if(term==='2') return '2º cuatrimestre';
 if(term==='-') return 'Requisito';
 return term || '—';
}
function accentForYear(year){
 const colors={1:'#0f75bc',2:'#14b8a6',3:'#6366f1',4:'#8b5cf6',5:'#f97316'};
 return colors[year] || '#0f75bc';
}
function card(c){
 const btn=document.createElement('button');
 btn.className='course-card'; btn.style.setProperty('--accent',accentForYear(c.year));
 btn.innerHTML=`<b>${c.name}</b><div class="meta"><span class="tag">${c.hours} h</span>${c.weekly?`<span class="tag">${c.weekly} h/sem</span>`:''}</div>`;
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
   box.innerHTML=`<div class="year-head"><div class="year-title">${year}º año</div><div class="year-hours">${total} h</div></div><div class="terms"></div>`;
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
 if(!curriculum.children.length) curriculum.innerHTML='<p class="intro-card">No se encontraron asignaturas con esa búsqueda.</p>';
}
[search,yearFilter].forEach(el=>el.addEventListener('input',render));
$('.close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{ if(e.target===modal) modal.close(); });
render();
