(() => {
 'use strict';
 const button=document.querySelector('.night-toggle');if(!button)return;
 const key='homelab.readerTheme.v1',warning=document.querySelector('.reading-crumb .storage-warning');let persistent=true;
 function unavailable(){persistent=false;if(warning){warning.hidden=false;warning.textContent='Darstellung gilt nur bis zum Neuladen: Browserspeicher ist gesperrt.';}}
 function apply(dark){document.body.classList.toggle('night',dark);button.setAttribute('aria-pressed',String(dark));button.textContent=dark?'Zum hellen Journal':'Nachtmodus';}
 try{apply(localStorage.getItem(key)==='dark');}catch(e){unavailable();apply(false);}
 button.addEventListener('click',()=>{const dark=!document.body.classList.contains('night');apply(dark);if(persistent){try{if(dark)localStorage.setItem(key,'dark');else localStorage.removeItem(key);}catch(e){unavailable();}}});
 addEventListener('storage',e=>{if(e.key===key||e.key===null)apply(e.newValue==='dark');});
})();
