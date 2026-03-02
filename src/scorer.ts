import { LintResult, LintViolation, Severity } from './types';

const SEVERITY_PENALTIES: Record<Severity, number> = {
  error: 15,
  warning: 8,
  info: 3,
};

export function calculateScore(violations: LintViolation[]): number {
  let score = 100;

  for (const violation of violations) {
    score -= SEVERITY_PENALTIES[violation.severity];
  }

  return Math.max(0, score);
}

export function getScoreColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

export function aggregateResults(results: LintResult[]): {
  overallScore: number;
  totalViolations: number;
  passed: boolean;
} {
  if (results.length === 0) {
    return { overallScore: 0, totalViolations: 0, passed: false };
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const overallScore = Math.round(totalScore / results.length);
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
  const passed = results.every(r => r.passed);

  return { overallScore, totalViolations, passed };
}
