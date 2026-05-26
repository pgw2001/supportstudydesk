import { useState, useEffect, useCallback, useMemo } from "react";
import { getLocalDateString } from "../../utils/dateUtils";

export const useExpandedCalendar = (onExpandStateChange, { viewDate, holidays, schedules, today }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // { date, dateString }

    // 확장 상태가 바뀔 때마다 부모(Dashboard)에게 알림
    useEffect(() => {
        onExpandStateChange?.(isExpanded);
    }, [isExpanded, onExpandStateChange]);

    const handleExpand = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsExpanded(false);
        setSelectedDate(null);
    }, []);

    // 확장된 달력을 위한 7x6 (42일) 데이터 계산
    const expandedCalendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        const startDate = new Date(year, month, 1);
        startDate.setDate(1 - firstDayOfMonth); // 그리드 시작 날짜 (이전 달 포함)

        for (let i = 0; i < 42; i++) {
            const tempDate = new Date(startDate);
            tempDate.setDate(startDate.getDate() + i);
            const dateString = getLocalDateString(tempDate);
            const holidayDateString = `${tempDate.getFullYear()}${String(tempDate.getMonth() + 1).padStart(2, '0')}${String(tempDate.getDate()).padStart(2, '0')}`;
            
            days.push({
                date: tempDate,
                dateString,
                isCurrentMonth: tempDate.getMonth() === month,
                isToday: dateString === getLocalDateString(today),
                holiday: holidays.find(h => String(h.locdate) === holidayDateString),
                daySchedules: schedules.filter(s => {
                    return dateString >= s.startDate && dateString <= s.endDate;
                })
            });
        }
        return days;
    }, [viewDate, holidays, schedules, today]);

    return {
        isExpanded,
        handleExpand,
        handleClose,
        expandedCalendarDays,
        selectedDate,
        setSelectedDate
    };
};