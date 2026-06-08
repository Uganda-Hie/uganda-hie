# Uganda HIE — Public Health Intelligence Platform
**BoU@60 Hackathon · Bank of Uganda · June 2026**

> Connecting fragmented patient records, facility
> reporting, and MoH disease intelligence across Uganda.

---

## 🌐 Live Demo
**https://cool-smakager-893ca4.netlify.app/moh**

---

## 🎯 What we built

A national Health Information Exchange (HIE) and
Ministry of Health Command Center demonstrating how
Uganda's fragmented health data can be unified into
a single, near-real-time intelligence platform.

**The problem:** Uganda has 7,000+ health facilities
reporting through disconnected systems. The Ministry
of Health cannot see disease hotspots in real time,
stock-outs go undetected until facilities run dry,
and patient records don't follow patients across facilities.

**Our solution:** A full-stack HIE demo with 6 role
portals showing exactly how the system works for every
stakeholder — from a remote nurse in Kaabong to the
Chief Medical Officer in Kampala.

---

## 🚀 Demo Script (Judge walkthrough — ~3 minutes)

### Press keys 1-6 to switch roles instantly

**Role 1 — MoH Analyst** `Press 1`
- National Snapshot: animated KPIs, disease selector
- Switch Scenario to "Malaria Surge — North" →
  watch AI brief update dramatically
- Disease Map → select Malaria → Show on Map →
  hover over Arua (critical, dark red) →
  click for district detail

**Role 2 — Facility Nurse** `Press 2`
- Facility overview: Karenga HCIII, Kaabong District
- Stock status: critical ACT supply warning
- Submit Daily Report → fill malaria cases →
  submit → watch sync animation confirm
  "Synced to MoH DHIS2 national aggregate"

**Role 3 — Doctor** `Press 3`
- Search "Otim" → Daniel Otim (emergency access required)
- Click patient → locked record
- Request Emergency Access → type reason → confirm
- Full clinical record reveals with red emergency banner
- Show: allergies, medications, lab results, referral history

**Role 4 — Patient** `Press 4`
- Aciro Grace's health record
- Navigate to Sharing → show consent controls
- Revoke access from a facility → confirm dialog

**Role 5 — Insurer** `Press 5`
- Claims inbox → filter by Pending
- Click a claim → approve it →
  watch status badge update live on the list

**Role 6 — Admin/DPO** `Press 6`
- Audit log: flagged emergency accesses in red
- Show the Otim emergency access entry

---

## 🏗️ Architecture

This is a front-end demo with mock API routes.
No real patient data is used or stored anywhere.

```
Next.js 16 (App Router)
├── /moh          MoH Command Center (5 screens)
├── /facility     Facility nurse portal (2 screens)
├── /doctor       Clinical officer portal (2 screens)
├── /patient      Patient portal (2 screens)
├── /insurer      Insurance claims portal
└── /admin/audit  System audit log
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Charts | Recharts |
| Map | react-simple-maps + D3 |
| Animation | Framer Motion |
| State | Zustand |
| Deploy | Netlify |

---

## 📊 Data

Synthetic seed data covering:
- 50 Uganda districts with real geography
- 100 health facilities (HCII → NRH)
- 10 disease categories with weekly surveillance data
- 120 synthetic patient records
- 500 weekly disease records across districts
- 1,200 stock inventory snapshots

All data is synthetic. No real patient records,
phone numbers, or clinical data.

---

## 👥 Team

| Name | Role |
|---|---|
| Ayodele John Oluwaseyi | Full-Stack Lead — Frontend, UI/UX, Map, Architecture |
| Moses [Last Name] | [Role — Backend, Data, Clinical Logic] |

ISBAT University, Kampala · AltSchool Africa

---

## 🏥 How it complements DHIS2

This HIE is not a DHIS2 replacement. It sits alongside
Uganda's existing DHIS2/eHMIS infrastructure as:
- A patient-level shared health record layer
- A real-time facility-to-MoH intelligence feed
- A consent-managed patient sharing platform
- A claims verification bridge for insurers

DHIS2 handles aggregate reporting.
This HIE handles individual patient journeys and
cross-facility coordination.

---

## 🧑‍💻 Local Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

---

*Built in 48 hours for the Bank of Uganda BoU@60
Hackathon — June 2026*
