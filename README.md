# Setu (Sanjeevani Setu) 🌿

> **Technology that cares for elders.** A dignified, consent-first elder-care coordination platform featuring phone-based spoken reminders, live medicine countdown clocks, local chemist doorstep ordering, nearby doctor tele-consults, and secure family health lockers.

---

## 🌟 Core Features

- 📞 **Phone-Based Reminders**:
  - Delivers voice call reminders and clean, large-text SMS messages.
  - Zero app navigation or smartphone proficiency required by older adults.
  - Interactive Voice Studio with Web Speech API browser voice playback.

- ⏰ **Medicine Clock & Countdown Timer**:
  - Real-time digital clock showing hours, minutes, and seconds until the next upcoming dose.
  - One-tap "Mark Dose as Taken" confirmation loop with instant caregiver sync.
  - Add and manage custom morning, afternoon, evening, and night medication schedules.

- 💊 **Local Care & Pharmacy Ordering**:
  - Quick contact directory for neighborhood chemists (Apollo, MedPlus, local Sanjeevani pharmacies).
  - 1-tap WhatsApp and phone prescription refills with doorstep delivery options.
  - Directory of geriatric specialists and family doctors with direct clinic dialing and consultation bookings.

- 🔒 **Consent-First Medical History Locker**:
  - Digital records vault for prescriptions, metabolic lab reports, discharge summaries, and vaccine cards.
  - Elder Consent Master Switch: Elders can pause or enable family caregiver sharing anytime with one tap.

- 💎 **Transparent Subscription Plans**:
  - Tiered plans (Seva Free, Family Bridge, Concierge 360) with monthly and annual billing.

- 🚨 **Elder Safety SOS**:
  - 5-second cancelable emergency broadcast modal to avoid accidental panic triggers.
  - High-contrast A / A+ text enlargement toggle for 60+ visual ergonomics.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production / GitHub Pages
```bash
npm run build
```
The production bundle is compiled to `./dist` with relative paths (`base: './'`), ready for direct deployment on GitHub Pages.

---

## 🌐 Deploy to GitHub Pages

1. In your GitHub repository settings, navigate to **Settings** > **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** (or deploy directly from the `gh-pages` branch using the `dist/` folder).
3. The site will be live at `https://<your-username>.github.io/setu/`.

---

## 📄 License
Apache-2.0
