import { BusinessInputs } from "./types";

export interface IndustryTemplate {
  title: string;
  badge: string;
  iconName: string;
  inputs: BusinessInputs;
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    title: "E-Commerce Apparel Store",
    badge: "Retail & B2C",
    iconName: "ShoppingBag",
    inputs: {
      businessName: "Loom & Thread",
      website: "loomandthread.co",
      industry: "E-Commerce / Direct-to-Consumer Apparel",
      description: "Direct-to-consumer sustainable clothing brand. Customers submit orders via Shopify. We source items regionally, deal with delivery suppliers, and actively respond regarding delivery delays, sizing questions, and returns. Customer service reps spend several hours per day copy-pasting order IDs into tracking calculators. Returns require manual review and email coordination by store staff.",
      employeeCount: 12,
      hourlyRate: 22,
      manualHoursPerWeek: 18
    }
  },
  {
    title: "SaaS Tech Startup",
    badge: "Technology",
    iconName: "Cpu",
    inputs: {
      businessName: "SentryFlow",
      website: "sentryflow.io",
      industry: "Software as a Service (B2B SaaS)",
      description: "Cloud-native infrastructure observability tool for mid-stage enterprises. Sales reps manually scour LinkedIn to find tech executives, scrape their emails, draft cold touches, and seek calendar bookings. Leads submitting our contact form are manually matched with reps with a typical latency of 6 hours. Trial signup churn is high since onboarding checklists are manually triggered via support.",
      employeeCount: 25,
      hourlyRate: 45,
      manualHoursPerWeek: 14
    }
  },
  {
    title: "Boutique Real Estate Agency",
    badge: "Property",
    iconName: "Home",
    inputs: {
      businessName: "Vanguard Realty Group",
      website: "vanguardrealty.com",
      industry: "Real Estate Brokerage",
      description: "Independent luxury brokerage handles regional property buy, lease, and portfolio consulting. Agents spend significant time copying and pasting leads from portals (Zillow, local directories) into a legacy spreadsheet CRM. Scheduling open houses requires extensive SMS back-and-forth coordinate with prospects. Contracts are hand-generated via PDF editors for electronic signature.",
      employeeCount: 8,
      hourlyRate: 35,
      manualHoursPerWeek: 20
    }
  },
  {
    title: "Accounting & Tax Firm",
    badge: "Professional Services",
    iconName: "Briefcase",
    inputs: {
      businessName: "Sterling CPA Advisors",
      website: "sterlingcpas.com",
      industry: "Financial & Advisory Services",
      description: "Boutique public accounting firm providing fractional CFO advisory, business tax prep, and payroll. Clients email invoices, bank statements, and receipt snapshots. Junior accountants classify these manually in spreadsheets. Chasing missing client documents is done via manual emails. Setting up onboarding client links and folders on Google Drive takes 30 minutes per client.",
      employeeCount: 15,
      hourlyRate: 50,
      manualHoursPerWeek: 16
    }
  },
  {
    title: "Regional Pediatric Clinic",
    badge: "Healthcare",
    iconName: "Stethoscope",
    inputs: {
      businessName: "Evergreen Family Care",
      website: "evergreenpediatrics.org",
      industry: "Healthcare & Family Wellness",
      description: "Multi-physician private clinical practice. Front-desk staff coordinates 45 appointments per day, mostly answering phone calls for reschedule, prescription refills, and medical records. Cancellations are hard to fill manually because calls to patient waiting lists are timed poorly. New patient forms are hand-filled on clipboards and manually typed into our EHR database.",
      employeeCount: 18,
      hourlyRate: 28,
      manualHoursPerWeek: 22
    }
  }
];
