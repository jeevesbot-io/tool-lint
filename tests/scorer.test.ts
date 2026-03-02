import { describe, it, expect } from 'vitest';
import { calculateScore, getScoreColor } from '../src/scorer';
import { LintViolation } from '../src/types';

describe('Scorer', () => {
  it('should start at 100 with no violations', () => {
    const score = calculateScore([]);
    expect(score).toBe(100);
  });

  it('should deduct 15 points for errors', () => {
    const violations: LintViolation[] = [
      {
        ruleId: 'test',
        severity: 'error',
        message: 'Test',
        suggestion: 'Fix it',
        path: 'test',
      },
    ];
    const score = calculateScore(violations);
    expect(score).toBe(85);
  });

  it('should deduct 8 points for warnings', () => {
    const violations: LintViolation[] = [
      {
        ruleId: 'test',
        severity: 'warning',
        message: 'Test',
        suggestion: 'Fix it',
        path: 'test',
      },
    ];
    const score = calculateScore(violations);
    expect(score).toBe(92);
  });

  it('should deduct 3 points for info', () => {
    const violations: LintViolation[] = [
      {
        ruleId: 'test',
        severity: 'info',
        message: 'Test',
        suggestion: 'Fix it',
        path: 'test',
      },
    ];
    const score = calculateScore(violations);
    expect(score).toBe(97);
  });

  it('should not go below 0', () => {
    const violations: LintViolation[] = Array(20).fill({
      ruleId: 'test',
      severity: 'error',
      message: 'Test',
      suggestion: 'Fix it',
      path: 'test',
    });
    const score = calculateScore(violations);
    expect(score).toBe(0);
  });

  describe('getScoreColor', () => {
    it('should return green for scores 80-100', () => {
      expect(getScoreColor(100)).toBe('green');
      expect(getScoreColor(80)).toBe('green');
    });

    it('should return yellow for scores 50-79', () => {
      expect(getScoreColor(79)).toBe('yellow');
      expect(getScoreColor(50)).toBe('yellow');
    });

    it('should return red for scores 0-49', () => {
      expect(getScoreColor(49)).toBe('red');
      expect(getScoreColor(0)).toBe('red');
    });
  });
});
