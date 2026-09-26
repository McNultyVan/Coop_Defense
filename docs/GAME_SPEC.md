# Coop Defense game rules

Coop Defense is a 2–4 player competition. Each player protects a separate farm lane from the **same randomized wave plan**. The host starts a match after everyone is ready; any surviving player can launch wave 1 or send a later wave before the automatic 12-second intermission ends. There are eight waves. All players begin with five eggs and 100 corn, enough to buy any first defense.

## Controls and resources

Choose a round pad for an attack defense or one of three marked crossings for a fence. Selecting a built attack tower shows its circular range; its server targeting uses that same circle. A fence only affects the marked section of path. Defeats earn corn and slowly charge the armored ostrich. Every survivor earns an egg and a small corn award after a cleared wave. At the start of waves 2–8, each surviving player earns a bonus of eight corn times the new wave number, including when a player starts the wave early. A predator reaching the coop steals an egg. At zero eggs, a player spectates.

Defenses have three levels. Attack towers can be built or upgraded during a wave or break. Knocked-down fences can be rebuilt during a break for 8 corn at every level. A fence that starts a wave down can also be rebuilt during that wave; a fence knocked down during the current wave must wait for the next break. A downed fence cannot upgrade until rebuilt. Its barbed or electric wire still affects passing enemies while down.

| Standard defense | Build / Level 2 / Level 3 corn | Effect |
| --- | --- | --- |
| Fence | 15 / 25 / 65 | Blocks ordinary and robot foxes at a crossing; snakes and wolves bypass after a pause regardless of variant. Level 2 barbs damage and slow ordinary passers; Level 3 electric wire also hits robots and withstands more attacks. Both wires still work while down. |
| Soy Seed Lobber | 30 / 45 / 165 | Rapid short-range seeds; upgrades add damage and speed; flaming triple shot at Level 3. |
| Fertilizer | 45 / 65 / 195 | Medium-speed crystal splashes nearby enemies at every level and bounces through a close group of up to three. Higher levels increase damage, rate, splash and bounce reach. Level 3 hits up to five and leaves a roughly three-second flower slow ring. |

A player also gets one special attack tower from the chosen bird:

| Bird | Defense | Build / Level 2 / Level 3 corn | Role |
| --- | --- | --- | --- |
| Chicken | Peck Post | 40 / 65 / 185 | Fast close-range single-target pecks. |
| Duck | Pond Sprayer | 50 / 70 / 205 | Splash damage and brief group slow. |
| Goose | Honk Cannon | 60 / 80 / 225 | Heavy hits, armor break and knockback. |

Level 3 attacks and electric wire can damage robots. Level 1 and 2 attacks and barbs cannot damage or slow robots, but intact fences still block robot foxes. Robot snakes and wolves bypass intact fences after the same pause as their ordinary counterparts. Range is intentionally limited and grows only slightly with upgrades. Shorter-range towers have a small damage bonus; longer-range towers have a small damage penalty. Upgrade power rises considerably at each level. The selection panel shows sustained primary-target DPS (before armor), or fence health. The warning appears when robots arrive in wave 7.

## Predators

Foxes are the baseline fence attackers. Fast snakes can slither under an intact fence after a short pause. Heavy wolves hop over after a longer pause. Each family has basic, armored and machine versions. Armored enemies first shed their armor under fire and continue with a basic body and health bar. Machine enemies are the strongest and first appear at a modest share in wave 7, then become more common in wave 8. They pay a substantial health-based corn bounty when defeated. The common wave plan varies by match. Waves 5 and 6 have more enemies to build up to wave 7; the robot share starts near 10% and increases to about 25% in wave 8. Defeat payouts grow with spawned health and include an armor bonus. Roughly 9% of armored spawns have shimmering gold armor and pay three times the usual corn, even after their armor breaks.

## Armored Ostrich

Defeats charge a single armored ostrich. At 100% charge, it runs from the coop toward the raid entrance during a wave. The runner deals **no damage**. Each ordinary enemy it crosses is pushed back a little farther once; each machine is knocked down for two seconds instead. It takes substantially more defeats to recharge than the original version.

## Score and rematch

**Final score = 1,000 × eggs + up to 750 weighted defeat points + unspent corn.** Weighted defeats vary by predator and version. Remaining corn is worth one point per corn. Exact ties share the same rank; waves survived and kills break any score tie. Any player can request a rematch in the same room. The new match resets resources and generates a fresh shared wave plan.

The Cloudflare Durable Object is authoritative for room membership, spending, range, attacks, movement, scores and results. Client visuals follow server snapshots; reconnect tokens restore a seat after refresh.
