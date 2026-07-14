import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

// Calendario fluido y reutilizable para cualquier vista de registro.
// - Sin dependencias externas (solo Tailwind + lucide-react).
// - Devuelve la fecha en formato YYYY-MM-DD para mantener compatibilidad con el backend.
// - Navegacion rapida por mes y anio (util para fechas de nacimiento).

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const pad = (value: number): string => String(value).padStart(2, '0')

// month es 0-indexado.
const toISO = (year: number, month: number, day: number): string => `${year}-${pad(month + 1)}-${pad(day)}`

const todayISO = (): string => {
  const now = new Date()
  return toISO(now.getFullYear(), now.getMonth(), now.getDate())
}

type DateParts = { year: number; month: number; day: number }

const parseISO = (value: string): DateParts | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  if (month < 0 || month > 11 || day < 1 || day > 31) return null

  return { year, month, day }
}

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  id?: string
  /** Fecha minima seleccionable (YYYY-MM-DD). Por defecto 100 anios atras. */
  min?: string
  /** Fecha maxima seleccionable (YYYY-MM-DD). Por defecto hoy. */
  max?: string
  placeholder?: string
  disabled?: boolean
}

export function DateField({
  value,
  onChange,
  id,
  min,
  max = todayISO(),
  placeholder = 'Selecciona una fecha',
  disabled = false,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxParts = parseISO(max) ?? parseISO(todayISO())!
  const minISO = min ?? `${maxParts.year - 100}-01-01`
  const minParts = parseISO(minISO)!

  const selected = parseISO(value)

  const [view, setView] = useState<{ year: number; month: number }>(() =>
    selected
      ? { year: selected.year, month: selected.month }
      : { year: maxParts.year, month: maxParts.month },
  )

  // Cerrar al hacer clic fuera o presionar Escape.
  useEffect(() => {
    if (!open) return

    const handlePointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const years = useMemo(() => {
    const list: number[] = []
    for (let year = maxParts.year; year >= minParts.year; year -= 1) list.push(year)
    return list
  }, [maxParts.year, minParts.year])

  const firstWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const displayLabel = selected
    ? new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        .format(new Date(selected.year, selected.month, selected.day))
    : ''

  const isDisabledDay = (day: number): boolean => {
    const iso = toISO(view.year, view.month, day)
    return iso < minISO || iso > max
  }

  const goMonth = (delta: number) => {
    setView((current) => {
      const shifted = new Date(current.year, current.month + delta, 1)
      return { year: shifted.getFullYear(), month: shifted.getMonth() }
    })
  }

  const handleSelectDay = (day: number) => {
    if (isDisabledDay(day)) return
    onChange(toISO(view.year, view.month, day))
    setOpen(false)
  }

  const toggleOpen = () => {
    if (open) {
      setOpen(false)
      return
    }
    // Al abrir, posiciona el calendario en la fecha ya elegida (o en el maximo permitido).
    const parsed = parseISO(value)
    setView(parsed ? { year: parsed.year, month: parsed.month } : { year: maxParts.year, month: maxParts.month })
    setOpen(true)
  }

  const dayClasses = (day: number): string => {
    const iso = toISO(view.year, view.month, day)
    const isSelected = value === iso
    const isToday = todayISO() === iso
    const disabledDay = isDisabledDay(day)

    if (isSelected) return 'bg-[#009A4D] text-white font-semibold shadow-sm'
    if (disabledDay) return 'text-gray-300 cursor-not-allowed'
    if (isToday) return 'text-[#009A4D] ring-1 ring-emerald-300 hover:bg-emerald-50'
    return 'text-gray-700 hover:bg-emerald-50'
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
          open ? 'border-[#009A4D] ring-2 ring-emerald-500/15' : 'border-gray-300'
        } bg-white outline-none disabled:cursor-not-allowed disabled:bg-gray-100`}
      >
        <CalendarDays size={16} className="shrink-0 text-gray-400" />
        <span className={displayLabel ? 'text-gray-800' : 'text-gray-400'}>
          {displayLabel || placeholder}
        </span>
      </button>

      <div
        role="dialog"
        aria-label="Selector de fecha"
        className={`absolute left-0 top-full z-20 mt-2 w-72 origin-top rounded-2xl border border-gray-200 bg-white p-4 shadow-xl transition-all duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            aria-label="Mes anterior"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex flex-1 items-center gap-2">
            <select
              value={view.month}
              onChange={(event) => setView((current) => ({ ...current, month: Number(event.target.value) }))}
              aria-label="Mes"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={view.year}
              onChange={(event) => setView((current) => ({ ...current, year: Number(event.target.value) }))}
              aria-label="Anio"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => goMonth(1)}
            aria-label="Mes siguiente"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday} className="grid h-8 place-items-center text-xs font-semibold text-gray-400">
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) =>
            day === null ? (
              <span key={`empty-${index}`} className="h-9 w-9" />
            ) : (
              <button
                key={day}
                type="button"
                disabled={isDisabledDay(day)}
                onClick={() => handleSelectDay(day)}
                className={`grid h-9 w-9 place-items-center rounded-lg text-sm transition-colors ${dayClasses(day)}`}
              >
                {day}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default DateField
