# Coop Defense — proposed game specification and implementation plan

**Status:** Awaiting initial approval. No game code or repository has been created.

## Goal and current state

Build a public, touch-friendly, 2–4 player competitive tower defense game. Players defend separate coops against equivalent simultaneous waves, then compare eggs and scores. The workspace currently contains only the supplied starter prompt; no game implementation or repository was present.

## Proposed rules

1. A host creates a five-character room code. Two to four players join, enter names, choose Chicken, Duck, or Goose (duplicates allowed), and ready up. The host starts when at least two are ready; all joined players must be ready.
2. Each player has an equivalent winding lane, eight fixed attack-tower pads, three separate fence anchors, five starting eggs, and 100 starting corn. **Every player can build Fence, Soy Seed Lobber, and Fertilizer; their bird adds a fourth, unique defense.** Every available tower costs at most 100 corn at level 1, so a player can always afford at least one starter tower. All players face the same wave schedule, with independent enemies, towers, economy, eggs, and score.
3. Tap an empty pad or fence anchor to build; tap a defense to upgrade it from level 1 to 2 to 3. Attack towers can be placed and upgraded during waves or breaks. Fence rebuilding is a separate paid action available **only between waves**. No selling in the first release. The cost displayed on each action is authoritative; unaffordable actions are disabled.
4. Every predator that reaches the coop removes one egg. Eggs stop at zero. Zero eggs eliminates the player; their lane freezes, while they can watch standings and remaining lanes. Each active player that survives an entire wave gains one egg and a corn completion bonus. Defeating enemies earns corn.
5. Eight finite waves end in results. If every player is eliminated earlier, results appear immediately. Players can see live standings but cannot affect another lane. The results show score, eggs, kills, waves survived, and elimination. Players can ready for a rematch in the same room with fresh resources and the option to change birds.

### Shared defenses and provisional economy

All players have these three defenses regardless of bird. The displayed level starts at **1 when built**; there are **two upgrades**, to levels 2 and 3. Prices below are provisional build / upgrade-to-2 / upgrade-to-3 costs.

| Defense | Level 1 | Level 2 | Level 3 | Costs |
| --- | --- | --- | --- | --- |
| Fence | Cheap physical barrier; affected predators stop and attack until it falls. No weapon damage. | More health; barbed wire damages and briefly slows passing predators **even after the fence is knocked down**. | More health; electric barbed wire deals stronger passing damage and slow **even when knocked down**, including to machines. | 15 / 25 / 40 corn |
| Soy Seed Lobber | Small, weak seeds fired rapidly at one target. | Stronger seeds at a faster rate. | Flaming burst of **three seeds per shot**, able to hurt machines. | 30 / 35 / 50 corn |
| Fertilizer | Medium-rate crystal; bounces to nearby predators only, up to **three total targets** per shot. | Concentrated fertilizer: stronger crystals, faster fire, slightly wider bounce reach. | Fertilizer bomb: stronger hit, bounces to up to **five nearby targets**, and leaves a flower ring that slows predators inside it for about **three seconds**. Able to affect machines. | 45 / 45 / 65 corn |

Crystal bounces require another predator to be within a short radius of the last target; they do not jump across empty stretches. A single predator receives at most one hit from each shot. The flower ring visibly fades at expiration.

**Fence cycle:** A new fence is intact. An intact fence persists across waves without a fee. A knocked-down fence stays down into the next break until the player pays to rebuild it; rebuild costs rise with level (provisionally 8 / 16 / 28 corn). Rebuilding restores full level-specific health without changing level. A knocked-down fence **cannot be upgraded** until rebuilt. Barbed/electric wire keeps damaging and slowing applicable enemies passing its anchor even while the fence body is down. Fence health and rebuild cost are shown at the anchor. The phrase “rebuilt every round” is implemented as a rebuild opportunity at every intermission, because the requested rule also lets the player choose not to rebuild.

For applicable intact fences, ordinary foxes stop and attack. Snakes can slither under after a short visible pause; wolves can hop over after a longer visible pause. Bypassing predators are still struck by an applicable wire hazard as they cross. Machine predators ignore level 1 and 2 fences altogether; level 3 fences can stop them, and machine snakes/wolves retain their delayed bypass abilities. These interactions will be tuned for readability at the integrated gameplay gate.

### Bird-specific fourth defense

| Bird | Tower | Tactical effect | Build / upgrades | Initial weakness |
| --- | --- | --- | --- | --- |
| Chicken | Peck Post | Short, rapid single-target hits; reliably clears foxes and snakes | 35 / 35 / 55 corn | Armor reduces each hit |
| Duck | Pond Sprayer | Medium-speed splash; briefly slows targets in its small impact area | 45 / 40 / 60 corn | Weak against isolated heavies |
| Goose | Honk Cannon | Slow, strong hit; strips armor for several seconds and shoves a target back a short distance | 55 / 45 / 65 corn | Slow against swarms |

Each special tower also has levels 1–3. Its level 3 gains the ability to affect machines; lower levels cannot damage, slow, push, or strip them. Range, damage, fire rate, slow, armor, health, and prices will live in one balance configuration. Towers prioritize the enemy furthest along the path **that they can affect**, so low-level attacks do not waste shots on immune machines. Corn comes from kills and a fixed wave completion award.

### Enemies and waves

There are **three ranked predator families**, each with **Basic, Armored, and Machine** versions: nine distinct enemy combinations. Rank determines overall threat and reward, while each family has a different way to pressure a fence.

| Rank | Predator | Basic behavior | Armored version | Machine version |
| --- | --- | --- | --- | --- |
| 1 | Fox | Baseline speed and health; attacks fences. | More health and damage reduction. | Tough robot fox; attacks eligible fences. |
| 2 | Snake | Faster, lighter; slithers under eligible fences after a brief pause. | More health and damage reduction, still slithers. | Fast robot snake; can slither after a brief pause at eligible fences. |
| 3 | Wolf | Slow, high-health threat; hops an eligible fence after a longer pause. | More health and damage reduction, still hops. | Heavy robot wolf; can hop after a longer pause at eligible fences. |

**Version order within each family: Basic < Armored < Machine.** Armor reduces incoming eligible damage. Machine predators are immune to **every level 1 or 2 defense and its secondary effects**, including Ostrich-boosted attacks, slow, knockback, armor break, low-level wire, and low-level fence blocking. Only level 3 towers and level 3 electric fences affect them. This rule appears persistently near the wave and tower controls as **“ROBOTS: Only Level 3 defenses work”**, on machine enemy cards, and in the level 1–2 tower details. Incoming-machine wave previews call it out before the first machine wave.

Waves 1–2 introduce basic foxes and snakes; 3–4 add wolves and armored versions; 5–6 mix the three families and give players time to build level 3 defenses; **machines first appear in wave 7**; wave 8 is a final mixed raid with more machines. The upcoming enemy mix is shown during each break. One common server schedule drives identical composition for every lane. Approximate targets: 25–65 seconds of spawning, up to about 90 seconds including cleanup per normal wave, an 8-second break, and about **8–11 minutes** for a complete match. A wave ends when spawning finishes and all surviving lanes have cleared or leaked their enemies. No endless mode or separate boss system.

### Ostrich rush

Kills fill a visible meter; every earned 100 charge grants one activation, with no charge bank beyond 100. The player taps **Ostrich Rush** to boost all owned attack towers for 10 seconds: 25% more damage and 25% faster fire. It does not upgrade or rebuild fences and never overrides machine immunity. The meter resets on activation and refills from subsequent kills. A clear lane effect and countdown show the active duration. Activation is unavailable after elimination. This is an earned temporary buff, not a separate tower.

### Scoring and ties

**Score = 1,000 × eggs remaining + min(250, weighted kills).** Basic / armored / machine versions award 1 / 2 / 3 kill points for foxes, 2 / 3 / 4 for snakes, and 3 / 4 / 5 for wolves. The 250-point cap ensures **one egg outweighs any difference in kills**. Waves survived appears in the breakdown and acts as a tie-breaker after score, then total predator defeats; a remaining exact tie is shared. Egg counts are never negative. No hidden multiplier or survival bonus is added to the score.

## Multiplayer and deployment architecture

- **Frontend:** TypeScript, React, Vite, and code-drawn SVG/CSS game elements. Responsive touch controls with a scrollable lane view on narrow portrait phones; landscape is recommended, never required. No artwork license or heavy asset pipeline is needed.
- **Backend:** One Cloudflare Worker serves the built static assets and routes room requests/WebSockets to one **SQLite-backed Durable Object per room**. This object owns membership, validated commands, wave timing, simulation, fences and rebuilds, eggs, economy, score, and final results. Clients render server snapshots and send intents such as place, upgrade, rebuild, ready, and activate. They do not determine damage or scores.
- **Synchronization:** Server-timestamped match start and regular state broadcasts during active waves. The room object advances the simulation at a modest fixed rate, saves recoverable match state periodically and on major transitions, and hibernates outside active matches. A reconnect token stored in the browser reclaims the same seat after refresh; disconnected players' lanes continue automatically. A player who loses their token cannot reclaim a seat mid-match. Room codes expire after a documented idle period; spectator behavior is for eliminated room members, without a public viewer link.
- **Source and delivery:** A new GitHub repository is the source of truth, with `README.md`, `docs/GAME_SPEC.md`, and `docs/PLAN.md`. Cloudflare Workers Builds connects to GitHub and deploys a single Worker plus static assets to a public `workers.dev` URL; no ChatGPT Sites. Repository and account connection are setup steps after approval. A Cloudflare account and GitHub authorization will be needed for production; no paid plan is assumed. Cloudflare currently supports [SQLite-backed Durable Objects on Workers Free](https://developers.cloudflare.com/durable-objects/platform/pricing/), [static assets alongside a Worker](https://developers.cloudflare.com/workers/static-assets/), and [GitHub-connected Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). Free quotas still apply.

[Vercel offers WebSockets in beta](https://vercel.com/docs/functions/websockets), but its function instances do not share room state by themselves and need a separate durable store/coordinator. A single Durable Object per room therefore keeps this project simpler even though it changes the preferred host from Vercel.

## Execution plan

| Phase | Integrated outcome and deliverable | Only necessary check / gate |
| --- | --- | --- |
| 1. Foundation and rooms | Repo, app shell, responsive lane canvas, room create/join, bird/name/ready, host start, authoritative room and connection protocol | App builds; two separate browser contexts join and reach the same start. |
| 2. Core match | Three shared towers plus bird special, separate fence anchors, levels 1–3, paid between-wave fence rebuild, three ranked predator families with three versions each, machine immunity and conspicuous warning, corn, eggs, eliminations, eight waves, live standings and spectator view | **Gameplay gate:** two contexts play several waves; fence bypass and rebuild, attacks, machine immunity, leaks, eggs, synchronized progression, standings, and elimination behave coherently. |
| 3. Complete experience | Ostrich Rush, final score and ties, results/rematch, rules, feedback, reconnect, broad balance pass | Brief integrated full-match smoke run; fix only blockers. |
| 4. Game feel | Readable farm art, animations, touch targets, phone scaling, feedback, confusing UX and important known issues | Focused phone and desktop review of the integrated build. |
| 5. Production | Connect GitHub deployment, production binding/config, public URL and deployment README | **Production gate:** clean browser plus independent second context can join, play, finish, score, rematch; phone-sized controls usable. |
| 6. Contest pass | Check requirements, obvious balance, controls, instructions, URL, README; resolve material issues | One focused release check; minor polish can remain listed. |

During phases 1–3, implement in large coherent batches. Keep `docs/PLAN.md` as the brief phase and known-issue record. Build or smoke-test only as needed to continue; run substantial gameplay checks at the two named gates. No user testing is requested until an integrated experience exists.

## Risks that could change the architecture

1. **Cloudflare account or GitHub connection unavailable:** production requires the owner's account authorization. If this blocks deployment, a different host or deployment path needs approval.
2. **Durable Object runtime or free quota proves unsuitable for active simulations:** reduce broadcast/simulation frequency first; a fundamentally different real-time backend needs approval.
3. **Refresh recovery during active matches:** server persistence must restore without duplicate wave rewards or spawn drift. If reliable recovery takes disproportionate work, retain seat reclaim and let a genuinely interrupted match fail clearly; disclose that limitation before release.

## Decisions requiring approval

- Approve these game rules and the eight-wave, approximately 8–11 minute match.
- Approve the single Cloudflare Worker and Durable Object architecture with GitHub-connected deployment in place of Vercel.

After approval, implementation starts without further routine feature approvals. Production account authorization is requested only when the deployment is ready for that final setup step.
