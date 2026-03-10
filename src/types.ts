export interface IrisData {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
  species: string;
}

export type IrisAttribute = keyof Omit<IrisData, 'species'>;

export interface FrequencyRow {
  classRange: string;
  midPoint: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
  lowerBound: number;
  upperBound: number;
}

export interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
}

export interface GroupedStats {
  mean: number;
  median: number;
  variance: number;
  stdDev: number;
}
