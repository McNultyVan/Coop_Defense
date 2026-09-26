export type Bird = 'chicken'|'duck'|'goose';
export type TowerType = 'fence'|'soy'|'fertilizer'|'peck'|'pond'|'honk';
export type Family = 'fox'|'snake'|'wolf';
export type Variant = 'basic'|'armored'|'machine';
export type Phase = 'lobby'|'break'|'wave'|'results';
export interface Tower {type:TowerType; level:1|2|3; pad:number; hp:number; cooldown:number; startedBrokenWave?:number}
export interface Enemy {id:number; family:Family; variant:Variant; originalVariant:Variant; x:number; hp:number; maxHp:number; baseHp:number; speed:number; fencePause:number; fenceIndex:number; slowUntil:number; stunUntil:number; rushHitAt:number; armorShedAt:number; armorBreakUntil:number; hitFenceAt:number; goldArmor?:boolean; spawnHp?:number}
export interface Flower {x:number; until:number}
export interface Effect {id:number;type:TowerType;from:number;to:number;at:number;until:number;level:number;bounce?:boolean;splash?:boolean}
export interface Player {id:string; name:string; bird:Bird; ready:boolean; connected:boolean; eggs:number; corn:number; charge:number; ostrichAt:number; ostrichUntil:number; kills:number; killPoints:number; waves:number; towers:Tower[]; enemies:Enemy[]; flowers:Flower[]}
export interface Game {code:string; phase:Phase; host:string; players:Player[]; wave:number; nextAt:number; spawnIndex:number; nextSpawnAt:number; enemyId:number; revision:number; message:string; notice:{text:string;until:number}|null; wavePlan:WaveEntry[][]; effects:Record<string,Effect[]>; updatedAt:number}
export interface WaveEntry {family:Family;variant:Variant;gold?:boolean}
export const FENCE_POS=[.26,.50,.74];
export const PADS=[.13,.20,.33,.40,.55,.63,.80,.88];
export const TOWER_INFO:Record<TowerType,{name:string;cost:[number,number,number];range:number;rate:number;damage:number}>={
 fence:{name:'Fence',cost:[15,35,110],range:0,rate:0,damage:0},
 soy:{name:'Soy Seed Lobber',cost:[30,45,165],range:.14,rate:.26,damage:4},
 fertilizer:{name:'Fertilizer',cost:[45,65,195],range:.17,rate:1.15,damage:7},
 peck:{name:'Peck Post',cost:[40,65,185],range:.13,rate:.30,damage:5},
 pond:{name:'Pond Sprayer',cost:[50,70,205],range:.16,rate:1.05,damage:8},
 honk:{name:'Honk Cannon',cost:[60,80,225],range:.18,rate:1.65,damage:19}
};
export const REBUILD_COST=[8,16,28];
export const FAMILY:{[K in Family]:{hp:number;speed:number;reward:number;points:number}}={
 fox:{hp:24,speed:.046,reward:3,points:1},snake:{hp:17,speed:.072,reward:4,points:2},wolf:{hp:64,speed:.035,reward:6,points:3}
};
export const VARIANT:{[K in Variant]:{hp:number;speed:number;reward:number;points:number}}={
 basic:{hp:1,speed:1,reward:1,points:0},armored:{hp:2.1,speed:.88,reward:1.5,points:1},machine:{hp:3.2,speed:.92,reward:2,points:2}
};
export function makeWaves(seed:number):WaveEntry[][]{
 let state=seed>>>0;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 const counts=[11,15,19,27,37,47,56,66];
 return counts.map((base,w)=>{
  const n=base+Math.floor(random()*5)-2,result:WaveEntry[]=[];
  for(let i=0;i<n;i++){
   const f=random(),v=random();
   const family:Family=w<2?(f<.27?'snake':'fox'):f<(w<4?.05+(w-2)*.06:.14+w*.015)?'wolf':f<.43?'snake':'fox';
   const variant:Variant=w>=6&&v<(w===6?.26:.40)?'machine':w>=2&&v<(w<4?.12+(w-2)*.07:.20+w*.045)?'armored':'basic';
   result.push({family,variant,gold:variant==='armored'&&random()<.09});
  }
  if(w>=6)result[Math.floor(n*.55)]={family:w===7?'wolf':'fox',variant:'machine'};
  return result;
 });
}
export function makePlayer(id:string,name:string,bird:Bird):Player{return {id,name,bird,ready:false,connected:true,eggs:5,corn:100,charge:0,ostrichAt:0,ostrichUntil:0,kills:0,killPoints:0,waves:0,towers:[],enemies:[],flowers:[]};}
export function score(p:Player){return 1000*p.eggs+Math.min(750,p.killPoints)+p.corn}
export function ranking(a:Player,b:Player){return score(b)-score(a)||b.waves-a.waves||b.kills-a.kills;}
export function available(p:Player,type:TowerType){return ['fence','soy','fertilizer',({chicken:'peck',duck:'pond',goose:'honk'} as const)[p.bird]].includes(type)}
export function laneY(x:number){return .52+.15*Math.sin(x*Math.PI*3.2)}
export function towerPower(type:TowerType,level:number){const cfg=TOWER_INFO[type];return cfg.damage*(1+(level-1)*.58)*(1+(.16-cfg.range)*1.25)}
export function towerDps(type:TowerType,level:number){if(type==='fence')return 0;const cfg=TOWER_INFO[type];return towerPower(type,level)*(type==='soy'&&level===3?2:1)*(1+(level-1)*.12)/cfg.rate}
export function cornReward(e:Enemy){const bulk=Math.max(2,Math.ceil((e.spawnHp||e.maxHp)/12));const armor=e.originalVariant==='armored'?2:e.originalVariant==='machine'?3:0;return (bulk+armor+(e.family==='snake'?1:0))*(e.goldArmor?3:1)}
export function towerRange(type:TowerType,level:number){return (TOWER_INFO[type].range+(level-1)*.008)*925}
function inRange(t:Tower,e:Enemy){
 const dx=(e.x-PADS[t.pad])*925;
 const dy=(laneY(e.x)-laneY(PADS[t.pad]))*420-(t.pad%2?-73:76);
 return Math.hypot(dx,dy)<=towerRange(t.type,t.level);
}
export function spawnEnemy(game:Game,p:Player,config:WaveEntry){
 const f=FAMILY[config.family],v=VARIANT[config.variant],scale=1+Math.max(0,game.wave-2)*.18,baseHp=Math.round(f.hp*scale);
 const spawnHp=Math.round(baseHp*v.hp);
 p.enemies.push({id:game.enemyId++,family:config.family,variant:config.variant,originalVariant:config.variant,x:0,hp:spawnHp,maxHp:spawnHp,baseHp,goldArmor:config.gold===true,spawnHp,speed:f.speed*v.speed*(1+Math.max(0,game.wave-2)*.04)*(game.wave>=5?1.16:1),fencePause:0,fenceIndex:-1,slowUntil:0,stunUntil:0,rushHitAt:0,armorShedAt:0,armorBreakUntil:0,hitFenceAt:0});
}
function hit(enemy:Enemy,raw:number,level:number,now:number){
 if(enemy.variant==='machine'&&level<3)return false;
 const armor=enemy.variant==='armored'||enemy.variant==='machine';
 const damage=armor&&now>enemy.armorBreakUntil?Math.max(1,raw-2):raw;
 enemy.hp=Math.max(0,enemy.hp-damage);
 if(enemy.variant==='armored'&&enemy.hp<=(enemy.baseHp||Math.round(enemy.maxHp/2.1))){
  enemy.variant='basic';enemy.hp=enemy.baseHp||Math.round(enemy.maxHp/2.1);enemy.maxHp=enemy.hp;
  enemy.speed/=VARIANT.armored.speed;enemy.armorShedAt=now;
 }
 return true;
}
export function place(p:Player,type:TowerType,pad:number){
 if(!available(p,type)||!Number.isInteger(pad)||pad<0||pad>=(type==='fence'?FENCE_POS.length:PADS.length)||p.towers.some(t=>t.pad===pad&&(t.type==='fence')===(type==='fence')))return false;
 const cost=TOWER_INFO[type].cost[0];if(p.corn<cost)return false;
 p.corn-=cost;p.towers.push({type,pad,level:1,hp:type==='fence'?40:0,cooldown:0});return true;
}
export function upgrade(p:Player,type:TowerType,pad:number){
 const t=p.towers.find(t=>t.type===type&&t.pad===pad);if(!t||t.level===3||t.type==='fence'&&t.hp<=0)return false;
 const cost=TOWER_INFO[t.type].cost[t.level];if(p.corn<cost)return false;
 p.corn-=cost;t.level=(t.level+1) as 2|3;if(t.type==='fence')t.hp+=t.level===2?55:85;return true;
}
export function rebuild(p:Player,pad:number,phase:Phase,wave:number){
 const t=p.towers.find(t=>t.type==='fence'&&t.pad===pad);if(!t||t.hp>0||!(phase==='break'||phase==='wave'&&t.startedBrokenWave===wave))return false;
 const cost=REBUILD_COST[t.level-1];if(p.corn<cost)return false;
 p.corn-=cost;t.hp=[40,95,180][t.level-1];t.startedBrokenWave=0;return true;
}
export function beginWave(game:Game,now:number){
 game.phase='wave';game.spawnIndex=0;game.nextSpawnAt=now+600;
 for(const p of game.players)for(const t of p.towers)if(t.type==='fence')t.startedBrokenWave=t.hp<=0?game.wave:0;
}
export function tick(game:Game,dt:number,now:number){
 if(game.phase==='break'){
  if(game.nextAt>0&&now>=game.nextAt){beginWave(game,now);game.message=`Wave ${game.wave}: defend your eggs!`;}return;
 }
 if(game.phase!=='wave')return;
 const config=game.wavePlan[game.wave-1];
 if(game.spawnIndex<config.length&&now>=game.nextSpawnAt){
  for(const p of game.players)if(p.eggs>0)spawnEnemy(game,p,config[game.spawnIndex]);
  game.spawnIndex++;game.nextSpawnAt=now+(game.wave<4?1250:Math.max(600,1350-game.wave*85));
 }
 for(const p of game.players){
  if(p.eggs===0)continue;
  game.effects[p.id]=(game.effects[p.id]||[]).filter(e=>e.until>now);
  p.flowers=p.flowers.filter(f=>f.until>now);
  if(p.ostrichUntil>now){
   const oldX=1-Math.max(0,Math.min(1,(now-dt*1000-p.ostrichAt)/3200));
   const rushX=1-Math.max(0,Math.min(1,(now-p.ostrichAt)/3200));
   for(const e of p.enemies)if(e.hp>0&&e.rushHitAt!==p.ostrichAt&&e.x>=rushX-.03&&e.x<=oldX+.025){
    e.rushHitAt=p.ostrichAt;
    if(e.variant==='machine')e.stunUntil=now+2000;
    else e.x=Math.max(0,e.x-.16);
   }
  }
  for(const e of p.enemies){
   if(e.hp<=0)continue;
   const old=e.x;let speed=e.stunUntil>now?0:e.speed*(e.slowUntil>now?.56:1);
   if(p.flowers.some(f=>Math.abs(f.x-e.x)<.048)&&e.variant!=='machine' || p.flowers.some(f=>Math.abs(f.x-e.x)<.048)&&e.variant==='machine')speed*=.7;
   const next=e.x+speed*dt;
   const fence=p.towers.find(t=>t.type==='fence'&&t.pad===FENCE_POS.findIndex((x,i)=>x>old-.003&&x<=next+.004&&i>=0));
   if(fence){
    const fx=FENCE_POS[fence.pad], affects=e.variant!=='machine'||fence.level===3;
    if(affects){
     if(fence.hp>0){
      const bypass=e.family!=='fox';
      if(bypass){
       if(e.fenceIndex!==fence.pad){e.fenceIndex=fence.pad;e.fencePause=0;}
       e.fencePause+=dt;
      }
      if(!bypass||e.fencePause<(e.family==='snake'?.55:1.2)){
       e.x=Math.min(e.x,fx-.004);
       if(now-e.hitFenceAt>650){fence.hp=Math.max(0,fence.hp-(e.family==='wolf'?14:e.variant==='machine'?18:7));e.hitFenceAt=now;}
       continue;
      }
     }
    }
   }
   e.x=Math.min(1,next);
   for(const t of p.towers){if(t.type!=='fence'||t.level<2)continue;
    const fx=FENCE_POS[t.pad];if(old<fx&&e.x>=fx){if(hit(e,t.level===2?3:8,t.level,now))e.slowUntil=now+900;}
   }
  }
  for(const t of p.towers){
   if(t.type==='fence')continue;
   t.cooldown=Math.max(0,t.cooldown-dt);
   if(t.cooldown>0)continue;
   const cfg=TOWER_INFO[t.type];
   const target=p.enemies.filter(e=>e.hp>0&&(e.variant!=='machine'||t.level===3)&&inRange(t,e)).sort((a,b)=>b.x-a.x)[0];
   if(!target)continue;
   game.effects[p.id].push({id:game.enemyId++,type:t.type,from:PADS[t.pad],to:target.x,at:now,until:now+480,level:t.level});
   t.cooldown=cfg.rate/(1+(t.level-1)*.12);
   const power=towerPower(t.type,t.level);
   const strike=(e:Enemy,mult=1)=>hit(e,power*mult,t.level,now);
   strike(target);
   if(t.type==='soy'&&t.level===3){strike(target,.5);strike(target,.5);}
   if(t.type==='fertilizer'){
    const seen=new Set([target.id]),limit=t.level===3?5:3;
    const splashRadius=.032+(t.level-1)*.009;
    const splash=(origin:Enemy)=>{
     for(const e of p.enemies.filter(e=>e.hp>0&&!seen.has(e.id)&&(e.variant!=='machine'||t.level===3)&&Math.abs(e.x-origin.x)<splashRadius).sort((a,b)=>Math.abs(a.x-origin.x)-Math.abs(b.x-origin.x))){
      if(seen.size>=limit)break;strike(e,.3+t.level*.1);seen.add(e.id);
      game.effects[p.id].push({id:game.enemyId++,type:t.type,from:origin.x,to:e.x,at:now,until:now+420,level:t.level,splash:true});
     }
    };
    let from=target;splash(target);
    while(seen.size<limit){
     const next=p.enemies.filter(e=>e.hp>0&&!seen.has(e.id)&&(e.variant!=='machine'||t.level===3)&&Math.abs(e.x-from.x)<(t.level>=2?.075:.055)).sort((a,b)=>Math.abs(a.x-from.x)-Math.abs(b.x-from.x))[0];
     if(!next)break;strike(next,.75);game.effects[p.id].push({id:game.enemyId++,type:t.type,from:from.x,to:next.x,at:now,until:now+480,level:t.level,bounce:true});seen.add(next.id);from=next;splash(next);
    }
    if(t.level===3)p.flowers.push({x:target.x,until:now+3000});
   }
   if(t.type==='pond')for(const e of p.enemies)if(e.hp>0&&e.id!==target.id&&Math.abs(e.x-target.x)<.045){strike(e,.55);if(e.variant!=='machine'||t.level===3)e.slowUntil=now+850;}
   if(t.type==='pond')target.slowUntil=now+850;
   if(t.type==='honk'){target.armorBreakUntil=now+3500;target.x=Math.max(0,target.x-.022);}
  }
  const survivors:Enemy[]=[];
  for(const e of p.enemies){if(e.hp<=0){const variant=e.originalVariant||e.variant;p.kills++;p.killPoints+=FAMILY[e.family].points+VARIANT[variant].points;p.corn+=cornReward(e);p.charge=Math.min(100,p.charge+(variant==='machine'?7:e.family==='wolf'?5:3));}
   else if(e.x>=1){p.eggs=Math.max(0,p.eggs-1);game.message=`${p.name} lost an egg!`;}else survivors.push(e);
  }
  p.enemies=p.eggs?survivors:[];
 }
 if(game.players.every(p=>p.eggs===0)){game.phase='results';game.message='All coops fell!';return;}
 if(game.spawnIndex===config.length&&game.players.every(p=>p.enemies.length===0)){
  const cleared=game.wave;
  for(const p of game.players)if(p.eggs>0){p.eggs++;p.corn+=12+game.wave*2;p.waves=game.wave;}
  if(game.wave===game.wavePlan.length){game.phase='results';game.message='The final raid is over!';}
  else {game.wave++;game.phase='break';game.nextAt=now+12000;game.message=`Wave cleared! +1 egg. Prepare for wave ${game.wave}.`;game.notice={text:`WAVE ${cleared} CLEARED · +1 EGG`,until:now+2600};}
 }
}
