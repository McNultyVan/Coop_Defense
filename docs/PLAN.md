# Coop Defense status

## Completed

- Deployed the game from the GitHub repository to Cloudflare Workers with an authoritative room Durable Object.
- Added a shared randomized wave plan, manual launch of any wave, identical enemy generation across players, standard and bird-specific defenses, machine immunity, eggs, corn, scoring, ties and rematches.
- Revised gameplay after live feedback: more expensive Level 3 upgrades, stronger later predators, smaller attack ranges, unspent-corn scoring, removable armor, and a single armored ostrich sweep with knockback or robot stall.
- Revised presentation: a complete no-scroll map, actual selected-tower range circle and fence crossing marker, original enemy and defense sprites, farm assets, movement interpolation, visible shots, clear card copy, countdown, and wave-clear toast.

## Current gate

Publish the revised build, inspect the desktop and narrow-screen layout on the live Worker, and verify a two-player wave launch/rematch when an independent second session is available.

## Known limits

- Difficulty still depends on tower placement and the randomly constrained wave composition. A scripted integrated pass checks the basic challenge curve, but live matches may warrant more tuning.
- A match may pause if every client disconnects until one reconnects.
- Idle room codes remain reserved; rooms are not automatically deleted.
