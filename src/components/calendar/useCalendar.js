import { useState, useEffect, useMemo, useCallback } from "react";
import { getHolidays } from "../../utils/HolidayAPI";
import { getLocalDateString } from "../../utils/dateUtils";

export const useCalendar = () => {
    const today = useMemo(() => new Date(), []);
    
    // 현재 보고 있는 달력을 관리하는 상태 (해당 월의 1일로 설정)
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [showPicker, setShowPicker] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [showScheduleDetails, setShowScheduleDetails] = useState(null); // { date: string, pos: {x, y, w, h} }

    // 일정 입력 관련 상태
    const [scheduleInput, setScheduleInput] = useState(null); // { date: string, pos, id? }
    const [tempTitle, setTempTitle] = useState("");
    const [tempDescription, setTempDescription] = useState("");
    const [tempColor, setTempColor] = useState("#3b82f6");
    const [tempStartTime, setTempStartTime] = useState("09:00");
    const [tempEndTime, setTempEndTime] = useState("10:00");
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
    const [miniPickerMode, setMiniPickerMode] = useState(null); // 'start' | 'end' | null
    
    const [schedules, setSchedules] = useState(() => {
        const saved = localStorage.getItem("calendar_schedules");
        return saved ? JSON.parse(saved) : [];
    });

    const minDate = useMemo(() => new Date(today.getFullYear() - 10, today.getMonth(), 1), [today]);
    const maxDate = useMemo(() => new Date(today.getFullYear() + 10, today.getMonth(), 1), [today]);

    // 일정 변경 시 로컬 스토리지 동기화
    useEffect(() => {
        localStorage.setItem("calendar_schedules", JSON.stringify(schedules));
    }, [schedules]);

    // 월이 변경될 때마다 공휴일 데이터를 가져옵니다.
    useEffect(() => {
        const fetchHolidays = async () => {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth() + 1;
            const data = await getHolidays(year, month);
            setHolidays(data);
        };
        fetchHolidays();
    }, [viewDate]);

    const handlePrevMonth = useCallback(() => {
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        if (prev >= minDate) {
            setViewDate(prev);
        }
    }, [viewDate, minDate]);

    const handleNextMonth = useCallback(() => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (next <= maxDate) {
            setViewDate(next);
        }
    }, [viewDate, maxDate]);

    const handleGoToday = useCallback(() => {
        setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }, [today]);

    const handleDeleteSchedule = useCallback((id) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
    }, []);

    const handleDateClick = useCallback((date, pos) => {
        const dateStr = getLocalDateString(date);
        setScheduleInput({ date: dateStr, pos });
        setTempTitle("");
        setTempDescription("");
        setTempColor("#3b82f6");
        setTempStartTime("09:00");
        setTempEndTime("10:00");
        setTempStartDate(dateStr);
        setTempEndDate(dateStr);
    }, []);

    const handleScheduleDetailsClick = useCallback((date, pos) => {
        setShowScheduleDetails({ date: getLocalDateString(date), pos });
    }, []);

    const handleEditSchedule = useCallback((schedule, pos = null) => {
        setScheduleInput({ 
            date: schedule.startDate || schedule.date, 
            pos: pos || (showScheduleDetails ? showScheduleDetails.pos : { x: 0, y: 0, w: 0, h: 0 }), 
            id: schedule.id 
        });
        setTempTitle(schedule.title);
        setTempDescription(schedule.description || "");
        setTempColor(schedule.color);
        setTempStartTime(schedule.startTime || "09:00");
        setTempEndTime(schedule.endTime || "10:00");
        setTempStartDate(schedule.startDate || schedule.date);
        setTempEndDate(schedule.endDate || schedule.date);
        setShowScheduleDetails(null); // 상세 창 닫기
    }, [showScheduleDetails]);

    const saveSchedule = useCallback(() => {
        if (tempTitle.trim()) {
            let finalStartDate = tempStartDate;
            let finalEndDate = tempEndDate;
            let finalStartTime = tempStartTime;
            let finalEndTime = tempEndTime;

            // 시작 날짜가 종료 날짜보다 늦을 경우 자동 조정 및 경고
            if (finalStartDate > finalEndDate) {
                finalEndDate = finalStartDate;
                alert("종료 날짜가 시작 날짜보다 빨라, 시작 날짜와 동일하게 조정되었습니다.");
            }
            
            // 날짜가 같을 때 시작 시간이 종료 시간보다 늦을 경우 자동 조정
            if (finalStartDate === finalEndDate && finalStartTime > finalEndTime) {
                finalEndTime = finalStartTime;
            }

            if (scheduleInput.id) {
                // 수정 모드
                setSchedules(prev => prev.map(s => 
                    s.id === scheduleInput.id ? { ...s, title: tempTitle, description: tempDescription, color: tempColor, startDate: finalStartDate, endDate: finalEndDate, startTime: finalStartTime, endTime: finalEndTime } : s
                ));
            } else {
                // 신규 추가 모드
                const newSchedule = {
                    id: Date.now(),
                    description: tempDescription,
                    startDate: finalStartDate,
                    endDate: finalEndDate,
                    startTime: finalStartTime,
                    endTime: finalEndTime,
                    title: tempTitle,
                    color: tempColor
                };
                setSchedules(prev => [...prev, newSchedule]);
            }
        }
        setScheduleInput(null);
        setTempTitle("");
        setTempDescription("");
        setTempStartDate("");
        setTempEndDate("");
        setTempStartTime("09:00");
        setTempEndTime("10:00");
        setTempColor("#3b82f6");
    }, [tempTitle, tempDescription, tempColor, tempStartDate, tempEndDate, tempStartTime, tempEndTime, scheduleInput]);

    return {
        today,
        viewDate, setViewDate,
        showPicker, setShowPicker,
        holidays,
        showScheduleDetails, setShowScheduleDetails,
        scheduleInput, setScheduleInput,
        tempTitle, setTempTitle,
        tempDescription, setTempDescription,
        tempColor, setTempColor,
        tempStartTime, setTempStartTime,
        tempEndTime, setTempEndTime,
        tempStartDate, setTempStartDate,
        tempEndDate, setTempEndDate,
        miniPickerMode, setMiniPickerMode,
        schedules,
        minDate, maxDate,
        handlePrevMonth, handleNextMonth, handleGoToday,
        handleDeleteSchedule, handleDateClick, handleScheduleDetailsClick,
        handleEditSchedule, saveSchedule
    };
};