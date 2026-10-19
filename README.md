# Sanjeevani Setu v2 🌿

> **Technology that cares for elders.** A dignified, consent-first elder-care coordination platform featuring phone-based spoken reminders, live medicine countdown clocks, 4-step elder text increase meter, local chemist doorstep ordering, nearby doctor tele-consults, and secure family health lockers.

---

## 🌟 Key Highlights in Sanjeevani Setu v2

### 🔍 Interactive Text Increase Meter (बुजुर्गों के लिए टेक्स्ट साइज मीटर)
- **4 Granular Scale Levels**:
  - `Level 1 (100%)`: Standard balanced scale for everyday reading.
  - `Level 2 (120%)`: Enhanced medium-large text for comfortable reading.
  - `Level 3 (140%)`: Extra-large scale for low vision assistance.
  - `Level 4 (160% Max)`: Maximum legibility scale designed specifically for 60+ seniors with presbyopia.
- **Dual Accessibility Access**:
  - Available right in the main Navbar (`A-`, 4-step visual LED meter gauge, `A+`).
  - Persistent floating quick-toggle in the bottom-right corner for effortless adjustment from anywhere on the page.
  - Preferences persist across sessions via `localStorage`.

### 💊 Medicine Clock & Digital Countdown Timer
- Live countdown ticker showing exact hours, minutes, and seconds remaining until the next scheduled dose.
- 1-tap confirmation loop (*Mark Next Dose As Taken*) to ensure seniors never second-guess routines.
- Optional voice read-aloud icon for dosage instructions and food timing.

### 🏪 Local Chemist & Nearby Geriatric Doctors
- Instant prescription refills and doorstep medicine delivery coordination.
- Appointment scheduling for Home Visits, Clinic visits, and Phone consultations.

### 🗄️ Consent-First Health Vault & Voice Studio
- Centralized medical records accessible to trusted family members.
- Spoken Hindi/English IVR phone reminder customizations.
- 1-Tap SOS Emergency Broadcast dialog.

---

## 📱 Full Responsiveness & Device Ergonomics

The application is thoroughly responsive across every viewport and device category:
- **Mobile Viewports (320px – 480px)**: iPhone SE, Android phones, compact viewports with zero horizontal clipping, responsive countdown tiles, 52px touch targets, and slide-out navigation.
- **Tablets & Laptops (640px – 1024px)**: Adaptive grids, side-by-side matrices, and fluid modals.
- **Desktop & Widescreen (1280px+)**: Multi-column architecture and side-by-side voice simulation studio.

---

## 🚀 How to Execute in Any Private Repository

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Clone the Repository
```bash
git clone <your-private-repo-url>
cd setu
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the URL printed in your console). The dev server is configured with `--host=0.0.0.0` for local network / container access.

### 5. Build for Production / GitHub Pages
```bash
npm run build
```
This compiles the production assets to `./dist` and creates a self-contained `./standalone.html` file that can be opened directly without a web server.

---

## 🌟 Core Features Overview

1. **Care Routine Medicine Clock**:
   - Live digital countdown timer to the next scheduled dose.
   - One-tap "Mark as Taken" tracking.
   - Customizable schedule (Morning, Afternoon, Evening, Night).

2. **Neighborhood Chemist & Doctor Grid**:
   - Order prescription medicines with doorstep delivery options.
   - Safe in-browser simulation of chemist WhatsApp and doctor call dispatches.

3. **Consent-First Medical History Locker**:
   - Secure digital vault for prescriptions, discharge summaries, and lab reports.
   - Elder Sharing Master Switch: pause or resume family sharing with one tap.

4. **Caregiver Voice & Message Studio**:
   - Customizable spoken Hindi/English scripts and SMS templates.
   - Live browser speech synthesis preview.

5. **Transparent Subscription Tiers**:
   - Seva (Free), Family Bridge, and Concierge 360 plans.

6. **Elder Dignity SOS**:
   - 5-second countdown with an immediate cancel button to avoid false alarms.

---

## 📄 License
Apache-2.0
