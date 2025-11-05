import { Link } from 'react-router-dom';
import logo from '@/assets/images/logos/logopkkq.jfif';
import bautroi from '@/assets/images/banners/bautroi.jfif';
import phao from '@/assets/images/banners/phao.jfif';
import tenlua from '@/assets/images/banners/tenlua.jfif';
import tenlua2 from '@/assets/images/banners/tenlua2.jfif';
import rada from '@/assets/images/banners/rada.jpg';

export default function Header() {

  return (
    <header className="bg-white shadow-2xl">
      {/* Top bar with contact info */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center text-xs sm:text-sm gap-2 sm:gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Hotline: 0982983412
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            f365.qcpkkq@mail.bqp
          </span>
        </div>
      </div>

      {/* Main header - Logo and Title Section with Horizontal Banner Strip */}
      <div className="relative overflow-hidden bg-white">
        {/* Horizontal Banner Strip - bautroi covers half, others share remaining half */}
        <div className="absolute inset-0 z-0">
          <div className="flex h-full w-full">
            {/* bautroi takes 50% width */}
            <div className="w-1/2 h-full">
              <img
                src={bautroi}
                alt="Banner 1"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
            {/* Remaining 4 images share the other 50% - 12.5% each */}
            <div className="w-1/8 h-full">
              <img
                src={phao}
                alt="Banner 2"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
            <div className="w-1/8 h-full">
              <img
                src={tenlua}
                alt="Banner 3"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
            <div className="w-1/8 h-full">
              <img
                src={tenlua2}
                alt="Banner 4"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
            <div className="w-1/8 h-full">
              <img
                src={rada}
                alt="Banner 5"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
          </div>
        </div>

        {/* Content - Positioned on left half (over bautroi) */}
        <div className="relative z-10 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Container positioned to align with bautroi (left half) */}
            <div className="flex justify-start" style={{ maxWidth: '50%' }}>
            {/* Logo and Text Section - On bautroi background */}
            <Link to="/" className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Logo */}
              <img 
                src={logo} 
                alt="Sư đoàn 365 Logo" 
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-full border-4 border-yellow-500 shadow-xl bg-white p-1"
              />
              
              {/* Title and Motto */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FFD700] tracking-wide" 
                    style={{ 
                      textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                    }}>
                  SƯ ĐOÀN 365
                </h1>
                <p className="text-sm sm:text-base lg:text-lg font-semibold italic leading-relaxed"
                   style={{ 
                     color: '#00BFFF',
                     textShadow: '0 0 10px rgba(0,0,0,0.9), 1px 1px 3px rgba(0,0,0,1), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                   }}>
                  Cơ động chiến đấu, chốt trụ kiên cường, đánh thắng địch trong mọi tình huống
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
