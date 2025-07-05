import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BoltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { apiHelpers } from '../lib/supabase';

interface PlatformInfo {
  version: string;
  platform: string;
  size: string;
  filename: string;
  description: string;
  requirements: string[];
  available: boolean;
}

interface DownloadInfo {
  platforms: {
    windows: PlatformInfo;
    macos: PlatformInfo;
    linux: PlatformInfo;
  };
}

// Constants
const API_BASE = import.meta.env.VITE_API_BASE_URL || (window.location.protocol + '//' + window.location.host);
const DEFAULT_PLATFORM = 'windows';
const API_TIMEOUT = 60000; // 60 seconds timeout for downloads

// Fallback data - moved to constant to avoid duplication
const FALLBACK_DOWNLOAD_INFO: DownloadInfo = {
  platforms: {
    windows: {
      version: "1.0.1",
      platform: "Windows",
      size: "7.4 MB",
      filename: "ElyAnalyzer-Desktop-v1.0.1-FINAL.msi",
      description: "ElyAnalyzer Desktop Application with 15 Code Analyzers (MSI Installer)",
      requirements: [
        "Windows 10 or later",
        "100 MB free disk space",
        "Internet connection for initial setup"
      ],
      available: true
    },
    macos: {
      version: "1.0.0",
      platform: "macOS",
      size: "4.2 MB",
      filename: "ElyAnalyzer-Desktop.dmg",
      description: "ElyAnalyzer Desktop Application with 15 Code Analyzers",
      requirements: [
        "macOS 10.13 or later",
        "100 MB free disk space",
        "Internet connection for initial setup"
      ],
      available: false
    },
    linux: {
      version: "1.0.0",
      platform: "Linux",
      size: "3.5 MB",
      filename: "ElyAnalyzer-Desktop.AppImage",
      description: "ElyAnalyzer Desktop Application with 15 Code Analyzers",
      requirements: [
        "Ubuntu 18.04+ / CentOS 7+ / Debian 10+",
        "100 MB free disk space",
        "Internet connection for initial setup"
      ],
      available: false
    }
  }
};

// Fetch with timeout utility
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const Download: React.FC = () => {
  const { user, session } = useAuth();
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>(FALLBACK_DOWNLOAD_INFO); // Start with fallback data
  const [selectedPlatform, setSelectedPlatform] = useState<string>(DEFAULT_PLATFORM);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false since we show fallback immediately
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Redirect if not authenticated
  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // Memoized current platform info
  const currentPlatform = useMemo(() => {
    if (!downloadInfo) return null;
    return downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms];
  }, [downloadInfo, selectedPlatform]);

  // Memoized features data
  const features = useMemo(() => [
    {
      icon: ShieldCheckIcon,
      title: "Privacy First",
      description: "100% local processing, your code never leaves your machine",
      color: "green"
    },
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Instant analysis with optimized performance",
      color: "blue"
    },
    {
      icon: CpuChipIcon,
      title: "15 Analyzers",
      description: "Comprehensive code analysis across all aspects",
      color: "purple"
    }
  ], []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch download info function
  const fetchDownloadInfo = useCallback(async () => {
    if (!isOnline) {
      console.log('Offline mode - using fallback data');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const response = await fetchWithTimeout(`${API_BASE}/api/download/info`);
      
      if (response.ok) {
        const data = await response.json();
        setDownloadInfo(data);
        console.log('Download info updated from server');
      } else {
        console.warn('Download info request failed, using fallback data:', response.status);
        // Keep fallback data, don't show error to user
      }
    } catch (error) {
      console.warn('Failed to fetch download info, using fallback data:', error);
      // Keep fallback data, don't show error to user unless it's critical
      if (error instanceof Error && error.name !== 'AbortError') {
        setError('Network connection issue - using offline data');
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Handle download function
  const handleDownload = useCallback(async () => {
    if (!session?.access_token) {
      toast.error('Authentication required');
      return;
    }

    if (!currentPlatform?.available) {
      toast.error(`${currentPlatform?.platform || 'Selected'} version is not available yet`);
      return;
    }

    if (!isOnline) {
      toast.error('Download requires internet connection');
      return;
    }

    setIsDownloading(true);
    
    try {
      const response = await apiHelpers.secureRequest(`${API_BASE}/api/download/desktop?platform=${selectedPlatform}`, {
        method: 'GET'
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please login again.');
          return;
        }
        if (response.status === 403) {
          toast.error('Access denied. Please check your subscription.');
          return;
        }
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentPlatform.filename;
      link.setAttribute('aria-label', `Download ${currentPlatform.filename}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download started successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Download timeout - please try again');
      } else {
        toast.error(`Download failed: ${errorMessage}`);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [session, currentPlatform, selectedPlatform, isOnline]);

  // Handle platform selection
  const handlePlatformSelect = useCallback((platform: string) => {
    setSelectedPlatform(platform);
  }, []);

  // Effect to fetch download info - only once on mount
  useEffect(() => {
    // Small delay to let the page render first
    const timer = setTimeout(() => {
      fetchDownloadInfo();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchDownloadInfo]);

  // Show minimal loading only for initial auth check
  if (loading && !downloadInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading download information">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-600 text-white text-center py-2 text-sm">
          <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
          You're offline - showing cached download information
        </div>
      )}

      {/* Network error indicator */}
      {error && (
        <div className="bg-orange-600 text-white text-center py-2 text-sm">
          <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
          {error}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <img 
                src="/elyanalyzer-logo.svg"
                alt="ElyAnalyzer Logo" 
                className="h-20 w-20 drop-shadow-2xl"
                loading="eager"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Download
              <span className="gradient-text"> ElyAnalyzer</span>
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Get the desktop application and start analyzing your code with 15 specialized analyzers
            </p>
          </motion.div>

          {/* Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            {downloadInfo && (
              <>
                {/* Platform Selection */}
                <div className="flex justify-center mb-8">
                  <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg" role="tablist" aria-label="Platform selection">
                    {Object.entries(downloadInfo.platforms).map(([key, platform]) => {
                      const isSelected = selectedPlatform === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handlePlatformSelect(key)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-primary-500 text-white'
                              : platform.available
                              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                              : 'text-slate-500 cursor-not-allowed'
                          }`}
                          disabled={!platform.available}
                          role="tab"
                          aria-controls={`platform-${key}-panel`}
                          aria-label={`Select ${platform.platform} platform${!platform.available ? ' (coming soon)' : ''}`}
                        >
                          {platform.platform}
                          {!platform.available && ' (Coming Soon)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* App Info */}
                <div className="flex items-center justify-center mb-8" id={`platform-${selectedPlatform}-panel`} role="tabpanel">
                  <div className="p-4 bg-primary-500/20 rounded-2xl mr-6">
                    <ComputerDesktopIcon className="h-16 w-16 text-primary-400" aria-hidden="true" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      ElyAnalyzer Desktop
                    </h2>
                    <p className="text-slate-300 mb-2">
                      {currentPlatform?.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Version {currentPlatform?.version}</span>
                      <span>•</span>
                      <span>Platform: {currentPlatform?.platform}</span>
                      <span>•</span>
                      <span>Size: {currentPlatform?.size}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className={`p-3 bg-${feature.color}-500/20 rounded-xl inline-block mb-4`}>
                        <feature.icon className={`h-8 w-8 text-${feature.color}-400`} aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-300 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* System Requirements */}
                <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-2" aria-hidden="true" />
                    System Requirements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentPlatform?.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" aria-hidden="true" />
                        <span className="text-slate-300">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div className="text-center">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !currentPlatform?.available || !isOnline}
                    className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-3"
                    aria-label={
                      isDownloading 
                        ? 'Downloading...' 
                        : !isOnline
                        ? 'Download requires internet connection'
                        : !currentPlatform?.available 
                        ? `${currentPlatform?.platform} version coming soon` 
                        : `Download ElyAnalyzer for ${currentPlatform?.platform}`
                    }
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
                        <span>Downloading...</span>
                      </>
                    ) : !isOnline ? (
                      <>
                        <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
                        <span>Offline - Connect to Download</span>
                      </>
                    ) : !currentPlatform?.available ? (
                      <>
                        <span>Coming Soon for {currentPlatform?.platform}</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-6 w-6" aria-hidden="true" />
                        <span>Download for {currentPlatform?.platform}</span>
                      </>
                    )}
                  </button>
                  <p className="text-slate-400 text-sm mt-4">
                    {currentPlatform?.platform === 'Windows' ? 'Windows 10+' : currentPlatform?.platform} • Secure download
                  </p>
                  
                  {/* Windows Defender Warning - Only show for Windows */}
                  {currentPlatform?.platform === 'Windows' && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-400 mb-2">Windows Defender Notice</h4>
                          <p className="text-xs text-slate-300 mb-3">
                            Windows Defender may show a security warning for this download. This is normal for new applications.
                          </p>
                          <div className="text-xs text-slate-400 text-center">
                            <p className="font-medium mb-2">If you see "Windows protected your PC":</p>
                            <ol className="list-decimal list-inside space-y-1 text-left inline-block">
                              <li>Click "More info"</li>
                              <li>Click "Run anyway"</li>
                              <li>The application is safe and digitally verified</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Installation Guide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">Installation Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Download</h3>
                <p className="text-slate-300">Click the download button above to get the installer</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Install</h3>
                <p className="text-slate-300">Run the {currentPlatform?.platform === 'Windows' ? 'MSI' : 'installer'} and follow the setup wizard</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyze</h3>
                <p className="text-slate-300">Start analyzing your code projects immediately</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Download; 
