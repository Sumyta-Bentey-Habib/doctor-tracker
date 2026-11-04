'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CALENDAR_STRINGS } from '@/utils';

export interface CalendarPickerProps {
  value?: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  align?: 'start' | 'end';
}

interface CalendarCell {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatDateString(year: number, monthZeroBased: number, day: number): string {
  return `${year}-${padZero(monthZeroBased + 1)}-${padZero(day)}`;
}

function parseDateString(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1; // 0-based
  const day = Number(dayStr);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
  return { year, month, day };
}

function formatDisplayDate(dateStr: string): string {
  const parsed = parseDateString(dateStr);
  if (!parsed) return dateStr;
  const monthName = CALENDAR_STRINGS.shortMonths[parsed.month] || '';
  return `${monthName} ${padZero(parsed.day)}, ${parsed.year}`;
}

export function CalendarPicker({
  value = '',
  onChange,
  placeholder = CALENDAR_STRINGS.selectDate,
  title,
  className = '',
  minDate,
  maxDate,
  align = 'start',
}: CalendarPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize view year & month from current value or today
  const initialDate = useMemo(() => {
    const parsed = parseDateString(value);
    if (parsed) return { year: parsed.year, month: parsed.month };
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [value]);

  const [viewYear, setViewYear] = useState(initialDate.year);
  const [viewMonth, setViewMonth] = useState(initialDate.month);

  const handleToggle = () => {
    if (!isOpen) {
      const parsed = parseDateString(value);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Click outside and Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateString(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Compute calendar grid cells
  const cells = useMemo<CalendarCell[]>(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const result: CalendarCell[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNumber = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateString = formatDateString(prevYear, prevMonth, dayNumber);

      const isDisabled =
        (Boolean(minDate) && dateString < (minDate as string)) ||
        (Boolean(maxDate) && dateString > (maxDate as string));

      result.push({
        dateString,
        dayNumber,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        isSelected: dateString === value,
        isDisabled,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateString = formatDateString(viewYear, viewMonth, day);
      const isDisabled =
        (Boolean(minDate) && dateString < (minDate as string)) ||
        (Boolean(maxDate) && dateString > (maxDate as string));

      result.push({
        dateString,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        isSelected: dateString === value,
        isDisabled,
      });
    }

    // Next month filler days (fill up to 35 or 42 cells)
    const totalCells = result.length > 35 ? 42 : 35;
    const remaining = totalCells - result.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateString = formatDateString(nextYear, nextMonth, day);
      const isDisabled =
        (Boolean(minDate) && dateString < (minDate as string)) ||
        (Boolean(maxDate) && dateString > (maxDate as string));

      result.push({
        dateString,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        isSelected: dateString === value,
        isDisabled,
      });
    }

    return result;
  }, [viewYear, viewMonth, minDate, maxDate, todayStr, value]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const handleToday = () => {
    onChange(todayStr);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${isOpen ? 'z-40' : ''} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        title={title || placeholder}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition hover:border-primary/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-hidden"
      >
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <CalendarIcon size={14} className="shrink-0 text-text-muted" />
          <span
            className={`truncate text-xs ${
              value ? 'font-semibold text-foreground' : 'text-text-muted'
            }`}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        {value ? (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange('');
              }
            }}
            title={CALENDAR_STRINGS.clearDate}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-foreground transition"
          >
            <X size={12} />
          </span>
        ) : null}
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={CALENDAR_STRINGS.selectDate}
          className={`absolute top-[calc(100%+8px)] z-50 w-[280px] rounded-3xl border border-border/80 bg-surface p-4 shadow-2xl transition animate-in fade-in zoom-in-95 duration-150 ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Calendar Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label={CALENDAR_STRINGS.previousMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 text-text-secondary hover:bg-surface-hover hover:text-foreground transition shadow-xs"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="text-xs font-bold text-foreground">
              {CALENDAR_STRINGS.months[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label={CALENDAR_STRINGS.nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 text-text-secondary hover:bg-surface-hover hover:text-foreground transition shadow-xs"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {CALENDAR_STRINGS.weekdays.map((day) => (
              <span key={day} className="text-[10px] font-bold text-text-muted">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              const isCellSelected = cell.isSelected;
              const isCellToday = cell.isToday && !isCellSelected;

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  disabled={cell.isDisabled}
                  onClick={() => handleSelectDate(cell.dateString)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs transition-all ${
                    isCellSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : isCellToday
                      ? 'border border-primary/50 font-bold text-primary hover:bg-primary/10'
                      : cell.isCurrentMonth
                      ? 'text-foreground hover:bg-surface-hover'
                      : 'text-text-muted/40 hover:bg-surface-hover/50'
                  } ${cell.isDisabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {cell.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5">
            {value ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-danger hover:underline"
              >
                {CALENDAR_STRINGS.clearDate}
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleToday}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              {CALENDAR_STRINGS.today}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
