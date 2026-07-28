import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppSelector } from '../../store'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { 
  Calendar, 
  Plus, 
  Trash2, 
  FileDown, 
  CheckCircle2, 
  Droplet, 
  Sprout, 
  Clock, 
  Activity, 
  PlayCircle
} from 'lucide-react'
import axios from 'axios'

interface ActiveCrop {
  id: string
  crop_name: string
  sowing_date: string
  current_stage: string
  created_at: string
}

interface ScheduleEvent {
  stage: string
  start_date: string
  end_date: string
  task: string
  water_requirement: string
  fertilizer_recommendation: string
}

interface CropScheduleResponse {
  crop_name: string
  sowing_date: string
  current_stage: string
  schedule: ScheduleEvent[]
}

export default function CropModule() {
  const { t } = useTranslation()
  const token = useAppSelector((state) => state.auth.token)

  const [activeCrops, setActiveCrops] = useState<ActiveCrop[]>([])
  const [selectedCrop, setSelectedCrop] = useState<ActiveCrop | null>(null)
  const [scheduleData, setScheduleData] = useState<CropScheduleResponse | null>(null)
  
  // Create crop inputs
  const [cropName, setCropName] = useState('rice')
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduleLoading, setIsScheduleLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActiveCrops()
  }, [])

  useEffect(() => {
    if (selectedCrop) {
      fetchCropSchedule(selectedCrop.id)
    } else {
      setScheduleData(null)
    }
  }, [selectedCrop])

  const fetchActiveCrops = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/crop/calendars', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setActiveCrops(response.data)
      if (response.data.length > 0 && !selectedCrop) {
        setSelectedCrop(response.data[0])
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch active crop lists.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCropSchedule = async (id: string) => {
    setIsScheduleLoading(true)
    try {
      const response = await axios.get(`/api/crop/calendars/${id}/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setScheduleData(response.data)
    } catch (err) {
      console.error('Failed to load crop schedule details', err)
    } finally {
      setIsScheduleLoading(false)
    }
  }

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    setError('')
    try {
      const response = await axios.post('/api/crop/calendars', {
        crop_name: cropName,
        sowing_date: sowingDate,
        current_stage: 'Sowing'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setActiveCrops(prev => [...prev, response.data])
      setSelectedCrop(response.data)
      setShowAddForm(false)
    } catch (err) {
      console.error(err)
      setError('Failed to track crop.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCrop = async (id: string) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await axios.delete(`/api/crop/calendars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const filtered = activeCrops.filter(c => c.id !== id)
      setActiveCrops(filtered)
      if (selectedCrop?.id === id) {
        setSelectedCrop(filtered.length > 0 ? filtered[0] : null)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to delete crop entry.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStage = async (newStage: string) => {
    if (!selectedCrop) return
    try {
      const response = await axios.patch(`/api/crop/calendars/${selectedCrop.id}`, {
        current_stage: newStage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Update local state lists
      setActiveCrops(prev => prev.map(c => c.id === selectedCrop.id ? response.data : c))
      setSelectedCrop(response.data)
    } catch (err) {
      console.error('Failed to update stage', err)
    }
  }

  const exportSchedulePDF = () => {
    if (!scheduleData || !selectedCrop) return

    const doc = new jsPDF()
    
    // Header banner
    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Agrova AI Farmer Query', 15, 18)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Crop Lifecycle Calendar: ${selectedCrop.crop_name.toUpperCase()}`, 15, 28)
    
    // Details
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(11)
    doc.text(`Sowing Date: ${selectedCrop.sowing_date}`, 15, 52)
    doc.text(`Current Stage: ${selectedCrop.current_stage}`, 130, 52)
    
    autoTable(doc, {
      startY: 58,
      head: [['Growth Stage', 'Timeline Dates', 'Farm Work Tasks', 'Water Needs', 'Fertilizers']],
      body: scheduleData.schedule.map(item => [
        item.stage,
        `${item.start_date} to ${item.end_date}`,
        item.task,
        item.water_requirement,
        item.fertilizer_recommendation
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    })

    doc.save(`crop_schedule_${selectedCrop.crop_name.toLowerCase()}.pdf`)
  }

  const supportedCrops = [
    { code: 'rice', label: 'Rice' },
    { code: 'wheat', label: 'Wheat' },
    { code: 'cotton', label: 'Cotton' },
    { code: 'sugarcane', label: 'Sugarcane' },
    { code: 'banana', label: 'Banana' },
    { code: 'tomato', label: 'Tomato' },
    { code: 'onion', label: 'Onion' },
    { code: 'groundnut', label: 'Groundnut' },
    { code: 'maize', label: 'Maize' },
    { code: 'millets', label: 'Millets' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="glass glow-green p-8 rounded-3xl relative overflow-hidden border border-white/5">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('modules.crop.title', 'Crop Lifecycle Tracker')}</h1>
              <p className="text-xs text-neutral-400">Schedule, monitor, and configure crop growth stages and harvesting calendars.</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-xs font-bold rounded-xl hover:scale-103 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Crop</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-neutral-900 border border-white/5 max-w-lg"
        >
          <h3 className="text-sm font-bold text-white mb-4">Start Crop Monitoring</h3>
          <form onSubmit={handleCreateCrop} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Crop Species</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-neutral-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500/40"
              >
                {supportedCrops.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Sowing Date</label>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full bg-neutral-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-white/5 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                Start Tracking
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tracked Crops List Column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Monitoring Lists</h3>
          
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
            {activeCrops.map((crop) => {
              const isSelected = selectedCrop?.id === crop.id
              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-lime-500/10 to-neutral-900 border-lime-500'
                      : 'bg-neutral-900/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-white capitalize">{crop.crop_name}</h4>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-lime-500" /> Sowed: {crop.sowing_date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-white/5 text-[9px] font-bold text-lime-400">
                      {crop.current_stage}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCrop(crop.id); }}
                      className="p-2 rounded-xl bg-neutral-800/40 text-neutral-500 hover:text-red-400 border border-transparent hover:border-red-500/15"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {activeCrops.length === 0 && (
              <div className="text-center py-16 text-neutral-500 text-sm">
                You are not tracking any crops currently.
              </div>
            )}
          </div>
        </div>

        {/* Timeline details Column */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/5 min-h-[400px]">
          
          {selectedCrop && scheduleData && !isScheduleLoading ? (
            <div className="space-y-6">
              
              {/* Timeline Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-lime-400 font-bold uppercase tracking-widest">
                    <Activity className="w-4 h-4" /> Timeline Progress
                  </span>
                  <h3 className="text-lg font-black text-white capitalize">{selectedCrop.crop_name} Calendar</h3>
                  <p className="text-xs text-neutral-500">Sowed on {selectedCrop.sowing_date}</p>
                </div>
                <button
                  onClick={exportSchedulePDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-xs font-semibold transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Calendar PDF</span>
                </button>
              </div>

              {/* Dynamic Timeline Progression */}
              <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                {scheduleData.schedule.map((evt, idx) => {
                  const isActive = selectedCrop.current_stage.toLowerCase() === evt.stage.toLowerCase()
                  return (
                    <div key={idx} className="relative space-y-2">
                      
                      {/* Timeline dot bullet */}
                      <span className={`absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full border-4 flex items-center justify-center ${
                        isActive
                          ? 'bg-lime-400 border-lime-400 glow-green animate-pulse'
                          : 'bg-neutral-900 border-neutral-800'
                      }`} />

                      <div className={`p-4 border rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-neutral-900 to-lime-500/5 border-lime-500'
                          : 'bg-neutral-900/30 border-white/5 text-neutral-400'
                      }`}>
                        
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-neutral-300'}`}>{evt.stage}</h4>
                          <span className="text-[10px] font-semibold">{evt.start_date} to {evt.end_date}</span>
                        </div>

                        {/* Stage details on hover/active */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="text-[9px] uppercase font-bold text-neutral-500 block">Required Farm Task</span>
                            <p className={`${isActive ? 'text-neutral-200' : 'text-neutral-400'}`}>{evt.task}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                              <Droplet className="w-3.5 h-3.5" />
                              <span>Irrigation: {evt.water_requirement}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-lime-400 font-semibold">
                              <Sprout className="w-3.5 h-3.5" />
                              <span>Fertilizer: {evt.fertilizer_recommendation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Complete/Activate Stage actions */}
                        {!isActive && (
                          <button
                            onClick={() => handleUpdateStage(evt.stage)}
                            className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-neutral-950 border border-white/5 hover:border-lime-500/40 text-[10px] font-bold text-neutral-400 hover:text-white rounded-lg transition-all"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Set Active Stage</span>
                          </button>
                        )}

                        {isActive && (
                          <div className="mt-3 flex items-center gap-1 text-[10px] text-lime-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Phase
                          </div>
                        )}

                      </div>

                    </div>
                  )
                })}
              </div>

            </div>
          ) : isScheduleLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-xs text-neutral-400">Loading timeline details...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-400">Select a Tracked Crop</p>
                <p className="text-xs text-neutral-600">Click an active crop log on the left checklist to view the growth schedule.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
