"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

const today = new Date();
console.log(today);
const fromMonth = new Date(today.getFullYear(), today.getMonth());
const todayDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
);

interface CalendarProps {
  onDateChange: (_date: Date | undefined) => void;
  endDate?: Date;
  startDate?: Date;
}

export function Calendar({
  onDateChange,
  endDate,
  startDate = todayDate,
}: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && newDate.getTime() !== (date?.getTime() || 0)) {
      setDate(newDate);
      onDateChange(newDate);
    }
  };

  const disablePastDates = (date: Date): boolean => {
    if (endDate) {
      return date < todayDate || date > endDate;
    }
    if (startDate) {
      return date < startDate;
    }
    return date < todayDate;
  };

  return (
    <div className="justify-center p-4">
      <div className="m-2 flex w-full">
        <DayPicker
          mode="single"
          onSelect={handleDateChange}
          selected={date}
          showOutsideDays
          disabled={disablePastDates} // Deshabilitar fechas pasadas
          fromMonth={fromMonth}
          classNames={{
            caption: "flex justify-center py-2 m-4 relative items-center",
            caption_label: "text-lg font-bold dark:text-base-300",
            nav: "flex items-center",
            nav_button_previous: "absolute left-1.5",
            nav_button_next: "absolute right-1.5",
            table: "w-full border-collapse",
            head_row: "flex justify-around font-base w-full",
            head_cell:
              "w-9 font-normal text-primary dark:text-neutral-content text-center",
            row: "flex justify-around w-full mt-0",
            cell: "text-primary dark:text-neutral-content h-full w-full text-center p-0 font-normal border border-gray-600",
            day: "h-9 w-9 p-0 font-normal",
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-white hover:text-white focus:text-white",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-400 opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => (
              <ChevronLeftIcon
                {...props}
                className="dark:text-base-300 h-4 w-4 stroke-2"
              />
            ),
            IconRight: ({ ...props }) => (
              <ChevronRightIcon
                {...props}
                className="dark:text-base-300 h-4 w-4 stroke-2"
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
