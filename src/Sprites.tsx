import type {Family,Variant,TowerType} from './game';
export function EnemySprite({family,variant,x,y,goldArmor=false}:{family:Family;variant:Variant;x:number;y:number;goldArmor?:boolean}){
 const robot=variant==='machine',armor=variant==='armored',metal=robot?'#778fa5':armor?(goldArmor?'#f4c845':'#b2a69b'):'';
 return <g transform={`translate(${x} ${y})`} className={`enemy-sprite enemy-${family} ${robot?'robot':''}`}>
  <ellipse cy="15" rx="24" ry="7" fill="#3b563a" opacity=".25"/>
  {robot&&<><circle r="28" fill="#91adbc" stroke="#445965" strokeWidth="3"/><path d="M-28 0h-8m8-12h-7m7 24h-7M28 0h8m-8-12h7m-7 24h7" stroke="#617988" strokeWidth="5"/><circle cx="0" cy="-26" r="5" fill="#65d9ef"/></>}
  {family==='snake'?<><path d="M-21 12 Q-31 -11 -11 -14 Q6 -17 1 2 Q0 13 14 7 L23 -5" fill="none" stroke={robot?'#334e5a':'#205e44'} strokeWidth="15" strokeLinecap="round"/><path d="M-21 12 Q-31 -11 -11 -14 Q6 -17 1 2 Q0 13 14 7 L23 -5" fill="none" stroke={robot?'#9cc5cc':'#67b970'} strokeWidth="10" strokeLinecap="round"/><circle cx="21" cy="-7" r="9" fill={robot?'#9cc5cc':'#69c575'}/><circle cx="24" cy="-10" r="2.5" fill={robot?'#f15d65':'#263e2a'}/><path d="M28 -4l8 3" stroke="#d75265" strokeWidth="2"/></>:
  <><path d="M-19 -8 L-19 -28 L-6 -18 L11 -19 L25 -29 L22 -3" fill={robot?'#7b91a1':family==='fox'?'#c56d3e':'#767b82'} stroke="#35464a" strokeWidth="2"/><ellipse cx="2" cy="2" rx="25" ry="19" fill={robot?'#9ab2bd':family==='fox'?'#ee9650':'#92959a'} stroke="#4c594e" strokeWidth="2"/><path d="M-14 4 Q2 24 18 3 L10 2 L3 9 L-6 1Z" fill={robot?'#d9e6e5':'#f5e4ca'}/><circle cx="-8" cy="-5" r="2.8" fill={robot?'#f25859':'#25332d'}/><circle cx="12" cy="-5" r="2.8" fill={robot?'#f25859':'#25332d'}/><ellipse cx="3" cy="9" rx="4.2" ry="3" fill="#473b38"/>{family==='wolf'&&<path d="M-16 14l-8 8m38-5 8 6" stroke="#62676e" strokeWidth="6" strokeLinecap="round"/>}</>}
  {armor&&<><path d="M-20 -14 Q1 -28 22 -14 L17 0 Q3 -5 -17 0Z" fill={metal} stroke={goldArmor?"#a57218":"#53626b"} strokeWidth="2"/><path d="M-10 -18h25" stroke={goldArmor?"#fff6b5":"#e1d7c8"} strokeWidth="3"/></>}
  {goldArmor&&armor&&<g className="gold-shimmer"><path d="M-26 -30l3-8 3 8 8 3-8 3-3 8-3-8-8-3Zm47 8 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#fff5a7"/></g>}
  {robot&&<path d="M-14 15h32m-27 4h22" stroke="#456477" strokeWidth="3"/>}
 </g>;
}
export function TowerSprite({type,level,x,y,down=false}:{type:TowerType;level:number;x:number;y:number;down?:boolean}){
 const color:Record<TowerType,string>={fence:'#a97846',soy:'#6ba34c',fertilizer:'#8b69b3',peck:'#efb847',pond:'#70bcd4',honk:'#efefde'};
 return <g transform={`translate(${x} ${y})`} className={`tower-sprite tower-${type} ${down?'down':''}`}>
  <ellipse cy="17" rx="28" ry="9" fill="#466c40" opacity=".25"/>
  {type==='fence'?<g opacity={down?.58:1} transform={down?'rotate(22)':''}><path d="M-25 -13v32m25-35v35m25-32v32" stroke="#67472f" strokeWidth="9" strokeLinecap="round"/><path d="M-26 -9h52M-26 8h52" stroke={level>=3?'#f9e878':level===2?'#a1a6a4':'#b98753'} strokeWidth="8" strokeLinecap="round"/>{level>=2&&<path d="M-25 -9l6-7 7 7 7-7 7 7 7-7 7 7 7-7M-25 8l7-7 7 7 7-7 7 7 7-7 7 7" fill="none" stroke={level>=3?'#ffe96a':'#bfc3c3'} strokeWidth="3"/>}{level>=3&&<path d="M0 -31l-8 17h8l-4 14 15-21H3l5-10Z" fill="#fff068" stroke="#ca8d32" strokeWidth="2"/>}</g>:
  <><circle r="27" fill="#f6eed5" stroke="#8c765b" strokeWidth="3"/><circle r="22" fill={color[type]} stroke="#496454" strokeWidth="2"/>
  {type==='soy'&&<><ellipse cx="0" cy="7" rx="13" ry="11" fill="#547946"/><path d="M-11 -2 Q-18 -18 -4 -24 Q9 -24 10 -8" fill="#a0d56a" stroke="#376844" strokeWidth="2"/><path d="M3 -9 L18 -18" stroke="#466d39" strokeWidth="7" strokeLinecap="round"/>{level>=3&&<path d="M15 -25q12 9 3 17q-10-7-3-17" fill="#ff942e"/>}</>}
  {type==='fertilizer'&&<><path d="M-11 -14h22l5 26h-32Z" fill="#e7c9ee" stroke="#665075" strokeWidth="3"/><circle cx="0" cy="-2" r="8" fill={level>=3?'#f4dd54':'#ac78d0'}/><path d="M-3 -18V-28h16" stroke="#4a6258" strokeWidth="5" strokeLinecap="round"/>{level>=3&&<circle cx="0" cy="-2" r="13" fill="none" stroke="#ffeb8a" strokeWidth="3"/>}</>}
  {type==='peck'&&<><ellipse cx="0" cy="5" rx="17" ry="14" fill="#fff1bb"/><circle cx="-1" cy="-12" r="12" fill="#ffeda8"/><path d="M-6 -23l4-9 5 7 6-5 2 11" fill="#e85643"/><path d="M10 -13l14 5-14 5" fill="#e98f3d"/><circle cx="3" cy="-14" r="2.2"/>{level>=3&&<path d="M-17 4l-11-9 5 16" fill="#f7db83"/>}</>}
  {type==='pond'&&<><ellipse cx="0" cy="5" rx="17" ry="14" fill="#d4f4f4"/><path d="M-17 -7 Q0 -25 16 -8 L18 5 Q0 17 -17 5Z" fill="#71c5d9"/><circle cx="1" cy="-12" r="3" fill="#294b59"/><path d="M13 -6l15 6-15 4" fill="#edb861"/>{level>=3&&<circle r="19" fill="none" stroke="#acf0f3" strokeWidth="3"/>}</>}
  {type==='honk'&&<><ellipse cx="-2" cy="6" rx="16" ry="13" fill="#f4f6e7"/><path d="M4 1Q-2 -29 10 -28Q21 -28 14 2" fill="#f4f6e7"/><path d="M14 -19l16 6-16 5" fill="#e7a251"/><circle cx="10" cy="-23" r="2" fill="#2b3e42"/>{level>=2&&<path d="M23 -28q16 10 0 20m5-27q22 13 0 27" fill="none" stroke="#f5e88b" strokeWidth="3"/>}</>}
  </>}
  {type!=='fence'&&level>=2&&<><path d="M-22 16 Q0 29 22 16" fill="none" stroke={level>=3?'#ffde5a':'#d5e5a1'} strokeWidth={level>=3?5:3}/><circle cx="-22" cy="-16" r={level>=3?5:3} fill={level>=3?'#ffe371':'#e2f5b3'}/><circle cx="22" cy="-16" r={level>=3?5:3} fill={level>=3?'#ffe371':'#e2f5b3'}/></>}{level===4&&<g><circle r="30" fill="none" stroke="#ffcf52" strokeWidth="4" strokeDasharray="8 4"/><path d="M-8 -37l8-10 8 10" fill="#ffda6a" stroke="#8b6436" strokeWidth="2"/></g>}{type==='fence'&&level===4&&<path d="M-26 -24h52M-26 22h52" stroke="#ffde77" strokeWidth="5"/>}{type!=='fence'&&<><rect x="-14" y="23" width="28" height="11" rx="5" fill="#244c40"/><text y="31" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">LV {level}</text></>}
 </g>;
}
export function OstrichSprite({x,y}:{x:number;y:number}){
 return <g transform={`translate(${x} ${y}) scale(-1 1)`} className="ostrich-sprite" pointerEvents="none">
  <path d="M-62 9h-21m26 10h-18m31-28h-23" stroke="#f8eec3" strokeWidth="6" strokeLinecap="round" opacity=".8"/>
  <ellipse cx="0" cy="10" rx="34" ry="24" fill="#e8dec6" stroke="#53686d" strokeWidth="3"/>
  <path d="M-12 20q-25 20-36-8m40 15-6 23m25-21 12 21" fill="none" stroke="#997759" strokeWidth="7" strokeLinecap="round"/>
  <path d="M15 3Q19-30 39-36Q54-37 47-8L38 10Z" fill="#eee6d6" stroke="#61727d" strokeWidth="3"/>
  <path d="M29-34Q42-51 56-33L52-21H30Z" fill="#899aaa" stroke="#425c68" strokeWidth="3"/>
  <circle cx="43" cy="-26" r="4" fill="#e36449"/>
  <path d="M49-13l18 5-18 5" fill="#e8a34d" stroke="#694d43" strokeWidth="2"/>
  <path d="M-28-7q24-28 52-13l-2 24q-23-8-47 9Z" fill="#7a91a2" stroke="#425869" strokeWidth="4"/>
  <path d="M-17-4l34-7m-31 17L14-2" stroke="#dbe4dc" strokeWidth="4"/>
 </g>;
}
