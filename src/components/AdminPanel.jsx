import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, Settings2 } from 'lucide-react'

const COLORS = [
  '#ff007f', '#00e5ff', '#7000ff', '#ff8c00', '#00ff88', 
  '#ffef00', '#ff4d4d', '#ff00ff', '#1e90ff', '#32cd32'
]

const AdminPanel = ({ goals, setGoals, onClose }) => {
  const [newGoal, setNewGoal] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassError, setShowPassError] = useState(false)

  // Session duration: 3 hours in milliseconds
  const SESSION_DURATION = 3 * 60 * 60 * 1000

  useEffect(() => {
    const session = localStorage.getItem('goal_admin_session')
    if (session) {
      const loginTime = parseInt(session, 10)
      const currentTime = Date.now()
      if (currentTime - loginTime < SESSION_DURATION) {
        setIsUnlocked(true)
      } else {
        localStorage.removeItem('goal_admin_session')
      }
    }
  }, [])

  const handleUnlock = (e) => {
    e.preventDefault()
    if (password === 'developerkishan') {
      setIsUnlocked(true)
      setShowPassError(false)
      setPassword('')
      localStorage.setItem('goal_admin_session', Date.now().toString())
    } else {
      setShowPassError(true)
      setTimeout(() => setShowPassError(false), 2000)
    }
  }

  const addGoal = (e) => {
    e.preventDefault()
    if (!newGoal.trim()) return
    
    const newEntry = {
      id: Date.now(),
      text: newGoal,
      description: newDescription,
      color: COLORS[goals.length % COLORS.length]
    }
    
    setGoals([...goals, newEntry])
    setNewGoal('')
    setNewDescription('')
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditText(goal.text)
    setEditDescription(goal.description || '')
  }

  const saveEdit = () => {
    setGoals(goals.map(g => g.id === editingId ? { ...g, text: editText, description: editDescription } : g))
    setEditingId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-pointer" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div 
        className="glass-card relative w-full max-w-lg z-10 animate-in flex flex-col gap-6 bg-[#0a0a14fb] border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
        style={{ maxHeight: '85vh' }}
      >
        {!isUnlocked ? (
          <div className="py-12 px-8 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(255,0,127,0.2)]">
              <Settings2 size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">System Locked</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Administrative access required</p>
            </div>

            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <input 
                type="password"
                placeholder="Enter Access Key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${showPassError ? 'border-primary' : 'border-white/10'} rounded-2xl px-6 py-4 text-center font-black tracking-[0.3em] outline-none focus:border-secondary transition-all placeholder:tracking-normal placeholder:font-bold`}
                autoFocus
              />
              {showPassError && (
                <p className="text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">Access Denied - Try Again</p>
              )}
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
                >
                  Verify Key
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-white">
                  <Settings2 size={24} className="text-secondary" />
                  Goal Manager
                </h2>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">
                  Administrative Access Granted
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-dim hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Add Section */}
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 block">New Goal Identity</label>
              <form onSubmit={addGoal} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="Enter goal name..." 
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full bg-black/40 border-white/10 rounded-2xl px-5 py-3 text-sm font-bold focus:border-secondary outline-none transition-all placeholder:text-white/10"
                  autoFocus
                />
                <textarea 
                  placeholder="Enter goal description..." 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-black/40 border-white/10 rounded-2xl px-5 py-3 text-sm font-medium focus:border-secondary outline-none transition-all placeholder:text-white/10 min-h-[80px] resize-none"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary shadow-xl w-full py-3 rounded-2xl" 
                  disabled={!newGoal.trim()}
                >
                  <Plus size={20} className="mr-2" />
                  Add Goal
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Existing Goals</span>
                <span className="text-[10px] font-black bg-secondary/20 text-secondary px-2 py-1 rounded-full">{goals.length}</span>
              </div>

              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="flex items-center gap-4 p-4 rounded-xl transition-all group border border-transparent hover:border-white/10"
                  style={{ 
                    background: `${goal.color}15`,
                  }}
                >
                  <div 
                    className="w-1.5 h-8 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: goal.color, boxShadow: `0 0 10px ${goal.color}44` }}
                  ></div>
                  
                  <div className="flex-1 min-w-0">
                    {editingId === goal.id ? (
                      <div className="flex flex-col gap-2">
                        <input 
                          autoFocus
                          className="w-full bg-transparent border-b border-primary py-1 text-sm font-bold text-white outline-none"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        />
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-medium text-white/70 outline-none focus:border-secondary resize-none"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white/90 truncate">{goal.text}</span>
                        <span className="text-[10px] font-medium text-white/40 line-clamp-1">{goal.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    {editingId === goal.id ? (
                      <button onClick={saveEdit} className="p-2 text-secondary hover:bg-secondary/10 rounded-xl">
                        <Check size={18} />
                      </button>
                    ) : (
                      <button onClick={() => startEdit(goal)} className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl">
                        <Edit2 size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-primary/40 hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {goals.length === 0 && (
                <div className="py-12 text-center text-white/20 italic text-sm">
                  List is empty
                </div>
              )}
            </div>

            <button 
              onClick={onClose} 
              className="btn btn-outline w-full justify-center py-4 border-white/10 hover:border-secondary hover:text-secondary rounded-2xl text-xs font-black uppercase tracking-[0.2em]"
            >
              Confirm Goals & Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
