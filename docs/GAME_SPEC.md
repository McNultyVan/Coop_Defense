# Coop Defense game rules

Coop Defense is a 2–4 player competition. Each player protects a separate farm lane from the **same randomized wave plan**. The host starts a match after everyone is ready; any surviving player can launch wave 1 or send a later wave before the automatic 12-second intermission ends. There are eight waves. All players begin with five eggs and 100 corn, enough to buy any first defense.

## Controls and resources

Choose a round pad for an attack defense or one of three marked crossings for a fence. Selecting a built attack tower shows its circular range; its server targeting uses that same circle. A fence only affects the marked section of path. Defeats earn corn and slowly charge the armored ostrich. Every survivor earns an egg and a small corn award after a cleared wave. A predator reaching the coop steals an egg. At zero eggs, a player spectates.

Defenses have three levels. Attack towers can be built or upgraded during a wave or break. Knocked-down fences can be rebuilt during a break for 8/16/28 corn at levels 1/2/3. A downed fence cannot upgrade until rebuilt. Its barbed or electric wire still affects passing enemies while down.

| Standard defense | Build / Level 2 / Level 3 corn | Effect |
| --- | --- | --- |
| Fence | 15 / 35 / 110 | Blocks foxes at a crossing. Level 2 barbs damage and slow passers; Level 3 electric wire hits robots and withstands more attacks. Both wires still work while down. |
| Soy Seed Lobber | 30 / 45 / 165 | Rapid weak seeds; stronger and faster at Level 2; flaming triple shot at Level 3. |
| Fertilizer | 45 / 65 / 195 | Medium-speed crystal, bouncing to up to three very close enemies. Level 2 improves rate, power and bounce reach. Level 3 hits up to five and leaves a roughly three-second flower slow ring. |

A player also gets one special attack tower from the chosen bird:

| Bird | Defense | Build / Level 2 / Level 3 corn | Role |
| --- | --- | --- | --- |
| Chicken | Peck Post | 35 / 55 / 170 | Fast close-range single-target pecks. |
| Duck | Pond Sprayer | 45 / 60 / 190 | Splash damage and brief group slow. |
| Goose | Honk Cannon | 55 / 70 / 210 | Heavy hits, armor break and knockback. |

Level 3 attack defenses can hit robots; levels 1 and 2 cannot affect robots. Range is intentionally limited and grows only slightly with upgrades. The warning appears when robots arrive in wave 7.

## Predators

Foxes are the baseline fence attackers. Fast snakes can slither under an intact fence after a short pause. Heavy wolves hop over after a longer pause. Each family has basic, armored and machine versions. Armored enemies first shed their armor under fire and continue with a basic body and health bar. Machine enemies are the strongest and first appear in wave 7. The common wave plan varies by match but increases enemy count, health, armor and machine share as the match progresses.

## Armored Ostrich

Defeats charge a single armored ostrich. At 100% charge, it can be sent down the path during a wave. The runner deals **no damage**. Each ordinary enemy it crosses is pushed back a medium distance once; each machine stays still for two seconds instead. It takes substantially more defeats to recharge than the original version.

## Score and rematch

**Final score = 1,000 × eggs + up to 750 weighted defeat points + unspent corn.** Weighted defeats vary by predator and version. Remaining corn is worth one point per corn. Exact ties share the same rank; waves survived and kills break any score tie. Any player can request a rematch in the same room. The new match resets resources and generates a fresh shared wave plan.

The Cloudflare Durable Object is authoritative for room membership, spending, range, attacks, movement, scores and results. Client visuals follow server snapshots; reconnect tokens restore a seat after refresh.
