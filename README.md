# Khanan Drishti

AI-enabled smart governance and compliance monitoring for Indian coal mines.

Khanan Drishti is designed to bridge the gap between field-level evidence and executive oversight. The platform connects safety inspections, statutory obligations, risk analysis, corrective actions, and management visibility into a unified digital dashboard.

## From Ground to Governance

One observation. One evidence trail. One accountable workflow.

```mermaid
flowchart TD
    A([Field Inspector]) --> B[Geo-tagged Evidence]
    B --> C[AI Verification]
    C --> D[Regulation / Obligation]
    D --> E[Risk Analysis]
    E --> F[CAPA]
    F --> G[SLA & Escalation]
    G --> H[Management Dashboard]
    H --> I([Compliance Report])
    
    style A fill:#1A2028,stroke:#F0A202,color:#EDE6DA
    style I fill:#1A2028,stroke:#F0A202,color:#EDE6DA
```

---

## Overview

Managing compliance across multiple coal mining operations is a complex challenge. Traditional processes often rely on fragmented information, paper-based inspection reports, and isolated spreadsheets. This leads to delayed visibility into critical safety risks, difficulty in tracking open corrective actions, and a lack of correlation between field evidence and statutory regulations.

Khanan Drishti addresses this by providing a centralized, role-agnostic web platform. It transforms raw field observations into prioritized, actionable insights, ensuring that safety, environmental, and operational compliance are continuously monitored and enforced.

## The Khanan Drishti Loop

Governance does not end when a violation is detected. Khanan Drishti is designed around the complete lifecycle—from evidence capture to verified closure.

```mermaid
flowchart LR
    A(CAPTURE) --> B(VERIFY)
    B --> C(UNDERSTAND)
    C --> D(PRIORITIZE)
    D --> E(ACT)
    E --> F(CLOSE)
    F --> G(LEARN)
    G -.-> A
```

---

## Problem

Indian coal mines face significant governance challenges due to operational scale and rigorous safety regulations:
- **Fragmented Data**: Inspection reports, evidence, and compliance scores are siloed.
- **Delayed Escalations**: High-risk safety observations take too long to reach decision-makers.
- **Poor Contractor Visibility**: Tracking the safety compliance and CAPA (Corrective and Preventive Action) resolution of third-party contractors is difficult.
- **Disconnected Evidence**: Photos and field reports are rarely mapped directly to specific regulatory clauses.
- **Lack of Geospatial Risk Context**: It is difficult to visualize compliance and risk trends across different geographical regions and subsidiaries simultaneously.

---

## Solution

Khanan Drishti serves as a unified digital governance dashboard. While a complete system would encompass mobile field apps and complex backends, this repository focuses exclusively on the **Web Application Dashboard**. 

The conceptual workflow of the platform ensures total traceability:

`Field Evidence` → `Inspection` → `Verification` → `Obligation Mapping` → `Risk Analysis` → `CAPA` → `Governance Dashboard`

*Note: The current repository implements the frontend dashboard interface powered by extensive mock data to demonstrate the platform's capabilities without requiring a live backend.*

## One Incident. Many Signals.

Instead of treating every compliance signal as an isolated record, Khanan Drishti connects related evidence, obligations, actions and risks.

```mermaid
flowchart LR
    A[Evidence] --> B[Observation]
    B --> C[Obligation]
    B --> D[Contractor]
    B --> E[CAPA]
    B --> F[Risk]
    B --> G[Inspection Priority]
```

## The Evidence Chain

Every decision should have a trail back to evidence.

```mermaid
flowchart TD
    A[📷 Evidence] --> B[📍 Location]
    B --> C[🕒 Timestamp]
    C --> D[🔎 Verification]
    D --> E[📜 Obligation]
    E --> F[⚠️ Risk]
    F --> G[🔧 Corrective Action]
    G --> H[✓ Closure]
```

---

## Key Capabilities

| Capability | Description |
| :--- | :--- |
| **Command Center** | Centralized `(/dashboard)` view displaying aggregate metrics, compliance trends, and high-risk alerts across all subsidiaries. Features interactive data visualization using Recharts. |
| **Multi-Mine Monitoring** | Enterprise data table `(/mines)` allowing advanced filtering by subsidiary, risk level, mine type, and compliance status. |
| **Mine Profiles** | Detailed individual mine views `(/mines/:id)` containing specific KPIs, compliance data, and a visualized "Risk Explanation" chain for targeted safety issues. |
| **GIS Risk Map** | Interactive geospatial view `(/map)` using MapLibre GL JS. Plots mines across Indian regions, colored by risk severity, with a risk-ranked sidebar and detailed data popups. |
| **Search & Filtering** | Robust search and multi-parameter filtering implemented across the Mines list and GIS map. |
| **Design System** | Industrial, dark-themed UI built with React and Tailwind CSS, featuring reusable components (DataTables, Modals, Badges, Toast notifications) and responsive routing. |

*(Note: Routes such as CAPA, Inspections, Evidence, and Contractors are structurally scaffolded in the application shell with empty states, but their deep data-management interfaces are not fully implemented in the current frontend prototype.)*

---

> ### Designed for the Mine, Not Just the Office
>
> Khanan Drishti separates field evidence capture from management visibility—because the person collecting evidence and the person making governance decisions are rarely standing in the same place.

## User Roles

The platform is designed to support different hierarchical views. The current dashboard implementation primarily reflects the **Corporate Management / Regulatory** perspective.

### Corporate Management & Regulatory Authorities
**Focus:** 
- Multi-mine visibility and geographical risk mapping.
- Aggregate compliance trends and subsidiary performance.
- Tracking major escalations and contractor governance.
- Statutory reporting oversight.

### Mine Officials (Conceptual)
**Focus:**
- Single-mine compliance status.
- Managing local inspections, observations, and evidence.
- Resolving assigned CAPAs.

---

## Three Layers of Khanan Drishti

```mermaid
flowchart TD
    subgraph Field [FIELD LAYER]
        direction TB
        F1(Inspections)
        F2(Evidence)
        F3(Attendance)
        F4(Site observations)
    end
    
    subgraph Intelligence [INTELLIGENCE LAYER]
        direction TB
        I1(Verification)
        I2(Obligation mapping)
        I3(Risk analysis)
        I4(AI insights)
    end
    
    subgraph Governance [GOVERNANCE LAYER]
        direction TB
        G1(Command Center)
        G2(CAPA)
        G3(Contractors)
        G4(Reporting)
        G5(Regulatory oversight)
    end

    Field --> Intelligence
    Intelligence --> Governance
```

---

## System Workflow

```mermaid
flowchart LR
    A[Field Evidence] --> B[Inspection]
    B --> C[AI Verification]
    C --> D[Obligation Mapping]
    D --> E[Risk Analysis]
    E --> F[CAPA Assignment]
    F --> G[Resolution Tracking]
    G --> H[Governance Dashboard]
    H --> I[Reporting & Analytics]
    
    style H fill:#1A2028,stroke:#F0A202,stroke-width:2px,color:#EDE6DA
```
*(The highlighted "Governance Dashboard" represents the core focus of this repository.)*

---

## North Star

> **From paper trails to proof.**

Turn fragmented compliance activity into structured, traceable and actionable governance.

---

## Tech Stack

The web dashboard is a purely frontend implementation utilizing modern web technologies:
- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (v4) with custom theme tokens
- **Routing**: React Router DOM (v7)
- **Mapping**: MapLibre GL JS
- **Charts**: Recharts
- **Icons**: Lucide React

---

```text
$ khanan-drishti status

SYSTEM
  Governance ............ ACTIVE
  Compliance ............ CONNECTED
  Evidence .............. TRACEABLE
  Risk .................. VISIBLE
  CAPA .................. ACTIONABLE
  Reporting ............. READY

> From Paper Trails to Proof.
```
