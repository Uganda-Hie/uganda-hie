'use client'

import { useState } from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { getFacilityById } from '@/data/facilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const num = z.coerce.number().min(0).max(9999)

export const DailyReportSchema = z.object({
  reporterName: z.string().min(1, 'Reporter name is required'),
  reporterRole: z.string().min(1, 'Reporter role is required'),
  reportDate: z.string().min(1, 'Report date is required'),
  opdVisits: num,
  emergencyVisits: num,
  admissions: num,
  discharges: num,
  referralsOut: num,
  malariaSuspected: num,
  malariaConfirmed: num,
  malariaTests: num,
  cholera: num,
  measles: num,
  respiratory: num,
  diarrhoeal: num,
  births: num,
  maternalDeaths: num,
  under5Deaths: num,
  adultDeaths: num,
  totalBeds: num,
  occupiedBeds: num,
  oxygenAvailable: z.boolean(),
  ambulanceOperational: z.boolean(),
  actStock: num,
  rdtStock: num,
  narrativeEvent: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof DailyReportSchema>

interface ReportFormProps {
  facilityId: string
  onSubmitSuccess?: () => void
}

function stockBorderClass(days: number): string {
  if (days < 7) return 'border-red-500 focus-visible:ring-red-500/40'
  if (days < 14) return 'border-amber-500 focus-visible:ring-amber-500/40'
  return 'border-green-500 focus-visible:ring-green-500/40'
}

export function ReportForm({ facilityId, onSubmitSuccess }: ReportFormProps) {
  const facility = getFacilityById(facilityId)
  const today = format(new Date(), 'yyyy-MM-dd')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(DailyReportSchema) as Resolver<FormValues>,
    defaultValues: {
      reporterName: '',
      reporterRole: '',
      reportDate: today,
      opdVisits: 0,
      emergencyVisits: 0,
      admissions: 0,
      discharges: 0,
      referralsOut: 0,
      malariaSuspected: 0,
      malariaConfirmed: 0,
      malariaTests: 0,
      cholera: 0,
      measles: 0,
      respiratory: 0,
      diarrhoeal: 0,
      births: 0,
      maternalDeaths: 0,
      under5Deaths: 0,
      adultDeaths: 0,
      totalBeds: facility?.totalBeds ?? 0,
      occupiedBeds: 0,
      oxygenAvailable: facility?.hasOxygen ?? false,
      ambulanceOperational: facility?.hasAmbulance ?? false,
      actStock: 30,
      rdtStock: 30,
      narrativeEvent: '',
    },
  })

  // Live-derived values.
  const malariaConfirmed = Number(watch('malariaConfirmed')) || 0
  const malariaTests = Number(watch('malariaTests')) || 0
  const positivity =
    malariaTests > 0 ? ((malariaConfirmed / malariaTests) * 100).toFixed(1) : '0.0'
  const totalBeds = Number(watch('totalBeds')) || 0
  const occupiedBeds = Number(watch('occupiedBeds')) || 0
  const occupancy =
    totalBeds > 0 ? Math.min(100, Math.round((occupiedBeds / totalBeds) * 100)) : 0
  const maternalDeaths = Number(watch('maternalDeaths')) || 0
  const under5Deaths = Number(watch('under5Deaths')) || 0
  const actStock = Number(watch('actStock')) || 0
  const rdtStock = Number(watch('rdtStock')) || 0
  const narrativeLen = (watch('narrativeEvent') || '').length

  async function onSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    onSubmitSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1 — Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reporter Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            {facility
              ? `${facility.name} · ${facility.level}`
              : 'Unknown facility'}
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Reporter name" error={errors.reporterName?.message}>
            <Input {...register('reporterName')} placeholder="Full name" />
          </Field>
          <Field label="Reporter role" error={errors.reporterRole?.message}>
            <Input
              {...register('reporterRole')}
              placeholder="e.g. In-charge Nurse"
            />
          </Field>
          <Field label="Report date" error={errors.reportDate?.message}>
            <Input type="date" {...register('reportDate')} />
          </Field>
        </CardContent>
      </Card>

      {/* Section 2 — OPD & Admissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">OPD &amp; Admissions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <NumField label="OPD visits" reg={register('opdVisits')} error={errors.opdVisits?.message} />
          <NumField label="Emergency visits" reg={register('emergencyVisits')} error={errors.emergencyVisits?.message} />
          <NumField label="Admissions" reg={register('admissions')} error={errors.admissions?.message} />
          <NumField label="Discharges" reg={register('discharges')} error={errors.discharges?.message} />
          <NumField label="Referrals out" reg={register('referralsOut')} error={errors.referralsOut?.message} />
        </CardContent>
      </Card>

      {/* Section 3 — Disease Surveillance */}
      <Card className="border-l-4 border-l-amber-400">
        <CardHeader>
          <CardTitle className="text-base">Disease Surveillance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <NumField label="Malaria suspected" reg={register('malariaSuspected')} error={errors.malariaSuspected?.message} />
            <NumField label="Malaria confirmed" reg={register('malariaConfirmed')} error={errors.malariaConfirmed?.message} />
            <NumField label="Malaria tests" reg={register('malariaTests')} error={errors.malariaTests?.message} />
          </div>
          <div className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
            Test positivity rate:{' '}
            <span className="font-semibold tabular-nums">{positivity}%</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <NumField label="Cholera" reg={register('cholera')} error={errors.cholera?.message} />
            <NumField label="Measles" reg={register('measles')} error={errors.measles?.message} />
            <NumField label="Respiratory" reg={register('respiratory')} error={errors.respiratory?.message} />
            <NumField label="Diarrhoeal" reg={register('diarrhoeal')} error={errors.diarrhoeal?.message} />
          </div>
        </CardContent>
      </Card>

      {/* Section 4 — Births & Deaths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Births &amp; Deaths</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <NumField label="Births" reg={register('births')} error={errors.births?.message} />
            <NumField label="Maternal deaths" reg={register('maternalDeaths')} error={errors.maternalDeaths?.message} />
            <NumField label="Under-5 deaths" reg={register('under5Deaths')} error={errors.under5Deaths?.message} />
            <NumField label="Adult deaths" reg={register('adultDeaths')} error={errors.adultDeaths?.message} />
          </div>
          {maternalDeaths > 0 && (
            <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
              ⚠ Maternal death requires immediate notification to DHO
            </div>
          )}
          {under5Deaths > 2 && (
            <div className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
              Review under-5 cases for preventable causes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5 — Facility Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Facility Capacity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Total beds (registry)">
              <Input type="number" readOnly className="bg-muted" {...register('totalBeds')} />
            </Field>
            <NumField label="Occupied beds" reg={register('occupiedBeds')} error={errors.occupiedBeds?.message} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Bed occupancy</span>
              <span className="font-medium tabular-nums">{occupancy}%</span>
            </div>
            <Progress value={occupancy} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Controller
              control={control}
              name="oxygenAvailable"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Oxygen available
                </label>
              )}
            />
            <Controller
              control={control}
              name="ambulanceOperational"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Ambulance operational
                </label>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6 — Medicine Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medicine Stock (Days Remaining)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Field label="ACTs (days)" error={errors.actStock?.message}>
            <Input
              type="number"
              className={cn(stockBorderClass(actStock))}
              {...register('actStock')}
            />
          </Field>
          <Field label="RDTs (days)" error={errors.rdtStock?.message}>
            <Input
              type="number"
              className={cn(stockBorderClass(rdtStock))}
              {...register('rdtStock')}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Section 7 — Narrative */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Narrative / Event Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            maxLength={500}
            rows={4}
            placeholder="Describe any unusual events, disease clusters, facility issues, or community alerts..."
            {...register('narrativeEvent')}
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">
            {narrativeLen}/500
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          'Submit Daily Report'
        )}
      </Button>
    </form>
  )
}

// ── Field wrappers ─────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function NumField({
  label,
  reg,
  error,
}: {
  label: string
  reg: ReturnType<ReturnType<typeof useForm<FormValues>>['register']>
  error?: string
}) {
  return (
    <Field label={label} error={error}>
      <Input type="number" min={0} max={9999} {...reg} />
    </Field>
  )
}
