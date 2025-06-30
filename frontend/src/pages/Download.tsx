import React, { useState, useEffect } from 'react';
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

const Download: React.FC = () => {
  const { user, session } = useAuth();
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('windows');
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchDownloadInfo();
  }, []);

  const fetchDownloadInfo = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${API_BASE}/download/info`);
      if (response.ok) {
        const data = await response.json();
        setDownloadInfo(data);
      } else {
        console.error('Download info request failed:', response.status, response.statusText);
        toast.error(`Failed to load download information: ${response.status}`);
        // Fallback download info
        setDownloadInfo({
          platforms: {
            windows: {
              version: "1.0.0",
              platform: "Windows",
              size: "6.5 MB",
              filename: "elyanalyzer-desktop-v1.0.0.msi",
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
        });
      }
    } catch (error) {
      console.error('Failed to fetch download info:', error);
      toast.error('Failed to load download information');
      // Fallback download info
      setDownloadInfo({
        platforms: {
          windows: {
            version: "1.0.0",
            platform: "Windows", 
            size: "6.5 MB",
            filename: "elyanalyzer-desktop-v1.0.0.msi",
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!session?.access_token) {
      toast.error('Authentication required');
      return;
    }

    const platform = downloadInfo?.platforms[selectedPlatform as keyof typeof downloadInfo.platforms];
    if (!platform?.available) {
      toast.error(`${platform?.platform} version is not available yet`);
      return;
    }

    setIsDownloading(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_BASE}/download/desktop?platform=${selectedPlatform}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please login again.');
          return;
        }
        throw new Error(`Download failed: ${response.status}`);
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = platform.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download started successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
            alt="ElyAnalyzer" 
                className="h-20 w-20 drop-shadow-2xl"
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
                  <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
                    {Object.entries(downloadInfo.platforms).map(([key, platform]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlatform(key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedPlatform === key
                            ? 'bg-primary-500 text-white'
                            : platform.available
                            ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                            : 'text-slate-500 cursor-not-allowed'
                        }`}
                        disabled={!platform.available}
                      >
                        {platform.platform}
                        {!platform.available && ' (Coming Soon)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* App Info */}
                <div className="flex items-center justify-center mb-8">
                  <div className="p-4 bg-primary-500/20 rounded-2xl mr-6">
                    <ComputerDesktopIcon className="h-16 w-16 text-primary-400" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      ElyAnalyzer Desktop
                    </h2>
                    <p className="text-slate-300 mb-2">
                      {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Version {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].version}</span>
                      <span>•</span>
                      <span>Platform: {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].platform}</span>
                      <span>•</span>
                      <span>Size: {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].size}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="p-3 bg-green-500/20 rounded-xl inline-block mb-4">
                      <ShieldCheckIcon className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                    <p className="text-slate-300 text-sm">100% local processing, your code never leaves your machine</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-blue-500/20 rounded-xl inline-block mb-4">
                      <BoltIcon className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                    <p className="text-slate-300 text-sm">Instant analysis with optimized performance</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-500/20 rounded-xl inline-block mb-4">
                      <CpuChipIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">15 Analyzers</h3>
                    <p className="text-slate-300 text-sm">Comprehensive code analysis across all aspects</p>
                  </div>
                </div>

                {/* System Requirements */}
                <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-2" />
                    System Requirements
                  </h3>
                                      <div className="grid md:grid-cols-2 gap-4">
                      {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].requirements.map((req: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-slate-300">{req}</span>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Download Button */}
                <div className="text-center">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].available}
                    className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-3"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Downloading...</span>
                      </>
                    ) : !downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].available ? (
                      <>
                        <span>Coming Soon for {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].platform}</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-6 w-6" />
                        <span>Download for {downloadInfo.platforms[selectedPlatform as keyof typeof downloadInfo.platforms].platform}</span>
                      </>
                    )}
                  </button>
                  <p className="text-slate-400 text-sm mt-4">
                    Windows 10+ • Secure download
                  </p>
                  
                  {/* Windows Defender Warning */}
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
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
                <p className="text-slate-300">Run the MSI installer and follow the setup wizard</p>
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
    </div>
  );
};

export default Download; 