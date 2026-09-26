import type {Family,Variant,TowerType} from './game';
export function EnemySprite({family,variant,x,y}:{family:Family;variant:Variant;x:number;y:number}){
 const robot=variant==='machine',armor=variant==='armored',metal=robot?'#778fa5':armor?'#b2a69b':'';
 return <g transform={`translate(${x} ${y})`} className={`enemy-sprite enemy-${family} ${robot?'robot':''}`}>
  <ellipse cy="15" rx="24" ry="7" fill="#3b563a" opacity=".25"/>
  {robot&&<><circle r="28" fill="#91adbc" stroke="#445965" strokeWidth="3"/><path d="M-28 0h-8m8-12h-7m7 24h-7M28 0h8m-8-12h7m-7 24h7" stroke="#617988" strokeWidth="5"/><circle cx="0" cy="-26" r="5" fill="#65d9ef"/></>}
  {family==='snake'?<><path d="M-21 12 Q-31 -11 -11 -14 Q6 -17 1 2 Q0 13 14 7 L23 -5" fill="none" stroke={robot?'#334e5a':'#205e44'} strokeWidth="15" strokeLinecap="round"/><path d="M-21 12 Q-31 -11 -11 -14 Q6 -17 1 2 Q0 13 14 7 L23 -5" fill="none" stroke={robot?'#9cc5cc':'#67b970'} strokeWidth="10" strokeLinecap="round"/><circle cx="21" cy="-7" r="9" fill={robot?'#9cc5cc':'#69c575'}/><circle cx="24" cy="-10" r="2.5" fill={robot?'#f15d65':'#263e2a'}/><path d="M28 -4l8 3" stroke="#d75265" strokeWidth="2"/></>:
  <><path d="M-19 -8 L-19 -28 L-6 -18 L11 -19 L25 -29 L22 -3" fill={robot?'#7b91a1':family==='fox'?'#c56d3e':'#767b82'} stroke="#35464a" strokeWidth="2"/><ellipse cx="2" cy="2" rx="25" ry="19" fill={robot?'#9ab2bd':family==='fox'?'#ee9650':'#92959a'} stroke="#4c594e" strokeWidth="2"/><path d="M-14 4 Q2 24 18 3 L10 2 L3 9 L-6 1Z" fill={robot?'#d9e6e5':'#f5e4ca'}/><circle cx="-8" cy="-5" r="2.8" fill={robot?'#f25859':'#25332d'}/><circle cx="12" cy="-5" r="2.8" fill={robot?'#f25859':'#25332d'}/><ellipse cx="3" cy="9" rx="4.2" ry="3" fill="#473b38"/>{family==='wolf'&&<path d="M-16 14l-8 8m38-5 8 6" stroke="#62676e" strokeWidth="6" strokeLinecap="round"/>}</>}
  {armor&&<><path d="M-20 -14 Q1 -28 22 -14 L17 0 Q3 -5 -17 0Z" fill={metal} stroke="#53626b" strokeWidth="2"/><path d="M-10 -18h25" stroke="#e1d7c8" strokeWidth="3"/></>}
  {robot&&<path d="M-14 15h32m-27 4h22" stroke="#456477" strokeWidth="3"/>}
 </g>;
}
export function TowerSprite({type,level,x,y,down=false}:{type:TowerType;level:number;x:number;y:number;down?:boolean}){
 const color:Record<TowerType,string>={fence:'#a97846',soy:'#6ba34c',fertilizer:'#8b69b3',peck:'#efb847',pond:'#70bcd4',honk:'#efefde'};
 return <g transform={`translate(${x} ${y})`} className={`tower-sprite tower-${type} ${down?'down':''}`}>
  <ellipse cy="17" rx="28" ry="9" fill="#466c40" opacity=".25"/>
  {type==='fence'?<g opacity={down?.58:1} transform={down?'rotate(22)':''}><path d="M-25 -13v32m25-35v35m25-32v32" stroke="#67472f" strokeWidth="9" strokeLinecap="round"/><path d="M-26 -9h52M-26 8h52" stroke={level===3?'#f9e878':level===2?'#a1a6a4':'#b98753'} strokeWidth="8" strokeLinecap="round"/>{level>=2&&<path d="M-25 -9l6-7 7 7 7-7 7 7 7-7 7 7 7-7M-25 8l7-7 7 7 7-7 7 7 7-7 7 7" fill="none" stroke={level===3?'#ffe96a':'#bfc3c3'} strokeWidth="3"/>}{level===3&&<path d="M0 -31l-8 17h8l-4 14 15-21H3l5-10Z" fill="#fff068" stroke="#ca8d32" strokeWidth="2"/>}</g>:
  <><circle r="27" fill="#f6eed5" stroke="#8c765b" strokeWidth="3"/><circle r="22" fill={color[type]} stroke="#496454" strokeWidth="2"/>
  {type==='soy'&&<><ellipse cx="0" cy="7" rx="13" ry="11" fill="#547946"/><path d="M-11 -2 Q-18 -18 -4 -24 Q9 -24 10 -8" fill="#a0d56a" stroke="#376844" strokeWidth="2"/><path d="M3 -9 L18 -18" stroke="#466d39" strokeWidth="7" strokeLinecap="round"/>{level===3&&<path d="M15 -25q12 9 3 17q-10-7-3-17" fill="#ff942e"/>}</>}
  {type==='fertilizer'&&<><path d="M-11 -14h22l5 26h-32Z" fill="#e7c9ee" stroke="#665075" strokeWidth="3"/><circle cx="0" cy="-2" r="8" fill={level===3?'#f4dd54':'#ac78d0'}/><path d="M-3 -18V-28h16" stroke="#4a6258" strokeWidth="5" strokeLinecap="round"/>{level===3&&<circle cx="0" cy="-2" r="13" fill="none" stroke="#ffeb8a" strokeWidth="3"/>}</>}
  {type==='peck'&&<><ellipse cx="0" cy="5" rx="17" ry="14" fill="#fff1bb"/><circle cx="-1" cy="-12" r="12" fill="#ffeda8"/><path d="M-6 -23l4-9 5 7 6-5 2 11" fill="#e85643"/><path d="M10 -13l14 5-14 5" fill="#e98f3d"/><circle cx="3" cy="-14" r="2.2"/>{level===3&&<path d="M-17 4l-11-9 5 16" fill="#f7db83"/>}</>}
  {type==='pond'&&<><ellipse cx="0" cy="5" rx="17" ry="14" fill="#d4f4f4"/><path d="M-17 -7 Q0 -25 16 -8 L18 5 Q0 17 -17 5Z" fill="#71c5d9"/><circle cx="1" cy="-12" r="3" fill="#294b59"/><path d="M13 -6l15 6-15 4" fill="#edb861"/>{level===3&&<circle r="19" fill="none" stroke="#acf0f3" strokeWidth="3"/>}</>}
  {type==='honk'&&<><ellipse cx="-2" cy="6" rx="16" ry="13" fill="#f4f6e7"/><path d="M4 1Q-2 -29 10 -28Q21 -28 14 2" fill="#f4f6e7"/><path d="M14 -19l16 6-16 5" fill="#e7a251"/><circle cx="10" cy="-23" r="2" fill="#2b3e42"/>{level>=2&&<path d="M23 -28q16 10 0 20m5-27q22 13 0 27" fill="none" stroke="#f5e88b" strokeWidth="3"/>}</>}
  </>}
  {type!=='fence'&&<><rect x="-14" y="23" width="28" height="11" rx="5" fill="#244c40"/><text y="31" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">LV {level}</text></>}
 </g>;
}
