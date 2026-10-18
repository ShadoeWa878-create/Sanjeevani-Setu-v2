# Phone-Based Reminders for Sanjeevani Setu

An elder-dignity focused voice call and SMS reminder delivery feature for Sanjeevani Setu, enabling older adults to receive vital medication and doctor appointment alerts without needing to navigate modern smartphone notifications or install mobile apps.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following implementation specifications have been confirmed based on user feedback:

- **Showcase Placement**: Feature card 05 will be introduced in "The Architecture of Care" section, directly accompanied by a dedicated interactive phone-reminder simulator showcase section immediately below the architecture list.
- **One-Tap Presets**: Presets included for rapid testing: "Morning Blood Pressure", "Evening Night Tablet", and "Doctor Appointment Consultation".
- **Spoken Voice Simulation**: Full Web Speech API speech synthesis integration (`window.speechSynthesis`) allowing elders and caregivers to press "Listen to Spoken Call" to hear how a soothing, respectful voice prompt sounds in real time.
- **Backend Architecture Notice**: Includes explicit `// TODO` architectural notes specifying integration with cloud telephony providers (Twilio / Exotel / WhatsApp Business Cloud API) and scheduled job runners.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges digital caregiver scheduling with accessible phone delivery. A caregiver or elder registers a contact number once and selects their preferred reception mode: **Spoken Phone Call** or **Plain High-Contrast SMS**. At the scheduled time, the system places an automated voice call or sends an easy-to-read text message.
- **Target Audience / Persona**: Older adults (60+) who experience friction with touchscreen notifications, app badges, or complex smartphone interfaces, alongside remote family caregivers who need certainty that reminders are actively heard and acknowledged.
- **Key Value**: Respects elder familiarity with a traditional ringing phone, preserves dignity, guarantees high comprehension, and requires zero smartphone app proficiency on the elder's side.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Feature Discovery**: Visitors browse "The Architecture of Care" and discover card **05. Phone-Based Reminders**, illustrating the principle of zero-friction phone delivery.
2. **Interactive Telephony Simulator**: 
   - User inputs a 10-digit mobile number (with auto-formatting and validation).
   - User selects reception mode: `Spoken Phone Call` vs. `Plain SMS Text`.
   - User can pick one of the quick test presets (e.g., *Blood Pressure Tablet 8:00 AM*, *Night Tablet 9:00 PM*, *Doctor Appointment*) or type a custom note.
3. **Live Script & Visual Preview**:
   - **Phone Call View**: Displays a simulated incoming phone screen with caller identification (*Sanjeevani Setu Care*), real-time call dialogue transcript, and an interactive "Listen to Call (Voice Demo)" button using browser speech synthesis with play/stop toggle.
   - **SMS Text View**: Displays a high-contrast SMS message card with clear timestamps, large 18px text, and clean high-legibility formatting.
4. **Caregiver Setup Confirmation State**: A simulated "Save Reminder Preference" action that confirms setup with high-contrast accessibility feedback without page reloads.

#### Visual Identity & Theme
- **Color Tokens**:
  - Background Canvas: Deep heritage teal `#12302F` with the signature 54px subtle grid overlay (`linear-gradient(rgba(241,232,214,.04))`).
  - Typography & Accents: Warm cream `#F1E8D6` with luminous soft saffron `#F4B183` accents for highlights, active tabs, and call-to-actions.
  - Surface Containers: Translucent dark emerald `#163938` / hairline borders (`rgba(241,232,214,0.12)`).
- **Typography**:
  - Headings: `Caladea` serif for graceful, respectful, and dignified tone.
  - Body & Form Controls: `Nunito Sans` with minimum 16px body font size and 18px+ preview text for optimal readability by older adults.
- **Accessibility & 60+ Ergonomics**:
  - Touch targets $\ge 48\text{px}$ for all buttons and interactive tabs.
  - Minimum 4.5:1 WCAG AAA compliant contrast across all text elements.
  - Generous padding, unambiguous active focus rings, and screen-reader `aria-live` regions for live preview updates.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Interactive Telephony Simulator vs. Mock Backend**
  - *Chosen Approach*: Pure client-side interactive state with Web Speech Synthesis and dynamic live preview.
  - *Why*: Enables instant evaluation and hosting directly on static GitHub Pages (`https://shadoewa878-create.github.io/sanjeevani-setu/`) without requiring server provisioning or live telephony API balance.
  - *Alternatives Considered*: Serverless Cloud Run webhook or Twilio trial API (rejected because GitHub Pages is static and external SMS APIs require SMS regulatory sender verification/DND whitelist).

- **Decision 2: Section Hierarchy & Placement**
  - *Chosen Approach*: Seamless dual presence: Item 05 in the numbered architecture grid (`The Architecture of Care`) linked directly to a dedicated interactive laboratory section (`Interactive Simulator`).
  - *Why*: Satisfies the need for architectural continuity while giving the rich interactive preview ample horizontal breathing room for both mobile and desktop screens.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Sanjeevani Setu Single-Page App                 │
│                                                                        │
│  ┌────────────────┐   ┌─────────────────┐   ┌───────────────────────┐  │
│  │   Navigation   │   │  Hero & Concept │   │ Architecture of Care  │  │
│  │ (3-Zone Clean) │   │ (Two Sides One) │   │ Cards 01 - 05         │  │
│  └────────────────┘   └─────────────────┘   └──────────┬────────────┘  │
│                                                        │               │
│                                                        ▼               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           Phone-Based Reminders Interactive Simulator            │  │
│  │                                                                  │  │
│  │   ┌───────────────────────────┐   ┌───────────────────────────┐  │  │
│  │   │      Controls Panel       │   │    Live Dynamic Preview   │  │  │
│  │   │  - Phone Input & Format   │   │  - Call Script / Speech   │  │  │
│  │   │  - Call / SMS Mode Radio  │──▶│  - High-Contrast SMS View │  │  │
│  │   │  - Quick Medicine Presets │   │  - Speech Synthesis Audio │  │  │
│  │   │  - Test Reminder Trigger  │   │  - Elder Sim Feedback    │  │  │
│  │   └───────────────────────────┘   └───────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                        │               │
│  ┌─────────────────────────────────────────────────────▼────────────┐  │
│  │           Connect & Footer (Disclaimer & GitHub Pages)           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### State & Event Model
- `phoneNumber`: string with Indian/international phone mask validation (`+91` / 10 digits).
- `deliveryMode`: `'call' | 'sms'`.
- `selectedPreset`: `'bp' | 'night' | 'doctor' | 'custom'`.
- `customMedicineText`: string with real-time preview binding.
- `isSpeaking`: boolean state tracking browser speech synthesis playback.
- `simulatedTriggerState`: `'idle' | 'simulating' | 'active' | 'sent'`.

#### Telephony Backend Roadmap (`// TODO` Block)
- Telephony Dispatch Engine: Node.js worker with Redis queue or Google Cloud Tasks.
- Service Integrations:
  - Twilio Voice API (`twiml <Say voice="Polly.Aditi">`) or Exotel IVR for regional Indian languages (Hindi, Marathi, Gujarati, Tamil, etc.).
  - Twilio Programmable SMS / Gupshup / WhatsApp Business API for plain text delivery.
  - Elder Consent Registry: Webhook handling keypad press (`Press 1 to confirm tablet taken`) for caregiver confirmation loop.
