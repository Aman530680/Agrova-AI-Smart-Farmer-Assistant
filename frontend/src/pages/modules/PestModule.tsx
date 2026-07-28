import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { 
  Bug, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  FlaskConical,
  FileDown,
  X
} from 'lucide-react'
import axios from 'axios'

interface DiagnosisResult {
  disease_detected: string
  symptoms: string
  treatment: string
  organic_solution: string
  chemical_solution: string
  recommended_pesticides: string[]
  warning?: string
}

export default function PestModule() {
  const { t } = useTranslation()
  const token = useAppSelector((state) => state.auth.token)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError('')
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError('')
  }

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || isLoading) return

    setIsLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('image', selectedFile)
    if (notes) {
      formData.append('notes', notes)
    }

    try {
      const response = await axios.post('/api/pest/diagnose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      setResult(response.data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to diagnose crop leaf image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const exportPDF = () => {
    if (!result) return

    const doc = new jsPDF()
    
    // Title Banner
    doc.setFillColor(16, 185, 129) // Emerald primary color
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Agrova AI Farmer Query', 15, 18)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('AI Crop Health Diagnostic Report', 15, 28)
    
    // Body info
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(10)
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 150, 28)
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Diagnosis Summary', 15, 55)
    
    autoTable(doc, {
      startY: 60,
      head: [['Field', 'Details']],
      body: [
        ['Detected Disease/Pest', result.disease_detected],
        ['Symptoms', result.symptoms],
        ['General Treatment Advisory', result.treatment],
        ['Organic Solution', result.organic_solution],
        ['Chemical Solution', result.chemical_solution],
        ['Recommended Pesticides', result.recommended_pesticides.join(', ')]
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      }
    })
    
    doc.setFontSize(10)
    doc.setTextColor(148, 163, 184)
    doc.text('Disclaimer: This is an AI-generated analysis. Please cross-reference with local agricultural experts before spraying chemical agents.', 15, doc.internal.pageSize.height - 15)

    doc.save(`kisan_mitra_diagnose_${result.disease_detected.replace(/\s+/g, '_').toLowerCase()}.pdf`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Welcome & Instructions */}
      <div className="glass glow-green p-8 rounded-3xl space-y-3 relative overflow-hidden border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('modules.pest.title', 'Pest Management')}</h1>
            <p className="text-xs text-neutral-400">Scan infected leaves or stems to identify pests and retrieve remedies.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Column */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-base font-bold text-white">Upload Infected Crop Leaf</h2>
          
          <form onSubmit={handleDiagnose} className="space-y-6">
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                previewUrl 
                  ? 'border-emerald-500/40 bg-emerald-500/5' 
                  : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                  <img src={previewUrl} alt="Crop preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/70 hover:bg-black text-white hover:scale-105 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-neutral-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-300">Drag image here or click to browse</p>
                    <p className="text-xs text-neutral-500">Supports PNG, JPG, JPEG up to 8MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* User added description */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Symptoms / Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('modules.pest.placeholder', 'e.g. Rice leaf showing brown spots since 5 days...')}
                rows={3}
                className="w-full bg-neutral-950/60 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/40 placeholder-neutral-600 transition-all duration-300 resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold hover:shadow-xl hover:shadow-emerald-500/10 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Diagnosing leaf...</span>
                </>
              ) : (
                <>
                  <Bug className="w-5 h-5" />
                  <span>Run Vision Check</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[400px]">
          
          {!result && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-400">Awaiting Image Check</p>
                <p className="text-xs text-neutral-600">Submit an image to populate diagnostic summaries</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-300 animate-pulse">Running AI Crop Scanner</p>
                <p className="text-xs text-neutral-500">Gemini model is identifying leaf characteristics...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Diagnosis Header */}
              <div className="space-y-2 border-b border-white/5 pb-4">
                <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> Scanner Complete
                </span>
                <h3 className="text-xl font-black text-white">{result.disease_detected}</h3>
                {result.warning && (
                  <p className="text-[10px] text-amber-500 italic">{result.warning}</p>
                )}
              </div>

              {/* Scrollable details */}
              <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 pr-2">
                
                {/* Symptoms */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase text-neutral-500">Visual Symptoms</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">{result.symptoms}</p>
                </div>

                {/* Treatment */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase text-neutral-500">General Treatment</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">{result.treatment}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {/* Organic */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Organic Solution
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">{result.organic_solution}</p>
                  </div>
                  
                  {/* Chemical */}
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <h5 className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <FlaskConical className="w-4 h-4" /> Chemical Control
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">{result.chemical_solution}</p>
                  </div>
                </div>

                {/* Recommended pesticides list */}
                {result.recommended_pesticides?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-neutral-500">Recommended Pesticides</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.recommended_pesticides.map((pest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-neutral-900 border border-white/5 text-xs text-neutral-300 rounded-xl">
                          {pest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* PDF Actions */}
              <button
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300 font-semibold text-sm"
              >
                <FileDown className="w-4.5 h-4.5" />
                <span>Export PDF Report</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
