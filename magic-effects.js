(()=>{
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const colors=["#b991ff","#d8ae68","#f6ede4","#8f6ad4"];
  function particle(x,y,strong=false){
    const dust=document.createElement("i");
    dust.className=strong?"fairy-dust fairy-burst":"fairy-dust";
    const angle=Math.random()*Math.PI*2;
    const distance=strong?18+Math.random()*38:5+Math.random()*12;
    dust.style.left=`${x}px`;dust.style.top=`${y}px`;
    dust.style.setProperty("--dust-x",`${Math.cos(angle)*distance}px`);
    dust.style.setProperty("--dust-y",`${Math.sin(angle)*distance}px`);
    dust.style.setProperty("--dust-size",`${strong?3+Math.random()*4:2+Math.random()*2}px`);
    dust.style.setProperty("--dust-color",colors[Math.floor(Math.random()*colors.length)]);
    document.body.appendChild(dust);
    dust.addEventListener("animationend",()=>dust.remove(),{once:true});
  }
  if(matchMedia("(pointer:fine)").matches){
    let last=0;
    addEventListener("pointermove",event=>{const now=performance.now();if(now-last<65)return;last=now;particle(event.clientX-3,event.clientY+6)},{passive:true});
  }
  addEventListener("pointerdown",event=>{for(let i=0;i<12;i++)particle(event.clientX,event.clientY,true)},{passive:true});
})();
