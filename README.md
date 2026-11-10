# AutoAudit Studio

### *Interactive AI-powered business workflow automation auditor, ROI estimator, and conversational agent strategy designer.*

AutoAudit Studio is a full-stack web application designed for operations managers, business analysts, and automation consultants. It analyzes standard company workflows, automates manual bottlenecks, profiles operational risks, projects payback periods, and generates ready-to-boot AI agent system instructions tailored to specific departmental struggles.

---

## 🚀 Key Capabilities

*   **Intelligent Business Inference Engine**: Reverse-engineers any company's core client segments, revenue models, and operational flows from an intuitive intake form.
*   **Manual Hotspot Risk Profiler**: Flags high-friction labor areas, estimates hourly drain, and analyzes commercial leak risks for key tasks.
*   **Financial ROI Projection**: Computes annualized value harvest, monthly labor capacities, target software expenditures, and projected investment payback timelines.
*   **AI Agent Blueprints**: Designs production-ready specifications for autonomous specialists (e.g., SDR Agent, Customer Support Agent, Operations Assistant) including custom **bootstrappable system prompts** utilizing official model directions.
*   **Step-by-Step Delivery Roadmap**: Maps immediate, short-term, and long-term delivery phases with precise tasks and deliverables.
*   **Custom Presentation Controls**: Includes dynamic multi-width container layouts (Compact, Standard, Wide, Full-width views) to optimize client-facing reviews.
*   **Executive PDF Exporter**: Bundles a tailored premium client-ready printer format using client-side layout rendering.

---

## 🛠️ The Tech Stack

*   **Core UI & Framework**: React 19, TypeScript, and Vite.
*   **Style Sheet Layer**: Tailwind CSS (Native Vite Plugin Integration) for modern, responsive utility layouts.
*   **Visual Controls & Icons**: `lucide-react` for vector icons, custom tailored print style layers, and layout width controls.
*   **API Proxies**: Full-stack architecture backed by an Express middle-tier to host and secure API keys server-side (preventing credential leakage).
*   **AI SDK**: `@google/genai` TypeScript SDK with robust multi-model fallback routines for extreme reliability under demand spikes.

---

## 📦 Local Installation & Setup

Ensure you have **Node.js (version 18+)** installed.

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/Princekharmania2007/ai-automation-audit-generator.git
cd ai-automation-audit-generator
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (using `.env.example` as a template):
```env
# Port the Express + Vite server runs on (defaults to 3000 locally, dynamically bound on Render)
PORT=3000

# Your Google Gemini API Key
GEMINI_API_KEY=your_api_key_here
```

### 3. Run Automated Tests
Execute the comprehensive Vitest + Supertest integration suite:
```bash
npm test
```

### 4. Run the App
To start the server in development mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### 5. Build & Start for Production
To bundle the frontend assets and compile the TypeScript Express server:
```bash
npm run build
```
To run the production build:
```bash
npm run start
```

---

## 💎 The Consulting Workflow

1.  **Intake Profiling**: The consultant enters the company's business name, description, size, blended hourly employee rates, and hours spent on manual work weekly.
2.  **AI Auditing**: The application proxies the requests safely to the Express server, invoking regional Gemini models. If a primary service experiences high demand, backend resilience adapters transition across secondary fallbacks:
    *   *Primary*: `gemini-3.6-flash`
    *   *Fallbacks*: `gemini-3.8-flash` ➡️ `gemini-2.5-flash` ➡️ `gemini-2.0-flash`
3.  **Audit Assessment**: View the formatted result instantly inside the interactive dashboard. Use the layout toggle toolbar to resize columns for on-screen read-throughs.
4.  **Actionable Hand-off**: Export polished executive document bundles for stakeholder sign-off, simulate conversations in the live sandbox, and copy the AI boot instructions directly into production code blocks.
