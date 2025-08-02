import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    dualMonitor: boolean;
    telemetryApi: boolean;
    realTimeStatusApi: boolean;
  };
  timestamp: string;
}

export async function runHealthCheck(): Promise<HealthCheckResult> {
  console.log('[HEALTH-CHECK] Running comprehensive health check...');
  
  const result: HealthCheckResult = {
    status: 'healthy',
    services: {
      dualMonitor: false,
      telemetryApi: false,
      realTimeStatusApi: false
    },
    timestamp: new Date().toISOString()
  };

  try {
    // Check dualMonitor
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/health');
      if (stdout.includes('healthy') || stdout.includes('ok')) {
        result.services.dualMonitor = true;
        console.log('[HEALTH-CHECK] ✅ DualMonitor: HEALTHY');
      }
    } catch (_error) {
      console.log('[HEALTH-CHECK] ❌ DualMonitor: UNHEALTHY');
    }

    // Check telemetry API
    try {
      const { stdout } = await execAsync('curl -s http://localhost:8788/health');
      if (stdout.includes('healthy') || stdout.includes('ok')) {
        result.services.telemetryApi = true;
        console.log('[HEALTH-CHECK] ✅ Telemetry API: HEALTHY');
      }
    } catch (_error) {
      console.log('[HEALTH-CHECK] ❌ Telemetry API: UNHEALTHY');
    }

    // Check real-time status API
    try {
      const { stdout } = await execAsync('curl -s http://localhost:8789/health');
      if (stdout.includes('healthy') || stdout.includes('ok')) {
        result.services.realTimeStatusApi = true;
        console.log('[HEALTH-CHECK] ✅ Real-Time Status API: HEALTHY');
      }
    } catch (_error) {
      console.log('[HEALTH-CHECK] ❌ Real-Time Status API: UNHEALTHY');
    }

    // Determine overall status
    const healthyServices = Object.values(result.services).filter(Boolean).length;
    if (healthyServices === 3) {
      result.status = 'healthy';
    } else if (healthyServices >= 1) {
      result.status = 'degraded';
    } else {
      result.status = 'unhealthy';
    }

    console.log(`[HEALTH-CHECK] Overall Status: ${result.status.toUpperCase()}`);
    console.log(`[HEALTH-CHECK] Healthy Services: ${healthyServices}/3`);
    
    return result;
  } catch (error) {
    console.error('[HEALTH-CHECK] Error during health check:', error);
    result.status = 'unhealthy';
    return result;
  }
}

export async function restartDualMonitor(): Promise<void> {
  console.log('[DUAL-MONITOR] Restarting dual monitor...');
  
  try {
    // Kill existing dual monitor process
    try {
      await execAsync('pkill -f "dualMonitor.js"');
      console.log('[DUAL-MONITOR] ✅ Killed existing dual monitor process');
    } catch (_error) {
      console.log('[DUAL-MONITOR] No existing dual monitor process found');
    }

    // Wait a moment for process cleanup
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Start dual monitor
    const { stdout, stderr } = await execAsync('node scripts/monitor/dualMonitor.js start', {
      cwd: process.cwd()
    });
    
    console.log('[DUAL-MONITOR] ✅ Dual monitor restarted successfully');
    console.log('[DUAL-MONITOR] Output:', stdout);
    
    if (stderr) {
      console.log('[DUAL-MONITOR] Stderr:', stderr);
    }

    // Wait for service to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify it's running
    try {
      const { stdout: healthCheck } = await execAsync('curl -s http://localhost:3001/health');
      if (healthCheck.includes('healthy') || healthCheck.includes('ok')) {
        console.log('[DUAL-MONITOR] ✅ Health check passed after restart');
      } else {
        console.log('[DUAL-MONITOR] ⚠️ Health check failed after restart');
      }
    } catch (_error) {
      console.log('[DUAL-MONITOR] ⚠️ Could not verify health after restart');
    }
    
  } catch (error) {
    console.error('[DUAL-MONITOR] Error restarting dual monitor:', error);
    throw error;
  }
}

export async function logSyncSuccess(): Promise<void> {
  const logMessage = `[SYNC SUCCESS] ${new Date().toISOString()} - All monitor systems synchronized successfully`;
  await execAsync(`echo "${logMessage}" >> logs/ghost/monitor-sync.log`);
  console.log(logMessage);
} 