const noteButton=document.querySelector(".note-button");const principle=document.getElementById("faith");noteButton.addEventListener("click",()=>principle.classList.add("open"));principle.querySelector("button").addEventListener("click",()=>principle.classList.remove("open"));
const notes={
building:["VOLUME / 01","Building","I build after I listen. This volume holds the projects, wrong turns and small decisions behind the work—not only the polished outcome.","#work","Explore my work →"],
understanding:["VOLUME / 02","Understanding","Notes from learning the Qur’an with meaning and tafsir, and from trying to let faith shape intention, responsibility and service. These are learning notes, not religious rulings.","#story","Read a guiding principle →"],
remembering:["VOLUME / 03","Remembering","Questions and reflections about Bangladesh, the Indian subcontinent and the histories that continue to shape how we live now.","#thoughts","History notes coming soon"],
reciting:["খণ্ড / ০৪","আবৃত্তি","বাংলা কবিতা, শব্দের প্রতি ভালোবাসা, আর যে অনুভূতিগুলো কণ্ঠে প্রকাশ করতে চাই—এই খণ্ডটি সম্পূর্ণ বাংলায় থাকবে।","#thoughts","আবৃত্তি শিগগিরই আসছে"],
reading:["VOLUME / 05","Reading","Books I return to, ideas I disagree with and sentences that changed the direction of a thought.","#thoughts","Reading notes coming soon"],
making:["VOLUME / 06","Making","Craft ideas, materials, unfinished experiments and the quiet pleasure of making something by hand.","#thoughts","Making notes coming soon"],
becoming:["VOLUME / 08","Becoming","Lessons from mistakes, challenges behind projects, small comforts and things I have not figured out yet.","#story","Read my story →"]
};
const reader=document.getElementById("bookReader"),readerLink=document.getElementById("readerLink");document.querySelectorAll("button.book").forEach(book=>book.addEventListener("click",()=>{const n=notes[book.dataset.book];document.getElementById("bookIndex").textContent=n[0];document.getElementById("bookTitle").textContent=n[1];document.getElementById("bookText").textContent=n[2];readerLink.href=n[3];readerLink.textContent=n[4];reader.classList.add("open");reader.scrollIntoView({behavior:"smooth",block:"center"})}));document.getElementById("closeBook").addEventListener("click",()=>reader.classList.remove("open"));
const star=document.getElementById("secretStar"),secret=document.getElementById("secretNote");star.addEventListener("click",()=>{secret.classList.add("show");setTimeout(()=>secret.classList.remove("show"),2800)});
const soundToggle=document.getElementById("soundToggle"),panel=document.getElementById("soundPanel");let ctx,source,filter,gain,timer;
function stopSound(){if(source){try{source.stop()}catch(e){}source=null}if(timer){clearInterval(timer);timer=null}if(gain&&ctx)gain.gain.linearRampToValueAtTime(.0001,ctx.currentTime+.4);document.querySelectorAll("[data-sound]").forEach(b=>b.classList.remove("active"))}
function selectedVolume(){return Number(document.getElementById("soundVolume").value)/200}
function noise(type){stopSound();ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();const length=ctx.sampleRate*4,buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<length;i++){const white=Math.random()*2-1;if(type==="rain")data[i]=white*.2;else{last=(last+.025*white)/1.025;data[i]=last*2.8}}source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;filter=ctx.createBiquadFilter();filter.type=type==="rain"?"highpass":"lowpass";filter.frequency.value=type==="rain"?1200:360;gain=ctx.createGain();gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.linearRampToValueAtTime(selectedVolume(),ctx.currentTime+1.8);source.connect(filter).connect(gain).connect(ctx.destination);source.start()}
function chime(){stopSound();ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();gain=ctx.createGain();gain.connect(ctx.destination);timer=setInterval(()=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=[523,659,784,880][Math.floor(Math.random()*4)];g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.035,ctx.currentTime+.03);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+2.6);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+2.7)},2200)}
soundToggle.addEventListener("click",()=>{const open=panel.classList.toggle("open");soundToggle.setAttribute("aria-pressed",open);soundToggle.innerHTML=open?"<span>◉</span> Choose ambience":"<span>◌</span> Brown noise";if(!open)stopSound()});document.querySelectorAll("[data-sound]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-sound]").forEach(x=>x.classList.remove("active"));b.classList.add("active");b.dataset.sound==="wood"?chime():noise(b.dataset.sound)}));document.getElementById("soundVolume").addEventListener("input",()=>{if(gain&&ctx)gain.gain.linearRampToValueAtTime(selectedVolume(),ctx.currentTime+.15)});

const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progress=document.getElementById("scrollProgress");
const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`};
addEventListener("scroll",updateProgress,{passive:true});updateProgress();

const revealItems=document.querySelectorAll(".section-label,.manifesto-grid>*,.project-card,.timeline article,.books-intro,.shelf,.contact>*");
if(reducedMotion){revealItems.forEach(el=>el.classList.add("revealed"))}else{
  revealItems.forEach(el=>el.classList.add("reveal-item"));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target)}}),{threshold:.12});
  revealItems.forEach(el=>observer.observe(el));
}

const navLinks=[...document.querySelectorAll(".topbar nav a")];
const observedSections=[...document.querySelectorAll("#story,#work,#thoughts")];
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id))}}),{rootMargin:"-35% 0px -55%",threshold:0});
observedSections.forEach(section=>navObserver.observe(section));

if(!reducedMotion&&matchMedia("(pointer:fine)").matches){
  const aura=document.getElementById("cursorAura");
  addEventListener("pointermove",event=>{aura.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;aura.classList.add("visible")},{passive:true});
  document.querySelectorAll("a,button,.project-card,.window-bar").forEach(el=>{el.addEventListener("pointerenter",()=>aura.classList.add("engaged"));el.addEventListener("pointerleave",()=>aura.classList.remove("engaged"))});

  document.querySelectorAll(".tilt-card").forEach(card=>{card.addEventListener("pointermove",event=>{const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;card.style.setProperty("--rx",`${-y*4}deg`);card.style.setProperty("--ry",`${x*5}deg`);card.style.setProperty("--mx",`${(x+.5)*100}%`);card.style.setProperty("--my",`${(y+.5)*100}%`)});card.addEventListener("pointerleave",()=>{card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg")})});

  document.querySelectorAll(".draggable-window").forEach(win=>{const handle=win.querySelector(".window-bar");let startX,startY,baseX=0,baseY=0,dragging=false;handle.title=win.dataset.dragLabel;handle.addEventListener("pointerdown",event=>{if(event.button!==0)return;dragging=true;startX=event.clientX-baseX;startY=event.clientY-baseY;handle.setPointerCapture(event.pointerId);win.classList.add("dragging")});handle.addEventListener("pointermove",event=>{if(!dragging)return;baseX=event.clientX-startX;baseY=event.clientY-startY;win.style.setProperty("--drag-x",`${baseX}px`);win.style.setProperty("--drag-y",`${baseY}px`)});const finish=()=>{dragging=false;win.classList.remove("dragging")};handle.addEventListener("pointerup",finish);handle.addEventListener("pointercancel",finish);handle.addEventListener("dblclick",()=>{baseX=baseY=0;win.style.setProperty("--drag-x","0px");win.style.setProperty("--drag-y","0px")})});
}

document.querySelectorAll(".book").forEach((book,index,books)=>{book.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight"].includes(event.key))return;event.preventDefault();const direction=event.key==="ArrowRight"?1:-1;books[(index+direction+books.length)%books.length].focus()})});
