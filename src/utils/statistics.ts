import { FrequencyRow, DescriptiveStats, GroupedStats } from './types';

/**
 * Manual implementation of statistical algorithms as requested.
 * No external libraries used for these calculations.
 */

export const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

export const calculateMedian = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const calculateMode = (data: number[]): number[] => {
  if (data.length === 0) return [];
  const counts: Record<number, number> = {};
  let maxCount = 0;
  
  data.forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
    }
  });

  const modes = Object.keys(counts)
    .filter(key => counts[Number(key)] === maxCount)
    .map(Number);
    
  return modes;
};

export const calculateVariance = (data: number[]): number => {
  if (data.length < 2) return 0;
  const mean = calculateMean(data);
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
  // Sample variance (n-1)
  return sumSquaredDiffs / (data.length - 1);
};

export const calculateStdDev = (data: number[]): number => {
  return Math.sqrt(calculateVariance(data));
};

export const getDescriptiveStats = (data: number[]): DescriptiveStats => {
  return {
    mean: calculateMean(data),
    median: calculateMedian(data),
    mode: calculateMode(data),
    variance: calculateVariance(data),
    stdDev: calculateStdDev(data)
  };
};

/**
 * Frequency Distribution for Ungrouped Data
 */
export const calculateUngroupedFrequency = (data: number[]) => {
  const counts: Record<number, number> = {};
  data.forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
  });
  
  const sortedKeys = Object.keys(counts).map(Number).sort((a, b) => a - b);
  let cumulative = 0;
  
  return sortedKeys.map(val => {
    const freq = counts[val];
    cumulative += freq;
    return {
      value: val,
      frequency: freq,
      relativeFrequency: freq / data.length,
      cumulativeFrequency: cumulative
    };
  });
};

/**
 * Frequency Distribution for Grouped Data (Sturges' Rule)
 */
export const calculateGroupedFrequency = (data: number[]): FrequencyRow[] => {
  if (data.length === 0) return [];
  
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Rule of Sturges: k = 1 + 3.322 * log10(n)
  const k = Math.ceil(1 + 3.322 * Math.log10(n));
  
  const range = max - min;
  const classWidth = range / k;
  
  const rows: FrequencyRow[] = [];
  let cumulative = 0;
  
  for (let i = 0; i < k; i++) {
    const lower = min + i * classWidth;
    const upper = lower + classWidth;
    
    // Count values in [lower, upper) except for last class which is [lower, upper]
    const freq = data.filter(val => {
      if (i === k - 1) {
        return val >= lower && val <= upper;
      }
      return val >= lower && val < upper;
    }).length;
    
    cumulative += freq;
    
    rows.push({
      classRange: `${lower.toFixed(2)} |----- ${upper.toFixed(2)}`,
      lowerBound: lower,
      upperBound: upper,
      midPoint: (lower + upper) / 2,
      frequency: freq,
      relativeFrequency: freq / n,
      cumulativeFrequency: cumulative
    });
  }
  
  return rows;
};

/**
 * Statistics for Grouped Data
 */
export const calculateGroupedStats = (rows: FrequencyRow[], totalN: number): GroupedStats => {
  if (rows.length === 0 || totalN === 0) {
    return { mean: 0, median: 0, variance: 0, stdDev: 0 };
  }

  // Grouped Mean: Σ(fi * xi) / n
  const sumFiXi = rows.reduce((acc, row) => acc + row.frequency * row.midPoint, 0);
  const mean = sumFiXi / totalN;

  // Grouped Median: L + [ (n/2 - Fac_prev) / f_median ] * h
  const nHalf = totalN / 2;
  const medianRowIndex = rows.findIndex(row => row.cumulativeFrequency >= nHalf);
  const medianRow = rows[medianRowIndex];
  const prevFac = medianRowIndex > 0 ? rows[medianRowIndex - 1].cumulativeFrequency : 0;
  const h = medianRow.upperBound - medianRow.lowerBound;
  const median = medianRow.lowerBound + ((nHalf - prevFac) / medianRow.frequency) * h;

  // Grouped Variance: Σ[ fi * (xi - mean)^2 ] / (n - 1)
  const sumFiXiMinusMeanSq = rows.reduce((acc, row) => {
    return acc + row.frequency * Math.pow(row.midPoint - mean, 2);
  }, 0);
  const variance = sumFiXiMinusMeanSq / (totalN - 1);
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    variance,
    stdDev
  };
};
