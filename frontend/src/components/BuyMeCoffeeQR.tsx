import { motion } from 'framer-motion'
import { HeartIcon, QrCodeIcon } from '@heroicons/react/24/outline'

const BuyMeCoffeeQR = () => {
  // QR code for Buy Me a Coffee - updated with correct link
  const buyMeCoffeeUrl = "https://coff.ee/genshro"
  
  // Generate QR code using a QR code API service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(buyMeCoffeeUrl)}&bgcolor=1e293b&color=f1f5f9&qzone=2`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <HeartIcon className="h-6 w-6 text-red-400 mr-2" />
          <h3 className="text-xl font-semibold text-slate-100">Support ElyAnalyzer</h3>
        </div>
        
        <p className="text-slate-300 mb-6 text-sm">
          If you find ElyAnalyzer helpful, consider buying me a coffee! ☕
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img 
              src={qrCodeUrl} 
              alt="Buy Me a Coffee QR Code"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                // Fallback if QR service fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex items-center justify-center w-48 h-48 bg-slate-200 rounded-lg">
              <QrCodeIcon className="h-12 w-12 text-slate-500" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-2">Scan QR code or click the link below</p>
            <a 
              href={buyMeCoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              <HeartIcon className="h-4 w-4 mr-2" />
              Buy Me a Coffee
            </a>
          </div>
        </div>
        
        <p className="text-slate-500 text-xs mt-4">
          Your support helps keep ElyAnalyzer free and continuously improving! 🚀
        </p>
      </div>
    </motion.div>
  )
}

export default BuyMeCoffeeQR 