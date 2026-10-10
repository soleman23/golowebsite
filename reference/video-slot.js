// <video-slot id="..." placeholder="..."> — drag-drop / click-to-pick video placeholder. Persists per id in IndexedDB; instances sharing an id stay in sync.
(function(){
  if (customElements.get('video-slot')) return;
  const DB='golo-video-slots', ST='videos';
  const open=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
  const tx=async(mode,fn)=>{const db=await open();return new Promise((res,rej)=>{const t=db.transaction(ST,mode);const s=t.objectStore(ST);const q=fn(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);});};
  const get=k=>tx('readonly',s=>s.get(k)), put=(k,v)=>tx('readwrite',s=>s.put(v,k)), del=k=>tx('readwrite',s=>s.delete(k));
  class VideoSlot extends HTMLElement{
    constructor(){super();this.attachShadow({mode:'open'});this._url=null;
      this.shadowRoot.innerHTML=`<style>
        :host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#0b2c1a;font-family:system-ui,-apple-system,sans-serif;}
        .empty{position:absolute;inset:18px;border:3px dashed rgba(212,242,58,.45);border-radius:34px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;padding:30px;cursor:pointer;background:radial-gradient(120% 80% at 50% 0%,#1d5a36 0%,#0f3a22 55%,#0a2418 100%);}
        .empty.over{border-color:#d4f23a;background:rgba(212,242,58,.12);}
        .ic{width:92px;height:92px;border-radius:50%;background:rgba(212,242,58,.16);border:1px solid rgba(212,242,58,.5);display:flex;align-items:center;justify-content:center;}
        .t{font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1.1;}
        .s{font-size:19px;font-weight:700;color:rgba(255,255,255,.62);line-height:1.35;max-width:300px;}
        video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
        .clr{position:absolute;top:70px;right:22px;z-index:3;border:0;border-radius:9999px;padding:10px 16px;font:800 15px system-ui;background:rgba(0,0,0,.6);color:#fff;cursor:pointer;opacity:0;transition:opacity .2s;}
        :host(:hover) .clr{opacity:1;}
        @media print{.clr{display:none}}
      </style>
      <div class="empty" part="empty"><span class="ic"><svg width="40" height="40" viewBox="0 0 24 24" fill="#d4f23a"><path d="M8 5.5v13l10.5-6.5z"/></svg></span><span class="t"></span><span class="s">Drop a screen recording here, or click to choose a file</span></div>
      <input type="file" accept="video/*" hidden>`;
      this.$e=this.shadowRoot.querySelector('.empty');this.$i=this.shadowRoot.querySelector('input');
      this.$e.addEventListener('click',()=>this.$i.click());
      this.$i.addEventListener('change',()=>this.$i.files[0]&&this.set(this.$i.files[0]));
      this.addEventListener('dragover',e=>{e.preventDefault();this.$e.classList.add('over');});
      this.addEventListener('dragleave',()=>this.$e.classList.remove('over'));
      this.addEventListener('drop',e=>{e.preventDefault();this.$e.classList.remove('over');const f=[...(e.dataTransfer.files||[])].find(f=>f.type.startsWith('video/'));if(f)this.set(f);});
      this._sync=e=>{if(e.detail===this.key)this.load();};
    }
    get key(){return this.getAttribute('id')||'video-slot';}
    connectedCallback(){this.shadowRoot.querySelector('.t').textContent=this.getAttribute('placeholder')||'Screen recording';window.addEventListener('video-slot-change',this._sync);this.load();}
    disconnectedCallback(){window.removeEventListener('video-slot-change',this._sync);if(this._url)URL.revokeObjectURL(this._url);}
    async set(file){await put(this.key,file);window.dispatchEvent(new CustomEvent('video-slot-change',{detail:this.key}));}
    async clear(){await del(this.key);window.dispatchEvent(new CustomEvent('video-slot-change',{detail:this.key}));}
    async load(){
      let blob=null;try{blob=await get(this.key);}catch(e){}
      this.shadowRoot.querySelectorAll('video,.clr').forEach(n=>n.remove());
      if(this._url){URL.revokeObjectURL(this._url);this._url=null;}
      if(!blob){this.$e.style.display='';return;}
      this.$e.style.display='none';this._url=URL.createObjectURL(blob);
      const v=document.createElement('video');Object.assign(v,{src:this._url,autoplay:true,muted:true,loop:true,playsInline:true});v.setAttribute('playsinline','');
      const b=document.createElement('button');b.className='clr';b.textContent='Remove video';b.onclick=e=>{e.stopPropagation();this.clear();};
      this.shadowRoot.append(v,b);v.play().catch(()=>{});
    }
  }
  customElements.define('video-slot',VideoSlot);
})();
