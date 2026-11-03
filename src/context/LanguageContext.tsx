import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English (Ghana)', flag: '🇬🇭' },
  { code: 'twi', name: 'Twi', nativeName: 'Asante Twi', flag: '🇬🇭' },
  { code: 'ga', name: 'Ga', nativeName: 'Gã (Accra)', flag: '🇬🇭' },
  { code: 'ewe', name: 'Ewe', nativeName: 'Eʋegbe (Volta)', flag: '🇬🇭' },
  { code: 'hausa', name: 'Hausa', nativeName: 'Harshen Hausa (Zongo)', flag: '🇬🇭' },
];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  speakPrompt: (key: string) => void;
  isSpeaking: boolean;
  stopAudio: () => void;
  supportedLanguages: LanguageInfo[];
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // App & Taglines
    appName: 'Fixly',
    appTagline: 'The handyman who shows up, at an agreed price, with your money protected.',
    promiseBanner: 'Vetted artisans · Price locked before work · Payment held safely in Escrow',

    // Roles
    clientRole: 'Homeowner / Client',
    proRole: 'Artisan Pro',
    opsRole: 'Dispute & Ops Admin',
    switchRole: 'Switch Persona',
    currentRole: 'Active View',

    // Nav & Common
    home: 'Home',
    myJobs: 'My Jobs',
    earnings: 'Wallet & Payouts',
    trustProfile: 'Trust Profile',
    disputes: 'Mediation & Claims',
    badgesCenter: 'Verification Badges',
    offlineStatus: 'Network',
    online: 'Online',
    patchy: '2G Patchy',
    offline: 'Offline Mode',
    ghanaPostGps: 'Ghana Post GPS',
    landmark: 'Nearest Landmark',
    searchServices: 'What do you need fixed today in Accra?',
    needNow: 'Need Someone Now',
    needNowSub: 'Urgent leak, electrical sparks, or repair dispatch within 30 mins',
    planProject: 'Plan a Project',
    planProjectSub: 'POP ceilings, painting, tiling, sofa upholstery with staged milestones',
    currencyGhs: 'GH₵',
    protectionFee: 'Fixly Escrow Guarantee (5%)',
    totalAgreed: 'Total Locked Amount',
    callOutFee: 'Call-out / Diagnostic Fee',

    // Actions
    accept: 'Accept Job',
    decline: 'Decline',
    iHaveArrived: "I've Arrived (GPS Verified)",
    diagnoseAndQuote: 'Diagnose & Submit Itemized Quote',
    approveQuote: 'Approve Quote & Start Work',
    materialsNeeded: 'Shop Run for Materials',
    completeJob: 'Submit Completion & After Photos',
    confirmSignOff: 'Confirm Job Solved & Release Escrow',
    reportProblem: 'Report Problem / Freeze Escrow',
    sosButton: 'EMERGENCY SOS',
    sosSub: 'Tap for immediate safety alert, live GPS share, or silent alarm',
    instantCashout: 'Instant Mobile Money Cashout',
    listenVoice: 'Listen Audio Prompt',
    startVoiceRecording: 'Record Task with Voice',
    stopVoiceRecording: 'Stop Recording',
    voiceNuanceDetected: 'Audio Nuance Captured',
    speechToTextConfidence: 'Speech Accuracy',

    // Statuses
    status_draft: 'Drafting',
    status_requested: 'Finding Nearby Artisan...',
    status_matched: 'Artisan Matched',
    status_pro_en_route: 'Pro En Route',
    status_arrived: 'Pro Arrived on Site',
    status_diagnosed: 'Quote Awaiting Approval',
    status_quote_approved: 'Quote Approved · Work In Progress',
    status_in_progress: 'Tools Down · Work Active',
    status_completed: 'Awaiting Client Sign-Off',
    status_hold_period: 'Protected in 24h Escrow Hold',
    status_closed: 'Completed & Paid Out',
    status_disputed: 'Under Ops Mediation',

    // Badges
    badge_ghana_card: 'Ghana Card Biometric Verified',
    badge_association_master: 'Certified Master Craftsman',
    badge_guarantor_backed: 'Guarantor Backed',
    badge_insurance_pool: 'Insurer-Backed Pool',
    badge_super_fixer: 'Super Fixer (98% 1st Fix)',
    badge_on_time_pro: 'Punctual Pro (96% On-Time)',

    // Voice Prompts Transcripts
    voice_new_job: 'New repair request received nearby. Review price and distance, then tap Accept within 40 seconds.',
    voice_arrived: 'You have arrived. Please greet the client and inspect the problem before quoting any material.',
    voice_quote_sent: 'Your itemized quote has been sent to the client. Please wait for them to tap approve before starting.',
    voice_payment_held: 'The job is signed off. Your earnings are held safely in escrow and will release in 24 hours.',
    voice_offline_warning: 'You are currently offline. Your photo and status update are saved in the queue and will sync automatically once data connects.',
  },
  twi: {
    // App & Taglines
    appName: 'Fixly',
    appTagline: 'Adwumayɛfoɔ a ɔbɛba, boɔ a moapene soɔ, na wo sika bɔ ho ban.',
    promiseBanner: 'Adwumayɛfoɔ a yɛahwehwɛ mu · Boɔ no sesa da · Wo sika da escrow ban mu',

    // Roles
    clientRole: 'Ofiewura / Afiefei',
    proRole: 'Adwumayɛfoɔ Pa (Artisan)',
    opsRole: 'Nkabom ne Nsɛnnennen Hwɛfoɔ',
    switchRole: 'Sesa Wo Dwumadie',
    currentRole: 'Dwuma a Woredi',

    // Nav & Common
    home: 'Ofie',
    myJobs: 'M’adwuma Nkrataa',
    earnings: 'Sika Kotoku & Gye Sika',
    trustProfile: 'Gye Di & Gyinapɛn',
    disputes: 'Akasakasa & Asɛm Siesie',
    badgesCenter: 'Abɔdin ne Nkrataa Pa',
    offlineStatus: 'Intanɛt Tebea',
    online: 'Intanɛt Wɔ Hɔ (Online)',
    patchy: 'Intanɛt Yɛ Mmerɛ (2G)',
    offline: 'Intanɛt Nni Hɔ (Offline)',
    ghanaPostGps: 'Ghana Post GPS Koodi',
    landmark: 'Baeɛ a Ɛbɛn Wo Fie',
    searchServices: 'Ɛdeɛn na ɛasɛe a wopɛ sɛ yɛsiesie ma wo nnɛ?',
    needNow: 'Mehwehwɛ Obi Seesei Ara',
    needNowSub: 'Pɔmpi repom, kanea rehyew, anaa mfididie asɛe ntem',
    planProject: 'Nhyehyɛe Adwuma Kɛseɛ',
    planProjectSub: 'POP ceiling, adan pente, taeles towe, akongua pata foforo',
    currencyGhs: 'GH₵',
    protectionFee: 'Fixly Sika Banbɔ (5%)',
    totalAgreed: 'Boɔ a Yapene So Pɛpɛɛpɛ',
    callOutFee: 'Nkɔ-hwɛ / Diagnostic Boɔ',

    // Actions
    accept: 'Gye Adwuma No',
    decline: 'Mprenpren Mentumi',
    iHaveArrived: 'Medu Fie Hɔ (GPS Akyerɛ)',
    diagnoseAndQuote: 'Hwehwɛ Mu & Kyerɛ Boɔ Pɔtee',
    approveQuote: 'Mepene Boɔ So · Hyɛ Aseɛ',
    materialsNeeded: 'Merekɔ Tɔ Nnoɔma',
    completeJob: 'Mewie Adwuma No (Fa Mfoni To So)',
    confirmSignOff: 'Mepene So Sɛ Adwuma Awie · Gyaa Sika',
    reportProblem: 'Kae Sɛ Ɛnyɛ · Sika Nsi Hɔ',
    sosButton: 'SOS AHOƆHIA BANBƆ',
    sosSub: 'Mewɔ asiane mu · Mia ha ma polisfoɔ ne Fixly mmɛgye wo',
    instantCashout: 'Gye Sika Kɔ MoMo Mu Seesei',
    listenVoice: 'Tie Nne Nkyerɛkyerɛmu',
    startVoiceRecording: 'Kasa Kyerɛkyerɛ Haw No Mu',
    stopVoiceRecording: 'Gyae Kasa No',
    voiceNuanceDetected: 'Yɛate Haw No Nnyegyeɛ Yie',
    speechToTextConfidence: 'Kasa No Pɛpɛɛpɛyɛ',

    // Statuses
    status_draft: 'Woresiesie Nkrataa',
    status_requested: 'Yɛrehwehwɛ Adwumayɛfoɔ a Ɔbɛn Wo...',
    status_matched: 'Yɛanya Adwumayɛfoɔ Pa',
    status_pro_en_route: 'Adwumayɛfoɔ No Repue Aba',
    status_arrived: 'Adwumayɛfoɔ No Adu Wo Fie',
    status_diagnosed: 'Boɔ Retwɛn Wo Mpenesoɔ',
    status_quote_approved: 'Woapene So · Adwuma Rekɔ So',
    status_in_progress: 'Adwuma Rekɔ So Pɛpɛɛpɛ',
    status_completed: 'Ofiewura Retwɛn Sɛ Ɔsɔ Hwɛ',
    status_hold_period: 'Sika Da Banbɔ Mu Nnɔnhwere 24',
    status_closed: 'Adwuma Awie · Woagye Wo Sika',
    status_disputed: 'Fixly Dwumadibea Resiesie Asɛm No',

    // Badges
    badge_ghana_card: 'Ghana Card Agina Mu Pɛpɛɛpɛ',
    badge_association_master: 'Opanin Pa Wɔ Adwuma Mu',
    badge_guarantor_backed: 'Ofiewura Gyina N’akyi',
    badge_insurance_pool: 'Nsiakyire Insurance Banbɔ',
    badge_super_fixer: 'Ɔsiesiefoɔ Pa (98% Ntetee)',
    badge_on_time_pro: 'Ɔba Berɛ Pɔtee Wɔ GPS So',

    // Voice Prompts
    voice_new_job: 'Woanya adwuma foforɔ a ɛbɛn wo. Hwɛ boɔ no ne akwansin no, na mia Gye Adwuma no ansa na sekend aduanan atwam.',
    voice_arrived: 'Woadu fie hɔ. Mepawokyew kyea ofiewura no na hwɛ haw no yie ansa na wode nnoɔma boɔ ato so.',
    voice_quote_sent: 'Wo nnoɔma ne adwumayɛ boɔ kɔ ma ofiewura no. Twɛn ma ɔnpene so ansa na wode hama ato ho.',
    voice_payment_held: 'Adwuma no awie pɛpɛɛpɛ. Wo sika da hɔ banbɔ mu, na yɛbɛgyaa ama wo wɔ nnɔnhwere aduonu anan akyi.',
    voice_offline_warning: 'Intanɛt nni hɔ seesei. Mfoni ne adwuma a woyɛe no akora baabi a ɛbɛkɔ ntɛm ara sɛ ntam gyae a.',
  },
  ga: {
    // App & Taglines
    appName: 'Fixly',
    appTagline: 'Nitsumɔlɔ ni baaba, nyɛkpatɛ hiɛ, ni o-shika he yɛ tswaa.',
    promiseBanner: 'Nitsumɔlɔi ni akwɛ mli jogbaŋŋ · Jra ntsɔɔ mli kpakpa · O-shika yɛ Escrow mli',

    // Roles
    clientRole: 'Shia Ntsɛ / Mɔ ni taoɔ saamo',
    proRole: 'Nitsumɔlɔ Kpakpa (Artisan)',
    opsRole: 'Sanegbaa kɛ Hwɛmɔ',
    switchRole: 'Tsake O-Gbɛjianɔ',
    currentRole: 'He ni oyɔɔ',

    // Nav & Common
    home: 'Shia',
    myJobs: 'Mi-Nitsumɔi',
    earnings: 'Shika Kotoku & Hetsɔɔ',
    trustProfile: 'Hemɔkɛyeli & Bɔ ni oyɔɔ',
    disputes: 'Sanegbaa kɛ Gbeenaa',
    badgesCenter: 'Badges kɛ Kpɛmɔ Wolo',
    offlineStatus: 'Intanɛt Gbɛ',
    online: 'Intanɛt Gbɛ Yɛ (Online)',
    patchy: 'Intanɛt Gbɛ Gbɔjɔ (2G)',
    offline: 'Intanɛt Gbɛ Bɛ (Offline)',
    ghanaPostGps: 'Ghana Post GPS Kood',
    landmark: 'He kpatoshi ni bɛŋkɛ',
    searchServices: 'Mɛni efite ni otaoɔ ni asaa ahã bo ŋmɛnɛ yɛ Ga mli?',
    needNow: 'Mitaoɔ Mɔ ko Amrɔ Nɛɛ',
    needNowSub: 'Nu gbɛ gbaa, la efite, loo nitsumɔ ko ni he hiaa amrɔ nɛɛ',
    planProject: 'Gbɛjianɔ Nitsumɔ Agbo',
    planProjectSub: 'POP tsɔɔle, tsu pɛntimɔ, tailis toomɔ, kɔɔts he tsɔɔmɔ',
    currencyGhs: 'GH₵',
    protectionFee: 'Fixly Shika Tswaa (5%)',
    totalAgreed: 'Jra Pɔtee ni Akpatɛ Hiɛ',
    callOutFee: 'Baakwɛ Jra',

    // Actions
    accept: 'Mɔ Nitsumɔ Lɛ',
    decline: 'Minyɛŋ Amrɔ Nɛɛ',
    iHaveArrived: 'Mibashɛ Shia (GPS Kpɛ)',
    diagnoseAndQuote: 'Kwɛ Mli & Kɛ Jra Ahã',
    approveQuote: 'Mkpɛtɛ Jra Lɛ Hiɛ · Je Shishi',
    materialsNeeded: 'Miya he nibii',
    completeJob: 'Migbe Nitsumɔ Lɛ Naa (Kɛ Mfoniri Hã)',
    confirmSignOff: 'Nitsumɔ Lɛ Hi · Gblamɔ Shika Lɛ',
    reportProblem: 'Kɛɛ Ehiii · Tsimɔ Shika Lɛ',
    sosButton: 'SOS KPOƆMƆ GBƐ',
    sosSub: 'Miyɛ oshara mli · Mia biɛ koni polis kɛ Fixly aba',
    instantCashout: 'Gblamɔ Shika Kɛyabote MoMo Mli',
    listenVoice: 'Bo Gbee Tsɔɔmɔ Lɛ Toi',
    startVoiceRecording: 'Kɛ O-Gbee Tsɔɔ Nɔ Ni Efite',
    stopVoiceRecording: 'Gblamɔ Gbee Lɛ',
    voiceNuanceDetected: 'Anu Nɔ Ni Efite Lɛ Jogbaŋŋ',
    speechToTextConfidence: 'Bɔ Ni Gbee Lɛ Tsɔɔ Pɛpɛɛpɛ',

    // Statuses
    status_draft: 'Wolo Toomɔ Mli',
    status_requested: 'Aatao Nitsumɔlɔ ni bɛŋkɛ bo...',
    status_matched: 'Ana Nitsumɔlɔ Kpakpa',
    status_pro_en_route: 'Nitsumɔlɔ Lɛ Miiba',
    status_arrived: 'Nitsumɔlɔ Lɛ Ebashɛ Shia',
    status_diagnosed: 'Jra Lɛ Mɛɔ Okpɛlɛmɔ',
    status_quote_approved: 'Okpɛlɛ Nɔ · Nitsumɔ Lɛ Yaahiɛ',
    status_in_progress: 'Atsuɔ Nitsumɔ Lɛ Amrɔ Nɛɛ',
    status_completed: 'Shia Ntsɛ Lɛ Miikwɛ',
    status_hold_period: 'Shika Lɛ Yɛ Tswaa Mli Ŋmli 24',
    status_closed: 'Nitsumɔ Lɛ Egbe Naa · Ashika Emɔ Bo',
    status_disputed: 'Fixly Huɛmɔlɔi Miisaa Sane Lɛ',

    // Badges
    badge_ghana_card: 'Ghana Card Kpɛ Mli Pɛpɛɛpɛ',
    badge_association_master: 'Nitsumɔlɔ Onukpa Kpakpa',
    badge_guarantor_backed: 'Mɔ Ko Damɔ N’akyi',
    badge_insurance_pool: 'Insurance Buulɔ Tswaa',
    badge_super_fixer: 'Saamolɔ Kpakpa (98% Klɛŋklɛŋ)',
    badge_on_time_pro: 'Ebashɛ Nɔmɔ Pɔtee GPS',

    // Voice Prompts
    voice_new_job: 'Ona nitsumɔ hee ni bɛŋkɛ bo. Kwɛ jra lɛ kɛ gbɛ lɛ, ni omia Mɔ Nitsumɔ Lɛ dani sekend 40 abaaho.',
    voice_arrived: 'Obashɛ shia lɛ. Mipao o-fai, ŋaa shia ntsɛ lɛ ni okwɛ nɔ ni efite jogbaŋŋ dani obake jra.',
    voice_quote_sent: 'Ojra lɛ eyashɛ shia ntsɛ lɛ ŋɔɔ. Mɛ kɛyashi ekpɛlɛ nɔ dani oje nitsumɔ shishi.',
    voice_payment_held: 'Nitsumɔ lɛ egbe naa jogbaŋŋ. Oshika yɛ tswaa mli, abaahã bo yɛ ŋmliti 24 amli.',
    voice_offline_warning: 'Intanɛt bɛ amrɔ nɛɛ. Mfoniri kɛ nitsumɔ ni otsu lɛ eto he ko kɛmɛ intanɛt gbɛ.',
  },
  ewe: {
    // App & Taglines
    appName: 'Fixly',
    appTagline: 'Dɔwɔla si ava, le ga si dzi miewɔ ɖeka, eye wò ga le takpɔkpɔ me.',
    promiseBanner: 'Dɔwɔla dodowo · Ga maxɔgbɔ · Ga le escrow takpɔkpɔ te',

    // Roles
    clientRole: 'Aƒetɔ / Dɔdola',
    proRole: 'Dɔwɔla Bibia',
    opsRole: 'Kplɔlawo & Nyadrodrola',
    switchRole: 'Trɔ Dɔwɔƒe',
    currentRole: 'Afisi Nèle',

    // Nav & Common
    home: 'Aƒe',
    myJobs: 'Nye Dɔwo',
    earnings: 'Ga Kotoku & Ga Xɔxɔ',
    trustProfile: 'Kakaɖedzi & Dzesiwo',
    disputes: 'Nyahehe & Dzraɖo',
    badgesCenter: 'Kakaɖedzi Dzesiwo',
    offlineStatus: 'Intanɛt',
    online: 'Intanɛt Le Dɔwɔm (Online)',
    patchy: 'Intanɛt Gbɔdzɔ (2G)',
    offline: 'Intanɛt Meli O (Offline)',
    ghanaPostGps: 'Ghana Post GPS Dzesi',
    landmark: 'Xɔ si gblɔe kpuie',
    searchServices: 'Nukae gblẽ si nàdi be woadzra ɖo egbe le Accra?',
    needNow: 'Medi Ame aɖe Fifia',
    needNowSub: 'Tsi le dudu, dzo le bibi, alo kuxi kaba le aƒe me',
    planProject: 'Dɔ Gã Wɔwɔ',
    planProjectSub: 'POP ceiling, aƒe pɛntim, tailis toto, zikpui dzraɖo',
    currencyGhs: 'GH₵',
    protectionFee: 'Fixly Ga Takpɔkpɔ (5%)',
    totalAgreed: 'Ga Blibo si Dzi Miewɔ Ðeka',
    callOutFee: 'Vava kple Kpɔkpɔ Fe',

    // Actions
    accept: 'Xɔ Dɔ la',
    decline: 'Nyemate Ŋu O',
    iHaveArrived: 'Meɖo Aƒeme (GPS Kpɔe)',
    diagnoseAndQuote: 'Kpɔ Eme & Gblɔ Fe',
    approveQuote: 'Lɔ̃ Ðe Fe Dzi · Dze Etsɔ',
    materialsNeeded: 'Meyi Nuƒleƒe',
    completeJob: 'Mewu Dɔ Nu (Tsɔ Foto De Eme)',
    confirmSignOff: 'Dɔ la Nyo · Ðe Ga la Fia',
    reportProblem: 'Kuxi Li · Tɔ Te Ga la',
    sosButton: 'SOS KPOƆMƆ KABA',
    sosSub: 'Afɔku le tepe · Mia afisia na kpovitɔwo',
    instantCashout: 'Xɔ Ga la le MoMo me Fifia',
    listenVoice: 'Se Gbe la ƒe Nufiame',
    startVoiceRecording: 'Tsɔ Wò Gbe Gblɔ Kuxi la',
    stopVoiceRecording: 'Tɔ Te Gbeɖiɖi la',
    voiceNuanceDetected: 'Gbe la Kpɔ Kuxi la Pɛpɛɛpɛ',
    speechToTextConfidence: 'Gbeŋɔŋlɔ Ƒe Kakaɖedzi',

    // Statuses
    status_draft: 'Wole Agbalẽ Dzram Ðo',
    status_requested: 'Wole Dɔwɔla Dim Le Wò Gbɔ...',
    status_matched: 'Wokpɔ Dɔwɔla Nyui Aɖe',
    status_pro_en_route: 'Dɔwɔla la Le Mɔ Dzi Gbɔna',
    status_arrived: 'Dɔwɔla la Ðo Aƒeme',
    status_diagnosed: 'Wole Fe Lɛ Dzom',
    status_quote_approved: 'Èlɔ̃ Ðe Edzi · Dɔ Le Edzi',
    status_in_progress: 'Dɔwɔwɔ Le Edzi Nyuie',
    status_completed: 'Aƒetɔ Le Edzi Kpɔm',
    status_hold_period: 'Ga Le Takpɔkpɔ Me Gaƒoƒo 24',
    status_closed: 'Dɔ la Wu Nu · Ga la Va',
    status_disputed: 'Fixly Le Nya la Kpɔm',

    // Badges
    badge_ghana_card: 'Ghana Card Biometric Kpɔɖeŋu',
    badge_association_master: 'Dɔwɔlagã Bibia',
    badge_guarantor_backed: 'Ame Bibia Tsɔ Ŋkɔ Ðo Ete',
    badge_insurance_pool: 'Insurance Takpɔkpɔ',
    badge_super_fixer: 'Dzraɖola Gã (98% Gbãtɔ)',
    badge_on_time_pro: 'Ava Ɣeyiɣi Dzi GPS',

    // Voice Prompts
    voice_new_job: 'Dɔ yeye va ɖo gbɔwò. Kpɔ home kple mɔzɔzɔ, eye nàxɔ dɔ la le sekend blaene me.',
    voice_arrived: 'Èɖo aƒeme. Do gbe na aƒetɔ la eye nàkpɔ kuxi la nyuie hafi agblɔ nuƒle fe.',
    voice_quote_sent: 'Fe agbalẽ la yi na aƒetɔ la. Lalam be wòalɔ̃ hafi nàdze dɔ gɔme.',
    voice_payment_held: 'Dɔ la wu nu nyuie. Wò ga le takpɔkpɔ me, woatsɔe na wò le gaƒoƒo 24 megbe.',
    voice_offline_warning: 'Intanɛt mele dɔwɔm o. Wò foto kple dɔwɔwɔ dzra ɖo be ne mɔ va la wòayi.',
  },
  hausa: {
    // App & Taglines
    appName: 'Fixly',
    appTagline: 'Kwararren mai gyara da zai zo a farashin da aka amince, tare da kudin ka cikin tsaro.',
    promiseBanner: 'Kwararrun ma’aikata · Farashi mai tsayawa · Kudin ka a cikin Escrow',

    // Roles
    clientRole: 'Mai Gida / Abokin Ciniki',
    proRole: 'Kwararren Mai Sana’a (Pro)',
    opsRole: 'Gudanarwa & Sasantawa',
    switchRole: 'Sauya Matsayi',
    currentRole: 'Matsayin Yanzu',

    // Nav & Common
    home: 'Gida',
    myJobs: 'Ayyukana',
    earnings: 'Asusun Kudi & Fitarwa',
    trustProfile: 'Bayanin Dogaro',
    disputes: 'Sasantawa & Neman Hakki',
    badgesCenter: 'Alamomin Tabbatarwa',
    offlineStatus: 'Yanayin Sadarwa',
    online: 'Akwai Sadarwa (Online)',
    patchy: 'Sadarwa Mai Rarrafe (2G)',
    offline: 'Babu Sadarwa (Offline)',
    ghanaPostGps: 'Ghana Post GPS Lambar Wuri',
    landmark: 'Babban Wurin Da Aka Sani',
    searchServices: 'Me ya lalace da kake son a gyara a Accra yau?',
    needNow: 'Ina Son Mai Gyara Yanzu',
    needNowSub: 'Yoyon ruwa, tartsatsin wuta, ko matsalar da ake son gyara cikin minti 30',
    planProject: 'Tsara Babban Aiki',
    planProjectSub: 'Silingin POP, fenti, tiles, gyaran kujeru tare da biyan kudi mataki-mataki',
    currencyGhs: 'GH₵',
    protectionFee: 'Kariyar Fixly Escrow (5%)',
    totalAgreed: 'Adadin Farashin Da Aka Amince',
    callOutFee: 'Kudin Zuwa Dubawa',

    // Actions
    accept: 'Karbi Aikin',
    decline: 'Ba Zan Iya Ba Yanzu',
    iHaveArrived: 'Na Isa Wurin (Tabbatar da GPS)',
    diagnoseAndQuote: 'Duba & Ba Da Farashin Kayan Gyara',
    approveQuote: 'Amince Da Farashi · Fara Aiki',
    materialsNeeded: 'Zan Je Shago Siyan Kaya',
    completeJob: 'Kammala Aiki (Sa Hoton Bayan Gyara)',
    confirmSignOff: 'Aiki Ya Yi Kyau · Saki Kudin',
    reportProblem: 'Akwai Matsala · Tsayar Da Kudin',
    sosButton: 'KIRAN GAUGAVA (SOS)',
    sosSub: 'Ina cikin hadari · Danna domin jami’an tsaro da Fixly su kawo dauki',
    instantCashout: 'Tura Kudi Zuwa MoMo Nan Take',
    listenVoice: 'Saurari Umarni Da Murya',
    startVoiceRecording: 'Bayyana Matsalar Da Muryarka',
    stopVoiceRecording: 'Tsaya Da Daukar Murya',
    voiceNuanceDetected: 'An Gano Matsalar Da Kyau',
    speechToTextConfidence: 'Daidaiton Magana',

    // Statuses
    status_draft: 'Ana Shirya Bayani',
    status_requested: 'Ana Neman Mai Gyara Kusa Da Kai...',
    status_matched: 'An Samu Kwararren Mai Gyara',
    status_pro_en_route: 'Mai Gyara Na Kan Hanya',
    status_arrived: 'Mai Gyara Ya Isa Gidan Ka',
    status_diagnosed: 'Farashin Gyara Na Neman Amincewa',
    status_quote_approved: 'An Amince · Ana Yin Aiki',
    status_in_progress: 'Ana Kan Yin Aiki Yanzu',
    status_completed: 'Mai Gida Na Dubawa',
    status_hold_period: 'Kudin Na Karkashin Tsaro Na Sa’o’i 24',
    status_closed: 'An Kammala Aiki · An Saki Kudi',
    status_disputed: 'Fixly Na Sasantawa Kan Aikin',

    // Badges
    badge_ghana_card: 'Ghana Card Biometric Tabbatacce',
    badge_association_master: 'Babban Kwararren Ma’aikaci',
    badge_guarantor_backed: 'Mai Shaida Yana Tsaye A Baya',
    badge_insurance_pool: 'Inshora Mai Kare Kudin Ka',
    badge_super_fixer: 'Gwani Mai Gyara (98% Aikin Farko)',
    badge_on_time_pro: 'Mai Zuwa A Kan Lokaci GPS',

    // Voice Prompts
    voice_new_job: 'An samu sabon aiki kusa da kai. Duba farashi da nisa, sannan ka danna karba kafin dakika 40 su cika.',
    voice_arrived: 'Ka isa wurin aikin. Don Allah gaisa da mai gida kuma ka bincika matsalar sosai kafin saka kudin kaya.',
    voice_quote_sent: 'An tura farashin kayan aiki ga mai gida. Ka jira ya amince kafin ka fara aiki.',
    voice_payment_held: 'An kammala aikin cikin nasara. Kudinka na cikin tsaro, za a sake maka su bayan sa’o’i 24.',
    voice_offline_warning: 'Babu sadarwa a yanzu. Hotunanka da bayanin aikin an ajiye su, za a tura su da zarar an samu intanet.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  speakPrompt: () => {},
  isSpeaking: false,
  stopAudio: () => {},
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('fixly_lang') as LanguageCode;
    return saved && ['en', 'twi', 'ga', 'ewe', 'hausa'].includes(saved) ? saved : 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('fixly_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const speakPrompt = (key: string) => {
    try {
      const text = t(key);
      if (!window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (err) {
        // audio context initial gesture restriction pass
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.lang = language === 'en' ? 'en-GH' : 'en-GB';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Audio prompt synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speakPrompt,
        isSpeaking,
        stopAudio,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
