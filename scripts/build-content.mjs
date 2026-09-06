import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const books=["building","understanding","remembering","reciting","reading","making","cooking","becoming"];
const root=process.cwd();
const outputRoot=existsSync(join(root,"dist","index.html"))?join(root,"dist"):root;
const escape=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const inline=value=>escape(value)
  .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
  .replace(/\*(.+?)\*/g,"<em>$1</em>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>');

function parse(source){
  const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if(!match)return {meta:{},body:source};
  const meta={};
  for(const line of match[1].split(/\r?\n/)){
    const divider=line.indexOf(":");
    if(divider<0)continue;
    const key=line.slice(0,divider).trim();
    let value=line.slice(divider+1).trim().replace(/^['"]|['"]$/g,"");
    if(value==="true")value=true;
    if(value==="false")value=false;
    meta[key]=value;
  }
  return {meta,body:match[2].trim()};
}

function markdown(source){
  const lines=source.split(/\r?\n/),parts=[];
  let listType="",items=[];
  const flush=()=>{if(!items.length)return;parts.push(`<${listType}>${items.map(item=>`<li>${inline(item)}</li>`).join("")}</${listType}>`);items=[];listType=""};
  for(const raw of lines){
    const line=raw.trim();
    const list=line.match(/^[-*]\s+(.+)/),numbered=line.match(/^\d+[.)]\s+(.+)/);
    if(list||numbered){const next=list?"ul":"ol";if(listType&&listType!==next)flush();listType=next;items.push((list||numbered)[1]);continue}
    flush();
    if(!line)continue;
    const heading=line.match(/^(#{1,3})\s+(.+)/);
    if(heading){const level=Math.min(heading[1].length+1,4);parts.push(`<h${level}>${inline(heading[2])}</h${level}>`);continue}
    if(line.startsWith("> ")){parts.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);continue}
    parts.push(`<p>${inline(line)}</p>`);
  }
  flush();return parts.join("\n");
}

const entries=[];
for(const book of books){
  const folder=join(root,"content",book);
  if(!existsSync(folder))continue;
  for(const filename of readdirSync(folder).filter(name=>name.endsWith(".md")&&!name.toLowerCase().startsWith("readme"))){
    const {meta,body}=parse(readFileSync(join(folder,filename),"utf8"));
    if(meta.published===false)continue;
    const slug=meta.slug||basename(filename,".md");
    entries.push({book,slug,title:meta.title||slug.replace(/-/g," "),date:meta.date||"",type:meta.type||"Journal page",summary:meta.summary||body.split(/\r?\n/).find(line=>line.trim()&&!line.startsWith("#"))||"",language:meta.language||"en",image:meta.image||"",imageAlt:meta.imageAlt||meta.title||"",audio:meta.audio||"",plainText:body,html:markdown(body)});
  }
}
entries.sort((a,b)=>String(b.date).localeCompare(String(a.date))||a.title.localeCompare(b.title));
writeFileSync(join(outputRoot,"library-content.js"),`window.LIBRARY_CONTENT = ${JSON.stringify(entries,null,2)};\n`);
console.log(`Built ${entries.length} library page(s) → ${join(outputRoot,"library-content.js")}`);
