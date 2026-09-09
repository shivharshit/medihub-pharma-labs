import React, { useState } from 'react';
import { Radio, Eye, MapPin, Activity, Laptop, Smartphone, Globe, Shield, Sparkles } from 'lucide-react';
import { MEDIHUB_HQ_COORDS } from '../services/billaEyesService';

// Detailed Real-World Geographic Coastal Vector Contours (Equirectangular 1000x500 Projection)
const REAL_WORLD_CONTINENTS = [
  // North America (Alaska, Canada, USA, Mexico, Central America)
  "M 95 62 C 115 50, 150 48, 185 52 C 220 56, 255 45, 290 60 C 310 75, 325 110, 310 135 C 295 155, 290 185, 260 205 C 240 220, 215 240, 200 270 C 190 290, 180 280, 160 250 C 145 225, 120 190, 105 160 C 90 130, 85 85, 95 62 Z",
  // Florida peninsula
  "M 265 190 C 275 200, 280 220, 275 235 C 270 240, 265 230, 260 215 Z",
  // Greenland
  "M 330 30 C 370 25, 410 30, 395 75 C 375 95, 345 90, 325 70 C 315 50, 320 35, 330 30 Z",
  // South America (Colombia, Brazil, Argentina, Chile, Peru)
  "M 265 255 C 300 250, 345 260, 375 295 C 400 330, 385 380, 350 420 C 330 445, 310 475, 295 470 C 285 450, 275 400, 265 350 C 255 300, 250 270, 265 255 Z",
  // Europe (Scandinavia, UK, France, Spain, Germany, Italy, Balkans)
  "M 450 155 C 455 140, 480 135, 495 115 C 505 90, 520 70, 545 65 C 560 70, 555 110, 540 125 C 530 140, 520 160, 500 175 C 475 190, 455 180, 450 155 Z",
  // Iberian Peninsula (Spain/Portugal)
  "M 455 165 C 475 165, 480 185, 475 200 C 460 205, 445 190, 455 165 Z",
  // Italy boot
  "M 510 165 C 520 170, 530 195, 525 205 C 520 205, 515 190, 510 165 Z",
  // Great Britain & Ireland
  "M 465 105 C 480 100, 485 125, 475 140 C 465 145, 460 120, 465 105 Z M 450 115 C 460 115, 460 130, 450 135 Z",
  // Africa (North Africa, Sahara, West Africa, Congo, Horn of Africa, South Africa)
  "M 460 205 C 510 195, 570 195, 595 230 C 625 270, 605 320, 580 370 C 560 410, 535 435, 515 410 C 490 370, 480 320, 445 285 C 425 255, 435 215, 460 205 Z",
  // Madagascar
  "M 625 355 C 635 345, 645 385, 635 405 C 625 410, 620 380, 625 355 Z",
  // Eurasia (Russia, Middle East, India, China, Siberia, Indochina)
  "M 540 120 C 600 95, 700 80, 800 85 C 890 90, 930 120, 915 170 C 895 210, 850 230, 810 260 C 785 280, 770 310, 740 310 C 720 305, 705 275, 690 240 C 670 215, 620 220, 580 210 C 550 195, 540 150, 540 120 Z",
  // Indian Subcontinent
  "M 690 215 C 720 215, 750 230, 740 265 C 730 290, 705 305, 695 265 C 685 240, 680 225, 690 215 Z",
  // Arabian Peninsula (Saudi Arabia, UAE, Oman)
  "M 595 225 C 635 220, 660 245, 650 280 C 630 295, 605 280, 595 255 Z",
  // Japan Archipelago
  "M 865 145 C 880 150, 885 190, 870 205 C 855 210, 855 170, 865 145 Z",
  // Southeast Asia & Indonesia / Philippines Archipelago
  "M 760 270 C 785 270, 785 305, 765 315 Z M 785 320 C 825 320, 850 335, 820 345 Z M 815 245 C 835 245, 835 280, 820 290 Z",
  // Australia & New Zealand
  "M 795 345 C 845 330, 905 345, 915 390 C 920 425, 875 455, 835 450 C 790 440, 770 395, 795 345 Z",
  "M 925 425 C 940 425, 950 460, 935 470 C 920 470, 920 440, 925 425 Z"
];

export default function WorldRadarMap({ sessions = [], selectedVisitor, onSelectVisitor }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  // HQ Coordinates on 1000x500 scale
  const hqX = (MEDIHUB_HQ_COORDS.x / 100) * 1000;
  const hqY = (MEDIHUB_HQ_COORDS.y / 100) * 500;

  // Active unique country destination coordinates
  const activeLocations = sessions.map((s, idx) => {
    const destX = ((s.x || 50) / 100) * 1000;
    const destY = ((s.y || 50) / 100) * 500;

    // Control point for smooth quadratic parabolic arc
    const midX = (hqX + destX) / 2;
    const midY = Math.min(hqY, destY) - Math.abs(hqX - destX) * 0.16 - 30;
    const pathD = `M ${hqX} ${hqY} Q ${midX} ${midY} ${destX} ${destY}`;

    return {
      session: s,
      destX,
      destY,
      pathD,
      isOrigin: Math.abs(destX - hqX) < 10 && Math.abs(destY - hqY) < 10,
      key: s.visitor_id || `loc-${idx}`
    };
  });

  return (
    <div className="relative w-full bg-slate-950 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 select-none">
      {/* Top Intelligence HUD */}
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-slate-900/90 border border-cyan-500/40 rounded-full text-cyan-300 text-[11px] font-bold font-mono flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GLOBAL SATELLITE TELEMETRY RADAR</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-slate-300 text-[11px] font-medium backdrop-blur-md pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Central Hub: <strong>Medihub India SEZ</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-[11px] font-bold font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>{sessions.filter(s => s.is_online).length} Active Laser Arcs</span>
          </span>
        </div>
      </div>

      {/* SVG Real World Map Projection */}
      <div className="w-full aspect-[2/1] min-h-[380px] max-h-[580px] relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #041a35 0%, #020617 90%)' }}
        >
          <defs>
            {/* Cyber Radar Grid */}
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="0.75" />
            </pattern>

            {/* Glowing Laser Beam Gradient */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>

            {/* Intense Glow Filter */}
            <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Continent Gradient */}
            <linearGradient id="continentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a3d62" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#07233f" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#radarGrid)" />

          {/* Major Latitudes & Longitudes */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(6, 182, 212, 0.18)" strokeDasharray="5 5" strokeWidth="1" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(6, 182, 212, 0.18)" strokeDasharray="5 5" strokeWidth="1" />
          <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(6, 182, 212, 0.08)" strokeDasharray="2 4" />
          <line x1="750" y1="0" x2="750" y2="500" stroke="rgba(6, 182, 212, 0.08)" strokeDasharray="2 4" />
          <line x1="0" y1="125" x2="1000" y2="125" stroke="rgba(6, 182, 212, 0.08)" strokeDasharray="2 4" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="rgba(6, 182, 212, 0.08)" strokeDasharray="2 4" />

          {/* Real Geographic Continents (Detailed Coastlines) */}
          <g>
            {REAL_WORLD_CONTINENTS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="url(#continentGrad)"
                stroke="#0ea5e9"
                strokeWidth="1.2"
                strokeOpacity="0.75"
                filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.2))"
                className="transition-all duration-300 hover:fill-cyan-900/60"
              />
            ))}
          </g>

          {/* Animated Laser Beams from Medihub HQ to Visitors */}
          {activeLocations.map(({ session, destX, destY, pathD, isOrigin, key }) => {
            if (isOrigin) return null;
            const isSelected = selectedVisitor?.visitor_id === session.visitor_id;
            const isHovered = hoveredSession?.visitor_id === session.visitor_id;

            return (
              <g key={`arc-${key}`}>
                {/* Arc Ambient Glow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth={isSelected || isHovered ? "4" : "2.5"}
                  strokeOpacity={isSelected || isHovered ? "0.95" : "0.45"}
                  filter="url(#laserGlow)"
                />

                {/* Flowing Laser Dash */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#laserBeamGrad)"
                  strokeWidth={isSelected || isHovered ? "3" : "2"}
                  strokeDasharray="12 8"
                  className="animate-laser-flow"
                />

                {/* Traveling Satellite Photon Pulse Particle */}
                <circle r={isSelected ? "4.5" : "3.5"} fill="#67e8f9" filter="url(#laserGlow)">
                  <animateMotion
                    path={pathD}
                    dur={`${Math.max(1.5, Math.min(3.5, Math.abs(destX - hqX) * 0.007))}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Medihub HQ Central Station (India) */}
          <g transform={`translate(${hqX}, ${hqY})`}>
            {/* Pulsing Sonar Wave Rings */}
            <circle r="26" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle r="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
            <circle r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" filter="url(#laserGlow)" />
            <text x="12" y="4" fill="#a5f3fc" fontSize="10" fontWeight="bold" fontFamily="monospace">
              MEDIHUB HQ (INDIA)
            </text>
          </g>

          {/* Active Visitor Terminal Pins */}
          {activeLocations.map(({ session, destX, destY, isOrigin, key }) => {
            if (isOrigin) return null;
            const isSelected = selectedVisitor?.visitor_id === session.visitor_id;
            const isHovered = hoveredSession?.visitor_id === session.visitor_id;
            const isOnline = session.is_online;

            return (
              <g
                key={`pin-${key}`}
                transform={`translate(${destX}, ${destY})`}
                className="cursor-pointer"
                onClick={() => onSelectVisitor && onSelectVisitor(session)}
                onMouseEnter={() => setHoveredSession(session)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                {/* Sonar ripple on live active visitors */}
                {isOnline && (
                  <circle
                    r={isSelected ? "20" : "14"}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Pin Node Head */}
                <circle
                  r={isSelected || isHovered ? "8.5" : "6"}
                  fill={isOnline ? "#10b981" : "#0284c7"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "2.5" : "1.8"}
                  filter="url(#laserGlow)"
                  className="transition-all duration-200"
                />

                {/* Floating Tag */}
                {(isSelected || isHovered) && (
                  <g transform="translate(12, -12)">
                    <rect
                      x="0"
                      y="-14"
                      width="140"
                      height="26"
                      rx="7"
                      fill="#0f172a"
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                    />
                    <text x="8" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      {session.flag || '🌐'} {session.visitor_id}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredSession && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 border border-cyan-500/50 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2 transition-all duration-150 min-w-[220px]"
            style={{
              left: `${Math.min(76, Math.max(6, hoveredSession.x || 50))}%`,
              top: `${Math.min(68, Math.max(12, (hoveredSession.y || 50) - 16))}%`
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                <span className="text-base">{hoveredSession.flag}</span>
                <span>{hoveredSession.visitor_id}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                hoveredSession.is_online ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {hoveredSession.is_online ? 'Live Now' : 'Recorded'}
              </span>
            </div>

            <div className="text-[12px] text-slate-200 font-semibold">
              {hoveredSession.country} • <span className="text-slate-400 font-normal">{hoveredSession.city}</span>
            </div>

            <div className="text-[11px] text-cyan-300 font-medium flex items-center gap-1.5 truncate">
              <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{hoveredSession.current_action || 'Browsing Catalog'}</span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
              <span>{hoveredSession.deviceType}</span>
              <span>{hoveredSession.browser}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Bottom Legend Strip */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 px-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="text-slate-200 font-medium">Medihub Global HQ (Origin Hub)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-200 font-medium">Live Active Buyer Laser</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            <span className="text-slate-200 font-medium">Recorded Session Node</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-cyan-400/90 font-semibold">
          Laser Beam Routing: Direct Center-to-Target Satellite Telemetry
        </div>
      </div>
    </div>
  );
}
