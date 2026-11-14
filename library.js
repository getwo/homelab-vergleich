(() => {
 'use strict';
 const topic=document.querySelector('#topic-select'),search=document.querySelector('#article-search'),only=document.querySelector('#saved-only');
 if(!topic||!search||!only)return;
 const key='homelab.savedArticles.v1',buttons=[...document.querySelectorAll('.save-article')],allowed=new Set(buttons.map(b=>b.dataset.url));
 let saved=new Set(),persistent=true;
 const warning=document.querySelector('#storage-warning');
 function unavailable(){persistent=false;warning.hidden=false;warning.textContent='Lokale Speicherung nicht verfügbar: Merker gelten nur bis zum Neuladen.';}
 try {const raw=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(raw))saved=new Set(raw.filter(x=>typeof x==='string'&&allowed.has(x)));}catch(e){unavailable();}
 function filter(){let count=0;
  document.querySelectorAll('.topic').forEach(section=>{let n=0;section.querySelectorAll('a.card').forEach(c=>{const show=(topic.value==='all'||topic.value===section.id)&&(!only.checked||saved.has(c.getAttribute('href')))&&c.textContent.toLocaleLowerCase('de').includes(search.value.trim().toLocaleLowerCase('de'));c.hidden=!show;if(show)n++;});section.hidden=n===0;count+=n;});
  const text=count?`${count} passende Artikel${only.checked?' · Merkliste':''}`:'Keine passenden Artikel. Suche oder Filter zurücksetzen.';document.querySelector('#search-status').textContent=text;
 }
 function draw(){buttons.forEach(b=>{const yes=saved.has(b.dataset.url);b.setAttribute('aria-pressed',String(yes));b.textContent=yes?'★ Gemerkt':'☆ Merken';b.setAttribute('aria-label',(yes?'Merker entfernen: ':'Artikel merken: ')+b.parentElement.querySelector('h3').textContent);});document.querySelector('.saved-counter').textContent=`${saved.size} Artikel gemerkt · nur in diesem Browser`;filter();}
 buttons.forEach(b=>b.addEventListener('click',()=>{saved.has(b.dataset.url)?saved.delete(b.dataset.url):saved.add(b.dataset.url);if(persistent){try{localStorage.setItem(key,JSON.stringify([...saved]));}catch(e){unavailable();}}draw();}));
 topic.addEventListener('change',filter);search.addEventListener('input',filter);only.addEventListener('change',filter);
 document.querySelector('#filter-reset').addEventListener('click',()=>{topic.value='all';search.value='';only.checked=false;filter();});
 document.querySelectorAll('.topic-links a').forEach(a=>a.addEventListener('click',()=>{topic.value=a.hash.slice(1);search.value='';only.checked=false;filter();}));
 addEventListener('storage',e=>{if(e.key!==key&&e.key!==null)return;try{const value=JSON.parse(e.newValue||'[]');saved=new Set(Array.isArray(value)?value.filter(x=>allowed.has(x)):[]);draw();}catch(ignore){}});
 document.documentElement.classList.add('library-ready');draw();
})();
