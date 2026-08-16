const saved = JSON.parse(localStorage.getItem("smartSchoolSupabase") || "null");
const config = saved || { url:"", key:"", channel:"smart-school-arduino" };
let supabaseClient = null;
let channel = null;

const $ = s => document.querySelector(s);
const logBox = $("#log");

function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}
function setStatus(kind, online, text){
  const dot = kind==="cloud" ? $("#cloudDot") : $("#bridgeDot");
  const label = kind==="cloud" ? $("#cloudStatus") : $("#bridgeStatus");
  dot.className = "dot " + (online?"online":"offline");
  label.textContent = text;
}
function log(msg){
  if(logBox.querySelector(".muted")) logBox.innerHTML="";
  const d=document.createElement("div"); d.className="logline";
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logBox.prepend(d);
}
function updateState(device, command){
  const el=$("#state-"+device); if(el) el.textContent=command;
}

async function connectSupabase(){
  if(!config.url || !config.key){
    setStatus("cloud",false,"Cloud not configured");
    return;
  }
  try{
    supabaseClient = window.supabase.createClient(config.url, config.key);
    channel = supabaseClient.channel(config.channel || "smart-school-arduino");
    channel.on("broadcast",{event:"bridge-status"}, payload=>{
      const data=payload.payload||{};
      if(data.status==="online"){
        setStatus("bridge",true,"Bridge online");
        log("Laptop bridge connected.");
      }else{
        setStatus("bridge",false,"Bridge offline");
      }
    });
    channel.on("broadcast",{event:"arduino-state"}, payload=>{
      const d=payload.payload||{};
      if(d.device && d.command) updateState(d.device,d.command);
    });
    await channel.subscribe((status)=>{
      if(status==="SUBSCRIBED"){
        setStatus("cloud",true,"Cloud connected");
        log("Connected to Supabase Realtime.");
      }else if(status==="CHANNEL_ERROR"){
        setStatus("cloud",false,"Cloud error");
        log("Supabase channel error.");
      }
    });
  }catch(e){
    setStatus("cloud",false,"Cloud error");
    log("Connection error: "+e.message);
  }
}

async function sendCommand(device, command){
  const payload={type:"arduino-command",device,command,source:"website",timestamp:new Date().toISOString()};
  if(!channel){
    toast("Supabase connect nahi hai.");
    log(`Not sent: ${device} ${command}`);
    return;
  }
  try{
    const result=await channel.send({type:"broadcast",event:"arduino-command",payload});
    if(result==="ok" || result===undefined){
      updateState(device,command);
      log(`Command sent → ${device}: ${command}`);
      toast(`${device} → ${command}`);
    }else{
      log("Command result: "+result);
      toast("Command send nahi hua.");
    }
  }catch(e){
    log("Send error: "+e.message);
    toast("Command error");
  }
}

document.querySelectorAll(".control").forEach(btn=>{
  btn.addEventListener("click",()=>sendCommand(btn.dataset.device,btn.dataset.command));
});
$("#clearLog").addEventListener("click",()=>logBox.innerHTML='<div class="muted">No commands yet.</div>');
$("#settingsBtn").addEventListener("click",()=>{
  $("#supabaseUrl").value=config.url||"";
  $("#supabaseKey").value=config.key||"";
  $("#channelName").value=config.channel||"smart-school-arduino";
  $("#settingsDialog").showModal();
});
$("#saveSettings").addEventListener("click",(e)=>{
  e.preventDefault();
  const next={url:$("#supabaseUrl").value.trim(),key:$("#supabaseKey").value.trim(),channel:$("#channelName").value.trim()||"smart-school-arduino"};
  localStorage.setItem("smartSchoolSupabase",JSON.stringify(next));
  Object.assign(config,next);
  $("#settingsDialog").close();
  if(channel && supabaseClient) supabaseClient.removeChannel(channel);
  channel=null;
  connectSupabase();
});

connectSupabase();
