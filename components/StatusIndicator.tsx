import React, { useEffect, useState } from 'react'
import { checkServiceHealth } from '../services/memory-service'

export const StatusIndicator: React.FC = () => {
  const [leannStatus, setLeannStatus] = useState<'checking' | 'active' | 'inactive'>('checking')

  useEffect(() => {
    const checkStatus = async () => {
      const isAvailable = await checkServiceHealth()
      setLeannStatus(isAvailable ? 'active' : 'inactive')
    }

    checkStatus()
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    checking: { bg: 'bg-gray-100', dot: 'bg-gray-400', text: 'Checking...' },
    active: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'LEANN Active' },
    inactive: { bg: 'bg-orange-50', dot: 'bg-orange-500', text: 'Fallback Mode' }
  }

  const config = statusConfig[leannStatus]

  return (
    <div
      className={`glass-panel px-3 py-2 rounded-xl ${config.bg} border border-white/50 flex items-center gap-2 text-sm`}
      title={
        leannStatus === 'active'
          ? 'LEANN semantic search is active'
          : leannStatus === 'inactive'
          ? 'Using tag-based linking (LEANN unavailable). Install LEANN for semantic search.'
          : 'Checking LEANN status...'
      }
    >
      <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      <span className="font-medium text-gray-700">{config.text}</span>
    </div>
  )
}
