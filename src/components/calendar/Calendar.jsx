import { useState, useEffect, useRef, useMemo } from "react";
import rough from "roughjs";
import { getHolidays } from "../../utils/HolidayAPI";
import ExpandedModal from "../common/ExpandedModal";

const SEED = 3333; // 고정된 시드값을 사용하여 새로고침 후에도 항상 동일한 결과 유지

function CalendarPin({className}) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
             svgRef.current.innerHTML = ""; 

            const rc = rough.svg(svgRef.current);
            
            const triangle = rc.path("M23.5311 5.03514C26.2737 0.654952 32.6544 0.654955 35.397 5.03515L56.097 38.0949C59.0162 42.757 55.6647 48.8097 50.1641 48.8097H8.76403C3.2634 48.8097 -0.0880692 42.757 2.83108 38.0949L23.5311 5.03514Z",{
                fill: 'none',
                stroke: '#000',
                strokeWidth: 1,
                roughness: 1,  // 구불구불 정도
                seed: SEED
            });

            triangle.setAttribute('transform', 'translate(10, 1)');

            const outerCircle = rc.circle(38.5,15,26, {
                fill: '#D43333',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 2,
                roughness: 1,  // 구불구불 정도
                bowing: 1,      // 휘어짐 정도
                seed: SEED + 1
            });

            const innerCircle = rc.circle(38.5,15,16, {
                fill: '#af4444',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 2,
                roughness: 1,
                bowing: 1,
                seed: SEED + 2
            });

            svgRef.current.appendChild(triangle);
            svgRef.current.appendChild(outerCircle);
            svgRef.current.appendChild(innerCircle);
        }
    }, []);
    return (
        <svg ref={svgRef} width="100%" className={className} viewBox="0 0 77 71" preserveAspectRatio="xMidYMid meet">
        </svg>
    );
}

function CalendarBody({ className, viewDate, onPrev, onNext, canPrev, canNext, onTitleClick, onGoToday, onExpand, holidays, schedules, onDateClick }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = "";

            const rc = rough.svg(svgRef.current);

            // 실제 날짜 정보 계산
            const now = new Date();
            const currentYear = viewDate.getFullYear();
            const currentMonth = viewDate.getMonth(); // 0-11
            const monthName = viewDate.toLocaleString("en-US", { month: "long" });
            const displayTitle = `${monthName} ${currentYear}`;
            const today = now.getDate();
            
            // Dimensions of the main calendar body rectangle
            const mainRectX = 5;
            const mainRectY = 5;
            const mainRectWidth = 515.5;
            const mainRectHeight = 456;

            // Main rectangle for the calendar body
            const rect = rc.rectangle(mainRectX, mainRectY, mainRectWidth, mainRectHeight, {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3.5,
                roughness: 2.5,
                bowing: 2,
                seed: SEED
            });
            svgRef.current.appendChild(rect);

            // Month and Year text
            const monthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            monthText.setAttribute("x", mainRectX + 15); // Left aligned
            monthText.setAttribute("y", mainRectY + 55); // Position below top edge
            monthText.setAttribute("text-anchor", "start"); // Start text from x
            monthText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 30px; font-weight: bold; fill: #333;");
            monthText.textContent = displayTitle;
            svgRef.current.appendChild(monthText);

            // 텍스트의 실제 렌더링 너비를 계산하여 히트박스 크기를 동적으로 설정
            const textWidth = monthText.getBBox().width;

            // Title Hitbox (Invisible rect over Month Year text)
            const titleHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            titleHitbox.setAttribute("x", (mainRectX + 15).toString());
            titleHitbox.setAttribute("y", (mainRectY + 20).toString());
            titleHitbox.setAttribute("width", textWidth.toString());
            titleHitbox.setAttribute("height", "50");
            titleHitbox.setAttribute("fill", "transparent");
            titleHitbox.style.cursor = "pointer";
            titleHitbox.onpointerdown = (e) => {
                e.stopPropagation();
                onTitleClick();
            };
            svgRef.current.appendChild(titleHitbox);

            // Combined frame for Prev, Next, and Today buttons
            const buttonFrameX = 305; // 확장 버튼 공간 확보를 위해 왼쪽으로 이동
            const buttonFrameY = 25;
            const buttonFrameWidth = 205; // 165 -> 205로 너비 확장
            const buttonFrameHeight = 35;

            const buttonFrame = rc.rectangle(buttonFrameX, buttonFrameY, buttonFrameWidth, buttonFrameHeight, {
                stroke: '#000',
                strokeWidth: 1.5,
                roughness: 1.2,
                seed: SEED + 45
            });
            svgRef.current.appendChild(buttonFrame);

            // Vertical separators between buttons
            const sep1 = rc.line(buttonFrameX + 40, buttonFrameY, buttonFrameX + 40, buttonFrameY + buttonFrameHeight, {
                stroke: '#000', strokeWidth: 1.2, roughness: 1, seed: SEED + 46
            });
            const sep2 = rc.line(buttonFrameX + 80, buttonFrameY, buttonFrameX + 80, buttonFrameY + buttonFrameHeight, {
                stroke: '#000', strokeWidth: 1.2, roughness: 1, seed: SEED + 47
            });
            const sep3 = rc.line(buttonFrameX + 165, buttonFrameY, buttonFrameX + 165, buttonFrameY + buttonFrameHeight, {
                stroke: '#000', strokeWidth: 1.2, roughness: 1, seed: SEED + 48
            });
            svgRef.current.appendChild(sep1);
            svgRef.current.appendChild(sep2);
            svgRef.current.appendChild(sep3);

            // Today Button Text (No frame)
            const todayBtnText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            todayBtnText.setAttribute("x", (buttonFrameX + 80 + 85 / 2).toString()); // Today 버튼(너비 85)의 중앙
            todayBtnText.setAttribute("y", "51");
            todayBtnText.setAttribute("text-anchor", "middle");
            todayBtnText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 19px; font-weight: bold; fill: #333; letter-spacing: -0.8px;");
            todayBtnText.textContent = "Today";
            svgRef.current.appendChild(todayBtnText);

            const todayHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            todayHitbox.setAttribute("x", (buttonFrameX + 80).toString());
            todayHitbox.setAttribute("y", buttonFrameY.toString());
            todayHitbox.setAttribute("width", "85");
            todayHitbox.setAttribute("height", buttonFrameHeight.toString());
            todayHitbox.setAttribute("fill", "transparent");
            todayHitbox.style.cursor = "pointer";
            todayHitbox.onpointerdown = (e) => {
                e.stopPropagation();
                onGoToday();
            };
            svgRef.current.appendChild(todayHitbox);

            // Expand Button Icon (Using path from expand.jsx with roughjs style)
            const expandIconPath = "M14.0004 9.99958L21 3.00003M21 3.00003L15.8572 3M21 3.00003L20.9999 8.14263M10.0004 14L3.00044 21M3.00044 21L8.14326 21M3.00044 21L3.00051 15.8574M14.0004 14L21 20.9996M21 20.9996L21 15.8569M21 20.9996L15.8573 20.9995M10.0004 10.0004L3.00003 3.00003L3 8.14272M3.00003 3.00003L8.14275 3.0001";
            const expandIcon = rc.path(expandIconPath, {
                stroke: '#333',
                strokeWidth: 1.5,
                roughness: 1,
                seed: SEED + 49
            });
            expandIcon.setAttribute('transform', `translate(${buttonFrameX + 165 + 10}, ${buttonFrameY + 7.5}) scale(0.8)`);
            svgRef.current.appendChild(expandIcon);

            const expandHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            expandHitbox.setAttribute("x", (buttonFrameX + 165).toString());
            expandHitbox.setAttribute("y", buttonFrameY.toString());
            expandHitbox.setAttribute("width", "40");
            expandHitbox.setAttribute("height", buttonFrameHeight.toString());
            expandHitbox.setAttribute("fill", "transparent");
            expandHitbox.style.cursor = "pointer";
            expandHitbox.onpointerdown = (e) => {
                e.stopPropagation();
                onExpand();
            };
            svgRef.current.appendChild(expandHitbox);

            // Left Arrow Button (Prev Month)
            if (canPrev) {
                const prevArrow = rc.polygon([[buttonFrameX + 30, 33], [buttonFrameX + 30, 52], [buttonFrameX + 10, 42.5]], {
                    fill: '#333',
                    fillStyle: 'solid',
                    stroke: '#000',
                    strokeWidth: 1,
                    roughness: 1,
                    seed: SEED + 40
                });
                svgRef.current.appendChild(prevArrow);

                // Left Arrow Hitbox (Invisible rect for reliable clicking)
                const prevHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                prevHitbox.setAttribute("x", buttonFrameX.toString());
                prevHitbox.setAttribute("y", buttonFrameY.toString());
                prevHitbox.setAttribute("width", "40");
                prevHitbox.setAttribute("height", buttonFrameHeight.toString());
                prevHitbox.setAttribute("fill", "transparent");
                prevHitbox.style.cursor = "pointer";
                prevHitbox.onpointerdown = (e) => {
                    e.stopPropagation();
                    onPrev();
                };
                svgRef.current.appendChild(prevHitbox);
            }

            // Right Arrow Button (Next Month)
            if (canNext) {
                const nextArrow = rc.polygon([[buttonFrameX + 50, 33], [buttonFrameX + 50, 52], [buttonFrameX + 70, 42.5]], {
                    fill: '#333',
                    fillStyle: 'solid',
                    stroke: '#000',
                    strokeWidth: 1,
                    roughness: 1,
                    seed: SEED + 41
                });
                svgRef.current.appendChild(nextArrow);

                // Right Arrow Hitbox (Invisible rect for reliable clicking)
                const nextHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                nextHitbox.setAttribute("x", (buttonFrameX + 40).toString());
                nextHitbox.setAttribute("y", buttonFrameY.toString());
                nextHitbox.setAttribute("width", "40");
                nextHitbox.setAttribute("height", buttonFrameHeight.toString());
                nextHitbox.setAttribute("fill", "transparent");
                nextHitbox.style.cursor = "pointer";
                nextHitbox.onpointerdown = (e) => {
                    e.stopPropagation();
                    onNext();
                };
                svgRef.current.appendChild(nextHitbox);
            }

            // Days of the week
            const days = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
            const dayBlockHeight = 35;
            const dayBlockPaddingX = 10; // Padding from left/right of the main rect's inner area
            const dayBlockTotalWidth = mainRectWidth - (2 * dayBlockPaddingX);
            const dayBlockWidth = dayBlockTotalWidth / 7;
            const dayBlockStartX = mainRectX + dayBlockPaddingX;
            const dayBlockStartY = mainRectY + 90; // Position below month text

            days.forEach((day, index) => {
                const x = dayBlockStartX + (index * dayBlockWidth);
                const fillColor = day === "SUN" ? '#D43333' : '#000'; // Red for SUN, black for others

                // Draw the background block for the day
                const dayRect = rc.rectangle(x, dayBlockStartY, dayBlockWidth, dayBlockHeight, {
                    fill: fillColor,
                    fillStyle: 'solid',
                    stroke: '#000',
                    strokeWidth: 1.5,
                    roughness: 1.5,
                    bowing: 1,
                    seed: SEED + index + 10
                });
                svgRef.current.appendChild(dayRect);

                // Add the day text
                const dayText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                dayText.setAttribute("x", x + (dayBlockWidth / 2)); // Center text horizontally within its block
                dayText.setAttribute("y", dayBlockStartY + (dayBlockHeight / 2) + 5); // Center text vertically
                dayText.setAttribute("text-anchor", "middle"); // Center text based on x
                dayText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 16px; font-weight: bold; fill: #fff;");
                dayText.textContent = day;
                svgRef.current.appendChild(dayText);
            });

            // Grid for dates (7x5)
            const gridPaddingX = 10;
            const gridPaddingY = 10; // Gap below day blocks
            const gridStartX = mainRectX + gridPaddingX;
            const gridStartY = dayBlockStartY + dayBlockHeight + gridPaddingY;
            const gridTotalWidth = mainRectWidth - (2 * gridPaddingX);
            const gridTotalHeight = mainRectHeight - (gridStartY - mainRectY) - gridPaddingY; // Remaining height within the main rect
            const cellWidth = gridTotalWidth / 7;
            const cellHeight = gridTotalHeight / 5;

            // 해당 월의 첫 번째 날과 마지막 날 계산
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) ~ 6 (Sat)
            
            // 7x5 그리드에 들어갈 날짜들 계산 (35개)
            const calendarDays = [];
            const startDate = new Date(currentYear, currentMonth, 1);
            startDate.setDate(1 - firstDayOfMonth); // 그리드의 시작점 (이전 달 날짜 포함 가능)

            for (let i = 0; i < 35; i++) {
                const tempDate = new Date(startDate);
                tempDate.setDate(startDate.getDate() + i);
                
                const holidayDateString = `${tempDate.getFullYear()}${String(tempDate.getMonth() + 1).padStart(2, '0')}${String(tempDate.getDate()).padStart(2, '0')}`;
                const scheduleDateString = tempDate.toISOString().split('T')[0];
                
                const holiday = (holidays || []).find(h => String(h.locdate) === holidayDateString);
                const daySchedules = (schedules || []).filter(s => s.date === scheduleDateString);

                calendarDays.push({
                    date: new Date(tempDate),
                    isCurrentMonth: tempDate.getMonth() === currentMonth,
                    isToday: tempDate.toDateString() === now.toDateString(),
                    isHoliday: !!holiday,
                    holidayName: holiday ? holiday.dateName : ""
                });
            }

            // Draw internal vertical lines
            for (let i = 1; i < 7; i++) { // 6 lines for 7 columns
                const x = gridStartX + (i * cellWidth);
                const line = rc.line(x, gridStartY, x, gridStartY + gridTotalHeight, {
                    stroke: '#ccc',
                    strokeWidth: 1,
                    roughness: 0.5,
                    seed: SEED + i + 100
                });
                svgRef.current.appendChild(line);
            }

            // Draw internal horizontal lines
            for (let i = 1; i < 5; i++) { // 4 lines for 5 rows
                const y = gridStartY + (i * cellHeight);
                const line = rc.line(gridStartX, y, gridStartX + gridTotalWidth, y, {
                    stroke: '#ccc',
                    strokeWidth: 1,
                    roughness: 0.5,
                    seed: SEED + i + 200
                });
                svgRef.current.appendChild(line);
            }

            // 날짜 숫자 그리기
            calendarDays.forEach((dateInfo, index) => {
                const row = Math.floor(index / 7);
                const col = index % 7;
                const cellX = gridStartX + (col * cellWidth);
                const cellY = gridStartY + (row * cellHeight);
                const textX = cellX + 8; // 좌측 여백
                const textY = cellY + 22; // 상단 여백 (날짜 숫자 위치)

                // Cell Hitbox (For adding schedules)
                const cellHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                cellHitbox.setAttribute("x", cellX.toString());
                cellHitbox.setAttribute("y", cellY.toString());
                cellHitbox.setAttribute("width", cellWidth.toString());
                cellHitbox.setAttribute("height", cellHeight.toString());
                cellHitbox.setAttribute("fill", "transparent");
                cellHitbox.style.cursor = "pointer";
                cellHitbox.onpointerdown = (e) => {
                    e.stopPropagation();
                    onDateClick(dateInfo.date);
                };
                svgRef.current.appendChild(cellHitbox);

                // Draw frame for today's date
                if (dateInfo.isToday) {
                    const todayFrame = rc.rectangle(
                        gridStartX + (col * cellWidth), // x
                        gridStartY + (row * cellHeight), // y
                        cellWidth, // width
                        cellHeight, // height
                        {
                            stroke: '#0a0a0a', // Red color for today's frame
                            strokeWidth: 2.5,
                            roughness: 1.5,
                            bowing: 1,
                            fill: 'none', // No fill
                            seed: SEED + index + 300 // Unique seed
                        }
                    );
                    svgRef.current.appendChild(todayFrame);
                }

                // 일요일이거나 공휴일이면 빨간색, 그 외 현재 달이면 검정, 아니면 회색
                let textColor = dateInfo.isCurrentMonth ? '#333' : '#ccc';
                if (dateInfo.isCurrentMonth && (col === 0 || (dateInfo.isHoliday && col !== 6))) {
                    textColor = '#D43333';
                }

                const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                dateText.setAttribute("x", textX.toString());
                dateText.setAttribute("y", textY.toString());
                dateText.setAttribute("text-anchor", "start");
                dateText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 17px; font-weight: ${dateInfo.isToday ? 'bold' : 'normal'}; fill: ${textColor}; pointer-events: none;`);
                dateText.textContent = dateInfo.date.getDate().toString();
                svgRef.current.appendChild(dateText);

                // 공휴일 및 사용자 일정 표시
                if (dateInfo.isCurrentMonth) {
                    const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                    fo.setAttribute("x", textX.toString());
                    fo.setAttribute("y", (cellY + 28).toString()); // 날짜 숫자와 겹치지 않게 약간 하단으로 조정
                    fo.setAttribute("width", (cellWidth - 12).toString()); // 셀 너비를 넘지 않도록 설정
                    fo.setAttribute("height", "45"); // 일정이 여러 개일 수 있으므로 충분한 높이 확보
                    fo.style.pointerEvents = "auto"; // 툴팁 활성화를 위해 마우스 이벤트 허용

                    const div = document.createElement("div");
                    div.style.fontFamily = "'Comic Sans MS', cursive";
                    div.style.fontSize = "10px";
                    div.style.display = "flex";
                    div.style.flexDirection = "column";
                    div.style.gap = "1px";

                    if (dateInfo.isHoliday) {
                        const holidayDiv = document.createElement("div");
                        holidayDiv.style.backgroundColor = "#e6f4ea"; // 구글 캘린더 스타일 연한 녹색 배경
                        holidayDiv.style.borderLeft = "3px solid #188038"; // 짙은 녹색 세로줄
                        holidayDiv.style.padding = "1px 4px";
                        holidayDiv.style.borderRadius = "2px";
                        holidayDiv.style.color = "#188038"; // 글자색도 녹색 계열로 변경
                        holidayDiv.style.whiteSpace = "nowrap";
                        holidayDiv.style.overflow = "hidden";
                        holidayDiv.style.textOverflow = "ellipsis";
                        holidayDiv.style.cursor = "help"; // 마우스 오버 시 도움말 커서 표시
                        holidayDiv.textContent = dateInfo.holidayName;
                        holidayDiv.title = dateInfo.holidayName;
                        div.appendChild(holidayDiv);
                    }

                    // 사용자 일정 표시 (최대 2개까지만 표시 예시)
                    const daySchedules = schedules.filter(s => s.date === dateInfo.date.toISOString().split('T')[0]);
                    daySchedules.slice(0, 2).forEach(sched => {
                        const schedDiv = document.createElement("div");
                        const color = sched.color || "#3b82f6";
                        schedDiv.style.backgroundColor = `${color}20`; // 선택한 색상의 20% 투명도 배경
                        schedDiv.style.borderLeft = `3px solid ${color}`; // 선택한 색상의 세로줄
                        schedDiv.style.padding = "1px 4px";
                        schedDiv.style.borderRadius = "2px";
                        schedDiv.style.color = color;
                        schedDiv.style.whiteSpace = "nowrap";
                        schedDiv.style.overflow = "hidden";
                        schedDiv.style.textOverflow = "ellipsis";
                        schedDiv.textContent = sched.title;
                        div.appendChild(schedDiv);
                    });

                    fo.appendChild(div);
                    svgRef.current.appendChild(fo);
                }
            });
        }
    }, [viewDate, onPrev, onNext, canPrev, canNext, onTitleClick, onGoToday, onExpand, holidays, schedules, onDateClick]);
    return (
        <div className={`relative ${className}`}>
            <svg ref={svgRef} width="100%" className="absolute inset-0 w-full h-full" viewBox="0 0 522 506" preserveAspectRatio="none">
            </svg>
        </div>
    );
}

function Calendar({ onExpandStateChange }) {
    const today = useMemo(() => new Date(), []);
    // 현재 보고 있는 달력을 관리하는 상태 (해당 월의 1일로 설정)
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [showPicker, setShowPicker] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // 확장 상태가 바뀔 때마다 부모(Dashboard)에게 알림
    useEffect(() => {
        onExpandStateChange?.(isExpanded);
    }, [isExpanded, onExpandStateChange]);

    // 일정 입력 관련 상태
    const [scheduleInput, setScheduleInput] = useState(null); // { date: string }
    const [tempTitle, setTempTitle] = useState("");
    const [tempColor, setTempColor] = useState("#3b82f6");
    
    const [schedules, setSchedules] = useState(() => {
        const saved = localStorage.getItem("calendar_schedules");
        return saved ? JSON.parse(saved) : [];
    });

    const minDate = useMemo(() => new Date(today.getFullYear() - 10, today.getMonth(), 1), [today]);
    const maxDate = useMemo(() => new Date(today.getFullYear() + 10, today.getMonth(), 1), [today]);

    const palette = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1', '#a855f7']; // 무지개 색상 팔레트

    const handlePrevMonth = () => {
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        if (prev >= minDate) {
            setViewDate(prev);
        }
    };

    const handleNextMonth = () => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (next <= maxDate) {
            setViewDate(next);
        }
    };

    const handleGoToday = () => {
        setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const handleDateClick = (date) => {
        setScheduleInput({ date: date.toISOString().split('T')[0] });
    };

    const saveSchedule = () => {
        if (tempTitle.trim()) {
            const newSchedule = {
                id: Date.now(),
                date: scheduleInput.date,
                title: tempTitle,
                color: tempColor
            };
            setSchedules(prev => [...prev, newSchedule]);
        }
        setScheduleInput(null);
        setTempTitle("");
    };

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

    return (
        <section className="relative w-[clamp(180px,30vw,522px)] aspect-[522/506]">
            <CalendarPin className="absolute w-[15%] aspect-[77/71] left-1/2 -translate-x-1/2 z-0"/>
            
            {/* Month/Year Picker Dropdown */}
            {showPicker && (
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-30 bg-white border-2 border-black p-2 rounded shadow-lg flex gap-2 items-center">
                    <select 
                        className="p-1 border border-gray-300 rounded font-sans text-sm"
                        value={viewDate.getMonth()} 
                        onChange={(e) => {
                            setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1));
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select 
                        className="p-1 border border-gray-300 rounded font-sans text-sm"
                        value={viewDate.getFullYear()} 
                        onChange={(e) => {
                            setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
                        }}
                    >
                        {Array.from({ length: 21 }).map((_, i) => {
                            const year = today.getFullYear() - 10 + i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                    <button onClick={() => setShowPicker(false)} className="px-2 text-gray-500 hover:text-black">✕</button>
                </div>
            )}

            {/* Expanded Modal UI (16:9 Floating Window) */}
            <ExpandedModal 
                isOpen={isExpanded} 
                onClose={() => setIsExpanded(false)} 
                title="Expanded Calendar View"
            >
                {/* 여기에 확장되었을 때 보여줄 내용을 넣습니다. 필요하다면 더 큰 CalendarBody를 넣을 수 있습니다. */}
                <span className="text-gray-400 italic text-2xl" style={{ fontFamily: "'Comic Sans MS', cursive" }}>Calendar Content Here</span>
            </ExpandedModal>

            <CalendarBody 
                className="absolute w-[100%] aspect-[515.5/490] left-0 top-[6%] z-10"
                viewDate={viewDate}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                canPrev={viewDate > minDate}
                canNext={viewDate < maxDate}
                onTitleClick={() => setShowPicker(!showPicker)}
                onGoToday={handleGoToday}
                onExpand={() => setIsExpanded(true)}
                holidays={holidays}
                schedules={schedules}
                onDateClick={handleDateClick}
            />
        </section>

    );
}

export default Calendar;