import React, { useState } from 'react'

const GoalWheel = ({ goals, onSelect, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0)
  
  const spinWheel = () => {
    if (isSpinning || goals.length === 0) return
    
    setIsSpinning(true)
    const extraRotations = 8 + Math.random() * 5
    const randomAngle = Math.floor(Math.random() * 360)
    const newRotation = rotation + (extraRotations * 360) + randomAngle
    setRotation(newRotation)
    
    const segmentAngle = 360 / goals.length
    const finalAngleOnWheel = (360 - (newRotation % 360)) % 360
    const winningIndex = Math.floor(finalAngleOnWheel / segmentAngle)
    
    setTimeout(() => {
      setIsSpinning(false)
      onSelect(goals[winningIndex])
    }, 5000)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center scale-[0.8] sm:scale-100">
      {/* Outer Glow Effect */}
      <div className="absolute inset-[-40px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      
      {/* The Spinning Wheel */}
      <div 
        className="w-full h-full rounded-full border-[10px] border-[#1a1a2e] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden cursor-pointer"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 5000ms cubic-bezier(0.1, 0, 0, 1)',
        }}
        onClick={spinWheel}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <defs>
            {goals.map((goal, index) => {
              const angle = 360 / goals.length
              const midAngle = (index + 0.5) * angle
              const xTarget = 50 + 50 * Math.cos((Math.PI * midAngle) / 180)
              const yTarget = 50 + 50 * Math.sin((Math.PI * midAngle) / 180)
              
              return (
                <linearGradient 
                  key={`grad-${goal.id}`} 
                  id={`grad-${goal.id}`} 
                  x1="50" y1="50" 
                  x2={xTarget} y2={yTarget}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="20%" stopColor={goal.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={goal.color} />
                </linearGradient>
              )
            })}
          </defs>
          {goals.map((goal, index) => {
            const angle = 360 / goals.length
            const startAngle = index * angle
            const endAngle = (index + 1) * angle
            
            const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180)
            const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180)
            const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180)
            const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180)
            
            return (
              <g key={goal.id}>
                <path 
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} 
                  fill={`url(#grad-${goal.id})`} 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="0.2"
                />
                <text
                  x="96"
                  y="50"
                  fill="white"
                  fontSize="3.5"
                  className="font-black"
                  textAnchor="end"
                  transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                  style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {goal.text.length > 15 ? goal.text.substring(0, 12) + '..' : goal.text}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Center Indicator (Pointer Needle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="w-12 h-12 rounded-full bg-[#0a0a14] border-[3px] border-[#1a1a2e] shadow-2xl flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,0,127,0.4)]">
            <defs>
              <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            {/* White Hub */}
            <circle cx="50" cy="50" r="14" fill="white" />
            
            {/* THE NEEDLE - Points Up */}
            <path 
              d="M 50 18 L 44 50 L 56 50 Z" 
              fill="url(#needleGrad)" 
              stroke="#1a1a2e" 
              strokeWidth="0.5"
            />
            
            <circle cx="50" cy="50" r="4" fill="#ff007f" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Static Selection Point Indicator at 12 o'clock */}
      <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 z-40">
        <div className="w-10 h-10 bg-white shadow-2xl" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}></div>
      </div>

      {!isSpinning && (
        <div className="absolute top-50 left-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white font-black text-[10px] tracking-[0.5em] uppercase">SPIN</span>
        </div>
      )}
    </div>
  )
}

export default GoalWheel
