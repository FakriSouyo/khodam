import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  const currentYear = new Date().getFullYear();
  const fromYear = 1945;
  const toYear = currentYear - 1;

  const years = React.useMemo(() => {
    return Array.from(
      { length: toYear - fromYear + 1 },
      (_, i) => fromYear + i
    );
  }, [fromYear, toYear]);

  const months = React.useMemo(() => {
    return [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  }, []);

  // Initialize selectedMonth to the previous year and current month
  const [selectedMonth, setSelectedMonth] = React.useState(new Date(currentYear - 1, new Date().getMonth()));

  const handleYearChange = (newYear) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(Number(newYear));
    setSelectedMonth(newDate);
  };

  const handleMonthChange = (newMonth) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(Number(newMonth));
    setSelectedMonth(newDate);
  };

  const CustomCaption = () => {
    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();

    return (
      <div className="flex justify-center gap-1">
        <Select
          value={currentMonth.toString()}
          onValueChange={(value) => handleMonthChange(value)}
        >
          <SelectTrigger className="h-[28px] pr-1.5 focus:ring-0">
            <SelectValue>{months[currentMonth]}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            <ScrollArea className="h-80">
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => handleYearChange(value)}
        >
          <SelectTrigger className="h-[28px] pr-1.5 focus:ring-0">
            <SelectValue>{currentYear}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            <ScrollArea className="h-80">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <DayPicker
      month={selectedMonth}
      onMonthChange={setSelectedMonth}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        caption_dropdowns: "flex justify-center gap-1",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      fromYear={fromYear}
      toYear={toYear}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
