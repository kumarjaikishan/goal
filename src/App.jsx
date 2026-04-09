import React, { useState, useEffect } from 'react'
import GoalWheel from './components/GoalWheel'
import AdminPanel from './components/AdminPanel'
import Footer from './components/Footer'
import { Settings2 } from 'lucide-react'

const DEFAULT_GOALS = [
  { id: 1, text: 'Go for a Walk', color: '#ff007f' },
  { id: 2, text: 'Read a Book', color: '#00e5ff' },
  { id: 3, text: 'Learn Coding', color: '#7000ff' },
  { id: 4, text: 'Meditation', color: '#ff8c00' },
  { id: 5, text: 'Drink Water', color: '#00ff88' },
  { id: 6, text: 'Call a Friend', color: '#ffef00' }
]

function App() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goal_wheel_items')
    return saved ? JSON.parse(saved) : DEFAULT_GOALS
  })
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('goal_wheel_items', JSON.stringify(goals))
  }, [goals])

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-background relative overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 sm:mb-12 relative z-20">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white">
          Goal<span className="text-primary italic">Wheel</span>
        </h1>
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="btn btn-outline gap-2 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border-white/10 hover:border-secondary transition-all"
        >
          <Settings2 size={20} className="text-secondary" />
          <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px]">Manage Goals</span>
        </button>
      </header>

      {/* Main Wheel Section */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-10 sm:gap-16 relative z-10">
        <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
          <GoalWheel 
            goals={goals} 
            onSelect={handleGoalSelect} 
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </div>

        {/* Selected Goal Display */}
        <div className="w-full max-w-lg h-32 flex items-center justify-center relative">
          {selectedGoal && !isSpinning && (
            <div className="w-full animate-in relative group">
              {/* Outer Glow Layer */}
              <div 
                className="absolute inset-[-10px] rounded-[30px] opacity-20 blur-2xl transition-all duration-700 pointer-events-none group-hover:opacity-30"
                style={{ background: selectedGoal.color }}
              ></div>
              
              {/* Main Card */}
              <div 
                className="glass-card w-full flex flex-col items-center border-white/20 bg-[#0a0a1499] relative z-10 py-8"
                style={{ 
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 30px ${selectedGoal.color}22`
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[1px] w-6 bg-white/20"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">Today's Selection</span>
                  <div className="h-[1px] w-6 bg-white/20"></div>
                </div>
                
                <h2 
                  className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-center leading-none"
                  style={{ 
                    color: selectedGoal.color, 
                    textShadow: `0 0 15px ${selectedGoal.color}99, 0 0 30px ${selectedGoal.color}44`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                  }}
                >
                  {selectedGoal.text}
                </h2>
              </div>
            </div>
          )}
          {isSpinning && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-white/20 text-xs font-black uppercase tracking-[0.6em] animate-pulse">
                Analyzing Fates...
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 rounded-full bg-accent animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel 
          goals={goals} 
          setGoals={setGoals} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
