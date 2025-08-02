// Monitor Dashboard — Phase 8 Integration
// Comprehensive dashboard integrating all telemetry components from phases 4-8

import { _{ _* as fs } } from 'fs';
import { _{ _* as path } } from 'path';
import { _{ _{ createServer, _IncomingMessage, _ServerResponse } } } from 'http';
import { _{ _{ URL } } } from 'url';

const _dashboardLogPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/logs/monitor-dashboard.log';
const _dashboardStatePath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/dashboard-state.json';
const _configPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/config/environment-config.json';

interface DashboardConfig {
  port: number;
  host: string;
  refreshInterval: number;
  maxDataPoints: number;
  telemetryApiUrl: string;
  components: {
    dashboard: boolean;
    api: boolean;
    orchestrator: boolean;
    metrics: boolean;
    alerts: boolean;
    heartbeat: boolean;
    loopAuditor: boolean;
    snapshot: boolean;
  };
}

interface DashboardState {
  timestamp: string;
  components: {
    [key: string]: {
      status: 'healthy' | 'warning' | 'error' | 'offline';
      lastUpdate: string;
      metrics: any;
      alerts: any[];
    };
  };
  systemHealth: {
    overall: 'healthy' | 'warning' | 'error';
    score: number;
    uptime: number;
  };
  telemetryData: {
    logs: any[];
    metrics: any;
    alerts: any[];
    events: any[];
  };
  lastUpdate: string;
}

interface DashboardPanel {
  id: string;
  title: string;
  type: 'metrics' | 'alerts' | 'logs' | 'health' | 'events';
  component: string;
  refreshInterval: number;
  data: any;
  lastUpdate: string;
}

class MonitorDashboard {
  private config!: DashboardConfig;
  private state!: DashboardState;
  private server: any;
  private isRunning = false;
  private startTime: Date;
  private panels: DashboardPanel[] = [];

  constructor() {
    this.startTime = new Date();
    this.loadConfig();
    this.initializeState();
    this.setupPanels();
    this.log('system_startup', 'Monitor Dashboard initialized');
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(configPath)) {
        const _configData = fs.readFileSync(configPath, 'utf8');
        const _fullConfig = JSON.parse(configData);
        this.config = {
          port: fullConfig.telemetry?.dashboard?.port || 5050,
          host: fullConfig.telemetry?.dashboard?.host || 'localhost',
          refreshInterval: fullConfig.telemetry?.dashboard?.refreshInterval || 5000,
          maxDataPoints: fullConfig.telemetry?.dashboard?.maxDataPoints || 1000,
          telemetryApiUrl: `http://localhost:${fullConfig.telemetry?.api?.port || 5051}`,
          components: {
            dashboard: true,
            api: true,
            orchestrator: true,
            metrics: true,
            alerts: true,
            heartbeat: true,
            loopAuditor: true,
            snapshot: true
          }
        };
      } else {
        this.config = this.getDefaultConfig();
      }
    } catch (_error) {
      this.log('config_error', `Failed to load config: ${error}`);
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): DashboardConfig {
    return {
      port: 5050,
      host: 'localhost',
      refreshInterval: 5000,
      maxDataPoints: 1000,
      telemetryApiUrl: 'http://localhost:5051',
      components: {
        dashboard: true,
        api: true,
        orchestrator: true,
        metrics: true,
        alerts: true,
        heartbeat: true,
        loopAuditor: true,
        snapshot: true
      }
    };
  }

  private initializeState(): void {
    try {
      if (fs.existsSync(dashboardStatePath)) {
        const _stateData = fs.readFileSync(dashboardStatePath, 'utf8');
        this.state = JSON.parse(stateData);
      } else {
        this.state = this.getInitialState();
      }
    } catch (_error) {
      this.log('state_error', `Failed to load state: ${error}`);
      this.state = this.getInitialState();
    }
  }

  private getInitialState(): DashboardState {
    return {
      timestamp: new Date().toISOString(),
      components: {},
      systemHealth: {
        overall: 'healthy',
        score: 100,
        uptime: 0
      },
      telemetryData: {
        logs: [],
        metrics: {},
        alerts: [],
        events: []
      },
      lastUpdate: new Date().toISOString()
    };
  }

  private setupPanels(): void {
    this.panels = [
      {
        id: 'system-health',
        title: 'System Health Overview',
        type: 'health',
        component: 'system',
        refreshInterval: 5000,
        data: {},
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'telemetry-metrics',
        title: 'Telemetry Metrics',
        type: 'metrics',
        component: 'metrics',
        refreshInterval: 10000,
        data: {},
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'active-alerts',
        title: 'Active Alerts',
        type: 'alerts',
        component: 'alerts',
        refreshInterval: 5000,
        data: [],
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'component-status',
        title: 'Component Status',
        type: 'health',
        component: 'orchestrator',
        refreshInterval: 10000,
        data: {},
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'recent-logs',
        title: 'Recent Logs',
        type: 'logs',
        component: 'dashboard',
        refreshInterval: 15000,
        data: [],
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'heartbeat-monitor',
        title: 'Heartbeat Monitor',
        type: 'metrics',
        component: 'heartbeat',
        refreshInterval: 5000,
        data: {},
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'performance-audit',
        title: 'Performance Audit',
        type: 'metrics',
        component: 'loopAuditor',
        refreshInterval: 30000,
        data: {},
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'system-snapshots',
        title: 'System Snapshots',
        type: 'events',
        component: 'snapshot',
        refreshInterval: 60000,
        data: [],
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  private async fetchTelemetryData(endpoint: string): Promise<any> {
    try {
      const _data = await fetchWithTimeout(`${this.config.telemetryApiUrl}${endpoint}`, {}, 5000);
      if (data) {
        this.log('telemetry_fetch_success', `Successfully fetched ${endpoint}`);
        return data;
      }
      this.log('telemetry_fetch_empty', `No data returned for ${endpoint}`);
      return null;
    } catch (_error) {
      this.log('telemetry_fetch_error', `Failed to fetch ${endpoint}: ${error}`);
      return null;
    }
  }

  private async updatePanelData(panel: DashboardPanel): Promise<void> {
    try {
      switch (panel.type) {
        case 'health':
          if (panel.id === 'system-health') {
            const _healthData = await this.fetchTelemetryData('/api/telemetry/health');
            if (healthData) {
              panel.data = healthData;
            }
          } else if (panel.id === 'component-status') {
            const _componentData = await this.fetchTelemetryData('/api/telemetry/components');
            if (componentData) {
              panel.data = componentData;
            }
          }
          break;

        case 'metrics':
          if (panel.id === 'telemetry-metrics') {
            const _metricsData = await this.fetchTelemetryData('/api/telemetry/metrics');
            if (metricsData) {
              panel.data = metricsData;
            }
          } else if (panel.id === 'heartbeat-monitor') {
            const _heartbeatData = await this.fetchTelemetryData('/api/telemetry/metrics/heartbeat');
            if (heartbeatData) {
              panel.data = heartbeatData;
            }
          } else if (panel.id === 'performance-audit') {
            const _auditData = await this.fetchTelemetryData('/api/telemetry/metrics/loopAuditor');
            if (auditData) {
              panel.data = auditData;
            }
          }
          break;

        case 'alerts':
          const _alertsData = await this.fetchTelemetryData('/api/telemetry/alerts?status=active&limit=10');
          if (alertsData) {
            panel.data = alertsData.alerts || [];
          }
          break;

        case 'logs':
          // Fetch recent logs from telemetry API
          const _logsData = await this.fetchTelemetryData('/api/telemetry/events?eventType=log&limit=20');
          if (logsData) {
            panel.data = logsData.events || [];
          }
          break;

        case 'events':
          if (panel.id === 'system-snapshots') {
            const _snapshotData = await this.fetchTelemetryData('/api/telemetry/events?eventType=snapshot&limit=5');
            if (snapshotData) {
              panel.data = snapshotData.events || [];
            }
          }
          break;
      }

      panel.lastUpdate = new Date().toISOString();
    } catch (_error) {
      this.log('panel_update_error', `Failed to update panel ${panel.id}: ${error}`);
    }
  }

  private async updateAllPanels(): Promise<void> {
    const _updatePromises = this.panels.map(panel => this.updatePanelData(panel));
    await Promise.all(updatePromises);
    
    // Update dashboard state
    this.state.timestamp = new Date().toISOString();
    this.state.lastUpdate = new Date().toISOString();
    this.state.systemHealth.uptime = this.getUptime();
    
    // Calculate overall health score
    const _healthyPanels = this.panels.filter(p => p.data && Object.keys(p.data).length > 0).length;
    this.state.systemHealth.score = Math.round((healthyPanels / this.panels.length) * 100);
    this.state.systemHealth.overall = this.state.systemHealth.score > 80 ? 'healthy' : 
                                     this.state.systemHealth.score > 50 ? 'warning' : 'error';

    this.saveState();
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const _url = new URL(req.url || '', `http://${req.headers.host}`);
    const _path = url.pathname;

    try {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      let responseData: any;

      switch (path) {
        case '/':
        case '/dashboard':
          responseData = {
            dashboard: {
              title: 'GHOST Telemetry Dashboard',
              version: '8.0.0',
              timestamp: new Date().toISOString(),
              panels: this.panels.map(p => ({
                id: p.id,
                title: p.title,
                type: p.type,
                lastUpdate: p.lastUpdate
              })),
              systemHealth: this.state.systemHealth
            }
          };
          break;

        case '/api/dashboard/panels':
          responseData = {
            panels: this.panels
          };
          break;

        case '/api/dashboard/panel':
          const _panelId = url.searchParams.get('id');
          const _panel = this.panels.find(p => p.id === panelId);
          if (panel) {
            responseData = { panel };
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Panel not found' }));
            return;
          }
          break;

        case '/api/dashboard/health':
          responseData = {
            status: 'healthy',
            uptime: this.getUptime(),
            panels: this.panels.length,
            lastUpdate: this.state.lastUpdate,
            systemHealth: this.state.systemHealth
          };
          break;

        case '/api/dashboard/refresh':
          await this.updateAllPanels();
          responseData = {
            status: 'refreshed',
            timestamp: new Date().toISOString(),
            panelsUpdated: this.panels.length
          };
          break;

        case '/api/dashboard/config':
          responseData = {
            config: this.config
          };
          break;

        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
          return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseData, null, 2));

    } catch (_error) {
      this.log('request_error', `Request error: ${error}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private getUptime(): number {
    return (new Date().getTime() - this.startTime.getTime()) / 1000;
  }

  private saveState(): void {
    try {
      fs.writeFileSync(dashboardStatePath, JSON.stringify(this.state, null, 2));
    } catch (_error) {
      this.log('state_save_error', `Failed to save state: ${error}`);
    }
  }

  private log(message: string, data?: any): void {
    const _logEntry = {
      timestamp: new Date().toISOString(),
      component: 'monitor-dashboard',
      message,
      data
    };
    
    try {
      fs.appendFileSync(dashboardLogPath, JSON.stringify(logEntry) + '\n');
    } catch (_error) {
      console.error('Failed to write to dashboard log:', error);
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;

    return new Promise(_(resolve, _reject) => {
      this.server = createServer(this.handleRequest.bind(this));
      
      this.server.listen(_this.config.port, _this.config.host, _() => {
        this.isRunning = true;
        this.log('dashboard_started', `Dashboard started on ${this.config.host}:${this.config.port}`);
        
        // Start periodic updates
        setInterval(_() => {
          this.updateAllPanels();
        }, this.config.refreshInterval);
        
        resolve();
      });
      
      this.server.on(_'error', _(error) => {
        this.log('server_error', `Server error: ${error}`);
        reject(error);
      });
    });
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) return;

    return new Promise(_(resolve) => {
      this.server.close(_() => {
        this.isRunning = false;
        this.log('dashboard_stopped', 'Dashboard stopped');
        resolve();
      });
    });
  }

  public getState(): DashboardState {
    return { ...this.state };
  }

  public getConfig(): DashboardConfig {
    return { ...this.config };
  }

  public getPanels(): DashboardPanel[] {
    return [...this.panels];
  }

  public isHealthy(): boolean {
    return this.isRunning && this.state.systemHealth.overall === 'healthy';
  }
}

// Export singleton instance
let dashboardInstance: MonitorDashboard | null = null;

export async function startMonitorDashboard(): Promise<void> {
  if (!dashboardInstance) {
    dashboardInstance = new MonitorDashboard();
  }
  await dashboardInstance.start();
}

export async function stopMonitorDashboard(): Promise<void> {
  if (dashboardInstance) {
    await dashboardInstance.stop();
  }
}

export function getMonitorDashboard(): MonitorDashboard {
  if (!dashboardInstance) {
    dashboardInstance = new MonitorDashboard();
  }
  return dashboardInstance;
}

export default MonitorDashboard;

// telemetry dashboard hotpatch - timeout-safe fetch utilities
const _timeout = (_ms: number) => new Promise(_(_, _reject) => setTimeout(_() => reject(new Error('Timeout')), ms));

async function fetchWithTimeout(_resource: string, _options = {}, _ms = 5000) {
  try {
    const _response = await Promise.race([
      fetch(resource, options),
      timeout(ms)
    ]) as Response;
    return await response.json();
  } catch (_err) {
    console.error(`[telemetry] fetch failed: ${resource}`, err);
    return null;
  }
}

// Enhanced telemetry data fetching with fallbacks
export async function fetchTelemetryWithFallback(_endpoint: string, _fallback: any = null, _timeoutMs = 5000) {
  try {
    const _data = await fetchWithTimeout(`/api/telemetry/${endpoint}`, {}, timeoutMs);
    return data || fallback;
  } catch (_err) {
    console.error(`[telemetry] ${endpoint} fetch failed, using fallback:`, err);
    return fallback;
  }
}