const moods=[
  {id:"happy",name:"기분 좋아요",cls:"yellow",face:"⌣"},
  {id:"love",name:"설레요",cls:"pink",face:"⌣"},
  {id:"curious",name:"궁금해요",cls:"orange",face:"◉"},
  {id:"tired",name:"지쳤어요",cls:"gray",face:"﹏"},
  {id:"sad",name:"슬퍼요",cls:"blue",face:"︱"},
  {id:"angry",name:"화나요",cls:"red",face:"⌁"},
  {id:"surprised",name:"놀랐어요",cls:"purple",face:"•"},
  {id:"down",name:"우울해요",cls:"gray",face:"⌢"},
  {id:"calm",name:"평온해요",cls:"green",face:"⌣"},
  {id:"blank",name:"무덤덤해요",cls:"mint",face:"–"}
];
const state={date:new Date(),selectedDate:null,selectedMood:null};
let entries=JSON.parse(localStorage.getItem("mongle_entries")||"{}");

const $=s=>document.querySelector(s);
function key(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function fmt(d){return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active")}
function renderCalendar(){
  const d=state.date,y=d.getFullYear(),m=d.getMonth();
  $("#year").textContent=y;$("#month").textContent=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"][m];
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),cal=$("#calendar");cal.innerHTML="";
  for(let i=0;i<first;i++)cal.appendChild(document.createElement("div"));
  for(let n=1;n<=days;n++){
    const date=new Date(y,m,n), k=key(date), el=document.createElement("div");el.className="day";el.textContent=n;
    const today=new Date();if(key(date)===key(today))el.classList.add("today");
    if(entries[k]){el.classList.add("has-entry");const dot=document.createElement("span");dot.className="mood-dot "+(moods.find(x=>x.id===entries[k].mood)?.cls||"pink");el.appendChild(dot)}
    el.onclick=()=>entries[k]?openDetail(date):openMood(date);cal.appendChild(el);
  }
}
function renderMoods(){
  $("#moods").innerHTML=moods.map(m=>`<button class="mood" data-mood="${m.id}"><div class="cloud ${m.cls}">${m.face}</div><div class="mood-name">${m.name}</div></button>`).join("");
  document.querySelectorAll(".mood").forEach(b=>b.onclick=()=>{state.selectedMood=moods.find(m=>m.id===b.dataset.mood);$("#chosenMood").innerHTML=`오늘의 기분 · <b>${state.selectedMood.name}</b>`;show("writeScreen")});
}
function openMood(date){state.selectedDate=date;$("#moodDate").textContent=fmt(date);$("#writeDate").textContent=fmt(date);renderMoods();show("moodScreen")}
function openDetail(date){
  const e=entries[key(date)],m=moods.find(x=>x.id===e.mood)||moods[1];
  $("#detail").innerHTML=`<div class="detail-date">${fmt(date)}</div><div class="detail-mood"><span class="cloud ${m.cls}" style="display:inline-flex;width:105px;height:88px">${m.face}</span></div><h2>${esc(e.title||"제목 없음")}</h2><div class="detail-body">${esc(e.body||"")}</div>`;
  state.selectedDate=date;show("detailScreen");
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#prevMonth").onclick=()=>{state.date.setMonth(state.date.getMonth()-1);renderCalendar()}
$("#nextMonth").onclick=()=>{state.date.setMonth(state.date.getMonth()+1);renderCalendar()}
$("#addBtn").onclick=()=>openMood(new Date());
$("#saveBtn").onclick=()=>{
  const k=key(state.selectedDate);entries[k]={mood:state.selectedMood.id,title:$("#titleInput").value,body:$("#bodyInput").value};
  localStorage.setItem("mongle_entries",JSON.stringify(entries));$("#titleInput").value="";$("#bodyInput").value="";toast("몽글에 오늘을 기록했어요");state.date=new Date(state.selectedDate);renderCalendar();openDetail(state.selectedDate);
};
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>show("calendarScreen"));
function toast(t){const x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1600)}
renderCalendar();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
