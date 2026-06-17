export interface BusinessInputs {
  businessName: string;
  website: string;
  industry: string;
  description: string;
  employeeCount: number;
  hourlyRate: number;
  manualHoursPerWeek: number;
}

export interface InferredOverview {
  description: string;
  customers: string;
  revenueModel: string;
  coreWorkflows: string[];
}

export interface ManualHotspot {
  activity: string;
  team: string;
  estimatedHoursPerWeek: number;
  painLevel: 'High' | 'Medium' | 'Low';
  description: string;
  leakRisk: string;
}

export interface AutomationOpportunity {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  suggestedTools: string[];
  expectedROI: string;
}

export interface RecommendedAgent {
  name: string;
  businessProblem: string;
  proposedSolution: string;
  expectedBenefit: string;
  estimatedBusinessImpact: string;
  systemInstructionPrompt: string;
}

export interface EstimatedROI {
  hoursSavedPerMonth: number;
  monthlySavingsCost: number;
  estimatedSetupCost: number;
  estimatedMonthlySaaS: number;
  paybackPeriodMonths: number;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  taskDetails: string[];
  keyDeliverables: string[];
}

export interface SuggestedIntegration {
  service: string;
  triggerEvent: string;
  actionEvent: string;
  benefit: string;
}

export interface AuditReport {
  companyOverview: InferredOverview;
  manualHotspots: ManualHotspot[];
  automationOpportunities: AutomationOpportunity[];
  recommendedAgents: RecommendedAgent[];
  estimatedROI: EstimatedROI;
  implementationRoadmap: RoadmapPhase[];
  suggestedIntegrations: SuggestedIntegration[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
