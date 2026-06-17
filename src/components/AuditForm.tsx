import React, { useState } from "react";
import { BusinessInputs } from "../types";
import { INDUSTRY_TEMPLATES, IndustryTemplate } from "../data";
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  Clock, 
  FileSpreadsheet, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface AuditFormProps {
  onSubmit: (inputs: BusinessInputs) => void;
  isLoading: boolean;
}

export default function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [inputs, setInputs] = useState<BusinessInputs>({
    businessName: "",
    website: "",
    industry: "",
    description: "",
    employeeCount: 5,
    hourlyRate: 30,
    manualHoursPerWeek: 15
  });

  const [loadingStepText, setLoadingStepText] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === "employeeCount" || name === "hourlyRate" || name === "manualHoursPerWeek" 
        ? (Number(value) || 0)
        : value
    }));
  };

  const selectTemplate = (template: IndustryTemplate) => {
    setInputs(template.inputs);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.businessName.trim() || !inputs.industry.trim() || !inputs.description.trim()) return;
    onSubmit(inputs);
  };

  // Human-friendly loader scripts representing consulting compilation
  React.useEffect(() => {
    if (!isLoading) return;
    const steps = [
      "Securing analytical context & assets...",
      "Inferring specific clientele and business monetization structures...",
      "Analyzing manual repetition hotspots and operations friction...",
      "Scouting direct integration pathways (Zapier, Slack, CRM links)...",
      "Designing custom bespoke AI Agents (SDR, Support, Ops)...",
      "Drafting specialized system instruction scripts...",
      "Formulating labor savings & operational ROI indexes...",
      "Assembling the chronological implementation milestones...",
      "Finalizing digital automation audit report..."
    ];

    let current = 0;
    setLoadingStepText(steps[0]);

    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setLoadingStepText(steps[current]);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in" id="audit-form-container">
      {/* Title Header */}
      <header className="text-center mb-12 border-b border-[#D1CEC8] pb-10">
        <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#8C8881] mb-2">
          Business Analysis & Strategic Digitization
        </p>
        <h1 className="text-5xl md:text-6xl font-serif italic font-light tracking-tight text-[#1A1A1A] mb-4">
          AutoAudit Studio
        </h1>
        <p className="text-[#5C5954] text-xs md:text-sm font-mono uppercase tracking-widest max-w-2xl mx-auto">
          Identifying manual bottlenecks, mapping software integrations, and drafting ready-to-run AI agent instructions.
        </p>
      </header>

      {isLoading ? (
        /* CONSULTING TERMINAL LOADER - EDITORIAL STYLE */
        <div className="w-full max-w-2xl mx-auto bg-white border-2 border-[#1A1A1A] p-8 shadow-xl animate-pulse">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D1CEC8]">
            <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#8C8881]">
              AUDIT_COMPILATION_PIPELINE
            </p>
            <div className="inline-block px-3 py-0.5 bg-[#1A1A1A] text-white text-[9px] tracking-widest uppercase">
              ACTIVE ANALYTICS
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE6E1] flex items-center justify-center text-[#1A1A1A]">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-serif italic text-lg text-[#1A1A1A]">Generating Strategy Audit</h3>
                <p className="text-xs text-[#8C8881] font-mono">Formulating ROI equations via Gemini 3.5...</p>
              </div>
            </div>

            <div className="bg-[#F7F3F0] p-5 border border-[#D1CEC8] font-mono text-xs text-[#3D3D3D] space-y-3">
              <div className="flex justify-between">
                <span>Task Context Name:</span>
                <span className="text-[#1A1A1A] font-bold">{inputs.businessName || "New Business Target"}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Focus:</span>
                <span className="text-[#1A1A1A]">{inputs.industry || "General Operations"}</span>
              </div>
              <hr className="border-[#D1CEC8] my-2" />
              <div className="text-[#1A1A1A] text-xs font-semibold flex items-center gap-2 py-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping"></span>
                <span>{loadingStepText}</span>
              </div>
            </div>

            <p className="text-center text-[11px] text-[#8C8881] italic leading-relaxed pt-2">
              Our automated system is synthesizing manual workflows, estimating operational margins, and configuring active system instructions. Please wait briefly...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* QUICK-START PRESETS COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#D1CEC8] p-6">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 border-l-2 border-[#1A1A1A] pl-3">
                PRESET AUDIT BLUEPRINTS
              </h2>
              <p className="text-xs text-[#5C5954] mb-4 leading-relaxed">
                Choose a pre-filled industry case study to observe the depth, ROI calculations, and custom AI Agent prompts formulated by the audit engine.
              </p>
              
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {INDUSTRY_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectTemplate(tpl)}
                    className="w-full text-left p-4 border border-[#E5E1DA] hover:border-[#1A1A1A] bg-white hover:bg-[#F7F3F0] transition-all group flex flex-col gap-1.5 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#EAE6E1] text-[#3D3D3D] rounded-none">
                        {tpl.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8C8881] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="font-serif italic font-medium text-slate-900 group-hover:text-black">
                      {tpl.inputs.businessName}
                    </h3>
                    <p className="text-[11px] text-[#5C5954] line-clamp-2 leading-relaxed">
                      {tpl.inputs.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#EAE6E1] p-6 border border-[#D1CEC8]">
              <h3 className="font-serif italic text-base text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#3D3D3D]" />
                <span>Auditing With Financial Precision</span>
              </h3>
              <p className="text-xs text-[#5C5954] leading-relaxed font-sans">
                By modeling employees, average billing rates, and repetitive weekly task intervals, our consultant tool calculates payback periods to justify workflow tooling budgets.
              </p>
            </div>
          </div>

          {/* MAIN WORK ENGINE FORM (Lg: 7/12) */}
          <form 
            onSubmit={handleFormSubmit}
            className="lg:col-span-7 bg-white border border-[#D1CEC8] p-6 md:p-8 space-y-6"
          >
            <div className="border-b border-[#D1CEC8] pb-4">
              <h2 className="text-xl font-serif italic text-[#1A1A1A] flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#1A1A1A]" />
                <span>Strategic Parameters</span>
              </h2>
              <p className="text-xs text-[#8C8881] mt-1 uppercase tracking-wide font-mono">
                Input your firm's details to calculate potential points of digital automation.
              </p>
            </div>

            {/* Business & Website Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-medium text-xs mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#8C8881]" />
                  <span>Company Name *</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g., Vanguard Logistics"
                  value={inputs.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-[#D1CEC8] rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] bg-[#F7F3F0] text-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-medium text-xs mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#8C8881]" />
                  <span>Website URL (Optional)</span>
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder="e.g., vanguardship.com"
                  value={inputs.website}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-[#D1CEC8] rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] bg-[#F7F3F0] text-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-slate-800 font-medium text-xs mb-1.5">
                Primary Industry Segment *
              </label>
              <input
                type="text"
                name="industry"
                required
                placeholder="e.g., Third-Party Warehousing & Logistics (3PL)"
                value={inputs.industry}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-[#D1CEC8] rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] bg-[#F7F3F0] text-slate-900 transition-colors"
              />
            </div>

            {/* Custom Workflows Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-800 font-semibold text-xs">
                  Describe Tasks, Bottlenecks or Friction Points *
                </label>
                <span className="text-[10px] text-[#8C8881] font-mono">SPECIFIC EXAMPLES</span>
              </div>
              <textarea
                name="description"
                rows={5}
                required
                placeholder="Detail what your team spends physical hours on: copy-pasting customer details, scheduling back-and-forth emails, compiling routine reporting PDFs, updating multiple legacy CRMs, or chasing documents manually..."
                value={inputs.description}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-[#D1CEC8] rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] bg-[#F7F3F0] text-slate-900 transition-colors placeholder:text-[#8C8881] resize-none"
              />
            </div>

            {/* Operational Assumptions Grid */}
            <div className="border-t border-[#D1CEC8] pt-5 mt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">
                Operational Assumptions & Variables
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Team Size */}
                <div className="p-4 bg-[#F7F3F0] border border-[#E5E1DA]">
                  <div className="flex items-center gap-1 text-slate-800 text-xs font-semibold mb-1.5 font-sans">
                    <Users className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Company Size</span>
                  </div>
                  <input
                    type="number"
                    name="employeeCount"
                    min={1}
                    max={5000}
                    value={inputs.employeeCount}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D1CEC8] text-slate-900 rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] font-mono"
                  />
                  <span className="text-[10px] text-[#8C8881] block mt-1">Number of active employees</span>
                </div>

                {/* Blended wage */}
                <div className="p-4 bg-[#F7F3F0] border border-[#E5E1DA]">
                  <div className="flex items-center gap-1 text-slate-800 text-xs font-semibold mb-1.5 font-sans">
                    <DollarSign className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Hourly Wage ($)</span>
                  </div>
                  <input
                    type="number"
                    name="hourlyRate"
                    min={10}
                    max={500}
                    value={inputs.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D1CEC8] text-slate-900 rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] font-mono"
                  />
                  <span className="text-[10px] text-[#8C8881] block mt-1">Blended hourly labor rate</span>
                </div>

                {/* Hours per week bottleneck */}
                <div className="p-4 bg-[#F7F3F0] border border-[#E5E1DA]">
                  <div className="flex items-center gap-1 text-slate-800 text-xs font-semibold mb-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Repetitive Hours</span>
                  </div>
                  <input
                    type="number"
                    name="manualHoursPerWeek"
                    min={1}
                    max={40}
                    value={inputs.manualHoursPerWeek}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D1CEC8] text-slate-900 rounded-none text-sm focus:outline-none focus:border-[#1A1A1A] font-mono"
                  />
                  <span className="text-[10px] text-[#8C8881] block mt-1">Wasted per employee / week</span>
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              disabled={!inputs.businessName || !inputs.industry || !inputs.description}
              className={`w-full py-3 rounded-none font-sans uppercase tracking-[0.16em] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-white ${
                !inputs.businessName || !inputs.industry || !inputs.description
                  ? "bg-[#8C8881] cursor-not-allowed"
                  : "bg-[#1A1A1A] hover:bg-[#3D3D3D] hover:-translate-y-0.5 cursor-pointer"
              }`}
            >
              <span>Compile Complete Audit Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
