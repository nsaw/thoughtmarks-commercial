// GHOST Metrics Aggregator — Phase 8A P8.07.00
// Comprehensive metrics aggregation and analytics system

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as crypto from 'crypto';

const execAsync = promisify(exec);
const aggregatorLogPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/logs/metrics-aggregator.log';
const aggregatorStatePath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/metrics-aggregator-state.json';
const configPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/config/metrics-aggregator-config.json';
const analyticsPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/analytics';
const logDir = path.dirname(aggregatorLogPath);

// Ensure directories exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
if (!fs.existsSync(path.dirname(aggregatorStatePath))) {
  fs.mkdirSync(path.dirname(aggregatorStatePath), { recursive: true });
}
if (!fs.existsSync(path.dirname(configPath))) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(analyticsPath)) {
  fs.mkdirSync(analyticsPath, { recursive: true });
}

interface MetricSource {
  id: string;
  name: string;
  type: 'dashboard' | 'relay' | 'heartbeat' | 'loop-auditor' | 'snapshot';
  enabled: boolean;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'error';
  dataPath: string;
}

interface AggregatedMetric {
  id: string;
  timestamp: string;
  metricType: 'performance' | 'health' | 'system' | 'business' | 'custom';
  name: string;
  value: number;
  unit: string;
  source: string;
  tags: { [key: string]: string };
  metadata: any;
}

interface MetricTrend {
  metricName: string;
  timeRange: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  dataPoints: number;
}

interface SystemHealthScore {
  overall: number;
  performance: number;
  reliability: number;
  availability: number;
  security: number;
  timestamp: string;
  factors: {
    name: string;
    weight: number;
    score: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

interface PerformanceBaseline {
  metricName: string;
  baselineValue: number;
  upperThreshold: number;
  lowerThreshold: number;
  confidence: number;
  lastUpdated: string;
  dataPoints: number;
}

interface AnomalyDetection {
  id: string;
  timestamp: string;
  metricName: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  resolved: boolean;
}

interface MetricsAggregatorConfig {
  enabled: boolean;
  collection: {
    enabled: boolean;
    intervalMs: number;
    maxRetries: number;
    timeoutMs: number;
  };
  aggregation: {
    enabled: boolean;
    aggregationInterval: number;
    retentionPeriod: number;
    maxDataPoints: number;
  };
  analytics: {
    enabled: boolean;
    trendAnalysis: boolean;
    anomalyDetection: boolean;
    baselineCalculation: boolean;
    correlationAnalysis: boolean;
  };
  sources: {
    dashboard: boolean;
    relay: boolean;
    heartbeat: boolean;
    loopAuditor: boolean;
    snapshot: boolean;
  };
  integration: {
    dashboard: {
      enabled: boolean;
      updateInterval: number;
      sendAggregatedMetrics: boolean;
      sendTrends: boolean;
    };
    alerts: {
      enabled: boolean;
      anomalyThreshold: number;
      performanceThreshold: number;
      healthThreshold: number;
    };
  };
  security: {
    enabled: boolean;
    dataEncryption: boolean;
    accessControl: boolean;
    auditLogging: boolean;
  };
}

interface MetricsAggregatorState {
  timestamp: string;
  sources: MetricSource[];
  aggregatedMetrics: AggregatedMetric[];
  trends: MetricTrend[];
  healthScore: SystemHealthScore;
  baselines: PerformanceBaseline[];
  anomalies: AnomalyDetection[];
  lastUpdate: string;
  version: string;
}

class GhostMetricsAggregator {
  private config!: MetricsAggregatorConfig;
  private state!: MetricsAggregatorState;
  private isRunning = false;
  private collectionInterval = 10000; // 10 seconds
  private maxMetricHistory = 10000;
  private maxTrendHistory = 1000;
  private maxAnomalyHistory = 500;
  private startTime: Date;

  constructor() {
    this.startTime = new Date();
    this.loadConfig();
    this.initializeState();
    this.logEvent('system_startup', 'info');
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(configData);
      } else {
        this.config = this.getDefaultConfig();
        this.saveConfig();
      }
    } catch (error) {
      this.logEvent('config_error', `Failed to load config: ${error}`, 'error');
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): MetricsAggregatorConfig {
    return {
      enabled: true,
      collection: {
        enabled: true,
        intervalMs: 10000,
        maxRetries: 3,
        timeoutMs: 15000
      },
      aggregation: {
        enabled: true,
        aggregationInterval: 60000,
        retentionPeriod: 30,
        maxDataPoints: 10000
      },
      analytics: {
        enabled: true,
        trendAnalysis: true,
        anomalyDetection: true,
        baselineCalculation: true,
        correlationAnalysis: true
      },
      sources: {
        dashboard: true,
        relay: true,
        heartbeat: true,
        loopAuditor: true,
        snapshot: true
      },
      integration: {
        dashboard: {
          enabled: true,
          updateInterval: 10000,
          sendAggregatedMetrics: true,
          sendTrends: true
        },
        alerts: {
          enabled: true,
          anomalyThreshold: 0.8,
          performanceThreshold: 0.7,
          healthThreshold: 0.6
        }
      },
      security: {
        enabled: true,
        dataEncryption: false,
        accessControl: true,
        auditLogging: true
      }
    };
  }

  private saveConfig(): void {
    try {
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      this.logEvent('config_error', `Failed to save config: ${error}`, 'error');
    }
  }

  private initializeState(): void {
    try {
      if (fs.existsSync(aggregatorStatePath)) {
        const stateData = fs.readFileSync(aggregatorStatePath, 'utf8');
        this.state = JSON.parse(stateData);
      } else {
        this.state = this.getInitialState();
      }
    } catch (error) {
      this.logEvent('state_error', `Failed to load state: ${error}`, 'error');
      this.state = this.getInitialState();
    }
  }

  private getInitialState(): MetricsAggregatorState {
    return {
      timestamp: new Date().toISOString(),
      sources: this.initializeMetricSources(),
      aggregatedMetrics: [],
      trends: [],
      healthScore: {
        overall: 100,
        performance: 100,
        reliability: 100,
        availability: 100,
        security: 100,
        timestamp: new Date().toISOString(),
        factors: []
      },
      baselines: [],
      anomalies: [],
      lastUpdate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  private initializeMetricSources(): MetricSource[] {
    return [
      {
        id: 'dashboard',
        name: 'Telemetry Dashboard',
        type: 'dashboard',
        enabled: this.config.sources.dashboard,
        lastUpdate: new Date().toISOString(),
        status: 'inactive',
        dataPath: '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/dashboard-state.json'
      },
      {
        id: 'relay',
        name: 'Relay Telemetry Core',
        type: 'relay',
        enabled: this.config.sources.relay,
        lastUpdate: new Date().toISOString(),
        status: 'inactive',
        dataPath: '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/relay-telemetry-state.json'
      },
      {
        id: 'heartbeat',
        name: 'Heartbeat Visualizer',
        type: 'heartbeat',
        enabled: this.config.sources.heartbeat,
        lastUpdate: new Date().toISOString(),
        status: 'inactive',
        dataPath: '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/heartbeat-state.json'
      },
      {
        id: 'loop-auditor',
        name: 'Loop Auditor',
        type: 'loop-auditor',
        enabled: this.config.sources.loopAuditor,
        lastUpdate: new Date().toISOString(),
        status: 'inactive',
        dataPath: '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/loop-auditor-state.json'
      },
      {
        id: 'snapshot',
        name: 'Snapshot Daemon',
        type: 'snapshot',
        enabled: this.config.sources.snapshot,
        lastUpdate: new Date().toISOString(),
        status: 'inactive',
        dataPath: '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/snapshot-state.json'
      }
    ];
  }

  private logEvent(eventType: string, message: string, severity: string = 'info', data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      component: 'metrics-aggregator',
      eventType,
      severity,
      message,
      data
    };
    
    fs.appendFileSync(aggregatorLogPath, JSON.stringify(logEntry) + '\n');
  }

  private async collectMetricsFromSource(source: MetricSource): Promise<AggregatedMetric[]> {
    const metrics: AggregatedMetric[] = [];
    
    try {
      if (!fs.existsSync(source.dataPath)) {
        source.status = 'error';
        return metrics;
      }

      const data = JSON.parse(fs.readFileSync(source.dataPath, 'utf8'));
      source.lastUpdate = new Date().toISOString();
      source.status = 'active';

      // Extract metrics based on source type
      switch (source.type) {
        case 'dashboard':
          metrics.push(...this.extractDashboardMetrics(data, source.id));
          break;
        case 'relay':
          metrics.push(...this.extractRelayMetrics(data, source.id));
          break;
        case 'heartbeat':
          metrics.push(...this.extractHeartbeatMetrics(data, source.id));
          break;
        case 'loop-auditor':
          metrics.push(...this.extractLoopAuditorMetrics(data, source.id));
          break;
        case 'snapshot':
          metrics.push(...this.extractSnapshotMetrics(data, source.id));
          break;
      }
    } catch (error) {
      source.status = 'error';
      this.logEvent('collection_error', `Failed to collect metrics from ${source.name}: ${error}`, 'error');
    }

    return metrics;
  }

  private extractDashboardMetrics(data: any, sourceId: string): AggregatedMetric[] {
    const metrics: AggregatedMetric[] = [];
    const timestamp = new Date().toISOString();

    if (data.systemMetrics) {
      const { cpu, memory, disk } = data.systemMetrics;
      
      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'system',
        name: 'cpu_usage',
        value: cpu.usage,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'system', type: 'cpu' },
        metadata: { cores: cpu.cores, load: cpu.load }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'system',
        name: 'memory_usage',
        value: memory.usage,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'system', type: 'memory' },
        metadata: { total: memory.total, used: memory.used, available: memory.available }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'system',
        name: 'disk_usage',
        value: disk.usage,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'system', type: 'disk' },
        metadata: { total: disk.total, used: disk.used, available: disk.available }
      });
    }

    if (data.daemonHealth) {
      const healthyDaemons = data.daemonHealth.filter((d: any) => d.status === 'running').length;
      const totalDaemons = data.daemonHealth.length;
      
      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'health',
        name: 'daemon_health_ratio',
        value: totalDaemons > 0 ? (healthyDaemons / totalDaemons) * 100 : 0,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'daemons', type: 'health' },
        metadata: { healthy: healthyDaemons, total: totalDaemons }
      });
    }

    return metrics;
  }

  private extractRelayMetrics(data: any, sourceId: string): AggregatedMetric[] {
    const metrics: AggregatedMetric[] = [];
    const timestamp = new Date().toISOString();

    if (data.performanceMetrics) {
      const pm = data.performanceMetrics;
      
      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'performance',
        name: 'relay_response_time_avg',
        value: pm.averageResponseTime,
        unit: 'milliseconds',
        source: sourceId,
        tags: { component: 'relay', type: 'performance' },
        metadata: { p95: pm.p95ResponseTime, p99: pm.p99ResponseTime }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'performance',
        name: 'relay_success_rate',
        value: pm.successRate * 100,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'relay', type: 'performance' },
        metadata: { totalRequests: pm.totalRequests, successfulRequests: pm.successfulRequests }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'performance',
        name: 'relay_queue_length',
        value: pm.queueLength,
        unit: 'count',
        source: sourceId,
        tags: { component: 'relay', type: 'queue' },
        metadata: { concurrentRequests: pm.currentConcurrentRequests }
      });
    }

    return metrics;
  }

  private extractHeartbeatMetrics(data: any, sourceId: string): AggregatedMetric[] {
    const metrics: AggregatedMetric[] = [];
    const timestamp = new Date().toISOString();

    if (data.heartbeatStatus) {
      const hs = data.heartbeatStatus;
      
      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'health',
        name: 'clock_drift',
        value: Math.abs(hs.clockDrift),
        unit: 'seconds',
        source: sourceId,
        tags: { component: 'heartbeat', type: 'clock' },
        metadata: { systemTime: hs.systemTime, lastHeartbeat: hs.lastHeartbeat }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'health',
        name: 'daemon_health_ratio',
        value: hs.daemonCount > 0 ? (hs.healthyDaemons / hs.daemonCount) * 100 : 0,
        unit: 'percent',
        source: sourceId,
        tags: { component: 'heartbeat', type: 'daemons' },
        metadata: { healthy: hs.healthyDaemons, total: hs.daemonCount }
      });

      metrics.push({
        id: crypto.randomUUID(),
        timestamp,
        metricType: 'performance',
        name: 'ping_latency',
        value: hs.pingLatency,
        unit: 'milliseconds',
        source: sourceId,
        tags: { component: 'heartbeat', type: 'network' },
        metadata: { lastPingTime: hs.lastPingTime }
      });
    }

    return metrics;
  }

  private extractLoopAuditorMetrics(data: any, sourceId: string): AggregatedMetric[] {
    const metrics: AggregatedMetric[] = [];
    const timestamp = new Date().toISOString();

    // Placeholder for loop auditor metrics
    // This would be implemented when the loop auditor is available
    
    return metrics;
  }

  private extractSnapshotMetrics(data: any, sourceId: string): AggregatedMetric[] {
    const metrics: AggregatedMetric[] = [];
    const timestamp = new Date().toISOString();

    // Placeholder for snapshot metrics
    // This would be implemented when the snapshot daemon is available
    
    return metrics;
  }

  private async collectAllMetrics(): Promise<void> {
    const allMetrics: AggregatedMetric[] = [];

    for (const source of this.state.sources) {
      if (source.enabled) {
        const metrics = await this.collectMetricsFromSource(source);
        allMetrics.push(...metrics);
      }
    }

    this.state.aggregatedMetrics.push(...allMetrics);
    
    if (this.state.aggregatedMetrics.length > this.maxMetricHistory) {
      this.state.aggregatedMetrics = this.state.aggregatedMetrics.slice(-this.maxMetricHistory);
    }
  }

  private async analyzeTrends(): Promise<void> {
    if (!this.config.analytics.trendAnalysis) return;

    const metricGroups = this.groupMetricsByName();
    const trends: MetricTrend[] = [];

    for (const [metricName, metrics] of Object.entries(metricGroups)) {
      if (metrics.length >= 10) { // Need at least 10 data points for trend analysis
        const trend = this.calculateTrend(metricName, metrics);
        if (trend) {
          trends.push(trend);
        }
      }
    }

    this.state.trends = trends.slice(-this.maxTrendHistory);
  }

  private groupMetricsByName(): { [key: string]: AggregatedMetric[] } {
    const groups: { [key: string]: AggregatedMetric[] } = {};
    
    for (const metric of this.state.aggregatedMetrics) {
      if (!groups[metric.name]) {
        groups[metric.name] = [];
      }
      groups[metric.name].push(metric);
    }

    return groups;
  }

  private calculateTrend(metricName: string, metrics: AggregatedMetric[]): MetricTrend | null {
    if (metrics.length < 10) return null;

    const sortedMetrics = metrics.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const recentMetrics = sortedMetrics.slice(-5);
    const previousMetrics = sortedMetrics.slice(-10, -5);

    if (recentMetrics.length === 0 || previousMetrics.length === 0) return null;

    const currentValue = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
    const previousValue = previousMetrics.reduce((sum, m) => sum + m.value, 0) / previousMetrics.length;

    const changePercent = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (changePercent > 5) trend = 'increasing';
    else if (changePercent < -5) trend = 'decreasing';

    const confidence = Math.min(100, Math.abs(changePercent) * 10);

    return {
      metricName,
      timeRange: '5m',
      currentValue,
      previousValue,
      changePercent,
      trend,
      confidence,
      dataPoints: metrics.length
    };
  }

  private async detectAnomalies(): Promise<void> {
    if (!this.config.analytics.anomalyDetection) return;

    const metricGroups = this.groupMetricsByName();
    const newAnomalies: AnomalyDetection[] = [];

    for (const [metricName, metrics] of Object.entries(metricGroups)) {
      if (metrics.length >= 20) { // Need sufficient data for anomaly detection
        const baseline = this.getBaseline(metricName);
        if (baseline) {
          const recentMetrics = metrics.slice(-5);
          const avgValue = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
          
          const deviation = Math.abs(avgValue - baseline.baselineValue) / baseline.baselineValue;
          
          if (deviation > 0.2) { // 20% deviation threshold
            const anomaly: AnomalyDetection = {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              metricName,
              currentValue: avgValue,
              expectedValue: baseline.baselineValue,
              deviation,
              severity: deviation > 0.5 ? 'critical' : deviation > 0.3 ? 'high' : deviation > 0.2 ? 'medium' : 'low',
              confidence: Math.min(100, deviation * 100),
              description: `${metricName} is ${deviation > 0 ? 'above' : 'below'} expected baseline by ${(deviation * 100).toFixed(1)}%`,
              resolved: false
            };
            newAnomalies.push(anomaly);
          }
        }
      }
    }

    this.state.anomalies.push(...newAnomalies);
    
    if (this.state.anomalies.length > this.maxAnomalyHistory) {
      this.state.anomalies = this.state.anomalies.slice(-this.maxAnomalyHistory);
    }
  }

  private getBaseline(metricName: string): PerformanceBaseline | null {
    return this.state.baselines.find(b => b.metricName === metricName) || null;
  }

  private async calculateHealthScore(): Promise<void> {
    const factors: SystemHealthScore['factors'] = [];
    let overallScore = 100;

    // Performance factors
    const performanceMetrics = this.state.aggregatedMetrics.filter(m => m.metricType === 'performance');
    const avgResponseTime = performanceMetrics
      .filter(m => m.name.includes('response_time'))
      .reduce((sum, m) => sum + m.value, 0) / Math.max(1, performanceMetrics.filter(m => m.name.includes('response_time')).length);
    
    const performanceScore = Math.max(0, 100 - (avgResponseTime / 1000));
    factors.push({
      name: 'Response Time',
      weight: 0.3,
      score: performanceScore,
      impact: avgResponseTime > 2000 ? 'negative' : 'positive'
    });
    overallScore = overallScore * 0.7 + performanceScore * 0.3;

    // Reliability factors
    const reliabilityMetrics = this.state.aggregatedMetrics.filter(m => m.metricType === 'health');
    const avgHealthRatio = reliabilityMetrics
      .filter(m => m.name.includes('health_ratio'))
      .reduce((sum, m) => sum + m.value, 0) / Math.max(1, reliabilityMetrics.filter(m => m.name.includes('health_ratio')).length);
    
    factors.push({
      name: 'System Health',
      weight: 0.4,
      score: avgHealthRatio,
      impact: avgHealthRatio < 80 ? 'negative' : 'positive'
    });
    overallScore = overallScore * 0.6 + avgHealthRatio * 0.4;

    // Availability factors
    const activeSources = this.state.sources.filter(s => s.status === 'active').length;
    const totalSources = this.state.sources.filter(s => s.enabled).length;
    const availabilityScore = totalSources > 0 ? (activeSources / totalSources) * 100 : 100;
    
    factors.push({
      name: 'Service Availability',
      weight: 0.3,
      score: availabilityScore,
      impact: availabilityScore < 80 ? 'negative' : 'positive'
    });
    overallScore = overallScore * 0.7 + availabilityScore * 0.3;

    this.state.healthScore = {
      overall: Math.round(overallScore),
      performance: Math.round(performanceScore),
      reliability: Math.round(avgHealthRatio),
      availability: Math.round(availabilityScore),
      security: 100, // Placeholder
      timestamp: new Date().toISOString(),
      factors
    };
  }

  private async saveState(): Promise<void> {
    try {
      this.state.timestamp = new Date().toISOString();
      this.state.lastUpdate = new Date().toISOString();
      fs.writeFileSync(aggregatorStatePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      this.logEvent('state_error', `Failed to save state: ${error}`, 'error');
    }
  }

  private async sendToDashboard(): Promise<void> {
    try {
      if (this.config.integration.dashboard.enabled) {
        this.logEvent('component_error', '23359');
      }
    } catch (error) {
      this.logEvent('dashboard_error', `Failed to send to dashboard: ${error}`, 'error');
    }
  }

  private async aggregationLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        // Collect metrics from all sources
        await this.collectAllMetrics();
        
        // Analyze trends
        await this.analyzeTrends();
        
        // Detect anomalies
        await this.detectAnomalies();
        
        // Calculate health score
        await this.calculateHealthScore();
        
        // Save state
        await this.saveState();
        
        // Send to dashboard
        await this.sendToDashboard();
        
        this.logEvent('aggregation_cycle', 'Aggregation cycle completed');
        
        await new Promise(resolve => setTimeout(resolve, this.config.collection.intervalMs));
      } catch (error) {
        this.logEvent('aggregation_error', `Aggregation loop error: ${error}`, 'error');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    this.logEvent('system_startup', 'info');

    this.aggregationLoop().catch(error => {
      this.logEvent('system_error', `Aggregation loop failed: ${error}`, 'critical');
    });
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    this.logEvent('system_shutdown', 'info');
    await this.saveState();
  }

  public getState(): MetricsAggregatorState {
    return { ...this.state };
  }

  public getConfig(): MetricsAggregatorConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<MetricsAggregatorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.logEvent('config_update', 'newConfig');
  }

  public getAggregatedMetrics(limit: number = 1000): AggregatedMetric[] {
    return this.state.aggregatedMetrics.slice(-limit);
  }

  public getTrends(): MetricTrend[] {
    return [...this.state.trends];
  }

  public getHealthScore(): SystemHealthScore {
    return { ...this.state.healthScore };
  }

  public getAnomalies(limit: number = 100): AnomalyDetection[] {
    return this.state.anomalies.slice(-limit);
  }

  public isHealthy(): boolean {
    return this.state.healthScore.overall >= 70;
  }

  public clearHistory(): void {
    this.state.aggregatedMetrics = [];
    this.state.trends = [];
    this.state.anomalies = [];
    this.logEvent('component_error', '25954');
  }
}

let metricsAggregatorInstance: GhostMetricsAggregator | null = null;

export async function startGhostMetricsAggregator(): Promise<void> {
  if (!metricsAggregatorInstance) {
    metricsAggregatorInstance = new GhostMetricsAggregator();
  }
  await metricsAggregatorInstance.start();
}

export async function stopGhostMetricsAggregator(): Promise<void> {
  if (metricsAggregatorInstance) {
    await metricsAggregatorInstance.stop();
  }
}

export function getGhostMetricsAggregator(): GhostMetricsAggregator {
  if (!metricsAggregatorInstance) {
    metricsAggregatorInstance = new GhostMetricsAggregator();
  }
  return metricsAggregatorInstance;
}

export type {
  MetricSource,
  AggregatedMetric,
  MetricTrend,
  SystemHealthScore,
  PerformanceBaseline,
  AnomalyDetection,
  MetricsAggregatorConfig,
  MetricsAggregatorState
}; 