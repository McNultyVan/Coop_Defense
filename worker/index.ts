import { DurableObject } from "cloudflare:workers";
import {Game, Bird, TowerType, makePlayer, makeWaves, place, upgrade, rebuild, tick} from '../src/game';
interface Env {ROOMS:DurableObjectNamespace<GameRoom>;ASSETS:Fetcher}
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const codeOf=()=>Array.from(crypto.getRandomValues(new Uint8Array(5)),b=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b%32]).join('');
const tokenOf=()=>crypto.randomUUID()+crypto.randomUUID();
const validName=(s:unknown)=>typeof s==='string'&&s.trim().length>=1&&s.trim().length<=18;
const validBird=(s:unknown):s is Bird=>s==='chicken'||s==='duck'||s==='goose';
export default {
 async fetch(req:Request,env:Env){
  const url=new URL(req.url);
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(req);
  if(url.pathname==='/api/create'&&req.method==='POST'){
   let body:Record<string,unknown>;try{body=await req.json() as Record<string,unknown>}catch{return json({error:'Invalid request'},400)}
   if(!validName(body.name)||!validBird(body.bird))return json({error:'Enter a name and choose a bird.'},400);
   for(let tries=0;tries<6;tries++){
    const code=codeOf(),token=tokenOf(),stub=env.ROOMS.get(env.ROOMS.idFromName(code));
    const result=await stub.fetch(new Request('https://room/create',{method:'POST',body:JSON.stringify({code,token,name:body.name,bird:body.bird})}));
    if(result.status===409)continue;return result;
   }
   return json({error:'Could not reserve a room code. Try again.'},503);
  }
  const join=url.pathname.match(/^\/api\/join\/([A-Z2-9]{5})$/);
  if(join&&req.method==='POST'){
   let body:Record<string,unknown>;try{body=await req.json() as Record<string,unknown>}catch{return json({error:'Invalid request'},400)}
   if(!validName(body.name)||!validBird(body.bird))return json({error:'Enter a name and choose a bird.'},400);
   const stub=env.ROOMS.get(env.ROOMS.idFromName(join[1]));return stub.fetch(new Request('https://room/join',{method:'POST',body:JSON.stringify({...body,token:tokenOf()})}));
  }
  const socket=url.pathname.match(/^\/api\/ws\/([A-Z2-9]{5})$/);
  if(socket&&req.headers.get('Upgrade')?.toLowerCase()==='websocket'){
   const token=url.searchParams.get('token')||'';
   return env.ROOMS.get(env.ROOMS.idFromName(socket[1])).fetch(new Request(`https://room/ws?token=${encodeURIComponent(token)}`,{headers:{Upgrade:'websocket'}}));
  }
  return json({error:'Not found'},404);
 }
};
export class GameRoom extends DurableObject<Env>{
 private game:Game|null=null;
 private seats:Record<string,string>={};
 private loop:ReturnType<typeof setInterval>|null=null;
 private last=Date.now();
 private lastSave=0;
 constructor(ctx:DurableObjectState,env:Env){super(ctx,env);ctx.blockConcurrencyWhile(async()=>{this.game=await ctx.storage.get<Game>('game')||null;this.seats=await ctx.storage.get<Record<string,string>>('seats')||{};if(this.game){this.game.wavePlan ||= makeWaves(crypto.getRandomValues(new Uint32Array(1))[0]);this.game.effects ||= {};this.game.notice ||= null;}});}
 private async save(){if(this.game){this.game.updatedAt=Date.now();await this.ctx.storage.put({game:this.game,seats:this.seats});this.lastSave=Date.now();}}
 private broadcast(){if(!this.game)return;this.game.revision++;const data=JSON.stringify({type:'state',game:this.game,serverTime:Date.now()});for(const ws of this.ctx.getWebSockets())try{ws.send(data)}catch{}}
 private startLoop(){if(this.loop||!this.game||!['break','wave'].includes(this.game.phase))return;
  this.last=Date.now();this.loop=setInterval(()=>{if(!this.game)return;const now=Date.now();tick(this.game,Math.min(.4,(now-this.last)/1000),now);this.last=now;this.broadcast();if(now-this.lastSave>2500||this.game.phase==='results')void this.save();if(this.game.phase==='results'){clearInterval(this.loop!);this.loop=null;}},200);
 }
 async fetch(req:Request){const url=new URL(req.url);
  if(url.pathname==='/create'){
   if(this.game)return json({error:'Code already used'},409);
   const b=await req.json() as {code:string;token:string;name:string;bird:Bird};
   const id=crypto.randomUUID();this.seats[b.token]=id;
   this.game={code:b.code,phase:'lobby',host:id,players:[makePlayer(id,b.name.trim(),b.bird)],wave:0,nextAt:0,spawnIndex:0,nextSpawnAt:0,enemyId:1,revision:0,message:'Invite friends to your coop!',notice:null,wavePlan:makeWaves(crypto.getRandomValues(new Uint32Array(1))[0]),effects:{},updatedAt:Date.now()};
   await this.save();return json({code:b.code,token:b.token});
  }
  if(url.pathname==='/join'){
   if(!this.game)return json({error:'Room not found'},404);
   if(this.game.phase!=='lobby')return json({error:'Match already started'},409);
   if(this.game.players.length>=4)return json({error:'Room is full'},409);
   const b=await req.json() as {token:string;name:string;bird:Bird};
   const id=crypto.randomUUID();this.seats[b.token]=id;
   this.game.players.push(makePlayer(id,b.name.trim(),b.bird));await this.save();this.broadcast();return json({code:this.game.code,token:b.token});
  }
  if(url.pathname==='/ws'){
   const token=url.searchParams.get('token');const player=this.game?.players.find(p=>p.id===this.seats[token||'']);
   if(!player)return json({error:'Seat not found. Rejoin from lobby.'},403);
   if(req.headers.get('Upgrade')?.toLowerCase()!=='websocket')return json({error:'WebSocket required'},426);
   const pair=new WebSocketPair();this.ctx.acceptWebSocket(pair[1],[token!]);player.connected=true;
   pair[1].send(JSON.stringify({type:'seat',id:player.id}));pair[1].send(JSON.stringify({type:'state',game:this.game,serverTime:Date.now()}));this.broadcast();this.startLoop();return new Response(null,{status:101,webSocket:pair[0]});
  }
  return json({error:'Not found'},404);
 }
 async webSocketMessage(ws:WebSocket,message:string|ArrayBuffer){
  if(!this.game||typeof message!=='string'||message.length>1000)return;
  let command:Record<string,unknown>;try{command=JSON.parse(message)}catch{return}
  const token=this.ctx.getTags(ws)[0],p=this.game.players.find(p=>p.id===this.seats[token]);if(!p)return;
  const g=this.game;let changed=false;const type=command.type;
  if(type==='ready'&&g.phase==='lobby'){p.ready=Boolean(command.ready);changed=true;}
  if(type==='bird'&&g.phase==='lobby'&&validBird(command.bird)){p.bird=command.bird;p.ready=false;changed=true;}
  if(type==='start'&&g.phase==='lobby'&&g.host===p.id&&g.players.length>=2&&g.players.every(p=>p.ready)){
   g.phase='break';g.wave=1;g.nextAt=0;g.message='Build your defenses. Any bird can start wave 1!';changed=true;this.startLoop();
  }
  if(type==='launch'&&g.phase==='break'&&g.wave===1&&p.eggs>0){
   g.phase='wave';g.spawnIndex=0;g.nextSpawnAt=Date.now()+600;g.message=`${p.name} started the raid!`;changed=true;
  }
  if(type==='rematch'&&g.phase==='results'){
   g.phase='lobby';g.wave=0;g.nextAt=0;g.spawnIndex=0;g.enemyId=1;g.message=`${p.name} called a rematch. Pick birds and ready up.`;g.notice=null;g.effects={};g.wavePlan=makeWaves(crypto.getRandomValues(new Uint32Array(1))[0]);
   g.players=g.players.map(x=>({...makePlayer(x.id,x.name,x.bird),connected:x.connected}));
   changed=true;
  }
  if((g.phase==='break'||g.phase==='wave')&&p.eggs>0){
   if(type==='place'&&typeof command.tower==='string'&&Number.isInteger(command.pad))changed=place(p,command.tower as TowerType,command.pad as number);
   if(type==='upgrade'&&typeof command.tower==='string'&&Number.isInteger(command.pad))changed=upgrade(p,command.tower as TowerType,command.pad as number);
   if(type==='rebuild'&&Number.isInteger(command.pad))changed=rebuild(p,command.pad as number,g.phase);
   if(type==='ostrich'&&p.charge>=100&&Date.now()>=p.ostrichUntil){p.charge=0;p.ostrichUntil=Date.now()+10000;changed=true;}
  }
  if(changed){await this.save();this.broadcast();}
 }
 async webSocketClose(ws:WebSocket){this.disconnect(ws)}
 async webSocketError(ws:WebSocket){this.disconnect(ws)}
 private disconnect(ws:WebSocket){const token=this.ctx.getTags(ws)[0];const p=this.game?.players.find(p=>p.id===this.seats[token]);if(p){p.connected=this.ctx.getWebSockets().some(s=>s!==ws&&this.ctx.getTags(s)[0]===token);this.broadcast();void this.save();}}
}
