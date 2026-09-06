/* Paste your deployed Google Apps Script /exec URL between the quotes. */
const VISITOR_COUNTER_URL = "";

(function(){
  if(!VISITOR_COUNTER_URL)return;
  const params=new URLSearchParams(location.search);
  if(params.get("owner")==="1"){
    localStorage.setItem("nnz-owner","true");
    params.delete("owner");
    history.replaceState({},"",location.pathname+(params.size?"?"+params:"")+location.hash);
  }
  const owner=localStorage.getItem("nnz-owner")==="true";
  const today=new Date().toISOString().slice(0,10);
  const countedToday=localStorage.getItem("nnz-counted-on")===today;
  const action=owner||countedToday?"read":"visit";
  const callback="nnzVisitorCount"+Date.now();
  window[callback]=data=>{
    const count=Number(data&&data.count);
    if(Number.isFinite(count)){
      document.getElementById("visitorCount").textContent=count.toLocaleString();
      document.getElementById("visitorLine").hidden=false;
      if(action==="visit")localStorage.setItem("nnz-counted-on",today);
    }
    delete window[callback];script.remove();
  };
  const script=document.createElement("script");
  script.src=VISITOR_COUNTER_URL+"?action="+action+"&callback="+callback;
  script.onerror=()=>{delete window[callback];script.remove()};
  document.head.appendChild(script);
})();
