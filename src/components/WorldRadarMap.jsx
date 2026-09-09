import React, { useState } from 'react';
import { Radio, Eye, MapPin, Activity, Laptop, Smartphone, Globe, Shield } from 'lucide-react';
import { MEDIHUB_HQ_COORDS } from '../services/billaEyesService';

// Simplified Continental Polygons for Dark Cyber Grid
const CONTINENTS_PATHS = [
  // North America
  "M 120 70 L 290 70 L 310 110 L 260 190 L 210 240 L 170 200 L 140 180 L 110 130 Z",
  // Greenland
  "M 330 30 L 400 35 L 380 90 L 320 80 Z",
  // South America
  "M 260 250 L 350 260 L 380 340 L 320 440 L 280 430 L 250 320 Z",
  // Europe
  "M 450 80 L 580 80 L 560 160 L 510 190 L 440 160 L 440 120 Z",
  // Africa
  "M 450 190 L 580 180 L 610 270 L 570 380 L 510 390 L 440 280 Z",
  // Asia
  "M 580 70 L 890 80 L 880 230 L 780 290 L 670 250 L 580 170 Z",
  // Australia & Oceania
  "M 790 330 L 910 340 L 900 420 L 800 420 Z",
  // UK & Islands
  "M 440 110 L 470 110 L 460 140 L 435 135 Z",
  // Japan
  "M 860 160 L 880 170 L 870 210 L 850 190 Z",
  // Indonesia / Philippines
  "M 760 290 L 840 295 L 820 330 L 770 320 Z"
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

    // Control point for quadratic curve (arcs upward)
    const midX = (hqX + destX) / 2;
    const midY = Math.min(hqY, destY) - Math.abs(hqX - destX) * 0.18 - 25;
    const pathD = `M ${hqX} ${hqY} Q ${midX} ${midY} ${destX} ${destY}`;

    return {
      session: s,
      destX,
      destY,
      pathD,
      isOrigin: Math.abs(destX - hqX) < 5 && Math.abs(destY - hqY) < 5,
      key: s.visitor_id || `loc-${idx}`
    };
  });

  return (
    <div className="relative w-full bg-slate-950 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 select-none">
      {/* Map Top Intelligence Overlay */}
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-900/90 border border-cyan-500/40 rounded-full text-cyan-300 text-[11px] font-bold font-mono flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GLOBAL TELEMETRY RADAR GRID</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-slate-300 text-[11px] font-medium backdrop-blur-md pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Medihub Central HQ: <strong>India SEZ</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-[11px] font-bold font-mono flex items-center gap-1.5 backdrop-blur-md">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>{sessions.filter(s => s.is_online).length} Live Lasers Active</span>
          </span>
        </div>
      </div>

      {/* SVG Radar Map Container */}
      <div className="w-full aspect-[2/1] min-h-[360px] max-h-[560px] relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain"
          style={{ background: 'radial-gradient(ellipse at center, #031326 0%, #020617 85%)' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.07)" strokeWidth="0.75" />
            </pattern>

            {/* Glowing Laser Arc Gradient */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>

            {/* Cyan Glow Filter */}
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Pulse Glow for HQ */}
            <radialGradient id="hqPulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="500" fill="url(#radarGrid)" />

          {/* Longitude & Latitude Major Coordinates Lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="4 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="4 4" />

          {/* Continents Vectors */}
          <g opacity="0.45">
            {CONTINENTS_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="#083344"
                stroke="#0e7490"
                strokeWidth="1.2"
                className="transition-all duration-300 hover:fill-cyan-950"
              />
            ))}
          </g>

          {/* Dynamic Laser Beam Arcs from Medihub HQ to Visitors */}
          {activeLocations.map(({ session, destX, destY, pathD, isOrigin, key }) => {
            if (isOrigin) return null;
            const isSelected = selectedVisitor?.visitor_id === session.visitor_id;
            const isHovered = hoveredSession?.visitor_id === session.visitor_id;

            return (
              <g key={`arc-${key}`}>
                {/* Arc Shadow / Glow Layer */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth={isSelected || isHovered ? "3.5" : "2"}
                  strokeOpacity={isSelected || isHovered ? "0.9" : "0.5"}
                  filter="url(#laserGlow)"
                />

                {/* Animated Laser Beam Dashes */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#laserBeamGrad)"
                  strokeWidth={isSelected || isHovered ? "2.5" : "1.8"}
                  strokeDasharray="10 8"
                  className="animate-laser-flow"
                />

                {/* Travelling Photon Pulse along the path */}
                <circle r={isSelected ? "4" : "3"} fill="#38bdf8" filter="url(#laserGlow)">
                  <animateMotion
                    path={pathD}
                    dur={`${Math.max(1.8, Math.min(4, Math.abs(destX - hqX) * 0.008))}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Medihub HQ Central Node Beacon */}
          <g transform={`translate(${hqX}, ${hqY})`}>
            {/* Concentric Radar Wave */}
            <circle r="22" fill="url(#hqPulseGrad)" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle r="14" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '10s' }} />
            <circle r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" filter="url(#laserGlow)" />
            <text x="12" y="4" fill="#67e8f9" fontSize="9" fontWeight="bold" fontFamily="monospace">
              MEDIHUB HQ
            </text>
          </g>

          {/* Visitor Destination Pin Markers */}
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
                {/* Sonar ripple for online visitors */}
                {isOnline && (
                  <circle
                    r={isSelected ? "18" : "12"}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ animationDuration: '2.2s' }}
                  />
                )}

                {/* Pin Head */}
                <circle
                  r={isSelected || isHovered ? "8" : "5.5"}
                  fill={isOnline ? "#10b981" : "#0284c7"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  filter="url(#laserGlow)"
                  className="transition-all duration-200"
                />

                {/* Label pill on hover or selection */}
                {(isSelected || isHovered) && (
                  <g transform="translate(10, -10)">
                    <rect
                      x="0"
                      y="-12"
                      width="130"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      stroke="#06b6d4"
                      strokeWidth="1"
                    />
                    <text x="8" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {session.flag || '🌐'} {session.visitor_id}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card Overlay */}
        {hoveredSession && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 border border-cyan-500/50 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 transition-all duration-150"
            style={{
              left: `${Math.min(78, Math.max(8, hoveredSession.x || 50))}%`,
              top: `${Math.min(70, Math.max(15, (hoveredSession.y || 50) - 15))}%`
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                <span>{hoveredSession.flag}</span>
                <span>{hoveredSession.visitor_id}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                hoveredSession.is_online ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {hoveredSession.is_online ? 'Live Streaming' : 'Idle'}
              </span>
            </div>

            <div className="text-[11px] text-slate-300">
              <strong className="text-white">{hoveredSession.country}</strong> ({hoveredSession.city})
            </div>

            <div className="text-[10px] text-cyan-300 truncate max-w-[200px] font-medium flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>{hoveredSession.current_action || 'Browsing Catalog'}</span>
            </div>

            <div className="text-[9px] text-slate-500 font-mono">
              {hoveredSession.deviceType} • {hoveredSession.browser}
            </div>
          </div>
        )}
      </div>

      {/* Map Bottom Legend */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 px-6">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="text-slate-300">Medihub Central Export Node</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">Live Active Buyer Laser</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-300">Recent Session Terminal</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-cyan-400/90">
          Laser Beam Routing: Direct Center-to-Target Satellite Telemetry
        </div>
      </div>
    </div>
  );
}
