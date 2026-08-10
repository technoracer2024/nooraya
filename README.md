# Nooraya — Safe in Silence 🛡️✨

**Nooraya** is a premium, jewelry-first personal safety system designed to empower users without compromising on aesthetics. This repository contains the V2 Software Prototype (Web/Mobile App).

The system architecture is designed to support a physical ESP32-powered capacitive touch bracelet in the future. For the MVP, a software-based "Virtual Bracelet" simulates the hardware trigger.

---

## 🌟 Key Features

### 👤 User Mode (The Wearer)
- **Role-Based Authentication**: Secure onboarding with up to 5 Trusted Contacts.
- **Global SOS Trigger**: A discreet, 3-second hold action available across the entire app that guarantees an immediate emergency trigger.
- **Smart Route Tracking**: Single-tap GPS tracking that records paths on an interactive map and learns average travel times.
- **Automated Check-Ins**: A countdown timer that automatically alerts guardians if the user fails to confirm their safety.
- **Quick Alerts**: Pre-defined, one-tap safety messages (e.g., "I'm in a cab, sharing location") dispatched silently.
- **Premium Aesthetics**: Built with a "jewelry-first" design philosophy using glassmorphism, dynamic animations, and luxury typography (Cormorant Garamond).

### 🛡️ Guardian Portal (The Trusted Contact)
- **Code-Based Access**: Guardians access the portal using a dynamically generated `Guardian Access Code` tied to their phone number.
- **Live Monitoring Dashboard**: A dark-themed command center providing real-time status updates (`Safe`, `Caution`, `Emergency`).
- **Interactive Tracking Map**: Visualizes the user's GPS coordinates in real-time when tracking is active. Includes a quick-recenter button to instantly snap back to the user's location.
- **High-Visibility Emergency State**: Immediate actionable alerts allowing the guardian to call the user, view their exact coordinates, or review silent tap communications.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 (via Vite)
- **Type System**: TypeScript (100% strictly typed)
- **Styling**: Tailwind CSS v3.4 + Custom Design Tokens
- **State Management**: Zustand (with persistent cross-tab synchronization)
- **Mapping**: React Leaflet & OpenStreetMap (Free, no API keys required)
- **Icons**: Lucide React
- **Backend / Communication**: Vercel Serverless Functions + Twilio API (SMS/Voice Calls)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/technoracer2024/nooraya.git
   cd nooraya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:605` (or the port specified by Vite).*

---

## ☁️ Deployment (Vercel + Twilio)

To enable real-world SMS notifications and automated phone calls, the app must be deployed to Vercel and connected to a Twilio account.

1. **Deploy to Vercel**: Push the repository to GitHub and connect it to your Vercel account.
2. **Configure Twilio**: Sign up for Twilio and obtain your credentials.
3. **Environment Variables**: Add the following keys to your Vercel Project Settings:
   - `VITE_TWILIO_ACCOUNT_SID` & `TWILIO_ACCOUNT_SID`
   - `VITE_TWILIO_AUTH_TOKEN` & `TWILIO_AUTH_TOKEN`
   - `VITE_TWILIO_PHONE_NUMBER` & `TWILIO_PHONE_NUMBER`

*(See the `.env.example` file for more details).*

---

## 📁 Project Structure

```
src/
├── api/                  # Vercel Serverless Functions (Twilio)
├── components/           # Reusable UI elements (Sidebar, Map, SOS Button)
├── lib/                  # Utilities and Twilio SDK integration
├── pages/                # Main route views (User & Guardian Modes)
├── store/                # Zustand global state (useStore.ts)
├── App.tsx               # Application Router
└── index.css             # Tailwind config and premium design tokens
```

---

## 🎨 Design System

The application strictly adheres to the Nooraya branding guidelines:
- **Primary Colors**: `Nooraya Ivory` (#fff9ef), `Champagne Gold` (#d4af37), `Charcoal` (#1c1c1c).
- **Alert Colors**: `Emergency Red` (#c1121f).
- **Typography**: *Cormorant Garamond* for display/headings, *Inter* for body text.

---

*Nooraya — Safe in Silence.*
