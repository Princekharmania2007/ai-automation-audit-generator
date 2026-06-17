import React, { useState } from "react";
import { AuditReport, RecommendedAgent, ChatMessage } from "../types";
import { 
  ArrowLeft, 
  Printer, 
  Play, 
  Send, 
  Cpu, 
  Lock, 
  AlertTriangle,
  Zap,
  TrendingUp,
  Download,
  Terminal,
  Grid,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface AuditResultsProps {
  report: AuditReport;
  onBack: () => void;
  hourlyRate: number;
  employeeCount: number;
  manualHoursPerWeek: number;
}

export default function AuditResults({ 
  report, 
  onBack, 
  hourlyRate, 
  employeeCount, 
  manualHoursPerWeek 
}: AuditResultsProps) {
  const [selectedAgent, setSelectedAgent] = useState<RecommendedAgent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'roi' | 'opportunities' | 'agents' | 'roadmap'>('overview');
  
  // Custom states for the resilient PDF generation engine
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Dynamic layout column resizing controls
  const [containerWidth, setContainerWidth] = useState<'4xl' | '6xl' | '7xl' | 'full'>('6xl');

  // Dynamic resilience loading handler for CDN based html2pdf package
  const loadHtml2Pdf = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => {
        resolve((window as any).html2pdf);
      };
      script.onerror = () => {
        reject(new Error("Network exception fetching printable libraries. Please verify network connectivity."));
      };
      document.head.appendChild(script);
    });
  };

  // Triggers professional multi-page document creation compiling all 5 strategy sections
  const downloadReportAsPDF = async () => {
    setIsDownloadingPdf(true);
    setPdfError(null);
    try {
      const html2pdfLib = await loadHtml2Pdf();
      const element = document.getElementById("audit-report-pdf-template");
      if (!element) {
        throw new Error("Unable to locate compilation template on the current DOM.");
      }

      // Compute client details for filename
      const clientName = report.companyOverview.description.split("is")[0]?.trim() || "Operational";
      const cleanedClientName = clientName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const filename = `${cleanedClientName}_automation_strategy_roadmap.pdf`;

      const options = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false 
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }
      };

      await html2pdfLib().set(options).from(element).save();
    } catch (err: any) {
      console.error(err);
      setPdfError(err.message || "An exception occurred while compiling the editorial PDF strategy output.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const startSimulator = (agent: RecommendedAgent) => {
    setSelectedAgent(agent);
    setChatMessages([
      { 
        role: "model", 
        text: `Greetings. I am your custom configured ${agent.name}. I have been bootstrapped with your specific business context. Ask me anything to test how I handle leads, questions, or workflows!` 
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !selectedAgent || isChatLoading) return;

    const userMsg = currentInput;
    setCurrentInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: selectedAgent.systemInstructionPrompt,
          history: chatMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          message: userMsg
        })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setChatMessages(prev => [...prev, { role: "model", text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "model", text: `Error: ${data.error || 'Failed to trigger agent callback.'}` }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "model", text: "Network interruption connecting to AI agent workspace." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  const widthClasses = {
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`w-full ${widthClasses[containerWidth]} mx-auto px-4 py-8 transition-all duration-300 ease-in-out animate-fade-in`} id="audit-results-container">
      
      {/* Top action toolbar */}
      <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-[#D1CEC8] pb-6">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#5C5954] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Business Assessment</span>
          </button>

          {/* Sizing Switcher */}
          <div className="flex items-center gap-2 border-l border-[#D1CEC8] pl-4 md:pl-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C8881]">Layout:</span>
            <div className="inline-flex bg-[#F7F3F0] border border-[#D1CEC8] p-0.5">
              {(['4xl', '6xl', '7xl', 'full'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setContainerWidth(w)}
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold transition-all ${
                    containerWidth === w
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#5C5954] hover:text-[#1A1A1A] hover:bg-[#E5E1DA]"
                  }`}
                >
                  {w === '4xl' ? 'Compact' : w === '6xl' ? 'Standard' : w === '7xl' ? 'Wide' : 'Full'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={printReport}
              className="px-4 py-2 border border-[#1A1A1A] bg-white text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:bg-[#F7F3F0] transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print View</span>
            </button>
            
            <button
              onClick={downloadReportAsPDF}
              disabled={isDownloadingPdf}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#3D3D3D] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? "Compiling PDF..." : "Download Report"}</span>
            </button>
          </div>
          
          {pdfError && (
            <span className="text-[10px] text-rose-700 font-mono text-right font-medium">
              ⚠ {pdfError}
            </span>
          )}
        </div>
      </div>

      {/* Editorial aesthetic formal header */}
      <div className="relative border-b-4 border-[#3D3D3D] pb-8 mb-10">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-baseline gap-2 mb-4">
          <div>
            <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#8C8881] mb-1">
              DIGITAL TRANSFORMATION PATH / AUTOMATION AUDIT
            </p>
            <h1 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight text-[#1A1A1A]">
              {report.companyOverview.description.split("is")[0] || "Operational Audit"}
            </h1>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0">
            <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-white text-[9px] tracking-widest uppercase mb-1.5 font-mono">
              CLASSIFICATION: CONFIDENTIAL
            </span>
            <p className="text-xs text-[#5C5954] font-mono">
              Assessed Team: {employeeCount} Ftes
            </p>
            <p className="text-[10px] text-[#8C8881] font-mono">
              Blended Rate: ${hourlyRate}/Hour
            </p>
          </div>
        </div>
        
        {/* Dynamic Navigation Tabs */}
        <div className="no-print flex flex-wrap gap-1 mt-6 border-t border-[#D1CEC8] pt-4">
          {(['overview', 'roi', 'opportunities', 'agents', 'roadmap'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all border ${
                activeTab === tab 
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                  : 'bg-white text-[#5C5954] border-[#E5E1DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Executive Block / Left card */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-[#D1CEC8] p-8">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
                EXECUTIVE SUMMARY
              </h2>
              <p className="text-2xl font-serif italic text-[#3D3D3D] leading-snug">
                Based on your inputs, our team mapped multiple operational bottlenecks and identified <span className="underline decoration-[#8C8881] underline-offset-4 font-bold">{report.automationOpportunities.length} critical opportunities</span> to recover high-cost resources.
              </p>
              <p className="text-xs text-[#5C5954] mt-6 leading-relaxed">
                Repetitive routines and administrative task overhead account for a high propensity of developer/operational strain, contributing to potential margin decay or delayed user support.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[#E5E1DA]">
              <span className="text-xs uppercase tracking-widest text-[#8C8881] font-bold block mb-1">
                EVALUATION SCORE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-serif leading-none font-bold text-[#1a1a1a]">
                  {Math.min(95, Math.max(30, Math.round(100 - (manualHoursPerWeek * 2.5))))}%
                </span>
                <span className="text-xs font-mono text-[#5C5954]">POTENTIAL BOOST</span>
              </div>
            </div>
          </div>

          {/* Central Context Blocks */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#D1CEC8] p-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4">
                BUSINESS PROFILE & OPERATIONS STRATEGY
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-[#8C8881] font-semibold mb-1 col-span-1">
                    Value Proposition & Objective
                  </h4>
                  <p className="text-xs text-[#3D3D3D] leading-relaxed">
                    {report.companyOverview.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-[#8C8881] font-semibold mb-1">
                    Client & Customer Audience
                  </h4>
                  <p className="text-xs text-[#3D3D3D] leading-relaxed">
                    {report.companyOverview.customers}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#E5E1DA]">
                <h4 className="text-xs uppercase tracking-wide text-[#8C8881] font-semibold mb-2">
                  Financial Monetization Model
                </h4>
                <p className="text-xs text-[#3D3D3D] leading-relaxed pr-2">
                  {report.companyOverview.revenueModel}
                </p>
              </div>
            </div>

            {/* Core Workflows */}
            <div className="bg-[#EAE6E1] border border-[#D1CEC8] p-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4">
                VITAL OPERATIONAL STAGES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.companyOverview.coreWorkflows.map((flow, i) => (
                  <div key={i} className="bg-white border border-[#E5E1DA] p-4 flex gap-3">
                    <span className="font-serif italic text-lg text-[#8C8881]">0{i+1}.</span>
                    <p className="text-xs text-[#1A1A1A] font-medium leading-relaxed">{flow}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: FINANCIAL ROI */}
      {activeTab === 'roi' && (
        <div className="space-y-8 mb-12">
          {/* Main Numbers Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#1A1A1A] p-8 relative overflow-hidden">
            <div className="md:col-span-2 border-r border-[#D1CEC8] pr-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-0.5 bg-[#1A1A1A] text-white text-[9px] tracking-widest uppercase mb-4">
                  ANNUALIZED REVENUE VALUE
                </span>
                <p className="text-5xl md:text-6xl font-serif italic text-emerald-800 leading-none">
                  ${(report.estimatedROI.monthlySavingsCost * 12).toLocaleString()}
                </p>
                <p className="text-xs text-[#8C8881] mt-2 font-mono uppercase">
                  Recoverable labor value annually
                </p>
              </div>
              
              <p className="text-xs text-[#5C5954] leading-relaxed mt-6 italic">
                Derived from {report.estimatedROI.hoursSavedPerMonth} operational hours saved per month, at a calculated rate of ${hourlyRate}/hr across your team profile.
              </p>
            </div>

            <div className="p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D1CEC8]">
              <div>
                <span className="text-[10px] uppercase text-[#8C8881] font-bold block mb-1">
                  PAYBACK TIMELINE
                </span>
                <span className="text-4xl font-serif italic font-bold">
                  {report.estimatedROI.paybackPeriodMonths} Months
                </span>
              </div>
              <p className="text-[10px] text-[#5C5954] mt-2 leading-relaxed">
                Short break-even period amortizing initial software integration configuration fees.
              </p>
            </div>

            <div className="p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#8C8881] font-bold block mb-1">
                  MONTHLY RETENTION SAVINGS
                </span>
                <span className="text-4xl font-serif italic font-bold">
                  ${report.estimatedROI.monthlySavingsCost.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-[#5C5954] mt-2 leading-relaxed">
                Ongoing resources reclaimed for high-level customer development or product focus.
              </p>
            </div>
          </div>

          {/* Breakdown Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#D1CEC8] p-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4">
                ROI INPUTS & FORM CONTROLS
              </h3>
              <p className="text-xs text-[#5C5954] mb-6 leading-relaxed">
                Your estimated manual overhead equations mapping to savings metrics:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                  <span className="text-[#8C8881]">Team Size (Audited):</span>
                  <span className="font-bold text-[#1A1A1A]">{employeeCount} Employees</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                  <span className="text-[#8C8881]">Repetitive Hours Target Rate:</span>
                  <span className="font-bold text-[#1A1A1A]">{manualHoursPerWeek} hrs/week</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                  <span className="text-[#8C8881]">Calculated Blended Wage:</span>
                  <span className="font-bold text-[#1A1A1A]">${hourlyRate}.00/hr</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                  <span className="text-[#8C8881]">Initial Build Out Cost Setup:</span>
                  <span className="font-bold text-[#1A1A1A]">${report.estimatedROI.estimatedSetupCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                  <span className="text-[#8C8881]">Monthly Platform Cloud Fees:</span>
                  <span className="font-bold text-[#1A1A1A]">${report.estimatedROI.estimatedMonthlySaaS.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            <div className="bg-[#EAE6E1] p-8 border border-[#D1CEC8] flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4">
                  OPERATIONAL RE-ALLOCATION STRATEGY
                </h3>
                <p className="text-xs text-[#3D3D3D] leading-relaxed mb-4">
                  By re-routing developers, administrative associates, or managers away from low-value routines toward core operations, you effectively augment the capability limits of your current staffing footprint.
                </p>
                <blockquote className="border-l border-[#1A1A1A] pl-4 italic text-sm text-[#1A1A1A] my-4 font-serif">
                  "Every manual entry represents a pipeline risk. Automating is not about removing talent; it's about amplifying the leverage of your existing headcount."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: MANUAL HOTSPOTS & OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-8 mb-12">
          {/* Section 3.1: Manual Hotspots */}
          <div className="bg-white border border-[#D1CEC8] p-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
              IDENTIFIED TASK HOTSPOTS
            </h2>
            <p className="text-xs text-[#5C5954] mb-6">
              Repetitive processes and high-friction operational workflows requiring active elimination:
            </p>

            <div className="space-y-6">
              {report.manualHotspots.map((spot, i) => (
                <div key={i} className="pb-6 border-b border-[#E5E1DA] last:border-b-0 group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-2">
                    <h3 className="text-base font-serif italic text-[#1A1A1A]">
                      0{i+1}. {spot.activity}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 md:mt-0 font-mono text-[10px]">
                      <span className="text-[#8C8881]">DEPARTMENT:</span>
                      <span className="font-bold">{spot.team.toUpperCase()}</span>
                      <span className="text-[#8C8881]">/</span>
                      <span className={`px-2 py-0.5 rounded-none font-bold ${
                        spot.painLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {spot.painLevel.toUpperCase()} INTENSITY
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5C5954] leading-relaxed mb-2">
                    {spot.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3 p-2 bg-[#F7F3F0] border border-[#E5E1DA] inline-flex">
                    <span className="text-[10px] font-mono text-[#8C8881] uppercase font-bold">Commercial Leak Risk:</span>
                    <span className="text-[10px] uppercase font-mono text-rose-700 font-bold">{spot.leakRisk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3.2: Exact Automation Pipeline Steps */}
          <div className="bg-white border border-[#D1CEC8] p-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
              TARGET AUTOMATION ARCHITECTURES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {report.automationOpportunities.map((opp, i) => (
                <div key={i} className="p-6 bg-[#F7F3F0] border border-[#D1CEC8] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-sky-100 text-sky-800 font-bold">
                        {opp.category}
                      </span>
                      <span className="text-[9px] font-mono text-[#8C8881]">
                        DIFF: {opp.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-serif italic text-lg text-[#1A1A1A] mb-2 leading-snug">
                      {opp.title}
                    </h4>
                    <p className="text-xs text-[#5C5954] leading-relaxed mb-4">
                      {opp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D1CEC8] mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C8881] block mb-1">RECOMMENDED PLATFORMS</span>
                      <div className="flex flex-wrap gap-1">
                        {opp.suggestedTools.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 border border-[#D1CEC8] bg-white font-mono text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[10px] uppercase font-bold text-[#8C8881]">EXPECTED TARGET RESULT</span>
                      <span className="text-xs font-mono font-bold text-emerald-800">{opp.expectedROI}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RECOMMENDED DYNAMIC AGENTS */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Agent selection & Cards list */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#EAE6E1] p-6 border border-[#D1CEC8]">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-2">
                CUSTOM BESPOKE AI AGENTS
              </h2>
              <p className="text-xs text-[#5C5954] leading-relaxed">
                Click any agent below to launch the **Live Interactive Sandbox Interpreter**. Test how the agent conducts conversations or logs tasks using your compiled parameters.
              </p>
            </div>

            <div className="space-y-3">
              {report.recommendedAgents.map((agent, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-6 border transition-all flex flex-col gap-2 ${
                    selectedAgent?.name === agent.name
                      ? 'bg-white border-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#D1CEC8] hover:border-[#1A1A1A]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-mono tracking-wider text-[#8C8881] uppercase font-bold">
                      Besopke Agent 0{i+1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-bold">
                      ● READY_SIM
                    </span>
                  </div>
                  <h3 className="font-serif italic text-lg font-bold text-[#1a1a1a]">
                    {agent.name}
                  </h3>
                  <p className="text-[11px] text-[#5C5954] line-clamp-2 leading-relaxed">
                    Problem solved: {agent.businessProblem}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed information & Sandbox Live Play */}
          <div className="lg:col-span-7">
            {selectedAgent ? (
              <div className="bg-white border border-[#1A1A1A] p-6 md:p-8 space-y-6">
                
                {/* Agent Detail Panel */}
                <div className="border-b border-[#D1CEC8] pb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#8C8881]">BESPOKE TARGET COMPONENT</span>
                    <span className="text-xs font-serif italic font-semibold text-[#1A1A1A]">Sandbox Workspace Active</span>
                  </div>
                  <h3 className="text-2xl font-serif italic text-[#1A1A1A] font-bold">
                    {selectedAgent.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-[#8C8881] tracking-wide mb-1">
                      Business Pain Resolved
                    </h4>
                    <p className="text-xs text-[#3D3D3D] leading-relaxed">
                      {selectedAgent.businessProblem}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-[#8C8881] tracking-wide mb-1">
                      Operational Deployment
                    </h4>
                    <p className="text-xs text-[#3D3D3D] leading-relaxed">
                      {selectedAgent.proposedSolution}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 bg-[#F7F3F0] p-4 border border-[#E5E1DA]">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Expected Direct Benefit</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{selectedAgent.expectedBenefit}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Estimated Impact</span>
                      <span className="text-xs font-mono font-bold text-emerald-800">{selectedAgent.estimatedBusinessImpact}</span>
                    </div>
                  </div>

                  {/* System Instruction Drawer */}
                  <div className="p-4 bg-slate-950 text-slate-300 rounded-none border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono tracking-widest text-[#8C8881]">DEPLOYABLE PROMPT INSTRUCTIONS (GEMINI ALIASED)</span>
                      <span className="text-[8px] bg-slate-800 text-slate-300 px-1 font-mono uppercase">SYSTEM_ROLE</span>
                    </div>
                    <p className="text-[11px] font-mono select-all select-text cursor-pointer hover:bg-slate-900 p-2 scrollbar-thin line-clamp-4 overflow-y-auto leading-relaxed max-h-[140px]">
                      {selectedAgent.systemInstructionPrompt}
                    </p>
                    <p className="text-[9px] text-[#8C8881] mt-2 italic">
                      💡 Click above to copy this system instruction directly for use inside your own direct API setups.
                    </p>
                  </div>
                </div>

                {/* Live Sandbox Chat Simulator */}
                <div className="border-t-2 border-[#1A1A1A] pt-6 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs uppercase font-bold text-[#1A1A1A] flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Live Sandbox Simulator</span>
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5">
                      ● Active State
                    </span>
                  </div>

                  {/* Message stack */}
                  <div className="border border-[#D1CEC8] bg-[#F7F3F0] h-[220px] overflow-y-auto p-4 space-y-3 font-mono text-xs">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`p-3 max-w-[85%] ${
                        msg.role === 'user' 
                          ? 'ml-auto bg-[#1A1A1A] text-white' 
                          : 'bg-white text-slate-800 border border-[#E5E1DA]'
                      }`}>
                        <div className="text-[8px] uppercase tracking-wider text-slate-400 mb-1">
                          {msg.role === 'user' ? 'TEST USER' : selectedAgent.name.toUpperCase()}
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="flex items-center gap-2 p-2 text-[#8C8881]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[10px] italic">Agent is thinking...</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      className="flex-1 bg-white border border-[#D1CEC8] outline-none text-xs px-3 font-mono"
                      placeholder={`Test this agent... (e.g. "We need to schedule an appointment next Tuesday")`}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !currentInput.trim()}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#3D3D3D] text-white text-[10px] uppercase font-bold tracking-wider transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className="border border-dashed border-[#D1CEC8] p-12 text-center bg-white flex flex-col items-center justify-center min-h-[400px]">
                <Cpu className="w-12 h-12 text-[#8C8881] mb-4 animate-pulse" />
                <h3 className="font-serif italic text-xl text-[#1A1A1A] mb-2">No Agent Selected</h3>
                <p className="text-xs text-[#5C5954] max-w-sm">
                  Choose one of the recommended dynamic bespoke AI Agents from the sidebar to inspect their setup details, copy prompts, and evaluate them live.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ROADMAP & INTEGRATIONS */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8 mb-12 animate-fade-in">
          {/* Timeline Grid */}
          <div className="bg-white border border-[#D1CEC8] p-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
              IMPLEMENTATION ROADMAP PHASES
            </h2>
            <p className="text-xs text-[#5C5954] mb-6">
              A phased rollout model to minimize production risk, testing flows in sandboxes before production hookups:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.implementationRoadmap.map((phase, i) => (
                <div key={i} className="border border-[#E5E1DA] bg-[#F7F3F0] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white font-bold">
                        {phase.phase}
                      </span>
                      <span className="text-[10px] font-mono text-[#5C5954] font-bold">
                        {phase.duration}
                      </span>
                    </div>
                    <h3 className="font-serif italic text-lg text-[#1A1A1A] mb-3 border-b border-[#D1CEC8] pb-1">
                      {phase.title}
                    </h3>

                    <ul className="space-y-2.5 text-xs text-[#5C5954] pl-3 list-disc leading-relaxed font-sans mb-6">
                      {phase.taskDetails.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#D1CEC8] mt-auto">
                    <span className="text-[10px] uppercase font-bold text-[#8C8881] block mb-1">KEY DELIVERABLES</span>
                    <ul className="space-y-1 font-mono text-[9px]">
                      {phase.keyDeliverables.map((out, idx) => (
                        <li key={idx} className="text-black font-semibold">
                          — {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Win Integrations API Grid */}
          <div className="bg-white border border-[#D1CEC8] p-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
              SUGGESTED DIRECT INTEGRATIONS (ZAPIER / MAKE.COM HOOKS)
            </h2>
            
            <div className="overflow-x-auto pr-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] uppercase text-[9px] font-mono tracking-widest font-bold text-[#8C8881]">
                    <th className="py-3 px-2">Service Platform</th>
                    <th className="py-3 px-2">Trigger Event (Webhook)</th>
                    <th className="py-3 px-2">Action Event (Target)</th>
                    <th className="py-3 px-2 hidden md:table-cell">Primary Strategic Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA]">
                  {report.suggestedIntegrations.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F3F0]">
                      <td className="py-3.5 px-2 font-serif font-bold text-sm italic">{item.service}</td>
                      <td className="py-3.5 px-2 font-mono text-[11px] text-[#3D3D3D]">{item.triggerEvent}</td>
                      <td className="py-3.5 px-2 font-mono text-[11px] text-[#3D3D3D]">{item.actionEvent}</td>
                      <td className="py-3.5 px-2 text-[#5C5954] hidden md:table-cell leading-relaxed">{item.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Signatures Footer */}
      <footer className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center text-[9px] uppercase tracking-[0.2em] font-bold text-[#8C8881] border-t border-[#D1CEC8] pt-6">
        <div className="flex gap-4 mb-4 md:mb-0">
          <span>REPORT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}-AUD</span>
          <span>© AUTOAUDIT STUDIO CONSULTING</span>
        </div>
        <div className="flex items-center">
          <span className="mr-4">Page 01 of 01</span>
          <div className="w-12 h-px bg-[#8C8881]"></div>
        </div>
      </footer>

      {/* Hidden Offscreen PDF Report Template - Pristine Multi-page Editorial Layout */}
      <div 
        style={{ 
          position: "absolute", 
          top: "0px", 
          left: "0px", 
          width: "0px", 
          height: "0px", 
          overflow: "hidden", 
          pointerEvents: "none" 
        }}
      >
        <div 
          id="audit-report-pdf-template"
          style={{ 
            width: "790px",
          }}
          className="bg-[#F7F3F0] text-[#1A1A1A] p-1 select-none pointer-events-none"
        >
        {/* Page 1: COVER PAGE & EXECUTIVE BRIEFING */}
        <div className="bg-white border-4 border-[#1A1A1A] p-10 flex flex-col justify-between min-h-[1050px]">
          <div>
            <div className="flex justify-between items-start border-b-2 border-[#1A1A1A] pb-4 mb-8">
              <div>
                <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#8C8881] mb-1">
                  DIGITAL TRANSFORMATION PATHWAY
                </p>
                <h1 className="text-3xl font-serif italic font-bold text-[#1A1A1A]">
                  AUTOMATION STRATEGY AUDIT
                </h1>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] tracking-widest uppercase mb-1 font-mono">
                  CLASSIFICATION: CONFIDENTIAL
                </span>
                <p className="text-[10px] text-[#5C5954] font-mono">FTEs: {employeeCount} FTEs</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="mb-8">
                <span className="text-[10px] tracking-widest text-[#8C8881] font-mono block uppercase mb-1">AUDIT SUBJECT</span>
                <h2 className="text-3xl font-serif italic font-light text-[#1A1A1A]">
                  {report.companyOverview.description.split("is")[0] || "Target Company"}
                </h2>
              </div>

              <div className="p-6 bg-[#F7F3F0] border border-[#D1CEC8] mb-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-3">
                  EXECUTIVE BRIEFING
                </h3>
                <p className="text-sm font-serif italic text-[#3D3D3D] leading-relaxed mb-4">
                  Based on custom business operational parameters, our optimization models identified {report.automationOpportunities.length} high-leverage digital opportunities to recover critical time-resource leaks.
                </p>
                <p className="text-xs text-[#5C5954] leading-relaxed">
                  Routine workflows and administrative bottlenecks account for measurable capacity strains. Developing a phased deployment of dynamic bespoke AI agents and server-side automation routines is highly recommended.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-[10px] uppercase text-[#8C8881] font-bold tracking-wide mb-1">VITAL STRATEGIC VALUE</h4>
                  <p className="text-xs text-[#3D3D3D] leading-relaxed leading-relaxed">{report.companyOverview.description}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase text-[#8C8881] font-bold tracking-wide mb-1">TARGET AUDIENCE</h4>
                  <p className="text-xs text-[#3D3D3D] leading-relaxed leading-relaxed">{report.companyOverview.customers}</p>
                </div>
              </div>

              <div className="border-t border-[#E5E1DA] pt-4 mb-4">
                <h4 className="text-[10px] uppercase text-[#8C8881] font-bold tracking-wide mb-2">MONETIZATION SUMMARY</h4>
                <p className="text-xs text-[#3D3D3D] leading-relaxed leading-relaxed">{report.companyOverview.revenueModel}</p>
              </div>

              <div className="border-t border-[#E5E1DA] pt-4">
                <h4 className="text-[10px] uppercase text-[#8C8881] font-bold tracking-wide mb-3">VITAL OPERATIONAL STAGES</h4>
                <div className="grid grid-cols-2 gap-4">
                  {report.companyOverview.coreWorkflows.map((flow, i) => (
                    <div key={i} className="bg-[#F7F3F0] p-3 border border-[#E5E1DA] flex gap-2">
                      <span className="font-serif italic text-xs text-[#8C8881]">0{i+1}.</span>
                      <p className="text-[11px] text-[#1A1A1A] leading-normal">{flow}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D1CEC8] pt-4 flex justify-between items-center text-[8px] font-mono text-[#8C8881] uppercase tracking-wider">
            <span>CONFIDENTIAL STRATEGY BRIEF — PAGE 1 OF 5</span>
            <span>AUTOAUDIT CONSULTING</span>
          </div>
        </div>

        {/* Page 2: ROI MATRIX & CAPITAL REALLOCATION */}
        <div style={{ pageBreakBefore: "always" }} className="bg-white border-4 border-[#1A1A1A] p-10 flex flex-col justify-between min-h-[1050px]">
          <div>
            <div className="flex justify-between items-baseline border-b-2 border-[#1A1A1A] pb-4 mb-8">
              <span className="text-[10px] tracking-widest text-[#8C8881] font-mono block uppercase">PART II: FINANCIAL ANALYSIS & ROI</span>
              <span className="text-[8px] bg-[#1A1A1A] text-white px-2 py-0.2 font-mono">CONFIDENTIAL</span>
            </div>

            <div className="space-y-6">
              <div className="p-8 text-center" style={{ backgroundColor: "#ecfdf5", border: "1px solid #059669" }}>
                <span className="text-[10px] uppercase tracking-widest font-bold block mb-2" style={{ color: "#065f46" }}>ANNUALIZED VALUE HARVEST</span>
                <p className="text-5xl font-serif italic font-bold text-center" style={{ color: "#064e3b" }}>
                  ${(report.estimatedROI.monthlySavingsCost * 12).toLocaleString()}
                </p>
                <p className="text-xs mt-2 font-mono uppercase" style={{ color: "#065f46" }}>
                  Recoverable labor capacity value per annum based on Blended Rate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F3F0] border border-[#D1CEC8]">
                  <span className="text-[9px] uppercase text-[#8C8881] font-bold block mb-1">MONTHLY RETENTION VALUE</span>
                  <span className="text-2xl font-serif italic font-bold">
                    ${report.estimatedROI.monthlySavingsCost.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#5C5954] mt-1 leading-normal">Reclaimed operational cash-flow efficiency.</p>
                </div>
                <div className="p-4 bg-[#F7F3F0] border border-[#D1CEC8]">
                  <span className="text-[9px] uppercase text-[#8C8881] font-bold block mb-1">AMORTIZATION PAYBACK SCHEDULE</span>
                  <span className="text-2xl font-serif italic font-bold">
                    {report.estimatedROI.paybackPeriodMonths} Months
                  </span>
                  <p className="text-[10px] text-[#5C5954] mt-1 leading-normal">Initial implementation setup cost break-even speed.</p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">
                  FINANCIAL MATRIX & COMPUTATION PARAMETERS
                </h3>
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Total Audited Full-Time Employees (FTEs):</span>
                    <span className="font-bold text-[#1A1A1A]">{employeeCount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Average Repetitive / Manual Hours weekly per FTE:</span>
                    <span className="font-bold text-[#1A1A1A]">{manualHoursPerWeek} hrs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Average Hourly Labor Rate:</span>
                    <span className="font-bold text-[#1A1A1A]">${hourlyRate}.00/hr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Target Reclaimed Time per Month:</span>
                    <span className="font-bold text-[#1A1A1A]">{report.estimatedROI.hoursSavedPerMonth} hours</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Estimated Integration & Build Setup Fee:</span>
                    <span className="font-bold text-[#1A1A1A]">${report.estimatedROI.estimatedSetupCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E1DA]">
                    <span className="text-[#8C8881]">Estimated Routine Platform Multi-SaaS Fees:</span>
                    <span className="font-bold text-[#1A1A1A]">${report.estimatedROI.estimatedMonthlySaaS.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#5C5954] leading-relaxed italic border-l-2 border-[#1A1A1A] pl-4 font-serif">
                "Our operational models identify that manual bottlenecks do not just drain payroll: they delay feedback loops and decay operational agility."
              </p>
            </div>
          </div>

          <div className="border-t border-[#D1CEC8] pt-4 flex justify-between items-center text-[8px] font-mono text-[#8C8881] uppercase tracking-wider">
            <span>CONFIDENTIAL STRATEGY BRIEF — PAGE 2 OF 5</span>
            <span>AUTOAUDIT CONSULTING</span>
          </div>
        </div>

        {/* Page 3: MANUAL HOTSPOTS & OPPORTUNITY PIPELINES */}
        <div style={{ pageBreakBefore: "always" }} className="bg-white border-4 border-[#1A1A1A] p-10 flex flex-col justify-between min-h-[1050px]">
          <div>
            <div className="flex justify-between items-baseline border-b-2 border-[#1A1A1A] pb-4 mb-8">
              <span className="text-[10px] tracking-widest text-[#8C8881] font-mono block uppercase">PART III: PIPELINES & OPPORTUNITIES</span>
              <span className="text-[8px] bg-[#1A1A1A] text-white px-2 py-0.2 font-mono">CONFIDENTIAL</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">
                  CRITICAL MANUAL TASK HOTSPOTS
                </h3>
                <div className="space-y-4">
                  {report.manualHotspots.slice(0, 3).map((spot, i) => (
                    <div key={i} className="p-4 bg-[#F7F3F0] border border-[#E5E1DA]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif italic text-sm font-bold">{i+1}. {spot.activity}</span>
                        <span className="text-[9px] font-mono font-bold uppercase shrink-0 px-1" style={{ backgroundColor: "#ffe4e6", color: "#9f1239" }}>{spot.team} / {spot.painLevel}</span>
                      </div>
                      <p className="text-xs text-[#5C5954] leading-relaxed mb-2">{spot.description}</p>
                      <p className="text-[10px] font-mono uppercase" style={{ color: "#9f1239" }}>Commercial Risk: {spot.leakRisk}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">
                  TARGET AUTOMATION ARCHITECTURES
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {report.automationOpportunities.slice(0, 4).map((opp, i) => (
                    <div key={i} className="p-4 border border-[#D1CEC8] flex flex-col justify-between h-[200px] bg-[#F7F3F0]">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-mono uppercase px-1 font-bold" style={{ backgroundColor: "#e0f2fe", color: "#075985" }}>{opp.category}</span>
                          <span className="text-[8px] font-mono text-[#8C8881]">DIFF: {opp.difficulty}</span>
                        </div>
                        <h4 className="font-serif italic text-xs font-bold text-[#1A1A1A] line-clamp-1">{opp.title}</h4>
                        <p className="text-[10px] text-[#5C5954] leading-relaxed line-clamp-3 mt-1">{opp.description}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#E5E1DA]">
                        <p className="text-[9px] text-[#1A1A1A] font-mono font-bold line-clamp-1">Expected: {opp.expectedROI}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D1CEC8] pt-4 flex justify-between items-center text-[8px] font-mono text-[#8C8881] uppercase tracking-wider">
            <span>CONFIDENTIAL STRATEGY BRIEF — PAGE 3 OF 5</span>
            <span>AUTOAUDIT CONSULTING</span>
          </div>
        </div>

        {/* Page 4: BESPOKE AI AGENT DEPLOYMENT SPECS */}
        <div style={{ pageBreakBefore: "always" }} className="bg-white border-4 border-[#1A1A1A] p-10 flex flex-col justify-between min-h-[1050px]">
          <div>
            <div className="flex justify-between items-baseline border-b-2 border-[#1A1A1A] pb-4 mb-8">
              <span className="text-[10px] tracking-widest text-[#8C8881] font-mono block uppercase">PART IV: BESPOKE CLIENT-SIDE AI AGENTS</span>
              <span className="text-[8px] bg-[#1A1A1A] text-white px-2 py-0.2 font-mono">CONFIDENTIAL</span>
            </div>

            <div className="space-y-6">
              {report.recommendedAgents.slice(0, 2).map((agent, i) => (
                <div key={i} className="pb-6 border-b border-[#E5E1DA] last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-serif italic text-base font-bold text-[#1A1A1A]">
                      Agent 0{i+1}: {agent.name}
                    </h3>
                    <span className="text-[9px] border px-1.5 py-0.5 font-mono uppercase font-bold" style={{ backgroundColor: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }}>READY TO BOOT</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Corporate Pain Resolved</span>
                      <p className="text-xs text-[#3D3D3D] leading-relaxed">{agent.businessProblem}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Operational Implementation Flow</span>
                      <p className="text-xs text-[#3D3D3D] leading-relaxed">{agent.proposedSolution}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Expected Direct Benefit</span>
                        <span className="text-xs font-mono font-bold text-[#1A1A1A]">{agent.expectedBenefit}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#8C8881] block">Estimated ROI Impact</span>
                        <span className="text-xs font-mono font-bold" style={{ color: "#065f46" }}>{agent.estimatedBusinessImpact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-none border" style={{ backgroundColor: "#020617", color: "#cbd5e1", borderColor: "#0f172a" }}>
                    <span className="text-[8px] font-mono text-[#8C8881] block mb-1">BOOTSTRAP PROMPT INSTRUCTIONS (GEMINI ALIASED)</span>
                    <p className="text-[10px] font-mono leading-relaxed line-clamp-2">{agent.systemInstructionPrompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#D1CEC8] pt-4 flex justify-between items-center text-[8px] font-mono text-[#8C8881] uppercase tracking-wider">
            <span>CONFIDENTIAL STRATEGY BRIEF — PAGE 4 OF 5</span>
            <span>AUTOAUDIT CONSULTING</span>
          </div>
        </div>

        {/* Page 5: IMPLEMENTATION ROADMAP & INTEGRATIONS */}
        <div style={{ pageBreakBefore: "always" }} className="bg-white border-4 border-[#1A1A1A] p-10 flex flex-col justify-between min-h-[1050px]">
          <div>
            <div className="flex justify-between items-baseline border-b-2 border-[#1A1A1A] pb-4 mb-8">
              <span className="text-[10px] tracking-widest text-[#8C8881] font-mono block uppercase">PART V: DEPLOYMENT TIMELINE & INTEGRATION GRID</span>
              <span className="text-[8px] bg-[#1A1A1A] text-white px-2 py-0.2 font-mono">CONFIDENTIAL</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">
                  PHASED IMPLEMENTATION TIMELINE
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {report.implementationRoadmap.map((phase, i) => (
                    <div key={i} className="p-4 bg-[#F7F3F0] border border-[#E5E1DA] flex flex-col justify-between h-[300px]">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] font-mono uppercase bg-[#1A1A1A] text-white font-bold px-1.5">{phase.phase}</span>
                          <span className="text-[9px] font-mono text-[#8C8881]">{phase.duration}</span>
                        </div>
                        <h4 className="font-serif italic text-xs font-semibold border-b border-[#D1CEC8] pb-1 mb-2 leading-snug">{phase.title}</h4>
                        <ul className="text-[10px] text-[#5C5954] list-disc pl-3 space-y-1">
                          {phase.taskDetails.slice(0, 3).map((t, idx) => (
                            <li key={idx} className="line-clamp-2">{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-[#D1CEC8] mt-auto">
                        <span className="text-[8px] font-mono text-[#8C8881] block">DELIVERABLE</span>
                        <p className="text-[9px] font-bold text-black truncate">— {phase.keyDeliverables[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-3 border-b border-[#1A1A1A] pb-1">
                  SUGGESTED DIRECT WEBHOOK INTEGRATIONS
                </h3>
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-[#1A1A1A] uppercase font-mono tracking-wider font-bold text-[#8C8881]">
                      <th className="py-2">Service</th>
                      <th className="py-2">Webhook Trigger</th>
                      <th className="py-2">Target Action</th>
                      <th className="py-2">Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DA]">
                    {report.suggestedIntegrations.slice(0, 4).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-serif font-bold italic">{item.service}</td>
                        <td className="py-2 font-mono text-[9px]">{item.triggerEvent}</td>
                        <td className="py-2 font-mono text-[9px]">{item.actionEvent}</td>
                        <td className="py-2 text-[#5C5954] line-clamp-1">{item.benefit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D1CEC8] pt-4 flex justify-between items-center text-[8px] font-mono text-[#8C8881] uppercase tracking-wider">
            <span>CONFIDENTIAL STRATEGY BRIEF — PAGE 5 OF 5</span>
            <span>AUTOAUDIT CONSULTING</span>
          </div>
        </div>

      </div>

    </div>

    </div>
  );
}
