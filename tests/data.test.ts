import { describe, it, expect } from "vitest";
import { INDUSTRY_TEMPLATES } from "../src/data";

describe("Industry Templates Integrity Suite", () => {
  it("should have at least 5 curated industry templates", () => {
    expect(INDUSTRY_TEMPLATES.length).toBeGreaterThanOrEqual(5);
  });

  it("should have all required fields on every template", () => {
    INDUSTRY_TEMPLATES.forEach((tpl) => {
      expect(tpl.title).toBeTruthy();
      expect(tpl.badge).toBeTruthy();
      expect(tpl.iconName).toBeTruthy();
      expect(tpl.inputs).toBeDefined();

      const { inputs } = tpl;
      expect(inputs.businessName.trim().length).toBeGreaterThan(0);
      expect(inputs.industry.trim().length).toBeGreaterThan(0);
      expect(inputs.description.trim().length).toBeGreaterThan(10);
      expect(inputs.employeeCount).toBeGreaterThan(0);
      expect(inputs.hourlyRate).toBeGreaterThan(0);
      expect(inputs.manualHoursPerWeek).toBeGreaterThan(0);
    });
  });
});

