/**
 * Data Processing Utilities
 * 
 * Handles data transformation, normalization, and preparation
 * for AI analysis and machine learning models.
 */

/**
 * Normalize numerical data to 0-1 range for ML models
 * @param {Array} data - Array of numerical values
 * @returns {Object} - Normalized data and scaling parameters
 */
export const normalizeData = (data) => {
  if (!data || data.length === 0) {
    return { normalized: [], min: 0, max: 1 };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  if (range === 0) {
    return { normalized: data.map(() => 0.5), min, max };
  }

  const normalized = data.map(value => (value - min) / range);
  
  return { normalized, min, max };
};

/**
 * Denormalize data back to original scale
 * @param {Array} normalizedData - Normalized data array
 * @param {number} min - Original minimum value
 * @param {number} max - Original maximum value
 * @returns {Array} - Denormalized data
 */
export const denormalizeData = (normalizedData, min, max) => {
  const range = max - min;
  return normalizedData.map(value => value * range + min);
};

/**
 * Create time series sequences for LSTM training
 * @param {Array} data - Time series data
 * @param {number} sequenceLength - Length of each sequence
 * @returns {Object} - Training sequences and targets
 */
export const createTimeSeriesSequences = (data, sequenceLength = 30) => {
  const sequences = [];
  const targets = [];

  for (let i = 0; i < data.length - sequenceLength; i++) {
    const sequence = data.slice(i, i + sequenceLength);
    const target = data[i + sequenceLength];
    
    sequences.push(sequence);
    targets.push(target);
  }

  return { sequences, targets };
};

/**
 * Calculate statistical features for anomaly detection
 * @param {Array} data - Time series data
 * @param {number} windowSize - Size of rolling window
 * @returns {Object} - Statistical features
 */
export const calculateStatisticalFeatures = (data, windowSize = 7) => {
  const features = [];

  for (let i = windowSize; i < data.length; i++) {
    const window = data.slice(i - windowSize, i);
    
    const mean = window.reduce((sum, val) => sum + val, 0) / window.length;
    const variance = window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length;
    const stdDev = Math.sqrt(variance);
    
    const sorted = [...window].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    features.push({
      index: i,
      value: data[i],
      mean,
      stdDev,
      median,
      variance,
      min: Math.min(...window),
      max: Math.max(...window)
    });
  }

  return features;
};

/**
 * Detect outliers using IQR method
 * @param {Array} data - Numerical data array
 * @returns {Object} - Outlier detection results
 */
export const detectOutliers = (data) => {
  const sorted = [...data].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const outliers = [];
  const cleaned = [];
  
  data.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outliers.push({ index, value });
    } else {
      cleaned.push(value);
    }
  });

  return {
    outliers,
    cleaned,
    bounds: { lower: lowerBound, upper: upperBound },
    q1,
    q3,
    iqr
  };
};

/**
 * Calculate correlation between two data series
 * @param {Array} series1 - First data series
 * @param {Array} series2 - Second data series
 * @returns {number} - Correlation coefficient (-1 to 1)
 */
export const calculateCorrelation = (series1, series2) => {
  if (series1.length !== series2.length) {
    throw new Error('Series must have equal length');
  }

  const n = series1.length;
  if (n === 0) return 0;

  const mean1 = series1.reduce((sum, val) => sum + val, 0) / n;
  const mean2 = series2.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = series1[i] - mean1;
    const diff2 = series2[i] - mean2;
    
    numerator += diff1 * diff2;
    sum1Sq += diff1 * diff1;
    sum2Sq += diff2 * diff2;
  }

  const denominator = Math.sqrt(sum1Sq * sum2Sq);
  
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Smooth data using moving average
 * @param {Array} data - Input data array
 * @param {number} windowSize - Size of moving average window
 * @returns {Array} - Smoothed data
 */
export const applyMovingAverage = (data, windowSize = 5) => {
  const smoothed = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
    const window = data.slice(start, end);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    smoothed.push(average);
  }
  
  return smoothed;
};

/**
 * Calculate percentage change between values
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {number} - Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

/**
 * Group data by time period (daily, weekly, monthly)
 * @param {Array} data - Data with date field
 * @param {string} period - Grouping period ('day', 'week', 'month')
 * @returns {Object} - Grouped data
 */
export const groupByTimePeriod = (data, period = 'day') => {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item.date);
    let key;
    
    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default: // day
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return grouped;
};

/**
 * Aggregate grouped data by summing numerical fields
 * @param {Object} groupedData - Data grouped by time period
 * @param {Array} sumFields - Fields to sum
 * @param {Array} avgFields - Fields to average
 * @returns {Array} - Aggregated data
 */
export const aggregateGroupedData = (groupedData, sumFields = [], avgFields = []) => {
  const aggregated = [];
  
  Object.entries(groupedData).forEach(([period, items]) => {
    const aggregatedItem = { period, count: items.length };
    
    // Sum specified fields
    sumFields.forEach(field => {
      aggregatedItem[field] = items.reduce((sum, item) => sum + (item[field] || 0), 0);
    });
    
    // Average specified fields
    avgFields.forEach(field => {
      const values = items.filter(item => item[field] != null).map(item => item[field]);
      aggregatedItem[field] = values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
    });
    
    aggregated.push(aggregatedItem);
  });
  
  return aggregated.sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Prepare data for machine learning training
 * @param {Array} rawData - Raw data from database
 * @param {string} targetField - Field to predict
 * @param {Array} featureFields - Fields to use as features
 * @returns {Object} - Prepared training data
 */
export const prepareTrainingData = (rawData, targetField, featureFields) => {
  // Filter out incomplete records
  const completeData = rawData.filter(item => 
    item[targetField] != null && 
    featureFields.every(field => item[field] != null)
  );
  
  if (completeData.length === 0) {
    return { features: [], targets: [], metadata: { count: 0 } };
  }
  
  // Extract features and targets
  const features = completeData.map(item => 
    featureFields.map(field => item[field])
  );
  
  const targets = completeData.map(item => item[targetField]);
  
  // Normalize features
  const normalizedFeatures = features[0].map((_, featureIndex) => {
    const featureValues = features.map(feature => feature[featureIndex]);
    return normalizeData(featureValues);
  });
  
  // Reconstruct normalized feature matrix
  const normalizedFeatureMatrix = features.map((_, rowIndex) => 
    normalizedFeatures.map(normalizedFeature => normalizedFeature.normalized[rowIndex])
  );
  
  // Normalize targets
  const normalizedTargets = normalizeData(targets);
  
  return {
    features: normalizedFeatureMatrix,
    targets: normalizedTargets.normalized,
    metadata: {
      count: completeData.length,
      featureFields,
      targetField,
      featureNormalization: normalizedFeatures.map((norm, index) => ({
        field: featureFields[index],
        min: norm.min,
        max: norm.max
      })),
      targetNormalization: {
        min: normalizedTargets.min,
        max: normalizedTargets.max
      }
    }
  };
};

/**
 * Calculate data quality score
 * @param {Array} data - Data to evaluate
 * @param {Array} requiredFields - Required fields for quality assessment
 * @returns {Object} - Quality score and details
 */
export const calculateDataQuality = (data, requiredFields) => {
  if (!data || data.length === 0) {
    return { score: 0, details: { completeness: 0, consistency: 0, recency: 0 } };
  }
  
  // Completeness: percentage of complete records
  const completeRecords = data.filter(item => 
    requiredFields.every(field => item[field] != null && item[field] !== '')
  );
  const completeness = completeRecords.length / data.length;
  
  // Consistency: check for outliers in numerical fields
  const numericalFields = requiredFields.filter(field => 
    typeof data[0][field] === 'number'
  );
  
  let consistencySum = 0;
  numericalFields.forEach(field => {
    const values = data.map(item => item[field]).filter(val => val != null);
    if (values.length > 0) {
      const outlierResult = detectOutliers(values);
      const outlierRatio = outlierResult.outliers.length / values.length;
      consistencySum += 1 - outlierRatio;
    }
  });
  
  const consistency = numericalFields.length > 0 ? consistencySum / numericalFields.length : 1;
  
  // Recency: how recent is the latest data
  const dates = data.map(item => new Date(item.date || item.created_at)).filter(date => !isNaN(date));
  const latestDate = dates.length > 0 ? Math.max(...dates) : 0;
  const daysSinceLatest = (Date.now() - latestDate) / (1000 * 60 * 60 * 24);
  const recency = Math.max(0, 1 - daysSinceLatest / 30); // Full score if data is within 30 days
  
  // Overall quality score
  const score = (completeness * 0.4 + consistency * 0.4 + recency * 0.2);
  
  return {
    score: Math.round(score * 100) / 100,
    details: {
      completeness: Math.round(completeness * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      recency: Math.round(recency * 100) / 100,
      totalRecords: data.length,
      completeRecords: completeRecords.length,
      latestDataAge: Math.floor(daysSinceLatest)
    }
  };
};