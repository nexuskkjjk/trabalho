import { IrisData } from './types';

export const parseIrisCSV = (csvText: string): IrisData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      sepal_length: parseFloat(values[0]),
      sepal_width: parseFloat(values[1]),
      petal_length: parseFloat(values[2]),
      petal_width: parseFloat(values[3]),
      species: values[4].trim()
    };
  });
};
