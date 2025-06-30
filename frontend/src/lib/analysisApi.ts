// Analysis API for interacting with backend analysis endpoints

interface Project {
  id: string
  name: string
  path: string
  last_analyzed?: string
  created_at: string
}

interface CreateProjectRequest {
  name: string
  path: string
}

interface ScanRequest {
  project_id: string
  scan_type: 'full' | 'dependency' | 'pattern'
}

interface ScanResponse {
  status: string
  project_id: string
  scan_type: string
  message: string
}

interface AnalysisHistory {
  id: string
  project_id: string
  project_name: string
  scan_type: string
  scan_result: any
  issues_found: number
  created_at: string
}

interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface AnalysisNotification {
  type: 'analysis_complete'
  project_id: string
  scan_type: string
  issues_found: number
  timestamp: number
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const WS_URL = 'ws://localhost:8080/ws'

class AnalysisAPI {
  private ws: WebSocket | null = null
  private wsReconnectAttempts = 0
  private maxReconnectAttempts = 5
  private analysisCallbacks: Map<string, (notification: AnalysisNotification) => void> = new Map()

  constructor() {
    this.initWebSocket()
  }

  // WebSocket Management
  private initWebSocket() {
    try {
      this.ws = new WebSocket(WS_URL)
      
      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected to analysis server')
        this.wsReconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        try {
          const notification: AnalysisNotification = JSON.parse(event.data)
          this.handleAnalysisNotification(notification)
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.reconnectWebSocket()
      }
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
      }
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error)
      this.reconnectWebSocket()
    }
  }

  private reconnectWebSocket() {
    if (this.wsReconnectAttempts < this.maxReconnectAttempts) {
      this.wsReconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.wsReconnectAttempts), 30000)
      console.log(`🔄 Attempting WebSocket reconnection in ${delay}ms (attempt ${this.wsReconnectAttempts})`)
      
      setTimeout(() => {
        this.initWebSocket()
      }, delay)
    } else {
      console.error('❌ Max WebSocket reconnection attempts reached')
    }
  }

  private handleAnalysisNotification(notification: AnalysisNotification) {
    console.log('📡 Received analysis notification:', notification)
    
    // Call project-specific callback if registered
    const callback = this.analysisCallbacks.get(notification.project_id)
    if (callback) {
      callback(notification)
      this.analysisCallbacks.delete(notification.project_id) // One-time callback
    }
    
    // Trigger custom event for global listeners
    window.dispatchEvent(new CustomEvent('analysisComplete', { 
      detail: notification 
    }))
  }

  // Register callback for specific project analysis completion
  onAnalysisComplete(projectId: string, callback: (notification: AnalysisNotification) => void) {
    this.analysisCallbacks.set(projectId, callback)
  }

  // Project Management
  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE}/projects`)
      const result: APIResponse<Project[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch projects')
      }
      
      return result.data || []
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  async createProject(request: CreateProjectRequest): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
      
      const result: APIResponse<Project> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create project')
      }
      
      return result.data!
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  // Scanning Operations with Real-time Updates
  async startScan(request: ScanRequest): Promise<ScanResponse> {
    try {
      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
      
      const result: APIResponse<ScanResponse> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to start scan')
      }
      
      return result.data!
    } catch (error) {
      console.error('Error starting scan:', error)
      throw error
    }
  }

  // Enhanced scan with real-time callback
  async startScanWithCallback(
    request: ScanRequest, 
    onComplete?: (notification: AnalysisNotification) => void
  ): Promise<ScanResponse> {
    // Register callback for real-time updates
    if (onComplete) {
      this.onAnalysisComplete(request.project_id, onComplete)
    }
    
    return this.startScan(request)
  }

  // Analysis Results
  async getAnalysisHistory(): Promise<AnalysisHistory[]> {
    try {
      const response = await fetch(`${API_BASE}/analysis`)
      const result: APIResponse<AnalysisHistory[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analysis history')
      }
      
      return result.data || []
    } catch (error) {
      console.error('Error fetching analysis history:', error)
      throw error
    }
  }

  async submitAnalysisResult(analysisData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      })
      
      const result: APIResponse<any> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit analysis')
      }
      
      return result.data
    } catch (error) {
      console.error('Error submitting analysis:', error)
      throw error
    }
  }

  // PDF Generation
  async generatePDFReport(analysisId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/pdf/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis_id: analysisId })
      })
      
      const result: APIResponse<any> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate PDF')
      }
      
      return result.data
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  // Utility Methods
  getSupportedScanTypes(): string[] {
    return ['full', 'dependency', 'pattern']
  }

  formatScanType(scanType: string): string {
    const types: Record<string, string> = {
      'full': 'Full Analysis',
      'dependency': 'Dependency Check',
      'pattern': 'Pattern Detection'
    }
    return types[scanType] || scanType
  }

  // Legacy polling method (fallback if WebSocket fails)
  async pollAnalysisStatus(projectId: string, maxAttempts = 30): Promise<AnalysisHistory | null> {
    console.log('⏳ Falling back to polling method for project', projectId)
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const history = await this.getAnalysisHistory()
        const latestAnalysis = history.find(h => h.project_id === projectId)
        
        if (latestAnalysis) {
          // Check if analysis is recent (within last 5 minutes)
          const analysisTime = new Date(latestAnalysis.created_at).getTime()
          const now = new Date().getTime()
          const fiveMinutes = 5 * 60 * 1000
          
          if (now - analysisTime < fiveMinutes) {
            return latestAnalysis
          }
        }
        
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error)
      }
    }
    
    return null
  }

  // Promise-based analysis waiting (uses WebSocket + fallback)
  async waitForAnalysisComplete(projectId: string, timeoutMs = 60000): Promise<AnalysisNotification> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.analysisCallbacks.delete(projectId)
        reject(new Error('Analysis timeout'))
      }, timeoutMs)

      this.onAnalysisComplete(projectId, (notification) => {
        clearTimeout(timeout)
        resolve(notification)
      })
    })
  }

  // Cleanup
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.analysisCallbacks.clear()
  }
}

export const analysisApi = new AnalysisAPI()
export type { 
  Project, 
  CreateProjectRequest, 
  ScanRequest, 
  ScanResponse, 
  AnalysisHistory,
  AnalysisNotification 
}