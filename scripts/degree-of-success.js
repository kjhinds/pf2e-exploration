import { LEVEL_BASED_DCS, DEGREE_LABELS } from './constants.js';

export function getLevelBasedDC(level) {
  const clamped = Math.max(-1, Math.min(25, level));
  return LEVEL_BASED_DCS[String(clamped)];
}

export function degreeOfSuccess(total, dc, natural) {
  const diff = total - dc;
  let degree;
  if (diff >= 10) degree = 3; // Crit
  else if (diff >= 0) degree = 2; // Success
  else if (diff <= -10) degree = 0; // Crit fail
  else degree = 1; // Fail
 
  if (natural === 20) degree = Math.min(degree + 1, 3);
  if (natural === 1) degree = Math.max(degree - 1, 0);
 
  return DEGREE_LABELS[degree];
}