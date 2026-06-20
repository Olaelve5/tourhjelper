"use client";

import { motion } from "motion/react";
import React from "react";

function TdfLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center w-[300px] h-80">
      {/* Wind lines for speed effect */}
      <Wind speed={0.7} top="30%" delay={0} opacity={0.3} width="80px" />
      <Wind speed={0.5} top="45%" delay={0.2} opacity={0.5} width="60px" />
      <Wind speed={0.9} top="65%" delay={0.4} opacity={0.2} width="100px" />
      <Wind speed={1.2} top="15%" delay={0.5} opacity={0.4} width="40px" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Bike SVG */}
        <motion.svg
          width="160"
          height="100"
          viewBox="0 0 100 60"
          className="overflow-visible drop-shadow-[0_0_15px_rgba(255,225,0,0.5)]"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}>
          {/* --- Bike Frame --- */}
          {/* TdF Yellow color: #FFE100 */}
          <g
            stroke="#FFE100"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none">
            {/* Rear Triangle: Back wheel (20,45) -> Seat (35,15) -> Bottom Bracket (45,45) */}
            <path d="M 20 45 L 35 15 L 45 45 Z" />
            {/* Front Triangle: Seat (35,15) -> Head Tube (70,15) -> Bottom Bracket (45,45) */}
            <path d="M 35 15 L 70 15 L 45 45 Z" />
            {/* Fork: Head Tube (70,15) -> Front wheel (80,45) */}
            <path d="M 70 15 L 80 45" />

            {/* Seatpost and Seat */}
            <path d="M 35 15 L 32 8" />
            <path d="M 26 8 L 38 8" strokeWidth="3" stroke="#e5e7eb" />

            {/* Handlebars (Racing Drop Bars) */}
            <path
              d="M 70 15 L 75 8 L 81 8 L 84 14 C 84 17 80 17 80 14"
              stroke="#e5e7eb"
            />
          </g>

          {/* --- Wheels --- */}
          {/* Back Wheel */}
          <motion.g
            style={{ transformOrigin: "20px 45px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}>
            <circle
              cx="20"
              cy="45"
              r="14.5"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            {/* Outer tire */}
            <circle
              cx="20"
              cy="45"
              r="14.5"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            {/* Inner Rim */}
            <circle
              cx="20"
              cy="45"
              r="13"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1"
            />
            {/* Spokes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`bw-spoke-${i}`}
                x1="20"
                y1="31"
                x2="20"
                y2="59"
                stroke="#6b7280"
                strokeWidth="0.5"
                transform={`rotate(${i * 30} 20 45)`}
              />
            ))}
            {/* Hub */}
            <circle cx="20" cy="45" r="2" fill="#FFE100" />
          </motion.g>

          {/* Front Wheel */}
          <motion.g
            style={{ transformOrigin: "80px 45px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}>
            <circle
              cx="80"
              cy="45"
              r="14.5"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            <circle
              cx="80"
              cy="45"
              r="14.5"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            <circle
              cx="80"
              cy="45"
              r="13"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1"
            />
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`fw-spoke-${i}`}
                x1="80"
                y1="31"
                x2="80"
                y2="59"
                stroke="#6b7280"
                strokeWidth="0.5"
                transform={`rotate(${i * 30} 80 45)`}
              />
            ))}
            <circle cx="80" cy="45" r="2" fill="#FFE100" />
          </motion.g>

          {/* --- Crankset & Pedals --- */}
          <motion.g
            style={{ transformOrigin: "45px 45px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}>
            {/* Crank arms */}
            <line
              x1="45"
              y1="37"
              x2="45"
              y2="53"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Chainring */}
            <circle
              cx="45"
              cy="45"
              r="5"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
              strokeDasharray="2 1"
            />
            {/* Pedals */}
            <rect x="42" y="35" width="6" height="3" rx="1.5" fill="#FFE100" />
            <rect x="42" y="52" width="6" height="3" rx="1.5" fill="#FFE100" />
            <circle cx="45" cy="45" r="2" fill="#111111" />
          </motion.g>
        </motion.svg>

        {/* Road under the bike */}
        <div className="mt-[-2px] w-[300px] h-[4px] overflow-hidden relative opacity-100 rounded-[2px] bg-[#222222]">
          <motion.div
            className="absolute w-[200%] h-full flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
            {/* Half 1 */}
            <div className="w-1/2 h-full flex items-center justify-around px-4">
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
            </div>
            {/* Half 2 */}
            <div className="w-1/2 h-full flex items-center justify-around px-4">
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
              <div className="w-[30px] h-full bg-white/20"></div>
            </div>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-5 text-[10px] uppercase font-semibold tracking-[3px] text-white/40 flex gap-1 items-center"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
          <span>Tourhjelper oppdateres</span>
          <div className="flex px-1 min-w-[20px]">
            <motion.span
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.2, 0.8, 1],
              }}>
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.4, 0.8, 1, 1],
              }}>
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.6, 0.8, 1, 1],
              }}>
              .
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Wind({
  speed,
  top,
  delay,
  opacity,
  width,
}: {
  speed: number;
  top: string;
  delay: number;
  opacity: number;
  width: string;
}) {
  return (
    <motion.div
      className="absolute h-[2px] bg-[#e5e7eb] rounded-full z-0 overflow-hidden"
      style={{ top, right: "-20%", width, opacity }}
      animate={{ x: ["50vh", "-50vh"] }}
      transition={{ repeat: Infinity, duration: speed, delay, ease: "linear" }}
    />
  );
}

export default function UpdatingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#111111] font-sans text-white">
      <TdfLoader />
    </div>
  );
}
