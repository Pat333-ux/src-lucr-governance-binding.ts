// Beast-System-3-LUCR/src/lucr-governance-binding.ts

import { ResolutionOutcome } from "../resolution/resolution-outcome";

export type LUCRBindingLevel =
  | "SUPPORTIVE"
  | "CORRECTIVE"
  | "RESTRICTIVE"
  | "CRITICAL_INTERVENTION";

export interface LUCRBinding {
  id: string;
  outcomeId: string;
  level: LUCRBindingLevel;
  rationale: string[];
  ministries: string[];
  createdAt: string;
  metadata: Record<string, unknown>;
}

export class LUCRGovernanceBindingEngine {
  public bind(
    outcome: ResolutionOutcome,
    ministries: string[]
  ): LUCRBinding {
    const rationale: string[] = [];
    const level = this.determineLevel(outcome, rationale);

    return {
      id: `lucr_binding_${Date.now()}`,
      outcomeId: outcome.id,
      level,
      rationale,
      ministries,
      createdAt: new Date().toISOString(),
      metadata: {
        lucrScore: outcome.lucrScore,
        traumaScore: outcome.traumaScore,
        finalScore: outcome.finalScore,
      },
    };
  }

  private determineLevel(
    outcome: ResolutionOutcome,
    rationale: string[]
  ): LUCRBindingLevel {
    if (outcome.lucrScore >= 0.75) {
      rationale.push("Strong wellbeing alignment — supportive governance.");
      return "SUPPORTIVE";
    }

    if (outcome.lucrScore >= 0.5) {
      rationale.push("Moderate wellbeing alignment — corrective guidance required.");
      return "CORRECTIVE";
    }

    if (outcome.lucrScore >= 0.3) {
      rationale.push("Low wellbeing alignment — restrictive oversight required.");
      return "RESTRICTIVE";
    }

    rationale.push("Critical wellbeing failure — emergency intervention required.");
    return "CRITICAL_INTERVENTION";
  }

  public summarize(binding: LUCRBinding): string {
    return `LUCR Binding ${binding.id}: level=${binding.level}, ministries=${binding.ministries.join(
      ", "
    )}`;
  }
}

export function createLUCRGovernanceBindingEngine(): LUCRGovernanceBindingEngine {
  return new LUCRGovernanceBindingEngine();
}
