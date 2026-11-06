# Fixly: Handyman Marketplace & Trusted Home Services Platform

Fixly is a location-based home services marketplace in Ghana connecting homeowners, tenants, and diaspora clients with vetted artisans (plumbers, electricians, painters, carpenters, tilers) under a strict guarantee: verified pros show up at an agreed price with funds protected in escrow. The application provides an intuitive, high-touch mobile and desktop experience tailored for low-connectivity environments with offline sync queues, spoken voice prompts in English, Twi, and Ga, and transparent escrow workflows.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following critical requirements and choices have been confirmed through Phase 1 clarification:

- **Persona Experience & Navigation**: A welcome persona selector establishes initial user intent (Client, Pro Artisan, Ops Admin) with persistent memory in local preferences, complemented by a seamless profile switcher for testing and dual-role users.
- **Multilingual Support & Voice Guidance**: Native three-language support covering **English**, **Twi (Akan)**, and **Ga**, equipped with spoken voice note synthesis/audio playback prompts for non-technical artisans and low-literacy trade environments.
- **Offline Reliability & Sync Handling**: Integrated offline simulation toggle accompanied by an interactive **Offline Sync Queue Drawer**, visual status banners (Online, Patchy/2G, Offline), local optimistic state caching, and queued mutation resolution upon reconnect.
- **Payment & Escrow Architecture**: Mobile Money (MTN MoMo, Telecel Cash, AT Money) integration model with 24–48h post-job escrow holds for on-demand repairs and milestone-staged escrow releases for multi-day renovation projects.

---

## 1. Overview & Core Concept

- **What It Does**: Fixly delivers two tailored service streams:
  1. *On-Demand Fixes* (leaking pipe, burnt outlet, broken switch): Rapid dispatch with transparent price menus, Ghana Post GPS pin mapping, pro arrival confirmation, and escrow protection.
  2. *Planned Projects* (POP ceilings, full-house painting, bathroom tiling, sofa reupholstery): Guided brief submission, multi-pro quote comparison (labor vs. materials), staged milestones (e.g. 40/40/20), and photo verification at each milestone.
- **Target Audience / Personas**:
  - *Clients & Residents*: Homeowners and renters in Accra (East Legon, Osu, Spintex, Cantonments, Tema, etc.) demanding vetted strangers, no surprise mid-job price inflation, and clear dispute recourse.
  - *Diaspora Clients*: Ghanaians abroad managing repairs for family or investment properties with remote tracking, progress photo inspections, and MoMo/card funding.
  - *Pro Artisans & Crew Leads*: Informal tradespeople needing steady bookings, guaranteed payment release, automated digital receipts for WhatsApp, and verifiable trade reputations without high reading friction.
  - *Ops Team*: Dispute arbiters and verification officers managing Ghana Card verification queues, claim waterfalls, and SOS safety incidents.
- **Key Value**: Replaces word-of-mouth uncertainty with verified artisan trust: GPS check-in, in-app quote locking before tools touch the job, milestone photo sign-offs, and an insurer-backed claims waterfall.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FIXLY USER LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────────────────┘
  CLIENT                                PRO ARTISAN               OPS CONSOLE
    │                                        │                         │
    ├─► Select Job / Project                 ├─► Toggle Online/Offline ├─► Verify IDs
    ├─► Set Ghana Post GPS & Landmark        ├─► Audio Alert & Countdown├─► Mediate Claims
    ├─► Fund Escrow (Mobile Money)          ├─► GPS Check-in Arrival  └─► Monitor SOS
    ├─► Live Map Tracking                    ├─► Itemize Diagnostic Quote
    ├─► Approve Diagnostic Quote             ├─► Upload Before/After Photos
    ├─► Inspect Work & Confirm Completion   ├─► Request Milestone Payout
    └─► Submit 20s Trust Rating              └─► Withdraw from Wallet
```

1. **Client Booking Flow (On-Demand & Project)**:
   - *Discovery*: Instant search with fixed-price menus (e.g., GH₵180 Tap Replacement) or project brief builder with room/square-meter dimensions.
   - *Location Pinning*: Interactive map with draggable pin, landmark notes, and Ghana Post GPS code lookup (e.g., `GA-492-3841`).
   - *Escrow Checkout*: Clear fee breakdown showing base job price, 5% Fixly Guarantee protection fee, and selected Mobile Money wallet.
   - *Tracking & Live Status*: Radar matching state, assigned pro card with Ghana Card badge and problem-solved rate, masked call/chat, and live ETA.
   - *Quote Sign-Off*: Pro inspects on-site and submits an itemized labor + material breakdown; client approves in one tap before work proceeds.
   - *Sign-Off & Hold*: Client reviews "After" photo, releases job, rating prompt triggers (1–5 workmanship, 1–5 conduct, problem solved Y/N), and 24h escrow countdown begins.

2. **Pro Artisan Interface (High Tactile / Low Friction)**:
   - *Today's Cockpit*: High-contrast Online/Offline toggle, today's net earnings banner, and large icon-driven action cards.
   - *Dispatch Alert Card*: Audible chime, job title, neighborhood, distance, estimated earnings, and large 40-second countdown with dual "Accept" / "Decline" buttons.
   - *Arrival & Diagnosis*: "I Have Arrived" GPS trigger, photo capture for diagnostics, and tap-to-add common parts (e.g., PVC valve, flexi pipe).
   - *Offline Queue*: Actions taken without network (photo capture, quote draft, status advance) display in a yellow pending pill that auto-syncs when online.
   - *Earnings & Wallet*: Net breakdown (Job Price - 15% Platform Commission - 2.5% Insurance Pool), instant Mobile Money cash-out, and WhatsApp invoice export.

3. **Ops & Trust Console**:
   - Verification queue for pro Ghana Cards, association references, and trial job scorecards.
   - Dispute & Claims Waterfall mediator: stage 1 pro response, stage 2 ops evidence viewer (before/after photos, GPS timestamps, chat history), stage 3 claim payout execution.
   - Live Emergency SOS dashboard with location beacons and phone dials.

### Visual Identity & Theme

- **Aesthetic Direction**: Utilitarian, tactile, and daylight-friendly. Designed with high contrast for outdoor Ghanaian sunshine, clean borders, crisp typography, and large 48px touch targets for gloved or busy artisan hands.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Warm Off-White (`#FBFBF9`) in light mode; Deep Slate Navy (`#0F172A`) in dark mode.
  - *Structural Surfaces (30%)*: Crisp White (`#FFFFFF`) with hairline slate borders (`border-slate-200`) and soft elevation.
  - *Brand Accent (10%)*: Vibrant Safety Amber-Gold (`#D97706` / `#F59E0B`) representing craftsmanship and electrical/safety warmth, paired with Forest Trust Green (`#059669`) for verified badges and protected escrow indicators.
  - *Destructive / Urgency*: Vivid Vermilion (`#DC2626`) reserved strictly for SOS emergency triggers and dispute flags.
- **Typography & Scale**:
  - *Display / Headings*: **Plus Jakarta Sans** (bold, geometric, clean geometric numerals).
  - *Body Prose*: **Plus Jakarta Sans** / **DM Sans** (highly legible at 15–16px with 1.6 line height).
  - *Numerals & Currency*: Tabular figures (`tabular-nums font-mono`) for all GH₵ amounts, phone numbers, and Ghana Post GPS codes.
- **Tactile Ergonomics**:
  - Natural thumb-zone placement for mobile viewports (bottom 40% reserved for primary actions, accept/decline buttons, and audio player).
  - Voice Prompts: Spoken audio buttons beside key actions so non-reading artisans can tap a speaker icon to hear instructions in Twi ("Mepawokyew, fa mfoni no to so") or Ga.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Storage Strategy (Firestore + Offline Mutation Queue)**:
  - *Chosen Approach*: Firebase Firestore acts as the real-time cloud backbone, while an in-memory & `localStorage` IndexedDB-style queue buffers all pro actions during offline states. A prominent Network Simulator bar lets users test "Online", "Patchy (2G)", and "Offline" modes.
  - *Why*: Tradespeople in underground basements, remote compounds, or low-bandwidth zones in Ghana frequently lose signal. No work should halt or lose photos.
  - *Alternatives Considered*: Pure online-only Firestore calls would lead to blocked app states and failed uploads.
- **Decision 2: Price Locking via In-App Diagnostic Approval**:
  - *Chosen Approach*: On-demand menu prices serve as standard ceilings; when a pro arrives and identifies unexpected scope, they must submit an in-app quote revision that pauses the job until the client explicitly taps "Approve Revised Price".
  - *Why*: Eliminates the #1 grievance in Ghanaian home services: mid-job extortion or price inflation after disassembling a sink or wall.
- **Decision 3: Facts-First Trust Profile (No Vanity Stars Alone)**:
  - *Chosen Approach*: Artisan cards prominently highlight hard signals: "Ghana Card Verified", "Guarantor Backed", "42 Jobs Done", "97% Problem Solved", and "GH₵3,000 Claim Limit" before displaying the 1–5 star rating.
  - *Why*: Star ratings alone are easily manipulated or prone to cultural bias; factual reliability metrics protect both sides.
- **Decision 4: Built-in Audio Note Recorder & Player**:
  - *Chosen Approach*: Clients and pros can record voice memos to explain job details (e.g. describing a rattling ceiling fan or leaking tank) using native Web Audio / MediaRecorder, with fallback pre-recorded audio synthesis for Twi and Ga guidance.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FIXLY CLIENT & PRO APP                             │
│                                                                             │
│   ┌──────────────────────┐  ┌────────────────────┐  ┌────────────────────┐  │
│   │     Client App       │  │   Pro Artisan App  │  │    Ops Console     │  │
│   │ • On-Demand Map      │  │ • Job Inbox Radar  │  │ • ID Verification  │  │
│   │ • Project Quotes     │  │ • GPS Check-in     │  │ • Dispute Console  │  │
│   │ • Escrow Funding     │  │ • Offline Sync     │  │ • SOS Monitor      │  │
│   └──────────┬───────────┘  └─────────┬──────────┘  └─────────┬──────────┘  │
│              │                        │                       │             │
│   ┌──────────┴────────────────────────┴───────────────────────┴─────────┐   │
│   │                      Core Application State Layer                    │   │
│   │   • Auth & Role Session State      • Language & Audio Engine        │   │
│   │   • Active Job Coordinator         • Network Simulator State        │   │
│   └──────────────────────┬──────────────────────────────────────────────┘   │
│                          │                                                  │
│   ┌──────────────────────▼──────────────────────────────────────────────┐   │
│   │          Offline-First Mutation Engine & Sync Queue                 │   │
│   │   • Local Optimistic Cache (Drafts, Captured Photos, Statuses)     │   │
│   │   • Auto-Retrying Queue with Exponential Backoff                    │   │
│   └──────────────────────┬──────────────────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────────────────┘
                           │ Network Available
┌──────────────────────────▼──────────────────────────────────────────────────┐
│                   FIREBASE & GOOGLE CLOUD BACKEND                           │
│                                                                             │
│   ┌──────────────────────────┐         ┌────────────────────────────────┐   │
│   │    Firebase Firestore    │         │      Firebase Authentication   │   │
│   │ • Users & Pro Profiles   │         │ • Google & Phone Identity      │   │
│   │ • Jobs & Milestones      │         └────────────────────────────────┘   │
│   │ • Escrow & Claims Ledger │                                              │
│   │ • Live Messages & Voice  │         ┌────────────────────────────────┐   │
│   │ • SOS Alerts & Ops Log   │         │ Express Server API Proxy       │   │
│   └──────────────────────────┘         │ • Escrow Mock / MoMo Webhooks  │   │
│                                        │ • Cloud Config & Geocoding     │   │
│                                        └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Entities

- **User Profile (`users`)**:
  - `id`: Unique user identifier
  - `role`: `'client' | 'pro' | 'ops'`
  - `name`: Full name
  - `phone`: Ghanaian phone number (e.g. `+233 24 123 4567`)
  - `language`: `'en' | 'twi' | 'ga'`
  - `location`: `{ lat, lng, ghanaPostGps, landmark, area }`
  - `proProfile` (if pro): `{ trade, tier, claimLimit, qualityScore, jobsCompleted, problemSolvedRate, verifiedId, guarantorName, walletBalance, isOnline }`
- **Job Record (`jobs`)**:
  - `id`: Job document ID
  - `clientId`: User ID of client
  - `proId`: User ID of assigned artisan (or null if matching)
  - `type`: `'on_demand' | 'project'`
  - `trade`: `'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'tiling' | 'upholstery' | 'ac'`
  - `title`: Job description
  - `status`: `'draft' | 'requested' | 'matched' | 'pro_en_route' | 'arrived' | 'diagnosed' | 'quote_approved' | 'in_progress' | 'completed' | 'hold_period' | 'closed' | 'disputed'`
  - `pricing`: `{ basePrice, revisedQuote, protectionFee, totalAmount, platformFee, poolFee, netProEarnings }`
  - `milestones`: Array of `{ id, title, percentage, amount, status: 'pending'|'funded'|'submitted'|'approved', proofPhotos }`
  - `location`: `{ lat, lng, address, ghanaPostGps, landmark }`
  - `media`: `{ clientVoiceNote, clientPhotos, beforePhotos, afterPhotos }`
  - `ratings`: `{ clientRating: { workmanship, conduct, problemSolved, comment }, proRating: { punctuality, cleanliness } }`
  - `createdAt`, `updatedAt`, `escrowReleaseDate`
- **Dispute & Claim (`disputes`)**:
  - `id`: Dispute ID
  - `jobId`: Reference to job
  - `initiatorId`: Client or Pro
  - `category`: `'not_completed' | 'poor_workmanship' | 'damage' | 'overcharge' | 'no_show'`
  - `evidence`: Photos, audio notes, written claim
  - `status`: `'open' | 'pro_responded' | 'ops_review' | 'resolved' | 'escalated_to_claim'`
  - `outcome`: `{ decision, refundAmount, proDeduction, resolutionNotes }`
- **Offline Sync Queue Item**:
  - `id`: Client-generated UUID
  - `action`: `'UPDATE_STATUS' | 'SUBMIT_QUOTE' | 'UPLOAD_PROOF' | 'SEND_MESSAGE'`
  - `payload`: Action-specific data
  - `queuedAt`: Timestamp
  - `status`: `'pending' | 'syncing' | 'synced' | 'failed'`

### Interactive Component & State Mapping

1. **Role Switcher & Landing View (`RoleSelector.tsx`)**:
   - Allows choosing between "Client needing a repair", "Artisan ready to work", or "Ops Manager".
   - Persists selection to `localStorage` and profile, with a quick role badge in the user profile menu to easily inspect all personas.
2. **On-Demand Repair Wizard (`OnDemandBooking.tsx`)**:
   - Fixed-price catalog selection (Plumbing, Electrical, Masonry, Carpentry).
   - Ghana Post GPS lookup with landmark notes & interactive simulated map with pro radar.
   - Price breakdown card with 5% protection fee and MoMo payment simulator.
3. **Pro Artisan Dashboard (`ProDashboard.tsx`)**:
   - Large Online/Offline switch with audio feedback.
   - Incoming job modal with 40s countdown, GPS navigation simulation, and "I Have Arrived" trigger.
   - Live Quote Builder: quick line-item addition for parts & labor with total calculations.
   - Before & After camera capture simulation with instant client approval trigger.
4. **Offline Simulator & Sync Queue Drawer (`OfflineManager.tsx`)**:
   - Floating network status toggle (`Online 🟢`, `2G Patchy 🟡`, `Offline 🔴`).
   - Detailed queue drawer displaying pending mutations, retry mechanisms, and local cache statistics.
5. **Multilingual Audio Engine (`LanguageContext.tsx` & `AudioVoicePrompts.tsx`)**:
   - Seamless switching between English, Twi, and Ga.
   - Spoken audio prompts for every major step (job received, arrival confirmed, quote submitted, payment released) using clean Web Audio synthesis with authentic Ghanaian phonetics and phraseology.
6. **Dispute Resolution & SOS Center (`DisputeConsole.tsx` & `EmergencySosModal.tsx`)**:
   - 1-tap SOS trigger with silent alarm option, live GPS coordinates display, and emergency contacts.
   - Case evidence viewer with side-by-side before/after photo inspection, chat transcripts, and escrow release/refund buttons.

## 5. Recent Feature Additions & Platform Enhancements

- **Role-Based Admin Console & Discrete Redirection**:
  - Operations Tower made strictly role-based: public pill removed from public client view.
  - Automatic redirection on login for `admin@fixlygh.com` with secure password authentication.
  - Dedicated operational hubs: Active Dispute Tickets & Claims Waterfall, Auditing Failed Ghana Card Uploads, Pro Claim Limits & Guarantors, Manual Escrow Releases & Overrides, and Live SOS Distress Beacons.
- **Offline Artisan Broadcast (2G SMS Shortcode 1400 & WhatsApp wa.me)**:
  - Supports Ghanaian artisans with low or zero continuous internet access.
  - Automated 2G SMS broadcasts with interactive two-way shortcode replies (`Reply YES [JobCode] to accept or NO [JobCode] to pass via free SMS`).
  - Interactive simulator in the Artisan Broadcast Center to test incoming artisan SMS replies.
  - Direct `wa.me` WhatsApp links with preformatted job details, GhanaPost GPS codes, and escrow budget amounts.
  - Active broadcast indicator and dispatch status drawer accessible directly from the booking confirmation screen (`Screen4Confirmation.tsx`) and notifications drawer (`NotificationDrawer.tsx`).
- **Platform & Escrow FAQ in Profile Settings (`ProfileSettingsModal.tsx`)**:
  - Segmented tab toggle between **Profile Information** and **Platform & Escrow FAQ**.
  - Searchable accordion covering Fixly escrow protection, payout schedules, 24-hour service guarantee, free rework policy, 2G SMS offline artisan alerts, Ghana Card biometric verification, supported payment methods, dispute handling, and referral bonuses.
  - Category filter chips (*All FAQs*, *Escrow & Money*, *24-Hr Guarantee*, *Ghana Card & Safety*, *Offline 2G Broadcast*).
- **'Manage Payment Methods' Section in Wallet Screen (`Screen6Wallet.tsx`)**:
  - State-backed payment methods list supporting Ghanaian Mobile Money (MTN MoMo, Telecel/Vodafone Cash, AT Money) and Bank Cards (Visa, Mastercard, Gh-Link).
  - 1-click "Set as Default" toggle with visual `DEFAULT` badge.
  - "+ Add Method" modal with interactive tabs for Mobile Money (network selector, phone number validation, registered name) and Cards (network, 16-digit card number, MM/YY expiry, CVV, cardholder name).
  - Edit and delete actions with safety confirmations and feedback notifications.

---

## 6. Verification & Testing Strategy

- **Build Verification**: Run `compile_applet` and verify zero TypeScript, Vite, or Tailwind CSS compilation errors.
- **Workflow Testing**:
  - Create on-demand plumbing job as Client -> switch to Pro to accept job -> trigger GPS arrival -> submit diagnostic quote -> switch to Client to approve quote -> complete with after-photo -> release escrow.
  - Test project booking with multi-milestone payments.
  - Disconnect network using Network Simulator -> perform status update and quote submission -> observe items buffering in the Sync Queue -> reconnect to Online -> confirm automatic queue flush and Firestore state synchronization.
  - Test language toggling across English, Twi, and Ga, ensuring all primary labels, buttons, and voice prompts execute seamlessly.
  - Test artisan 2G SMS and WhatsApp broadcast simulation, including receiving inbound `YES [ID]` reply codes.
  - Test FAQ search and category filtering in Profile Settings.
  - Test adding, editing, and deleting payment methods (MTN MoMo, Telecel Cash, Visa) in the Wallet tab.

