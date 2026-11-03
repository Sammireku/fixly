# Handyman Marketplace App: Product & UX Document

Nov 2, 2026 · @Samuel Mireku

A location-based marketplace in Ghana that connects clients with vetted handymen, built on one promise: the pro shows up, at an agreed price, with your money protected.

## 1. Vision and positioning

**Promise:** "The handyman who shows up, at a price you agreed, with your money protected." Every feature in this document serves that sentence.

**What the app is**

- A location-based marketplace, Uber-style for urgent jobs and catalog-style for larger projects.
- Covers plumbing, electrical, gardening, upholstery, POP, painting, tiling, laundry and similar home services in Ghana.
- Sells assurance as much as access: verified pros, agreed prices, escrowed payment, proof of work, and recourse when something goes wrong.

**What it is not**

- Not a lock-in platform. Clients and pros may go direct after a good job. They lose protection, warranty and loyalty benefits when they do, and the app makes that trade-off visible.
- Not an open directory. Pros are vetted before they appear, and their record is built from verified in-app jobs.

**Launch scope** Plumbing and electrical (on-demand) first, then project services (POP, painting, upholstery, tiling), then recurring services (gardening, cleaning). Laundry is a separate pickup-and-delivery model and is treated as a later, distinct service line.

## 2. Users and problems

The core problem is trust, not discovery. Most people in Accra find a plumber or electrician by word of mouth, and the failures are consistent.

| User | Who they are | Main pain today | What the app gives them |
| --- | --- | --- | --- |
| Client (resident) | Homeowners and tenants in Accra neighborhoods | No-shows, price changes mid-job, poor work with no recourse, no way to vet strangers | Verified pros, agreed price, escrow, proof of work, dispute path |
| Diaspora client | Ghanaians abroad managing a family property | No trusted person to oversee repairs | Remote booking, photo sign-off, shareable job status |
| Pro (artisan) | Informal tradespeople, often on low-end phones | Unreliable leads, unpaid or late payment, no record of their work | Steady jobs, guaranteed payment, portfolio, earnings history |
| Pro crew lead | Artisan working with helpers or apprentices | Hard to prove who did what | Crew members listed on jobs with their own ID checks |
| Ops team | Platform staff | Manual vetting, disputes and incidents | Review queue, dispute console, incident tools |

**Design implications**

- Price is the main trust issue, so price is shown before commitment and locked at approval.
- Many Accra addresses are vague, so every location carries a pin, a Ghana Post GPS code and a landmark note.
- Voice notes and photos beat typing for both sides.
- Connectivity varies, so drafts save automatically and uploads queue until a connection returns.

## 3. Product model

The app runs two job types with different flows. Search routes each request to the right one.

|  | On-demand jobs | Project jobs |
| --- | --- | --- |
| Examples | Leaking tap, socket repair, unblock a drain, garden cleanup | POP ceiling, painting, upholstery, tiling |
| What matters most | Speed, arrival, fixed price | Reputation, itemized quote, staged payment |
| Centerpiece screen | Full-screen map with bottom sheet | Catalog browse and quote comparison |
| Pricing | Fixed-price menu, call-out fee, in-app quote for anything off-menu | Itemized quote (labor and materials), optional paid site visit credited to the job |
| Payment | Held in escrow, released after confirmation and a 24 to 48 hour hold | Milestones (for example 40/40/20), each held in escrow with photo sign-off |
| Extra protection | Rework guarantee | Retention hold, guarantor, insurance cover by job value |

**Routing rules**

1. Fixed-price menu item: on-demand.
2. Needs inspection or measurements: project.
3. Unclear request (for example "my AC is bad"): one triage question, "Fix something now or plan a bigger job?"

**Search design** Search shows jobs first and pros second. People know their problem, not the trade, so typing "plumber" lands on a job list ("Fix a leak," "Install a tap," "Unblock a drain") with prices.

**Leakage stance** Clients and pros may go direct. Off-platform jobs carry no escrow, warranty, claims cover or reviews, and the app says so plainly. In-app rebooking is rewarded with lower fees and loyalty discounts.

## 4. Client experience

**Home screen**

- Location chip (auto-detected pin, tap to adjust) and a "What do you need?" search.
- Two entry cards: **Need someone now** (on-demand) and **Plan a project**.
- Service icons, favorites, saved addresses (Home, Mum's house), and active or past jobs.

**Flow A: On-demand booking**

1. **Pick a job.** Search or tap a service, then a job ("Leaking tap"). Price or range and an "includes" line show first.
2. **Describe it.** Photo, voice note and optional text. Urgency toggle: now, today, or pick a time.
3. **Set location.** Full-screen map with draggable pin, Ghana Post GPS code and landmark field. Nearby pro pins show only when enough pros are close; otherwise an honest "finding a pro" state with an ETA.
4. **Review and pay.** Price breakdown, protection fee, Mobile Money selection, one-line protection note ("Your payment is held until you confirm the job").
5. **Matching.** Pro card with photo, tier badge, rating, jobs done and ETA. Client can decline and re-match.
6. **Live tracking.** Map with ETA, masked call and chat, verified pro photo, share-job link for a relative or caretaker.
7. **Arrival, quote, approval, work, sign-off.** GPS-verified arrival, in-app itemized quote that the client approves before work starts, before and after photos, client confirms completion, 24 to 48 hour hold, payout, two-way rating.

**Flow B: Project booking**

1. **Choose type.** Category (POP, painting, upholstery, tiling) and sub-type (ceiling, wall, sofa reupholstery).
2. **Write the brief.** Guided questions by type (rooms, size, finish), photos, rough measurements, budget range.
3. **Pick pros.** Either auto-send to three matched pros, or browse catalogs with filters (area, tier, rating, "verified on app" work, budget) and shortlist two or three.
4. **Optional site visit.** Small fee, credited to the job if the quote is accepted.
5. **Compare quotes.** Side by side: itemized labor and materials, timeline, warranty, milestone schedule, trust summary (tier, guarantor, insurance status).
6. **Accept and fund.** Review the milestone plan and terms, pay the first milestone into escrow, confirm the guarantee terms.
7. **Run the project.** Project page with schedule, milestones, chat, photo sign-off at each stage, final review.

**Booking confirmation (both flows)** Every confirmation shows four things: what is booked and the agreed price, who is coming (verified badge), what is protected, and how to change or cancel.

**Edge cases designed in**

| Situation | Behavior |
| --- | --- |
| No pros available | Scheduled booking or waitlist with an honest ETA, never an endless spinner |
| Mobile Money prompt fails or times out | Booking stays in "payment pending" with retry; job details are never lost |
| Pro cancels after matching | Auto re-match with priority flag and a small credit |
| Client cancels | Free before the pro departs; call-out fee after arrival |
| Quote differs from menu price | Explicit in-app client approval required before work starts |
| Scope changes mid-job | Re-approval of the changed quote; work pauses until approved |
| Weak connection | Drafts autosave, photos queue and upload when back online |

**Client-side principles**

- Show the price before asking for commitment.
- One primary action per screen.
- Bottom sheets over modals, so the map stays visible.
- Progress is always visible: status chips for on-demand, a stepper for projects.
- English first with space for Twi and other local-language strings.

## 5. Pro experience

The pro is often on a job site with a low-end phone and patchy data. Every screen works in about three taps, with large buttons, icons and voice.

**Job inbox (home)**

- Large Online / Offline toggle with today's earnings.
- Incoming request card: job type, distance and ETA, price or call-out fee, client first name and rating, photo or voice note, countdown (about 30 to 45 seconds on-demand). Only two buttons: Accept and Decline.
- Tabs: Now, Scheduled, Projects, Done.
- Alerts go by push, SMS and WhatsApp so a missed notification does not cost a job.

**On-demand job flow**

1. Accept, then navigate (opens a maps app with the GPS code and landmark).
2. "I've arrived" (GPS-verified); the client is notified.
3. Diagnose and quote: menu items or an itemized quote with a photo; client approves in-app before work starts.
4. Work: before-photo reminder; a "Materials needed" button flags a shop run without cancelling.
5. Complete: after-photo, one-line summary, client confirms; the pro sees "Payment held, releases in 24h."
6. Rate the client in two taps.

**Project flow**

- A request arrives with the brief, photos, measurements and budget. The pro can Quote, Request site visit, or Pass.
- Quote builder with trade templates (for example POP: area times rate, materials, labor, timeline), reusable line items and auto totals. The milestone schedule is pre-filled and editable within platform limits.
- After acceptance, a project page shows milestones, schedule, chat and a photo sign-off button per stage.

**Earnings and payouts**

- Wallet with three balances: Pending (escrow or hold), Available, Paid out.
- Instant Mobile Money cash-out for a small fee, or free next-day payout.
- Every job shows a receipt-style breakdown: job price, platform fee, pool contribution, net earnings.
- Auto-generated invoices and receipts, shareable on WhatsApp.
- Exportable payment history, which also serves as a record for future tool or material financing.

**Profile and growth**

- Tier progress bar with the next requirement ("6 more jobs, rating 4.6 or better") and the current claim limit with what moves it.
- Catalog manager with Verified and Unverified sections, and a prompt to add photos after each job.
- Availability calendar, service radius, trade settings.
- Short training videos on quoting and proof photos.

**Pro-specific design decisions**

- **Offline tolerance:** status changes, quotes and photos queue locally and sync later.
- **Voice and icons over text:** voice replies in chat, spoken prompts, minimal typing.
- **Low-data and low-memory mode:** compressed uploads, optional wait-for-WiFi photo upload, light screens.
- **Crews:** a lead pro adds helpers who appear on the job with their own ID checks.
- **Fair dispatch:** acceptance and decline rates are visible, and reasonable declines (too far, wrong trade, safety) carry no penalty.

## 6. Pro onboarding

Onboarding is staged: get a pro earning quickly, and ask for more paperwork only as job size grows.

| Stage | What happens | Why |
| --- | --- | --- |
| 1. Sign-up | Phone with OTP, name, trade(s), service areas. Language choice first, voice prompts and icons, short intro video. Also possible through a field agent or a WhatsApp form link | Low friction; many artisans will not install an app cold |
| 2. Identity and trade verification | Ghana Card capture with selfie liveness match; trade proof by strength (master craftsman or association reference, certificates, past-work photos); Mobile Money wallet name-matched to the Ghana Card; terms accepted | The gate: only verified people appear to clients |
| 3. Skills check | Short scenario quiz in voice or picture format (mandatory for safety-critical trades like electrical); a supervised or small trial job | Strongest vetting signal and the quality benchmark |
| 4. Profile and pricing | Work-clothes photo, bio, trades, experience; catalog uploaded as Unverified; rates set inside allowed bands; availability schedule | Gives clients something to judge before the first review exists |
| 5. Activation | Starter tier with capped job value; choice of Option A (join the insurance pool) or Option B (upload own policy for a "Fully insured" badge) | Clear insurance choice and a visible path to higher limits |

**Project-tier upgrade (later, only when a pro applies)**

- Guarantor added, receives an OTP and ID check, and signs the consent form with a stated liability cap.
- Portfolio reviewed by the ops team.
- Per-job insurance cover required for larger jobs.

**First 14 days**

- Welcome call or WhatsApp check-in from ops.
- First-job guidance: a quoting checklist and a proof-photo guide.
- Fast first payout (within 24 hours), because the first payment is what convinces a pro the app works.
- Reduced contribution for the first five completed jobs.

**Pro-side onboarding UX**

- Progress bar showing what is left ("3 of 5 steps done"), resumable anywhere.
- A "why we ask" line beside every document request.
- Voice and icons over text; works offline and resumes later.
- Field agents and local ambassadors, ideally respected artisans, can assist and vouch.

**Ops back-office for onboarding**

- Review queue with ID match results, reference notes and statuses: Applied, Verified, Skills checked, Trial job, Active, Suspended.
- Reference call scripts and a trial-job scorecard.
- Duplicate and fraud checks across Ghana Card, phone, Mobile Money wallet and device.

## 7. Trust system

Trust is built in six layers, each covering a different failure. If one layer fails, the next one catches it.

| Layer | Question it answers | Mechanism |
| --- | --- | --- |
| 1. Identity | Is this really who they say? | Ghana Card with liveness, Mobile Money name match, duplicate checks |
| 2. Competence | Can they do the work? | Trade references, skills check, trial job, verified portfolio |
| 3. Conduct | Did they behave properly? | GPS arrival, masked communication, price-versus-quote variance, conduct ratings |
| 4. Money | Is anyone being cheated? | Escrow, milestones, retention hold, itemized invoices |
| 5. Recourse | What if it goes wrong? | Dispute process, claims waterfall, guarantor, insurer-backed pool |
| 6. Reputation | Does the record mean something? | Verified-only reviews, quality score, tiers, demotion rules |

**The client-facing Trust Profile** Raw scores are not shown. Every pro card and profile leads with plain facts:

- Tier badge (Starter, Growth, Pro, Elite)
- "ID verified," "Guarantor-backed," "Insured"
- "42 jobs on app, 96% on time, 0 claims in 12 months"
- Problem-solved rate ("97% of clients said the problem was fixed")
- Star rating, shown after these facts because facts are harder to inflate

**Trust across a job's life**

- **Before:** verified badges, fixed prices, a protection line at checkout.
- **During:** live tracking, GPS check-in, masked contact, in-app quote approval, proof photos.
- **After:** two-sided review, hold window, one-tap "Report a problem," visible resolution status.

**Fraud and abuse controls**

| Risk | Control |
| --- | --- |
| Fake reviews | Reviews only after a paid in-app job; flag clusters of repeat pro-client pairs and unusually cheap jobs |
| Fake claims | Timestamped photo evidence required; claim rate tracked per client too |
| Retaliation ratings | Compare ratings against job signals (on time, problem solved); hold ratings from disputed jobs until the dispute closes |
| Account sharing or borrowed identity | Periodic selfie re-check before high-value jobs |
| Moving clients off-app mid-job after taking the protection fee | Treated as a conduct signal reviewed by ops |

**Principles that keep it credible**

- Objective signals (claims, rework, punctuality, price variance) outweigh opinions.
- Every penalty has a path back, so one bad stretch does not push a good artisan out.
- Clients are scored too: cancellations, payment problems and abusive behavior affect access, and pros see it.
- The rules are published in plain language, and every score change comes with a reason.
- Hard calls (disputes, suspensions) are made by a person with a written reason.

## 8. Ratings, tiers and claim limits

Each pro has a claim limit: the most the platform and its insurer will stand behind for that pro. Objective signals count for more than star ratings. All figures below are illustrative and are calibrated with the insurer's loss data.

**What clients rate (about 20 seconds)**

1. Workmanship, 1 to 5
2. Conduct (communication, respect, cleanliness), 1 to 5
3. Problem solved? Yes, Partly or No

**What the system measures (clients cannot game these)**

- On-time arrival (GPS)
- Final price versus quote variance
- Rework requests and valid claims
- Cancellations by the pro

**Quality score (0 to 100, rolling 180 days, recent jobs weighted higher)**

| Component | Weight |
| --- | --- |
| Problem solved | 35% |
| Workmanship | 25% |
| Claim- and rework-free rate | 20% |
| Punctuality | 10% |
| Conduct | 10% |

**Claim limit formula**

```latex
\text{Limit} = (\text{Base} + a \cdot J + b \cdot E) \times Q \times R
```

- **Base:** starter limit, for example GH₵1,000.
- **J:** verified in-app jobs in the last 12 months (capped at 50); a = GH₵30 per job.
- **E:** verified in-app earnings in the last 12 months; b = 5%.
- **Q (quality factor):** 0.5 to 1.2 from the quality score. It applies only after a minimum of 10 jobs; before that Q = 1 and the limit stays at Base.
- **R (risk factor):** 1.0 minus 0.25 per valid claim in the last 180 days. Two valid claims puts R at 0.5 or lower and freezes project-tier jobs pending review.
- A hard ceiling per tier keeps limits within what the insurer backs.

Example: 40 jobs, GH₵30,000 earned, Q = 1.1, no claims gives (1,000 + 1,200 + 1,500) × 1.1, about GH₵4,070. After one valid claim (R = 0.75) it falls to about GH₵3,050.

**Tie to job caps**

- Maximum single job value equals the pro's limit.
- Total value of jobs still inside warranty is at most 2 times the limit.
- Both are enforced when the pro accepts a job.

**Tier table**

|  | Starter | Growth | Pro | Elite |
| --- | --- | --- | --- | --- |
| Unlock | Ghana Card, trial job | 10+ jobs, Q of 60+, no valid claims in 90 days | 40+ jobs, Q of 75+, 6+ months active | 100+ jobs, Q of 85+, 12+ months active |
| Claim limit (GH₵) | 1,000 fixed | 1,000 to 3,000 | 3,000 to 8,000 | 8,000 to 20,000 |
| Guarantor | No | No | Yes, for project jobs | Yes |
| Retention hold | 10% | 7% | 5% | 5% |
| Pool contribution from pro | 3% | 2.5% | 2% | 1.5% |
| Platform top-up | 1% | 1% | 1% | 1% |
| Perks | Standard dispatch | Catalog and quote builder | Priority dispatch, Verified badge | Featured placement, tool financing, lower commission |

Contribution falls as the tier rises because lower-risk pros need less cover, which gives pros a visible reason to climb.

**Demotion and recovery**

- 1 valid claim: R drops, a watch flag is set, the limit recalculates immediately.
- 2 valid claims in 90 days: drop one tier, project jobs frozen pending review.
- 3 or more in 180 days: suspension and review.
- Recovery: 10 clean jobs at the lower tier restores R and eligibility to climb.

**Insurance model**

- Uninsured pros choose to join the pool, which is backed by a licensed insurer. Their cap on jobs rises with record, ratings and earnings.
- Pros who hold their own policy upload it and earn a "Fully insured" badge and priority on high-value jobs.
- Pros see their limit, the factors behind it, and the pool balance and claims history, so the rules are visible.

## 9. Cold start for new pros

A new pro has no history, so clients skip them, and they never get history. The app lends trust until the pro earns their own.

**Borrowed trust (what the pro brings)**

- Vetting signals shown in place of reviews: "Passed trial job, referred by \[name\]."
- A verified trial job produces the first photo-verified portfolio item and first review, so no pro goes live with a blank profile.
- Sponsorship: an established Pro or Elite artisan can sponsor an apprentice, and the sponsor's standing takes a small hit if the newcomer fails.

**Platform-lent trust (what the app provides)**

- A "New on the app" badge instead of zero stars.
- Starter protections: capped job value, extra retention hold, full escrow.
- Client opt-in at checkout: "Try a new pro for 10% off," funded from platform margin, not the pro's earnings.

**Controlled exposure**

- A reserved share of dispatch (about 10 to 15%) goes to new pros on low-value jobs in their trade, so rating-ranked matching does not starve them.
- First jobs are small menu items only, not projects.
- Ops reviews photos and ratings after each of the first five jobs and coaches where needed.

**Scoring while data is thin**

- Q stays locked until 10 jobs; the pro sees "Building record (4 of 10 jobs)."
- A neutral starting prior stops one 5-star or one 1-star review from swinging the score.
- Objective signals (on time, problem solved, claims) count from job one.

**Graduation**

- Graduate to Growth at 10 jobs, Q of 60 or more, and no valid claims.
- Borderline pros get five more supervised jobs.
- A valid claim or repeated no-shows triggers pause, coaching and, if needed, removal.

**Watch for**

- Friend-booking clusters used to farm early reviews.
- Over-recruiting in one trade or area, which starves every pro there.

## 10. Disputes and claims

A **dispute** is a disagreement about the job. A **claim** is money owed from the waterfall. Most issues should resolve as disputes, and only a few escalate to claims.

&#91;embedded content: dispute and claim flow, 2 decisions\]

A dispute the pro accepts closes at stage 2. Ops mediation handles the rest, and a claim is raised only when the remedy fails.

**Stage 0: Prevention (built into the flow)**

- Itemized quote approved in-app, before and after photos, GPS logs, chat history.
- Escrow hold window: 24 to 48 hours on-demand, per milestone on projects.
- Milestone sign-off with photos, so issues surface early.

**Stage 1: Client reports a problem**

- Available during the hold window, and for the warranty period on projects.
- Guided form: issue type (not completed, poor workmanship, damage, overcharge, no-show, safety), photos or video, description (voice allowed), desired outcome (redo, partial refund, full refund).
- Funds for that job freeze automatically and the pro is notified immediately.

**Stage 2: Pro responds (24 hours)** The pro can accept (agree to fix or refund), counter (offer a partial remedy), or contest (upload their own evidence). Most disputes should end here, and the rate is tracked as a health metric.

**Stage 3: Ops mediation (within 48 hours)** A case agent reviews photos, GPS logs, chat, quote and invoice, and may call both parties. Outcomes: rework (with a deadline and a verified re-check), partial refund, full refund, or release to the pro. A missed rework deadline moves the case to a claim.

**Stage 4: Claim** The client submits any extra evidence, such as an independent repair quote. The claim is assessed against the per-claim limit, exclusions and evidence requirements agreed with the insurer. The client is paid from the first available source and the platform recovers from the pro afterward, so the client is never left waiting on recoveries.

**Claims waterfall**

1. Retention hold or escrowed funds
2. The pro's wallet and future payouts
3. The guarantor, if rework failed (project tier)
4. The insurance pool
5. The insurer, for large or catastrophic losses

**Stage 5: Outcome and consequences**

- Valid claim: R drops, the limit recalculates immediately, a flag is set, and demotion rules apply.
- Invalid or fraudulent claim: no payout, a warning, and a client flag on repeat or proven abuse.
- Both parties receive a written decision with reasons. One appeal is allowed within 7 days, reviewed by a different, senior agent.

**Published service levels**

| Step | Target |
| --- | --- |
| Pro response | 24 hours |
| Mediation decision | 48 hours |
| Rework deadline | 5 days |
| Claim payout after approval | 3 to 5 working days |

**Evidence the app captures (and the insurer will ask for)**

- Timestamped before, after and sign-off photos
- GPS check-in and check-out
- Signed quote, invoice and payment records
- Chat log and call metadata
- Independent repair quote for damage claims

**Exclusions stated up front**

- Pre-existing defects, wear and tear
- Faulty client-supplied materials
- Work outside the pro's declared trade
- Changes made by someone else after completion
- Claims filed after the warranty window

**Small-claim rule** Under a set amount (for example GH₵200), a no-questions refund up to a limited number per client per year, because investigating tiny claims costs more than paying them.

**Abuse controls**

- Clients: claim rate tracked per client, evidence quality required, payouts capped for brand-new accounts.
- Pros: repeatedly contesting valid claims or ignoring rework deadlines drops a tier.
- Collusion: clusters of claims between the same pro and client are flagged.

**Ops tooling** Case queue with SLA timers, one-screen evidence viewer (photos, GPS, chat), decision templates, audit log, and a dashboard of dispute rate, rework success rate, claim approval rate, average payout and recovery rate from pros.

## 11. Safety design

Safety runs both ways: clients let strangers into their homes, and pros enter unknown places, sometimes at night.

**Before the job**

- The pro card shows a verified photo so the client can match it to the person at the door. Pros see client ratings and flags before accepting.
- Optional preferences: request a pro of a particular gender, or a pro with a helper.
- Pros may decline a job they feel unsafe about, with no penalty.
- Night jobs (about 8pm to 6am) add extra checks: tier requirement, a recent selfie re-check, and an automatic share-link.

**During the job**

- **SOS button** on both apps, one tap from the job screen. It alerts the ops team, shares live location and offers to call emergency services. A silent version exists for situations where a visible call could escalate things. An SMS fallback works when data fails.
- **Share-job link** for either side to send to a family member or neighbor, showing job status and live location.
- **Check-in prompts:** if a job runs well past its expected time, or either party stops responding, the app asks "Are you okay?" and escalates to ops if there is no answer within minutes.
- **Masked calls and chat only.** Real numbers stay hidden unless both sides choose to share.

**Trade-specific hazards**

- **Electrical and gas:** a short in-app safety checklist before starting, and an "unsafe site" option that lets the pro stop and still be paid the call-out fee.
- **Heights and heavy work (ceilings, lifting):** a helper is required, or site conditions are confirmed in the project brief.
- **Hazard reporting:** pros can flag unsafe wiring or structures to the client.

**Property and theft allegations** Before and after photos of the work area, GPS time-in and time-out, and an optional "valuables secured" checkbox for the client create a record. Helpers are named on the job and carry verified IDs.

**Incident response**

| Severity | Examples | Response |
| --- | --- | --- |
| Red | Immediate danger | Ops calls within minutes, immediate suspension pending review |
| Amber | Harassment, serious conduct complaint | Review within 24 hours |
| Green | Minor issue | Standard follow-up |

- A named incident owner, a standard log, and a protocol for cooperating with police on serious cases (to be drafted with a Ghanaian lawyer).
- Support for the affected person: follow-up call and a free reassignment or refund.

**Privacy** Live location is shared only during active jobs, only with the other party and ops, and is deleted or archived on a set schedule, with explicit consent under the Data Protection Act.

**Metrics** Incidents per 1,000 jobs by severity, SOS response time, share of SOS that were false alarms, and the share of night jobs completed without issue.

## 12. Pricing and commission

Principles: every fee is shown up front with no surprises at checkout; because leakage is acceptable, clients are charged for protection, not just access; and pro take-home stays high enough that staying in-app beats going direct. Figures are illustrative.

**Fee components**

| Fee | Paid by | Purpose |
| --- | --- | --- |
| Commission | Pro | Platform revenue, taken from the job price |
| Protection fee | Client | Escrow, dispute handling, rework guarantee, insurance cost |
| Pool contribution | Pro (1.5 to 3% by tier) | Funds the insurance pool |
| Platform top-up | Platform (1%) | Matches pool contributions |
| Call-out or site-visit fee | Client | Compensates the pro's trip, credited to the job if accepted |
| Instant cash-out fee | Pro (optional) | Covers Mobile Money payout costs |

**Commission by job type and tier**

|  | Starter | Growth | Pro | Elite |
| --- | --- | --- | --- | --- |
| On-demand | 18% | 15% | 12% | 10% |
| Projects | 12% | 10% | 8% | 7% (capped per project) |

- Repeat bookings with the same pro through the app take 5 points off commission, giving clients and pros a reason to rebook in-app.
- Protection fee: about 4 to 5% on-demand (minimum GH₵5) and about 3% on projects, with a cap. Large projects show the insurance premium as a separate line.

**Worked example: GH₵300 on-demand plumbing job, Growth tier**

| Line | GH₵ |
| --- | --- |
| Client pays: 300 plus protection fee (5%) | 315.00 |
| Pro receives: 300 minus commission (15%, 45.00) minus pool contribution (2.5%, 7.50) | 247.50 |
| Platform gross: 45.00 plus 15.00 | 60.00 |
| Less pool top-up (1%) | −3.00 |
| Less payment processing (estimate, 2 to 3%) | −8.00 |
| Platform net (about 16% of job value) | about 49.00 |

Current Mobile Money aggregator fees and levies must be checked before finalizing, since they move margin significantly on small jobs.

**Pricing the menu**

- Menu prices are set from real data on what pros charge.
- Each menu job has a price band (for example ±15%) so pros can compete on service, with the top end capped to protect trust.
- Materials are quoted separately, and clients may buy their own. The platform fee applies to labor unless the app handles the material purchase.
- No surge pricing. An urgent job carries a flat, clearly shown supplement (for example +20%).

**Later revenue (not at launch)**

- Pro subscription for lower commission, featured placement and tools.
- Tool and material financing repaid from future payouts.
- Recurring service plans (gardening, cleaning) at a small discount.
- Diaspora oversight: a flat fee for site visits and photo reports on a family property.
- Insurance distribution commission, subject to licensing.

**Promotions**

- First-job credit for clients, funded from the marketing budget and never from the pro's earnings.
- Reduced commission for a pro's first five jobs, and referral bonuses for pros who bring in vetted artisans.
- Heavy discounting is avoided, since low-price jobs train clients to expect cheap work.

**Pro-facing transparency** Net earnings appear in one line on every job, with the full breakdown one tap away.

## 13. Key screen wireframes

Twelve low-fidelity screens carry the product, grouped three at a time in the order a user meets them. Words in \[brackets\] and "GH₵ \_\_\_" stand for real data; layout and hierarchy are the point.

### Client: on-demand booking

&#91;embedded content: client on-demand flow, 3 screens\]

Price comes before the map, and protection and safety stay visible while the pro travels.

### Client: project booking

&#91;embedded content: client project flow, 3 screens\]

Quotes are compared side by side with trust signals, and each milestone is released only after photo sign-off.

### Pro app

&#91;embedded content: pro app, 3 screens\]

Each screen has one main action, amounts are shown net, and the next tier is always visible.

### Trust and safety

&#91;embedded content: trust and safety, 3 screens\]

Facts lead the profile, a problem report freezes payment at once, and SOS is one tap from the job screen.

## 14. Open decisions and design principles

**Open decisions**

| Decision | Options | Why it matters |
| --- | --- | --- |
| Who pays the protection fee | Client only, split with the pro, or absorbed early as a growth lever | Shapes how artisans feel about joining and how clients see the price |
| Guarantor liability | Financial liability up to a cap, or verification and mediation only | Drives the legal drafting and how hard pros are to recruit |
| Matching style for on-demand | Automatic by proximity and rating, or client browses and chooses | Speed versus building each pro's personal brand |
| Laundry | Include now or run as a separate pickup-and-delivery service later | Different logistics and margin profile |
| Pool framing | Insurer-backed pool as designed, or a platform-funded guarantee fund | Regulatory treatment; confirm with the licensed insurer and the regulator |
| Minimum job value | Floor price per service | Small jobs barely cover payment costs and support |

**Design principles**

1. Show the price before asking for commitment.
2. One primary action per screen.
3. Make progress visible (status chips, steppers, tier progress bars).
4. Save drafts automatically; connectivity drops.
5. Facts over opinions: lead with verified signals, not star ratings.
6. Every penalty has a path back.
7. Voice, photos and icons over typing, on both sides.
8. Be transparent about fees, rules and score changes.
9. Humans decide the hard calls and give written reasons.

**Success measures**

- Share of jobs completed in-app, no-show rate, and match time
- Repeat-booking rate and review coverage
- Disputes and claims per 100 jobs, resolution time, and recovery rate from pros
- Pro retention and payout success rate
- Incidents per 1,000 jobs and SOS response time
- Client survey: "I would trust this app with a stranger at my home"
