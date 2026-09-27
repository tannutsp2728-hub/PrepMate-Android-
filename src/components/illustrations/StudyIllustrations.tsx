import React from 'react';

// Cute, sophisticated hand-drawn study companion mascot: Pip the Study Owl with glasses and book
export const StudyCompanion: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-xs transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft pastel ambient glow */}
    <circle cx="60" cy="62" r="50" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Body */}
    <path
      d="M36 78C36 50 44 32 60 32C76 32 84 50 84 78C84 94 74 100 60 100C46 100 36 94 36 78Z"
      fill="#FDE68A"
      stroke="#475569"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Soft Belly patch */}
    <ellipse cx="60" cy="74" rx="16" ry="18" fill="#FFFBEB" stroke="#FBBF24" strokeWidth="1.8" />
    
    {/* Belly feather marks */}
    <path d="M56 68C58 70 62 70 64 68" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M54 75C57 77 63 77 66 75" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />

    {/* Wings */}
    <path
      d="M36 62C30 68 28 80 34 88C35 84 36 74 38 68"
      fill="#F59E0B"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M84 62C90 68 92 80 86 88C85 84 84 74 82 68"
      fill="#F59E0B"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Cute Graduation/Study Cap */}
    <path
      d="M60 18L84 28L60 38L36 28L60 18Z"
      fill="#6366F1"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M48 33V42C48 45 53 48 60 48C67 48 72 45 72 42V33"
      fill="#4F46E5"
      stroke="#475569"
      strokeWidth="2.2"
    />
    {/* Tassel */}
    <path d="M60 28L80 36V46" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="80" cy="47" r="2.5" fill="#F59E0B" />

    {/* Big Academic Round Glasses */}
    <circle cx="49" cy="54" r="9.5" fill="white" stroke="#475569" strokeWidth="2.5" />
    <circle cx="71" cy="54" r="9.5" fill="white" stroke="#475569" strokeWidth="2.5" />
    <path d="M58.5 54H61.5" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="51" cy="54" r="4.5" fill="#1E293B" />
    <circle cx="69" cy="54" r="4.5" fill="#1E293B" />
    {/* Catchlights */}
    <circle cx="52.5" cy="52" r="1.5" fill="white" />
    <circle cx="70.5" cy="52" r="1.5" fill="white" />

    {/* Little Orange Beak */}
    <path d="M57 59L60 64L63 59H57Z" fill="#F97316" stroke="#475569" strokeWidth="1.8" strokeLinejoin="round" />

    {/* Rosy blush cheeks */}
    <ellipse cx="38" cy="62" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.6" />
    <ellipse cx="82" cy="62" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.6" />

    {/* Open Notebook held in front */}
    <path
      d="M46 86L60 83L74 86V98L60 95L46 98V86Z"
      fill="#E0E7FF"
      stroke="#475569"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M60 83V95" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 88H56" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 92H55" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M64 88H70" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M64 92H69" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Little Feet */}
    <path d="M50 100V104" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M70 100V104" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Potted Growing Sprout/Plant (for Mastery, Study Streaks, and Progress)
export const SproutPlantIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 52 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft glow background */}
    <circle cx="40" cy="40" r="34" fill="#ECFDF5" />

    {/* Terracotta Plant Pot */}
    <path
      d="M26 46H54L50 70H30L26 46Z"
      fill="#FDBA74"
      stroke="#475569"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Pot rim */}
    <rect x="23" y="40" width="34" height="7" rx="3.5" fill="#FB923C" stroke="#475569" strokeWidth="2.2" />

    {/* Cute pot face */}
    <circle cx="36" cy="56" r="1.8" fill="#334155" />
    <circle cx="44" cy="56" r="1.8" fill="#334155" />
    <path d="M38.5 59C39.5 60.5 40.5 60.5 41.5 59" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="33" cy="58" r="1.5" fill="#FDA4AF" />
    <circle cx="47" cy="58" r="1.5" fill="#FDA4AF" />

    {/* Main Stem */}
    <path d="M40 40V24" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" />

    {/* Left Leaf */}
    <path
      d="M40 32C32 30 26 22 28 16C36 16 39 26 40 32Z"
      fill="#34D399"
      stroke="#475569"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M32 23C35 25 38 28 40 31" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />

    {/* Right Leaf */}
    <path
      d="M40 26C48 24 54 16 52 10C44 10 41 20 40 26Z"
      fill="#10B981"
      stroke="#475569"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M48 17C45 19 42 22 40 25" stroke="#047857" strokeWidth="1.4" strokeLinecap="round" />

    {/* Little yellow star/sparkle */}
    <path
      d="M58 24L60 27L63 29L60 31L58 34L56 31L53 29L56 27L58 24Z"
      fill="#FBBF24"
    />
  </svg>
);

// Cute Campfire/Flame (for Daily Study Streak 🔥)
export const CampfireStreakIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft warm aura */}
    <circle cx="40" cy="40" r="34" fill="#FFF7ED" />

    {/* Crossed study wood logs */}
    <rect
      x="20"
      y="58"
      width="40"
      height="8"
      rx="4"
      transform="rotate(-12 20 58)"
      fill="#D97706"
      stroke="#475569"
      strokeWidth="2"
    />
    <rect
      x="22"
      y="50"
      width="40"
      height="8"
      rx="4"
      transform="rotate(12 22 50)"
      fill="#B45309"
      stroke="#475569"
      strokeWidth="2"
    />

    {/* Big Outer Flame */}
    <path
      d="M40 14C45 25 58 32 58 48C58 60 49 66 40 66C31 66 22 60 22 48C22 34 32 24 40 14Z"
      fill="#FB923C"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Inner Yellow Core Flame */}
    <path
      d="M40 28C43 35 50 40 50 50C50 58 45 62 40 62C35 62 30 58 30 50C30 40 37 34 40 28Z"
      fill="#FDE047"
    />

    {/* Cute flame smile */}
    <circle cx="36" cy="48" r="1.6" fill="#475569" />
    <circle cx="44" cy="48" r="1.6" fill="#475569" />
    <path d="M38 52C39 53.5 41 53.5 42 52" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />

    {/* Floating Sparks */}
    <circle cx="28" cy="22" r="2.5" fill="#F97316" />
    <circle cx="54" cy="18" r="2" fill="#FBBF24" />
    <circle cx="48" cy="10" r="1.8" fill="#F97316" />
  </svg>
);

// Cute Glowing Brain with Lightbulb (for Revision Tracker 🧠)
export const BrainSparkIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft lavender/pink glow */}
    <circle cx="40" cy="42" r="34" fill="#F5F3FF" />

    {/* Glowing lightbulb on top */}
    <circle cx="40" cy="16" r="7" fill="#FDE047" stroke="#475569" strokeWidth="2" />
    <rect x="37" y="23" width="6" height="3" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
    {/* Light rays */}
    <path d="M40 6V4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 10L28 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 10L52 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

    {/* Left Brain Hemisphere */}
    <path
      d="M38 32C32 30 24 34 23 42C21 48 24 54 26 56C23 60 25 68 31 69C35 69 38 67 38 64V32Z"
      fill="#DDD6FE"
      stroke="#475569"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* Right Brain Hemisphere */}
    <path
      d="M42 32C48 30 56 34 57 42C59 48 56 54 54 56C57 60 55 68 49 69C45 69 42 67 42 64V32Z"
      fill="#C4B5FD"
      stroke="#475569"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* Brain Gyri wrinkles */}
    <path d="M28 44C32 44 34 46 38 46" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M28 58C32 58 35 56 38 56" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 44C48 44 46 46 42 46" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 58C48 58 45 56 42 56" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" />

    {/* Cute smiling face */}
    <circle cx="34" cy="51" r="1.8" fill="#1E1B4B" />
    <circle cx="46" cy="51" r="1.8" fill="#1E1B4B" />
    <path d="M38 53C39.5 54.5 40.5 54.5 42 53" stroke="#1E1B4B" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="30" cy="52" r="1.5" fill="#FDA4AF" />
    <circle cx="50" cy="52" r="1.5" fill="#FDA4AF" />
  </svg>
);

// Cute Star Trophy with Sparkles (for XP and Level achievements ⭐)
export const StarTrophyIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft golden aura */}
    <circle cx="40" cy="40" r="34" fill="#FEFCE8" />

    {/* Pedestal base */}
    <rect x="28" y="62" width="24" height="6" rx="3" fill="#64748B" stroke="#475569" strokeWidth="2" />
    <rect x="32" y="56" width="16" height="7" fill="#94A3B8" stroke="#475569" strokeWidth="2" />

    {/* Trophy Cup */}
    <path
      d="M24 22H56C56 38 48 48 40 48C32 48 24 38 24 22Z"
      fill="#FBBF24"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Inner cup depth */}
    <ellipse cx="40" cy="22" rx="16" ry="3.5" fill="#F59E0B" stroke="#475569" strokeWidth="2" />

    {/* Handles */}
    <path
      d="M24 26C16 26 14 36 24 40"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M56 26C64 26 66 36 56 40"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Big Centered Smiling Star */}
    <path
      d="M40 27L42.5 32.5L48 33.2L44 37L45 42.5L40 39.8L35 42.5L36 37L32 33.2L37.5 32.5L40 27Z"
      fill="#FEF08A"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Floating celebratory sparkles */}
    <path d="M18 14L20 18L24 20L20 22L18 26L16 22L12 20L16 18L18 14Z" fill="#F59E0B" />
    <path d="M62 12L63.5 15L66.5 16.5L63.5 18L62 21L60.5 18L57.5 16.5L60.5 15L62 12Z" fill="#F59E0B" />
  </svg>
);

// Cute Pomodoro Focus Clock (for Focus Timer ⏱️)
export const CozyClockIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft sky blue aura */}
    <circle cx="40" cy="40" r="34" fill="#F0F9FF" />

    {/* Alarm clock bells */}
    <circle cx="24" cy="22" r="8" fill="#F43F5E" stroke="#475569" strokeWidth="2.2" />
    <circle cx="56" cy="22" r="8" fill="#F43F5E" stroke="#475569" strokeWidth="2.2" />
    <rect x="36" y="16" width="8" height="4" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="2" />

    {/* Clock feet */}
    <line x1="26" y1="58" x2="20" y2="68" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="54" y1="58" x2="60" y2="68" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" />

    {/* Main Clock Face */}
    <circle cx="40" cy="42" r="23" fill="#FFE4E6" stroke="#475569" strokeWidth="2.5" />
    <circle cx="40" cy="42" r="18" fill="white" stroke="#FECDD3" strokeWidth="1.5" />

    {/* Clock Hands */}
    <line x1="40" y1="42" x2="40" y2="30" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="42" x2="50" y2="42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <circle cx="40" cy="42" r="2.5" fill="#E11D48" />

    {/* Cute eyes */}
    <circle cx="34" cy="46" r="1.5" fill="#881337" />
    <circle cx="46" cy="46" r="1.5" fill="#881337" />
    <path d="M38 48C39.5 49.5 40.5 49.5 42 48" stroke="#881337" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Cute Stack of Books (for Study Planner 📚)
export const StackOfBooksIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft mint aura */}
    <circle cx="40" cy="40" r="34" fill="#F0FDF4" />

    {/* Bottom Book (Green) */}
    <rect x="18" y="52" width="44" height="13" rx="3" fill="#34D399" stroke="#475569" strokeWidth="2.2" />
    <path d="M18 55H62" stroke="#059669" strokeWidth="1.5" />
    <rect x="22" y="55" width="36" height="7" fill="white" />

    {/* Middle Book (Purple) */}
    <rect x="22" y="38" width="40" height="12" rx="3" fill="#A78BFA" stroke="#475569" strokeWidth="2.2" />
    <path d="M22 41H62" stroke="#6D28D9" strokeWidth="1.5" />
    <rect x="26" y="41" width="32" height="6" fill="white" />

    {/* Top Book (Yellow with red ribbon bookmark) */}
    <rect x="26" y="24" width="34" height="12" rx="3" fill="#FBBF24" stroke="#475569" strokeWidth="2.2" />
    <path d="M26 27H60" stroke="#D97706" strokeWidth="1.5" />
    <rect x="30" y="27" width="26" height="6" fill="white" />

    {/* Ribbon bookmark hanging down */}
    <path d="M48 24V44L52 41L56 44V24" fill="#F43F5E" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />

    {/* Little yellow star */}
    <path d="M24 16L25.5 19L28.5 20.5L25.5 22L24 25L22.5 22L19.5 20.5L22.5 19L24 16Z" fill="#F59E0B" />
  </svg>
);

// Cute Pencil & Notepad (for Quick Notes ✏️)
export const PencilNotesIllustration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-105 ${className}`}
  >
    {/* Soft cream aura */}
    <circle cx="40" cy="40" r="34" fill="#FEF9C3" />

    {/* Paper Sheet */}
    <rect x="22" y="16" width="36" height="48" rx="4" fill="white" stroke="#475569" strokeWidth="2.2" />
    {/* Folded top-right corner */}
    <path d="M46 16L58 28H46V16Z" fill="#F1F5F9" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />

    {/* Cute pastel lined notes */}
    <line x1="28" y1="32" x2="48" y2="32" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="38" x2="52" y2="38" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
    <line x1="28" y1="44" x2="46" y2="44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="50" x2="50" y2="50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Slanted Cute Pencil */}
    <g transform="rotate(32 44 44)">
      <rect x="40" y="18" width="8" height="28" fill="#FBBF24" stroke="#475569" strokeWidth="1.8" />
      {/* Eraser */}
      <rect x="40" y="14" width="8" height="6" rx="2" fill="#FB7185" stroke="#475569" strokeWidth="1.8" />
      {/* Ferrule band */}
      <rect x="40" y="18" width="8" height="2" fill="#94A3B8" />
      {/* Sharpened tip */}
      <polygon points="40,46 48,46 44,54" fill="#FDE68A" stroke="#475569" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Graphite */}
      <polygon points="42,50 46,50 44,54" fill="#334155" />
    </g>
  </svg>
);

// Cute Mini Quest Scroll Badge (for Daily Study Quests 🎯)
export const QuestScrollBadge: React.FC<{ className?: string; size?: number; completed?: boolean }> = ({ 
  className = '', 
  size = 36,
  completed = false 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform hover:scale-110 shrink-0 ${className}`}
  >
    {/* Soft aura */}
    <circle cx="30" cy="30" r="26" fill={completed ? '#ECFDF5' : '#FEF3C7'} />

    {/* Mini Scroll Body */}
    <rect
      x="16"
      y="14"
      width="28"
      height="32"
      rx="6"
      fill={completed ? '#D1FAE5' : '#FFFBEB'}
      stroke="#475569"
      strokeWidth="2"
    />
    
    {/* Scroll roll ends */}
    <path
      d="M13 18C13 15.5 15.5 14 18 14H42C44.5 14 47 15.5 47 18C47 20.5 44.5 22 42 22H18C15.5 22 13 20.5 13 18Z"
      fill={completed ? '#A7F3D0' : '#FDE68A'}
      stroke="#475569"
      strokeWidth="1.8"
    />
    <path
      d="M13 42C13 39.5 15.5 38 18 38H42C44.5 38 47 39.5 47 42C47 44.5 44.5 46 42 46H18C15.5 46 13 44.5 13 42Z"
      fill={completed ? '#A7F3D0' : '#FDE68A'}
      stroke="#475569"
      strokeWidth="1.8"
    />

    {/* Scroll inner details: Checkmark or Quill line */}
    {completed ? (
      <path
        d="M23 29L28 34L37 25"
        stroke="#059669"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <>
        <line x1="22" y1="26" x2="38" y2="26" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="31" x2="34" y2="31" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="33" r="2" fill="#F59E0B" />
      </>
    )}
  </svg>
);

// Cute Mini Illustrated Subject Icons (Biology, Chemistry, Math, Physics, Tech, General)
export const BiologySubjectIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#ECFDF5" />
    {/* Cute Test Tube with Sprout Leaf */}
    <path
      d="M26 16H34V36C34 40.4 30.4 44 26 44C21.6 44 18 40.4 18 36V16H26Z"
      fill="#A7F3D0"
      stroke="#475569"
      strokeWidth="2"
    />
    <path d="M16 16H36" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 34C24 34 28 36 32 36" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="30" r="1.5" fill="white" />
    <circle cx="28" cy="26" r="1.2" fill="white" />
    {/* Sprouting green leaf */}
    <path
      d="M32 24C38 20 44 22 44 28C38 30 34 26 32 24Z"
      fill="#34D399"
      stroke="#475569"
      strokeWidth="1.8"
    />
    <path d="M34 25L41 26" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ChemistrySubjectIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#FDF2F8" />
    {/* Erlenmeyer Flask */}
    <path
      d="M27 15H33V26L42 41C43.5 43.5 41.7 46 38.8 46H21.2C18.3 46 16.5 43.5 18 41L27 26V15Z"
      fill="#FBCFE8"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M25 15H35" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    {/* Liquid inside */}
    <path
      d="M21 37L24 32C28 34 32 32 36 34L39 37L38 43H22L21 37Z"
      fill="#F472B6"
    />
    {/* Bubbles */}
    <circle cx="29" cy="22" r="2" fill="#F472B6" stroke="#475569" strokeWidth="1.2" />
    <circle cx="35" cy="18" r="1.5" fill="#FDE047" />
    <circle cx="26" cy="38" r="1.5" fill="white" />
    <circle cx="33" cy="39" r="1.8" fill="white" />
  </svg>
);

export const MathAptitudeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#FEF3C7" />
    {/* Geometric Compass / Ruler combo */}
    <polygon
      points="20,44 30,16 40,44 30,37"
      fill="#FDE68A"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Compass joint */}
    <circle cx="30" cy="17" r="3.5" fill="#F59E0B" stroke="#475569" strokeWidth="1.8" />
    {/* Crossbar with math symbol */}
    <line x1="24" y1="34" x2="36" y2="34" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <path d="M29 26L31 28M31 26L29 28" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="43" cy="20" r="2" fill="#F59E0B" />
  </svg>
);

export const PhysicsScienceIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#EEF2FF" />
    {/* Atom Orbit 1 */}
    <ellipse cx="30" cy="30" rx="19" ry="7" transform="rotate(-30 30 30)" stroke="#818CF8" strokeWidth="1.8" />
    {/* Atom Orbit 2 */}
    <ellipse cx="30" cy="30" rx="19" ry="7" transform="rotate(30 30 30)" stroke="#6366F1" strokeWidth="1.8" />
    {/* Nucleus */}
    <circle cx="30" cy="30" r="6" fill="#FBBF24" stroke="#475569" strokeWidth="2" />
    {/* Cute smile on nucleus */}
    <circle cx="28.5" cy="29" r="0.8" fill="#1E293B" />
    <circle cx="31.5" cy="29" r="0.8" fill="#1E293B" />
    <path d="M29 31C29.5 32 30.5 32 31 31" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
    {/* Electrons */}
    <circle cx="43" cy="22" r="2" fill="#4F46E5" stroke="#475569" strokeWidth="1" />
    <circle cx="17" cy="38" r="2" fill="#4F46E5" stroke="#475569" strokeWidth="1" />
  </svg>
);

export const GlobeGKIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#F0FDF4" />
    {/* Stand */}
    <path d="M22 46H38M30 40V46" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M42 28C42 36 36 42 30 42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    {/* Globe sphere */}
    <circle cx="28" cy="26" r="14" fill="#93C5FD" stroke="#475569" strokeWidth="2" />
    {/* Continents */}
    <path
      d="M22 23C24 21 28 22 29 25C26 27 23 27 22 23Z"
      fill="#86EFAC"
    />
    <path
      d="M28 29C32 29 36 32 33 35C29 35 28 32 28 29Z"
      fill="#86EFAC"
    />
    <circle cx="38" cy="18" r="2" fill="#FBBF24" />
  </svg>
);

export const GeneralStudyIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={`shrink-0 ${className}`}>
    <circle cx="30" cy="30" r="26" fill="#FAF5FF" />
    {/* Open Book */}
    <path
      d="M17 22C23 20 28 22 30 25C32 22 37 20 43 22V38C37 36 32 38 30 41C28 38 23 36 17 38V22Z"
      fill="#DDD6FE"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M30 25V41" stroke="#475569" strokeWidth="1.8" />
    <path d="M21 27C24 26 27 27 28 28" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M32 28C33 27 36 26 39 27" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Intelligent Subject Icon Resolver
export function getSubjectIllustratedBadge(subjectName: string, size = 38): React.ReactElement {
  const norm = (subjectName || '').toLowerCase();
  if (norm.includes('bio') || norm.includes('life') || norm.includes('botan') || norm.includes('zoolog') || norm.includes('physio') || norm.includes('cell') || norm.includes('anat')) {
    return <BiologySubjectIcon size={size} />;
  }
  if (norm.includes('chem') || norm.includes('organic') || norm.includes('pharma') || norm.includes('biochem')) {
    return <ChemistrySubjectIcon size={size} />;
  }
  if (norm.includes('math') || norm.includes('aptitude') || norm.includes('quant') || norm.includes('calcul') || norm.includes('algeb') || norm.includes('stat')) {
    return <MathAptitudeIcon size={size} />;
  }
  if (norm.includes('physic') || norm.includes('elect') || norm.includes('mechan') || norm.includes('thermo') || norm.includes('optics')) {
    return <PhysicsScienceIcon size={size} />;
  }
  if (norm.includes('knowl') || norm.includes('gk') || norm.includes('civil') || norm.includes('history') || norm.includes('geog') || norm.includes('polity') || norm.includes('upsc') || norm.includes('eco')) {
    return <GlobeGKIcon size={size} />;
  }
  return <GeneralStudyIcon size={size} />;
}
