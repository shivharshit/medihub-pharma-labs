import React, { useState } from 'react';
import { Radio, Eye, MapPin, Activity, Laptop, Smartphone, Globe, Shield, Sparkles, Navigation } from 'lucide-react';
import { MEDIHUB_HQ_COORDS } from '../services/billaEyesService';

export default function WorldRadarMap({ sessions = [], selectedVisitor, onSelectVisitor }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  // HQ Coordinates in percentage
  const hqXPercent = MEDIHUB_HQ_COORDS.x || 68.5;
  const hqYPercent = MEDIHUB_HQ_COORDS.y || 47.0;

  // HQ Coordinates on 1000x600 SVG canvas
  const hqX = (hqXPercent / 100) * 1000;
  const hqY = (hqYPercent / 100) * 600;

  // Active unique country destination coordinates
  const activeLocations = sessions.map((s, idx) => {
    const destXPercent = s.x || 50;
    const destYPercent = s.y || 50;
    const destX = (destXPercent / 100) * 1000;
    const destY = (destYPercent / 100) * 600;

    // Control point for smooth quadratic parabolic arc
    const midX = (hqX + destX) / 2;
    const midY = Math.min(hqY, destY) - Math.abs(hqX - destX) * 0.18 - 35;
    const pathD = `M ${hqX} ${hqY} Q ${midX} ${midY} ${destX} ${destY}`;

    return {
      session: s,
      destX,
      destY,
      destXPercent,
      destYPercent,
      pathD,
      isOrigin: Math.abs(destX - hqX) < 12 && Math.abs(destY - hqY) < 12,
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
            <span>AUTHENTIC GLOBAL TELEMETRY RADAR</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-slate-300 text-[11px] font-medium backdrop-blur-md pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Central Hub: <strong>Medihub India SEZ</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-[11px] font-bold font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>{sessions.filter(s => s.is_online).length} Live Lasers Active</span>
          </span>
        </div>
      </div>

      {/* Real World Map Container */}
      <div className="w-full aspect-[16/9] min-h-[420px] max-h-[620px] relative overflow-hidden flex items-center justify-center bg-[#020817]">
        {/* Authentic High-Resolution Vector World Map */}
        <div className="absolute inset-0 z-0 opacity-45 pointer-events-none flex items-center justify-center p-2">
          <img
            src="/world-map-real.svg"
            alt="Real World Map"
            className="w-full h-full object-contain filter invert hue-rotate-180 brightness-110 contrast-125 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          />
        </div>

        {/* Ambient Radial Deep Space Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none z-[1]" />

        {/* Dynamic Telemetry Laser Beams & Interactive Pins Layer */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-contain absolute inset-0 z-10"
        >
          <defs>
            {/* Cyber Radar Grid Pattern */}
            <pattern id="radarGridReal" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.06)" strokeWidth="0.75" />
            </pattern>

            {/* Glowing Laser Beam Gradient */}
            <linearGradient id="laserBeamGradReal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>

            {/* Intense Glow Filter */}
            <filter id="laserGlowReal" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Grid Layer */}
          <rect width="1000" height="600" fill="url(#radarGridReal)" />

          {/* Major Latitudes & Longitudes */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="6 6" strokeWidth="1" />
          <line x1="500" y1="0" x2="500" y2="600" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="6 6" strokeWidth="1" />

          {/* Animated Laser Beams from Medihub HQ to Visitors */}
          {activeLocations.map(({ session, destX, destY, pathD, isOrigin, key }) => {
            if (isOrigin) return null;
            const isSelected = selectedVisitor?.visitor_id === session.visitor_id;
            const isHovered = hoveredSession?.visitor_id === session.visitor_id;

            return (
              <g key={`arc-${key}`}>
                {/* Arc Ambient Glow Layer */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth={isSelected || isHovered ? "4.5" : "2.5"}
                  strokeOpacity={isSelected || isHovered ? "0.95" : "0.5"}
                  filter="url(#laserGlowReal)"
                />

                {/* Flowing Laser Dash */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#laserBeamGradReal)"
                  strokeWidth={isSelected || isHovered ? "3.2" : "2"}
                  strokeDasharray="12 8"
                  className="animate-laser-flow"
                />

                {/* Traveling Satellite Photon Pulse Particle */}
                <circle r={isSelected ? "5" : "3.5"} fill="#67e8f9" filter="url(#laserGlowReal)">
                  <animateMotion
                    path={pathD}
                    dur={`${Math.max(1.6, Math.min(3.8, Math.abs(destX - hqX) * 0.007))}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Medihub HQ Central Origin Node (India) */}
          <g transform={`translate(${hqX}, ${hqY})`}>
            {/* Sonar Ripple Rings */}
            <circle r="28" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
            <circle r="7.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" filter="url(#laserGlowReal)" />
            <text x="14" y="4" fill="#a5f3fc" fontSize="10" fontWeight="bold" fontFamily="monospace">
              MEDIHUB HQ (INDIA)
            </text>
          </g>

          {/* Active Visitor Terminal Destination Pins */}
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
                    r={isSelected ? "22" : "15"}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Pin Node Head */}
                <circle
                  r={isSelected || isHovered ? "9" : "6.5"}
                  fill={isOnline ? "#10b981" : "#0284c7"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "2.5" : "1.8"}
                  filter="url(#laserGlowReal)"
                  className="transition-all duration-200"
                />

                {/* Floating Tag */}
                {(isSelected || isHovered) && (
                  <g transform="translate(14, -14)">
                    <rect
                      x="0"
                      y="-14"
                      width="145"
                      height="28"
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
