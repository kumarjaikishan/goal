import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, Settings2 } from 'lucide-react'

const COLORS = [
  '#ff007f', '#00e5ff', '#7000ff', '#ff8c00', '#00ff88', 
  '#ffef00', '#ff4d4d', '#ff00ff', '#1e90ff', '#32cd32'
]

const AdminPanel = ({ goals, setGoals, onClose }) => {
  const [newGoal, setNewGoal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const addGoal = (e) => {
    e.preventDefault()
    if (!newGoal.trim()) return
    
    const newEntry = {
      id: Date.now(),
      text: newGoal,
      color: COLORS[goals.length % COLORS.length]
    }
    
    setGoals([...goals, newEntry])
    setNewGoal('')
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditText(goal.text)
  }

  const saveEdit = () => {
    setGoals(goals.map(g => g.id === editingId ? { ...g, text: editText } : g))
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
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-white">
            <Settings2 size={24} className="text-primary" />
            Goal Manager
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-dim hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Add Section */}
        <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 block">New Goal Identity</label>
          <form onSubmit={addGoal} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Enter goal name..." 
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="flex-1 bg-black/40 border-white/10 rounded-2xl px-5 py-3 text-sm font-bold focus:border-secondary outline-none transition-all placeholder:text-white/10"
              autoFocus
            />
            <button 
              type="submit" 
              className="btn btn-primary shadow-xl" 
              disabled={!newGoal.trim()}
              style={{ width: '56px', borderRadius: '16px', padding: 0, justifyContent: 'center' }}
            >
              <Plus size={24} />
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
              
              <div className="flex-1">
                {editingId === goal.id ? (
                  <input 
                    autoFocus
                    className="w-full bg-transparent border-b-2 border-primary py-1 text-sm font-bold text-white outline-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  />
                ) : (
                  <span className="text-sm font-bold tracking-tight text-white/90">{goal.text}</span>
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
      </div>
    </div>
  )
}

export default AdminPanel
