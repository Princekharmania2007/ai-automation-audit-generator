import React, { useState, useEffect } from "react";
import AuditForm from "./components/AuditForm";
import AuditResults from "./components/AuditResults";
import { BusinessInputs, AuditReport } from "./types";
import { AlertCircle, HelpCircle, Shield, WifiOff } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [inputs, setInputs] = useState<BusinessInputs | null>(null);
  
  const [errorText, setErrorText] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState<boolean>(true);

  // Poll server health on launch to identify if GEMINI_API_KEY is configured
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (res.ok) {
          setApiReady(data.apiConfigured);
        }
      } catch (err) {
        console.warn("Express server healthcheck error:", err);
      }
    }
    checkHealth();
  }, []);

  const handleAuditSubmit = async (params: BusinessInputs) => {
    setIsLoading(true);
    setErrorText(null);
    setInputs(params);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Internal operational analysis failure.");
      }

      setReport(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An unexpected network error occurred while synthesizing business parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setReport(null);
    setErrorText(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F3F0] text-[#1A1A1A] font-sans selection:bg-[#EAE6E1]" id="app-root">
      
      {/* Editorial top accent line */}
      <div className="w-full h-2 bg-[#1A1A1A] no-print"></div>

      {/* Main Content Area */}
      <main className="py-4 md:py-8 lg:py-12">
        
        {/* Warning if API key is not configured inside the Secrets Panel */}
        {!apiReady && (
          <div className="no-print max-w-4xl mx-auto mb-8 px-4">
            <div className="bg-amber-50 border border-amber-300 p-5 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-800 shrink-0" />
              <div>
                <h4 className="font-serif italic font-bold text-amber-900 text-sm">
                  System API Key Missing Configuration
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed mt-1">
                  The <code className="font-mono bg-amber-100 px-1 py-0.5 text-rose-900">GEMINI_API_KEY</code> environment variable is currently empty. To invoke your customized business strategy audits, please configure your key in the <b>Secrets manager panel</b> in the Google AI Studio UI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorText && (
          <div className="no-print max-w-2xl mx-auto mb-8 px-4">
            <div className="bg-rose-50 border border-rose-300 p-5 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-rose-800 shrink-0 animate-bounce" />
              <div className="flex-1">
                <h4 className="font-serif italic font-bold text-rose-950 text-sm">
                  Operational Compilation Error
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed mt-1">
                  {errorText}
                </p>
                <button
                  onClick={() => setErrorText(null)}
                  className="text-xs underline font-bold mt-3 text-rose-950 hover:text-rose-900 block"
                >
                  Dimiss Warning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic State Router */}
        {report && inputs ? (
          <AuditResults
            report={report}
            onBack={handleBackToForm}
            hourlyRate={inputs.hourlyRate}
            employeeCount={inputs.employeeCount}
            manualHoursPerWeek={inputs.manualHoursPerWeek}
          />
        ) : (
          <AuditForm
            onSubmit={handleAuditSubmit}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
