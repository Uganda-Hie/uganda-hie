'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface SyncAnimationProps {
  visible: boolean
  facilityName: string
  onComplete?: () => void
}

const CONFIRMATION_LINES = [
  '✓ Received by District Health Office — Kaabong',
  '✓ Synced to MoH DHIS2 national aggregate',
  '✓ Disease signals processed by HIE analytics engine',
]

// phase: 0 = syncing, 1 = success, 2 = confirmation lines
export function SyncAnimation({
  visible,
  facilityName,
  onComplete,
}: SyncAnimationProps) {
  const [phase, setPhase] = useState(0)
  const [reportId, setReportId] = useState('')
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    if (!visible) {
      setPhase(0)
      return
    }

    // Generate client-side only (avoids SSR hydration mismatch).
    const id = Math.floor(100000 + Math.random() * 900000)
    setReportId(`RPT-2026-${id}`)
    setTimestamp(format(new Date(), 'd MMM yyyy, HH:mm'))
    setPhase(0)

    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => onComplete?.(), 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [visible, onComplete])

  const lines = [...CONFIRMATION_LINES, `✓ Report ID: ${reportId}`]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            {/* Facility + timestamp */}
            <div className="mb-6 text-center text-xs text-muted-foreground">
              <div className="font-medium text-gray-600">{facilityName}</div>
              <div>{timestamp}</div>
            </div>

            {/* Spinner / checkmark */}
            <div className="flex flex-col items-center gap-3 text-center">
              {phase === 0 ? (
                <>
                  <Loader2 className="size-12 animate-spin text-blue-500" />
                  <p className="text-sm font-medium text-gray-700">
                    Syncing report to Uganda HIE…
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <CheckCircle2 className="size-14 text-green-500" />
                  </motion.div>
                  <p className="text-base font-semibold text-gray-900">
                    Report submitted successfully
                  </p>
                </>
              )}
            </div>

            {/* Confirmation lines */}
            {phase >= 2 && (
              <ul className="mt-6 space-y-2 border-t pt-4">
                {lines.map((line, i) => (
                  <motion.li
                    key={i}
                    className="text-xs text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}
                  >
                    {line}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
