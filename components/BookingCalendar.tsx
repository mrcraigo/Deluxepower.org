'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn, formatTime, toDateString } from '@/lib/utils';

interface BookingCalendarProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0 offset
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BookingCalendar({ selectedDate, selectedTime, onDateSelect, onTimeSelect }: BookingCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const todayStr = toDateString(today);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedDate]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function isDisabled(day: number) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr < todayStr) return true;
    // Sunday = day 0, Sat = 6 in JS
    const dow = new Date(dateStr + 'T00:00:00').getDay();
    return dow === 0; // Close Sundays
  }

  function dateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const isPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        {/* Month nav */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            disabled={isPastMonth}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-navy-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leading empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const ds = dateStr(day);
            const disabled = isDisabled(day);
            const isSelected = selectedDate === ds;
            const isToday = ds === todayStr;

            return (
              <button
                key={day}
                onClick={() => { if (!disabled) { onDateSelect(ds); onTimeSelect(''); } }}
                disabled={disabled}
                className={cn(
                  'relative flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition',
                  disabled && 'text-slate-300 cursor-not-allowed',
                  !disabled && !isSelected && 'text-slate-700 hover:bg-navy-50',
                  isSelected && 'bg-navy-900 text-white shadow-sm',
                  isToday && !isSelected && 'ring-2 ring-electric-500',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-3.5 rounded ring-2 ring-electric-500" />Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-3.5 rounded bg-navy-900" />Selected
          </span>
          <span className="text-slate-300">Sun = Closed</span>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
            <Clock className="h-4 w-4 text-electric-500" />
            Available Times
          </h3>
          {loadingSlots ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">
              No availability on this date. Please choose another day.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onTimeSelect(slot)}
                  className={cn(
                    'rounded-lg border px-3 py-2.5 text-sm font-medium transition',
                    selectedTime === slot
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-navy-300 hover:bg-navy-50',
                  )}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
