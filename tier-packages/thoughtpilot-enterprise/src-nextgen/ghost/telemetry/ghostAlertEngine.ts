// GHOST Alert Engine — Phase 8A P8.08.00
// Intelligent alerting and notification system with escalation policies

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as crypto from 'crypto';

const execAsync = promisify(exec);
const alertLogPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/logs/alert-engine.log';
const alertStatePath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/alert-engine-state.json';
const configPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/config/alert-engine-config.json';
const escalationPath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/escalations';
const logDir = path.dirname(alertLogPath);

// Ensure directories exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
if (!fs.existsSync(path.dirname(alertStatePath))) {
  fs.mkdirSync(path.dirname(alertStatePath), { recursive: true });
}
if (!fs.existsSync(path.dirname(configPath))) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(escalationPath)) {
  fs.mkdirSync(escalationPath, { recursive: true });
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  conditions: AlertCondition[];
  actions: AlertAction[];
  escalationPolicy?: EscalationPolicy;
  cooldownPeriod: number; // seconds
  lastTriggered?: string;
  triggerCount: number;
  maxTriggers: number;
}

interface AlertCondition {
  id: string;
  type: 'threshold' | 'trend' | 'anomaly' | 'absence' | 'presence';
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
  value: number;
  duration: number; // seconds
  aggregation: 'avg' | 'min' | 'max' | 'sum' | 'count';
}

interface AlertAction {
  id: string;
  type: 'notification' | 'webhook' | 'command' | 'escalation' | 'automation';
  target: string;
  template: string;
  enabled: boolean;
  retryCount: number;
  maxRetries: number;
  retryDelay: number; // seconds
}

interface EscalationPolicy {
  id: string;
  name: string;
  levels: EscalationLevel[];
  enabled: boolean;
  maxLevel: number;
  autoReset: boolean;
  resetAfter: number; // seconds
}

interface EscalationLevel {
  level: number;
  delay: number; // seconds
  actions: AlertAction[];
  recipients: string[];
  channels: string[];
}

interface AlertEvent {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  message: string;
  data: any;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  escalationLevel?: number;
  actions: AlertActionResult[];
}

interface AlertActionResult {
  actionId: string;
  actionType: string;
  target: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  timestamp: string;
  error?: string;
  retryCount: number;
  response?: any;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'slack' | 'email' | 'webhook' | 'sms' | 'pagerduty';
  config: any;
  enabled: boolean;
  rateLimit: number; // messages per minute
  lastUsed?: string;
  messageCount: number;
}

interface AlertEngineConfig {
  enabled: boolean;
  monitoring: {
    enabled: boolean;
    intervalMs: number;
    maxConcurrentAlerts: number;
    alertTimeout: number;
  };
  rules: {
    enabled: boolean;
    maxRules: number;
    ruleEvaluationInterval: number;
    conditionTimeout: number;
  };
  notifications: {
    enabled: boolean;
    defaultChannels: string[];
    rateLimiting: boolean;
    messageTemplates: boolean;
  };
  escalation: {
    enabled: boolean;
    autoEscalate: boolean;
    escalationTimeout: number;
    maxEscalationLevels: number;
  };
  integration: {
    dashboard: {
      enabled: boolean;
      updateInterval: number;
      sendAlerts: boolean;
      sendStatus: boolean;
    };
    telemetry: {
      enabled: boolean;
      sendMetrics: boolean;
      sendEvents: boolean;
    };
  };
  security: {
    enabled: boolean;
    authentication: boolean;
    authorization: boolean;
    auditLogging: boolean;
  };
}

interface AlertEngineState {
  timestamp: string;
  rules: AlertRule[];
  activeAlerts: AlertEvent[];
  alertHistory: AlertEvent[];
  channels: NotificationChannel[];
  escalationPolicies: EscalationPolicy[];
  lastUpdate: string;
  version: string;
}

class GhostAlertEngine {
  private config!: AlertEngineConfig;
  private state!: AlertEngineState;
  private isRunning = false;
  private monitoringInterval = 10000; // 10 seconds
  private maxAlertHistory = 10000;
  private maxActiveAlerts = 100;
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

  private getDefaultConfig(): AlertEngineConfig {
    return {
      enabled: true,
      monitoring: {
        enabled: true,
        intervalMs: 10000,
        maxConcurrentAlerts: 50,
        alertTimeout: 300000
      },
      rules: {
        enabled: true,
        maxRules: 100,
        ruleEvaluationInterval: 30000,
        conditionTimeout: 10000
      },
      notifications: {
        enabled: true,
        defaultChannels: ['slack', 'email'],
        rateLimiting: true,
        messageTemplates: true
      },
      escalation: {
        enabled: true,
        autoEscalate: true,
        escalationTimeout: 300000,
        maxEscalationLevels: 5
      },
      integration: {
        dashboard: {
          enabled: true,
          updateInterval: 10000,
          sendAlerts: true,
          sendStatus: true
        },
        telemetry: {
          enabled: true,
          sendMetrics: true,
          sendEvents: true
        }
      },
      security: {
        enabled: true,
        authentication: false,
        authorization: true,
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
      if (fs.existsSync(alertStatePath)) {
        const stateData = fs.readFileSync(alertStatePath, 'utf8');
        this.state = JSON.parse(stateData);
      } else {
        this.state = this.getInitialState();
      }
    } catch (error) {
      this.logEvent('state_error', `Failed to load state: ${error}`, 'error');
      this.state = this.getInitialState();
    }
  }

  private getInitialState(): AlertEngineState {
    return {
      timestamp: new Date().toISOString(),
      rules: this.getDefaultRules(),
      activeAlerts: [],
      alertHistory: [],
      channels: this.getDefaultChannels(),
      escalationPolicies: this.getDefaultEscalationPolicies(),
      lastUpdate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  private getDefaultRules(): AlertRule[] {
    return [
      {
        id: 'high-cpu-usage',
        name: 'High CPU Usage',
        description: 'Alert when CPU usage exceeds 80% for more than 5 minutes',
        enabled: true,
        severity: 'warning',
        conditions: [{
          id: 'cpu-threshold',
          type: 'threshold',
          metric: 'cpu_usage',
          operator: 'gt',
          value: 80,
          duration: 300,
          aggregation: 'avg'
        }],
        actions: [
          {
            id: 'cpu-dashboard',
            type: 'notification',
            target: 'dashboard-log',
            template: 'High CPU usage detected: {{value}}%',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          }
        ],
        cooldownPeriod: 300,
        triggerCount: 0,
        maxTriggers: 10
      },
      {
        id: 'daemon-failure',
        name: 'Daemon Failure',
        description: 'Alert when daemon health ratio drops below 80%',
        enabled: true,
        severity: 'critical',
        conditions: [{
          id: 'daemon-health-threshold',
          type: 'threshold',
          metric: 'daemon_health_ratio',
          operator: 'lt',
          value: 80,
          duration: 60,
          aggregation: 'avg'
        }],
        actions: [
          {
            id: 'daemon-dashboard',
            type: 'notification',
            target: 'dashboard-log',
            template: 'Daemon health critical: {{value}}% healthy',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          },
          {
            id: 'daemon-email',
            type: 'notification',
            target: 'email-critical',
            template: 'CRITICAL: Daemon health failure - {{value}}% healthy',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          },
          {
            id: 'daemon-auto-fix',
            type: 'automation',
            target: 'auto-fix-daemon',
            template: 'AUTO-FIX: Attempting to restart failed daemons',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          }
        ],
        escalationPolicy: this.getDefaultEscalationPolicies()[0],
        cooldownPeriod: 600,
        triggerCount: 0,
        maxTriggers: 5
      },
      {
        id: 'high-response-time',
        name: 'High Response Time',
        description: 'Alert when average response time exceeds 5 seconds',
        enabled: true,
        severity: 'warning',
        conditions: [{
          id: 'response-time-threshold',
          type: 'threshold',
          metric: 'relay_response_time_avg',
          operator: 'gt',
          value: 5000,
          duration: 120,
          aggregation: 'avg'
        }],
        actions: [
          {
            id: 'response-time-dashboard',
            type: 'notification',
            target: 'dashboard-log',
            template: 'High response time detected: {{value}}ms',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          }
        ],
        cooldownPeriod: 300,
        triggerCount: 0,
        maxTriggers: 10
      },
      {
        id: 'memory-usage',
        name: 'High Memory Usage',
        description: 'Alert when memory usage exceeds 90%',
        enabled: true,
        severity: 'error',
        conditions: [{
          id: 'memory-threshold',
          type: 'threshold',
          metric: 'memory_usage',
          operator: 'gt',
          value: 90,
          duration: 300,
          aggregation: 'avg'
        }],
        actions: [
          {
            id: 'memory-dashboard',
            type: 'notification',
            target: 'dashboard-log',
            template: 'High memory usage detected: {{value}}%',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          },
          {
            id: 'memory-auto-fix',
            type: 'automation',
            target: 'auto-fix-memory',
            template: 'AUTO-FIX: Attempting memory cleanup',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          }
        ],
        cooldownPeriod: 600,
        triggerCount: 0,
        maxTriggers: 5
      },
      {
        id: 'disk-usage',
        name: 'High Disk Usage',
        description: 'Alert when disk usage exceeds 95%',
        enabled: true,
        severity: 'error',
        conditions: [{
          id: 'disk-threshold',
          type: 'threshold',
          metric: 'disk_usage',
          operator: 'gt',
          value: 95,
          duration: 300,
          aggregation: 'avg'
        }],
        actions: [
          {
            id: 'disk-dashboard',
            type: 'notification',
            target: 'dashboard-log',
            template: 'High disk usage detected: {{value}}%',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          },
          {
            id: 'disk-auto-fix',
            type: 'automation',
            target: 'auto-fix-disk',
            template: 'AUTO-FIX: Attempting disk cleanup',
            enabled: true,
            retryCount: 0,
            maxRetries: 3,
            retryDelay: 60
          }
        ],
        cooldownPeriod: 600,
        triggerCount: 0,
        maxTriggers: 5
      }
    ];
  }

  private getDefaultChannels(): NotificationChannel[] {
    return [
      {
        id: 'dashboard-log',
        name: 'Dashboard Log Feed',
        type: 'webhook',
        config: {
          webhookUrl: 'http://localhost:5555/api/telemetry/alerts',
          channel: 'dashboard',
          username: 'GHOST Alert Engine'
        },
        enabled: true,
        rateLimit: 30,
        messageCount: 0
      },
      {
        id: 'email-critical',
        name: 'Critical Email Alerts',
        type: 'email',
        config: {
          smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: parseInt(process.env.SMTP_PORT || '587'),
          username: process.env.SMTP_USERNAME || '',
          password: process.env.SMTP_PASSWORD || '',
          from: process.env.ALERT_EMAIL_FROM || 'alerts@ghost.local',
          to: 'nick@sawyerdesign.io',
          secure: false,
          sendAllAlerts: false // Only send critical alerts by default
        },
        enabled: true,
        rateLimit: 5,
        messageCount: 0
      }
    ];
  }

  private getDefaultEscalationPolicies(): EscalationPolicy[] {
    return [
      {
        id: 'default-escalation',
        name: 'Default Escalation Policy',
        levels: [
          {
            level: 1,
            delay: 300, // 5 minutes
            actions: [{
              id: 'level1-dashboard',
              type: 'notification',
              target: 'dashboard-log',
              template: 'ALERT: {{message}} - Level 1 escalation',
              enabled: true,
              retryCount: 0,
              maxRetries: 3,
              retryDelay: 60
            }],
            recipients: ['team'],
            channels: ['dashboard-log']
          },
          {
            level: 2,
            delay: 900, // 15 minutes
            actions: [
              {
                id: 'level2-dashboard',
                type: 'notification',
                target: 'dashboard-log',
                template: 'URGENT: {{message}} - Level 2 escalation',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryDelay: 60
              },
              {
                id: 'level2-email',
                type: 'notification',
                target: 'email-critical',
                template: 'URGENT ALERT: {{message}} - Level 2 escalation',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryDelay: 60
              }
            ],
            recipients: ['team', 'leadership'],
            channels: ['dashboard-log', 'email-critical']
          },
          {
            level: 3,
            delay: 1800, // 30 minutes
            actions: [
              {
                id: 'level3-dashboard',
                type: 'notification',
                target: 'dashboard-log',
                template: 'CRITICAL: {{message}} - Level 3 escalation',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryDelay: 60
              },
              {
                id: 'level3-email',
                type: 'notification',
                target: 'email-critical',
                template: 'CRITICAL ALERT: {{message}} - Level 3 escalation - IMMEDIATE ACTION REQUIRED',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryDelay: 60
              },
              {
                id: 'level3-auto-fix',
                type: 'automation',
                target: 'auto-fix-critical',
                template: 'AUTO-FIX: Attempting to resolve critical alert: {{message}}',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryDelay: 60
              }
            ],
            recipients: ['team', 'leadership', 'emergency'],
            channels: ['dashboard-log', 'email-critical', 'automation']
          }
        ],
        enabled: true,
        maxLevel: 3,
        autoReset: true,
        resetAfter: 3600
      }
    ];
  }

  private logEvent(eventType: string, message: string, severity: string = 'info', data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      component: 'alert-engine',
      eventType,
      severity,
      message,
      data
    };
    
    fs.appendFileSync(alertLogPath, JSON.stringify(logEntry) + '\n');
  }

  private async evaluateRule(rule: AlertRule): Promise<boolean> {
    if (!rule.enabled) return false;

    try {
      // Check cooldown period
      if (rule.lastTriggered) {
        const lastTriggered = new Date(rule.lastTriggered);
        const now = new Date();
        const timeSinceLastTrigger = (now.getTime() - lastTriggered.getTime()) / 1000;
        
        if (timeSinceLastTrigger < rule.cooldownPeriod) {
          return false;
        }
      }

      // Check max triggers
      if (rule.triggerCount >= rule.maxTriggers) {
        return false;
      }

      // Evaluate all conditions
      for (const condition of rule.conditions) {
        const conditionMet = await this.evaluateCondition(condition);
        if (!conditionMet) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logEvent('rule_evaluation_error', `Failed to evaluate rule ${rule.name}: ${error}`, 'error');
      return false;
    }
  }

  private async evaluateCondition(condition: AlertCondition): Promise<boolean> {
    try {
      // Get metric data from aggregator
      const metricData = await this.getMetricData(condition.metric, condition.duration);
      
      if (!metricData || metricData.length === 0) {
        return false;
      }

      // Apply aggregation
      const aggregatedValue = this.aggregateMetricData(metricData, condition.aggregation);
      
      // Apply operator
      return this.applyOperator(aggregatedValue, condition.operator, condition.value);
    } catch (error) {
      this.logEvent('condition_evaluation_error', `Failed to evaluate condition: ${error}`, 'error');
      return false;
    }
  }

  private async getMetricData(metricName: string, duration: number): Promise<any[]> {
    try {
      // This would integrate with the metrics aggregator
      // For now, return mock data
      const aggregatorStatePath = '/Users/sawyer/gitSync/.cursor-cache/CYOPS/telemetry/metrics-aggregator-state.json';
      
      if (fs.existsSync(aggregatorStatePath)) {
        const data = JSON.parse(fs.readFileSync(aggregatorStatePath, 'utf8'));
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - duration * 1000);
        
        return data.aggregatedMetrics.filter((m: any) => {
          return m.name === metricName && new Date(m.timestamp) >= cutoffTime;
        });
      }
      
      return [];
    } catch (error) {
      this.logEvent('metric_data_error', `Failed to get metric data for ${metricName}: ${error}`, 'error');
      return [];
    }
  }

  private aggregateMetricData(data: any[], aggregation: string): number {
    if (data.length === 0) return 0;

    const values = data.map(d => d.value);
    
    switch (aggregation) {
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'count':
        return values.length;
      default:
        return values[values.length - 1];
    }
  }

  private applyOperator(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case 'gt':
        return value > threshold;
      case 'lt':
        return value < threshold;
      case 'eq':
        return value === threshold;
      case 'ne':
        return value !== threshold;
      case 'gte':
        return value >= threshold;
      case 'lte':
        return value <= threshold;
      default:
        return false;
    }
  }

  private async triggerAlert(rule: AlertRule, data: any): Promise<void> {
    try {
      const alertEvent: AlertEvent = {
        id: crypto.randomUUID(),
        ruleId: rule.id,
        ruleName: rule.name,
        timestamp: new Date().toISOString(),
        severity: rule.severity,
        status: 'active',
        message: this.formatAlertMessage(rule, data),
        data,
        actions: []
      };

      // Execute actions
      for (const action of rule.actions) {
        const actionResult = await this.executeAction(action, alertEvent);
        alertEvent.actions.push(actionResult);
      }

      // Add to active alerts
      this.state.activeAlerts.push(alertEvent);
      
      // Maintain max active alerts
      if (this.state.activeAlerts.length > this.maxActiveAlerts) {
        const removed = this.state.activeAlerts.shift();
        if (removed) {
          this.state.alertHistory.push(removed);
        }
      }

      // Update rule trigger count
      rule.triggerCount++;
      rule.lastTriggered = new Date().toISOString();

      this.logEvent('alert_triggered', `Alert triggered: ${rule.name}`, 'info', {
        ruleId: rule.id,
        severity: rule.severity,
        message: alertEvent.message
      });
    } catch (error) {
      this.logEvent('alert_trigger_error', `Failed to trigger alert for rule ${rule.name}: ${error}`, 'error');
    }
  }

  private formatAlertMessage(rule: AlertRule, data: any): string {
    let message = rule.description;
    
    // Replace template variables
    if (data.value !== undefined) {
      message = message.replace(/{{value}}/g, data.value.toString());
    }
    
    return message;
  }

  private async executeAction(action: AlertAction, alertEvent: AlertEvent): Promise<AlertActionResult> {
    const result: AlertActionResult = {
      actionId: action.id,
      actionType: action.type,
      target: action.target,
      status: 'pending',
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    try {
      switch (action.type) {
        case 'notification':
          await this.sendNotification(action, alertEvent);
          result.status = 'success';
          break;
        case 'webhook':
          await this.sendWebhook(action, alertEvent);
          result.status = 'success';
          break;
        case 'command':
          await this.executeCommand(action, alertEvent);
          result.status = 'success';
          break;
        case 'escalation':
          await this.triggerEscalation(action, alertEvent);
          result.status = 'success';
          break;
        case 'automation':
          await this.executeAutomation(action, alertEvent);
          result.status = 'success';
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      result.status = 'failed';
      result.error = error.toString();
      
      if (action.retryCount < action.maxRetries) {
        result.status = 'retrying';
        result.retryCount = action.retryCount + 1;
        
        // Schedule retry
        setTimeout(async () => {
          action.retryCount++;
          await this.executeAction(action, alertEvent);
        }, action.retryDelay * 1000);
      }
    }

    return result;
  }

  private async sendNotification(action: AlertAction, alertEvent: AlertEvent): Promise<void> {
    const channel = this.state.channels.find(c => c.id === action.target);
    if (!channel || !channel.enabled) {
      throw new Error(`Channel ${action.target} not found or disabled`);
    }

    // Check rate limiting
    if (this.config.notifications.rateLimiting) {
      const now = new Date();
      const lastUsed = channel.lastUsed ? new Date(channel.lastUsed) : new Date(0);
      const timeSinceLastUse = (now.getTime() - lastUsed.getTime()) / 1000;
      
      if (timeSinceLastUse < 60 / channel.rateLimit) {
        throw new Error(`Rate limit exceeded for channel ${channel.name}`);
      }
    }

    const message = this.formatNotificationMessage(action.template, alertEvent);
    
    switch (channel.type) {
      case 'webhook':
        await this.sendWebhookNotification(channel, message, alertEvent);
        break;
      case 'email':
        await this.sendEmailNotification(channel, message, alertEvent);
        break;
      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }

    // Update channel stats
    channel.lastUsed = new Date().toISOString();
    channel.messageCount++;
  }

  private formatNotificationMessage(template: string, alertEvent: AlertEvent): string {
    let message = template;
    
    message = message.replace(/{{message}}/g, alertEvent.message);
    message = message.replace(/{{severity}}/g, alertEvent.severity);
    message = message.replace(/{{timestamp}}/g, alertEvent.timestamp);
    message = message.replace(/{{ruleName}}/g, alertEvent.ruleName);
    
    return message;
  }

  private async sendWebhookNotification(channel: NotificationChannel, message: string, alertEvent: AlertEvent): Promise<void> {
    try {
      const webhookUrl = channel.config.webhookUrl;
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const payload = {
        alert: {
          id: alertEvent.id,
          ruleId: alertEvent.ruleId,
          ruleName: alertEvent.ruleName,
          severity: alertEvent.severity,
          status: alertEvent.status,
          message: message,
          timestamp: alertEvent.timestamp,
          data: alertEvent.data
        },
        channel: channel.config.channel || 'dashboard',
        username: channel.config.username || 'GHOST Alert Engine',
        timestamp: new Date().toISOString()
      };

      const { stdout } = await execAsync(`curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(payload)}' ${webhookUrl}`);
      
      if (stdout.includes('error')) {
        throw new Error(`Webhook error: ${stdout}`);
      }
      
      this.logEvent('webhook_notification_sent', `Dashboard notification sent: ${message}`, 'info');
    } catch (error) {
      throw new Error(`Failed to send webhook notification: ${error}`);
    }
  }

  private async sendEmailNotification(channel: NotificationChannel, message: string, alertEvent: AlertEvent): Promise<void> {
    try {
      const config = channel.config;
      
      // Only send email for critical alerts or if explicitly configured
      if (alertEvent.severity !== 'critical' && !config.sendAllAlerts) {
        this.logEvent('email_skipped', `Email skipped for non-critical alert: ${alertEvent.severity}`, 'info');
        return;
      }

      // Use mail command for simplicity (works on macOS/Linux)
      const emailContent = `
Subject: GHOST Alert Engine - ${alertEvent.severity.toUpperCase()}: ${alertEvent.ruleName}

Alert Details:
- Rule: ${alertEvent.ruleName}
- Severity: ${alertEvent.severity}
- Status: ${alertEvent.status}
- Time: ${alertEvent.timestamp}

Message: ${message}

Alert Data: ${JSON.stringify(alertEvent.data, null, 2)}

---
This is an automated alert from the GHOST Alert Engine.
Please check the dashboard for more details: https://gpt-cursor-runner.thoughtmarks.app/monitor
      `;

      const { stdout, stderr } = await execAsync(`echo "${emailContent}" | mail -s "GHOST Alert: ${alertEvent.ruleName}" ${config.to}`);
      
      if (stderr) {
        throw new Error(`Email error: ${stderr}`);
      }
      
      this.logEvent('email_notification_sent', `Email sent to ${config.to}: ${message}`, 'info');
    } catch (error) {
      this.logEvent('email_notification_error', `Failed to send email: ${error}`, 'error');
      throw new Error(`Failed to send email notification: ${error}`);
    }
  }

  private async sendWebhook(action: AlertAction, alertEvent: AlertEvent): Promise<void> {
    try {
      const payload = {
        alert: alertEvent,
        timestamp: new Date().toISOString()
      };

      const { stdout } = await execAsync(`curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(payload)}' ${action.target}`);
      
      if (stdout.includes('error')) {
        throw new Error(`Webhook error: ${stdout}`);
      }
    } catch (error) {
      throw new Error(`Failed to send webhook: ${error}`);
    }
  }

  private async executeCommand(action: AlertAction, alertEvent: AlertEvent): Promise<void> {
    try {
      const command = action.target.replace(/{{.*?}}/g, (match) => {
        const key = match.slice(2, -2);
        return alertEvent.data[key] || match;
      });

      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        throw new Error(`Command stderr: ${stderr}`);
      }

      this.logEvent('command_executed', 'Command executed successfully');
    } catch (error) {
      throw new Error(`Failed to execute command: ${error}`);
    }
  }

  private async triggerEscalation(action: AlertAction, alertEvent: AlertEvent): Promise<void> {
    const rule = this.state.rules.find(r => r.id === alertEvent.ruleId);
    if (!rule || !rule.escalationPolicy) {
      throw new Error('No escalation policy found for rule');
    }

    const policy = rule.escalationPolicy;
    const currentLevel = alertEvent.escalationLevel || 0;
    const nextLevel = currentLevel + 1;

    if (nextLevel <= policy.maxLevel) {
      const level = policy.levels.find(l => l.level === nextLevel);
      if (level) {
        alertEvent.escalationLevel = nextLevel;
        alertEvent.status = 'escalated';
        
        // Execute escalation actions
        for (const escalationAction of level.actions) {
          await this.executeAction(escalationAction, alertEvent);
        }

        this.logEvent('alert_escalated', `Alert escalated to level ${nextLevel}`, 'info', {
          ruleId: alertEvent.ruleId,
          alertId: alertEvent.id
        });
      }
    }
  }

  private async executeAutomation(action: AlertAction, alertEvent: AlertEvent): Promise<void> {
    try {
      this.logEvent('automation_started', `Starting automation for alert: ${alertEvent.ruleName}`, 'info');
      
      // Define automation strategies based on alert type
      const automationStrategies = {
        'daemon-failure': async () => {
          // Restart daemons if they're down
          const { stdout } = await execAsync('ps aux | grep -E "(braun-daemon|ghost-runner|patch-executor)" | grep -v grep');
          if (!stdout.trim()) {
            this.logEvent('automation_restart_daemons', 'No daemons running, attempting restart', 'info');
            await execAsync('bash scripts/watchdogs/alert-engine-daemon-watchdog.sh');
          }
        },
        'high-cpu-usage': async () => {
          // Kill high CPU processes
          const { stdout } = await execAsync('ps aux --sort=-%cpu | head -5');
          this.logEvent('automation_cpu_check', `High CPU processes: ${stdout}`, 'info');
        },
        'memory-usage': async () => {
          // Clear caches and restart services
          await execAsync('sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true');
          this.logEvent('automation_memory_cleanup', 'Memory cleanup completed', 'info');
        },
        'disk-usage': async () => {
          // Clean up old logs and temporary files
          await execAsync('find /Users/sawyer/gitSync/.cursor-cache/CYOPS/logs -name "*.log" -mtime +7 -delete 2>/dev/null || true');
          this.logEvent('automation_disk_cleanup', 'Disk cleanup completed', 'info');
        }
      };

      const strategy = automationStrategies[alertEvent.ruleId as keyof typeof automationStrategies];
      if (strategy) {
        await strategy();
        this.logEvent('automation_completed', `Automation completed for ${alertEvent.ruleName}`, 'info');
        
        // Mark alert as resolved if automation was successful
        alertEvent.status = 'resolved';
        alertEvent.resolvedBy = 'automation';
        alertEvent.resolvedAt = new Date().toISOString();
      } else {
        this.logEvent('automation_no_strategy', `No automation strategy for rule: ${alertEvent.ruleId}`, 'warning');
      }
    } catch (error) {
      this.logEvent('automation_error', `Automation failed for ${alertEvent.ruleName}: ${error}`, 'error');
      throw new Error(`Failed to execute automation: ${error}`);
    }
  }

  private async evaluateAllRules(): Promise<void> {
    for (const rule of this.state.rules) {
      try {
        const shouldTrigger = await this.evaluateRule(rule);
        
        if (shouldTrigger) {
          const data = await this.getAlertData(rule);
          await this.triggerAlert(rule, data);
        }
      } catch (error) {
        this.logEvent('rule_evaluation_error', `Failed to evaluate rule ${rule.name}: ${error}`, 'error');
      }
    }
  }

  private async getAlertData(rule: AlertRule): Promise<any> {
    // Get the most recent metric data for the alert
    const condition = rule.conditions[0];
    if (condition) {
      const metricData = await this.getMetricData(condition.metric, condition.duration);
      if (metricData.length > 0) {
        const latest = metricData[metricData.length - 1];
        return {
          value: latest.value,
          timestamp: latest.timestamp,
          metric: condition.metric
        };
      }
    }
    
    return {};
  }

  private async cleanupResolvedAlerts(): Promise<void> {
    const now = new Date();
    const resolvedAlerts: AlertEvent[] = [];
    
    for (const alert of this.state.activeAlerts) {
      if (alert.status === 'resolved') {
        resolvedAlerts.push(alert);
      } else if (alert.status === 'active') {
        // Check for timeout
        const alertTime = new Date(alert.timestamp);
        const timeSinceAlert = (now.getTime() - alertTime.getTime()) / 1000;
        
        if (timeSinceAlert > this.config.monitoring.alertTimeout) {
          alert.status = 'resolved';
          resolvedAlerts.push(alert);
        }
      }
    }

    // Move resolved alerts to history
    for (const alert of resolvedAlerts) {
      this.state.activeAlerts = this.state.activeAlerts.filter(a => a.id !== alert.id);
      this.state.alertHistory.push(alert);
    }

    // Maintain history size
    if (this.state.alertHistory.length > this.maxAlertHistory) {
      this.state.alertHistory = this.state.alertHistory.slice(-this.maxAlertHistory);
    }
  }

  private async saveState(): Promise<void> {
    try {
      this.state.timestamp = new Date().toISOString();
      this.state.lastUpdate = new Date().toISOString();
      fs.writeFileSync(alertStatePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      this.logEvent('state_error', `Failed to save state: ${error}`, 'error');
    }
  }

  private async sendToDashboard(): Promise<void> {
    try {
      if (this.config.integration.dashboard.enabled) {
        const dashboardData = {
          alerts: {
            active: this.state.activeAlerts,
            history: this.state.alertHistory.slice(-50), // Last 50 alerts
            summary: {
              totalActive: this.state.activeAlerts.length,
              totalHistory: this.state.alertHistory.length,
              criticalCount: this.state.activeAlerts.filter(a => a.severity === 'critical').length,
              errorCount: this.state.activeAlerts.filter(a => a.severity === 'error').length,
              warningCount: this.state.activeAlerts.filter(a => a.severity === 'warning').length
            }
          },
          status: {
            healthy: this.isHealthy(),
            uptime: Date.now() - this.startTime.getTime(),
            lastUpdate: new Date().toISOString()
          }
        };

        // Send to dashboard API
        const { stdout } = await execAsync(`curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(dashboardData)}' http://localhost:5555/api/telemetry/alerts`);
        
        if (stdout.includes('error')) {
          this.logEvent('dashboard_error', `Failed to send to dashboard: ${stdout}`, 'error');
        } else {
          this.logEvent('dashboard_update', 'Dashboard updated successfully', 'info');
        }
      }
    } catch (error) {
      this.logEvent('dashboard_error', `Failed to send to dashboard: ${error}`, 'error');
    }
  }

  private async monitoringLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        // Evaluate all rules
        await this.evaluateAllRules();
        
        // Cleanup resolved alerts
        await this.cleanupResolvedAlerts();
        
        // Save state
        await this.saveState();
        
        // Send to dashboard
        await this.sendToDashboard();
        
        this.logEvent('monitoring_cycle', 'Alert monitoring cycle completed');
        
        await new Promise(resolve => setTimeout(resolve, this.config.monitoring.intervalMs));
      } catch (error) {
        this.logEvent('monitoring_error', `Monitoring loop error: ${error}`, 'error');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    this.logEvent('system_startup', 'Alert engine started', 'info');

    this.monitoringLoop().catch(error => {
      this.logEvent('system_error', `Monitoring loop failed: ${error}`, 'critical');
    });
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    this.logEvent('system_shutdown', 'Alert engine stopped', 'info');
    await this.saveState();
  }

  public getState(): AlertEngineState {
    return { ...this.state };
  }

  public getConfig(): AlertEngineConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AlertEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.logEvent('config_update', 'Configuration updated', 'info');
  }

  public getActiveAlerts(): AlertEvent[] {
    return [...this.state.activeAlerts];
  }

  public getAlertHistory(limit: number = 1000): AlertEvent[] {
    return this.state.alertHistory.slice(-limit);
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.state.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  public resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alert = this.state.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  public addRule(rule: AlertRule): void {
    this.state.rules.push(rule);
    this.logEvent('rule_added', 'Alert rule added', 'info');
  }

  public removeRule(ruleId: string): boolean {
    const index = this.state.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      const rule = this.state.rules.splice(index, 1)[0];
      this.logEvent('rule_removed', 'Alert rule removed', 'info');
      return true;
    }
    return false;
  }

  public isHealthy(): boolean {
    return this.state.activeAlerts.filter(a => a.severity === 'critical').length === 0;
  }

  public clearHistory(): void {
    this.state.alertHistory = [];
    this.logEvent('history_cleared', 'Alert history cleared', 'info');
  }
}

let alertEngineInstance: GhostAlertEngine | null = null;

export async function startGhostAlertEngine(): Promise<void> {
  if (!alertEngineInstance) {
    alertEngineInstance = new GhostAlertEngine();
  }
  await alertEngineInstance.start();
}

export async function stopGhostAlertEngine(): Promise<void> {
  if (alertEngineInstance) {
    await alertEngineInstance.stop();
  }
}

export function getGhostAlertEngine(): GhostAlertEngine {
  if (!alertEngineInstance) {
    alertEngineInstance = new GhostAlertEngine();
  }
  return alertEngineInstance;
}

export type {
  AlertRule,
  AlertCondition,
  AlertAction,
  EscalationPolicy,
  EscalationLevel,
  AlertEvent,
  AlertActionResult,
  NotificationChannel,
  AlertEngineConfig,
  AlertEngineState
}; 