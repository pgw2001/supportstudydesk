import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import rough from "roughjs";
import ExpandedModal from "../common/ExpandedModal";
import ScheduleDetailsPopover from "./ScheduleDetailsPopover";
import { getLocalDateString } from "../../utils/dateUtils";
import { useCalendar } from "./useCalendar";
import { useExpandedCalendar } from "./useExpandedCalendar";
import Modal from "../common/modal";
import EditIcon from "../../assets/icons/edit";

const SEED = 3333; // 고정된 시드값을 사용하여 새로고침 후에도 항상 동일한 결과 유지

// 시간 포맷팅 헬퍼 (seconds -> HH:mm:ss)
const formatStudyTime = (seconds) => {
    if (!seconds || seconds <= 0) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const CALENDAR_FONT_STACK = `var(--calendar-mixed-font)`;

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

function CalendarBody({ className, viewDate, onPrev, onNext, canPrev, canNext, onTitleClick, onGoToday, onExpand, holidays, schedules, onDateClick, onScheduleDetailsClick, onDeleteSchedule }) {
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
            const todayDateString = getLocalDateString(now);
            
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
            monthText.setAttribute("style", `font-family: ${CALENDAR_FONT_STACK}; font-size: 30px; font-weight: bold; fill: #333;`);
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
            todayBtnText.setAttribute("style", `font-family: ${CALENDAR_FONT_STACK}; font-size: 19px; font-weight: bold; fill: #333; letter-spacing: -0.8px;`);
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
                dayText.setAttribute("style", `font-family: ${CALENDAR_FONT_STACK}; font-size: 16px; font-weight: bold; fill: #fff;`);
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
                const scheduleDateString = getLocalDateString(tempDate);
                
                const holiday = (holidays || []).find(h => String(h.locdate) === holidayDateString);
                const daySchedules = (schedules || []).filter(s => {
                    const targetDate = s.startDate || s.date;
                    return scheduleDateString >= targetDate && scheduleDateString <= (s.endDate || s.startDate || s.date);
                });

                calendarDays.push({
                    date: new Date(tempDate),
                    isCurrentMonth: tempDate.getMonth() === currentMonth,
                    isToday: scheduleDateString === todayDateString,
                    isHoliday: !!holiday,
                    holidayName: holiday ? holiday.dateName : "",
                    daySchedules // 필터링된 일정을 객체에 포함
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
                cellHitbox.onpointerdown = (e) => e.stopPropagation(); // 칸 전체 클릭 시 드래그 방지용 전파 차단만 수행
                cellHitbox.style.cursor = "default"; // 기본 커서로 설정

                const pX = cellX + cellWidth - 15;
                const pY = cellY + 15;
                
                // + 버튼을 위한 foreignObject 생성 (HTML div를 SVG 안에 넣기 위함)
                const plusFO = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                const hitAreaSize = 24; // 투명한 사각 영역의 크기 (아이콘 14px를 적절히 감쌈)
                plusFO.setAttribute("x", (pX - hitAreaSize / 2).toString());
                plusFO.setAttribute("y", (pY - hitAreaSize / 2).toString());
                plusFO.setAttribute("width", hitAreaSize.toString());
                plusFO.setAttribute("height", hitAreaSize.toString());
                plusFO.style.overflow = "visible";

                // 투명한 사각 div 영역 (Hit Area)
                const plusContainer = document.createElement("div");
                plusContainer.style.width = "100%";
                plusContainer.style.height = "100%";
                plusContainer.style.display = "flex";
                plusContainer.style.alignItems = "center";
                plusContainer.style.justifyContent = "center";
                plusContainer.style.opacity = "0"; // 기본적으로 히든
                plusContainer.style.transition = "opacity 0.2s";
                plusContainer.style.cursor = "pointer";
                plusContainer.setAttribute("data-no-drag", "true");

                // 디자인 유지를 위한 RoughJS 아이콘 SVG
                const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                iconSvg.setAttribute("width", "14");
                iconSvg.setAttribute("height", "14");
                iconSvg.setAttribute("viewBox", "0 0 14 14");
                const iconRc = rough.svg(iconSvg);
                iconSvg.appendChild(iconRc.line(2, 7, 12, 7, { strokeWidth: 2, roughness: 1, seed: SEED + index + 500 }));
                iconSvg.appendChild(iconRc.line(7, 2, 7, 12, { strokeWidth: 2, roughness: 1, seed: SEED + index + 501 }));
                
                plusContainer.appendChild(iconSvg);
                plusFO.appendChild(plusContainer);

                // 클릭 이벤트 핸들러 (div 영역 전체가 클릭 대상)
                plusContainer.onpointerdown = (e) => {
                    e.stopPropagation();
                    onDateClick(dateInfo.date, { x: cellX, y: cellY, w: cellWidth, h: cellHeight });
                };

                // 호버 상태 동기화 (셀 전체 호버 시 반투명, 버튼 영역 호버 시 불투명)
                cellHitbox.onpointerenter = () => { plusContainer.style.opacity = "0.5"; };
                cellHitbox.onpointerleave = (e) => {
                    if (e.relatedTarget === plusContainer || e.relatedTarget === plusFO) return;
                    plusContainer.style.opacity = "0";
                };
                plusContainer.onpointerenter = () => { plusContainer.style.opacity = "1"; };
                plusContainer.onpointerleave = (e) => {
                    if (e.relatedTarget === cellHitbox) plusContainer.style.opacity = "0.5";
                    else plusContainer.style.opacity = "0";
                };

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
                dateText.setAttribute("style", `font-family: ${CALENDAR_FONT_STACK}; font-size: 17px; font-weight: ${dateInfo.isToday ? 'bold' : 'normal'}; fill: ${textColor}; pointer-events: none;`);
                dateText.textContent = dateInfo.date.getDate().toString();
                svgRef.current.appendChild(dateText);

                // 공휴일 및 사용자 일정 표시
                let fo = null;
                if (dateInfo.isCurrentMonth) {
                    fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                    fo.setAttribute("x", textX.toString());
                    fo.setAttribute("y", (cellY + 25).toString()); // 전체 영역을 위로 3px 이동
                    fo.setAttribute("width", (cellWidth - 12).toString()); // 셀 너비를 넘지 않도록 설정
                    fo.setAttribute("height", "45"); // 일정이 여러 개일 수 있으므로 충분한 높이 확보
                    fo.style.pointerEvents = "auto"; // 툴팁 활성화를 위해 마우스 이벤트 허용

                    // 일정 상세 정보 팝업을 띄우는 이벤트 (드래그 방지 및 상세 팝업 트리거)
                    fo.onpointerdown = (e) => {
                        e.stopPropagation(); // 드래그 이벤트 전파 차단
                        onScheduleDetailsClick(dateInfo.date, { x: cellX, y: cellY, w: cellWidth, h: cellHeight });
                    };

                    const div = document.createElement("div");
                    div.style.fontFamily = CALENDAR_FONT_STACK;
                    // 일정 텍스트 크기도 가변적으로 설정 (최소 8px, 기본 2cqw, 최대 11px)
                    div.style.fontSize = "clamp(8px, 2cqw, 11px)";
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

                    // 공휴일/일정 위에서도 +버튼이 유지되도록 이벤트 추가
                    fo.onpointerenter = () => {
                        plusContainer.style.opacity = "0.5";
                    };
                    fo.onpointerleave = (e) => {
                        if (e.relatedTarget === cellHitbox || e.relatedTarget === plusContainer) return;
                        plusContainer.style.opacity = "0";
                    };

                    // 사용자 일정 표시
                    const daySchedules = dateInfo.daySchedules || [];

                    if (daySchedules.length >= 3) {
                        // 3개 이상의 일정이 있을 경우: 첫 번째는 바 형태, 나머지는 점 형태로 표시
                        const firstSched = daySchedules[0];
                        const firstSchedDiv = document.createElement("div");
                        const firstColor = firstSched.color || "#3b82f6";
                        firstSchedDiv.style.backgroundColor = `${firstColor}20`;
                        firstSchedDiv.style.borderLeft = `3px solid ${firstColor}`;
                        firstSchedDiv.style.padding = "1px 4px";
                        firstSchedDiv.style.borderRadius = "2px";
                        firstSchedDiv.style.color = firstColor;
                        firstSchedDiv.style.whiteSpace = "nowrap";
                        firstSchedDiv.style.overflow = "hidden";
                        firstSchedDiv.style.display = "flex";
                        firstSchedDiv.style.justifyContent = "space-between";
                        firstSchedDiv.style.alignItems = "center";

                        const titleSpan = document.createElement("span");
                        titleSpan.style.overflow = "hidden";
                        titleSpan.style.textOverflow = "ellipsis";
                        titleSpan.textContent = firstSched.title;
                        firstSchedDiv.appendChild(titleSpan);

                        const delBtn = document.createElement("span");
                        delBtn.textContent = "✕";
                        delBtn.style.fontSize = "9px";
                        delBtn.style.cursor = "pointer";
                        delBtn.style.opacity = "0";
                        delBtn.style.marginLeft = "4px";
                        delBtn.onpointerdown = (e) => { e.stopPropagation(); onDeleteSchedule(firstSched.id); };
                        firstSchedDiv.onmouseenter = () => { delBtn.style.opacity = "1"; };
                        firstSchedDiv.onmouseleave = () => { delBtn.style.opacity = "0"; };
                        firstSchedDiv.appendChild(delBtn);

                        div.appendChild(firstSchedDiv);

                        const dotsContainer = document.createElement("div");
                        dotsContainer.style.display = "flex";
                        dotsContainer.style.flexDirection = "row";
                        dotsContainer.style.alignItems = "center"; // 점들과 텍스트의 중앙 정렬을 맞춤
                        dotsContainer.style.gap = "6px"; // 점 사이의 간격 (한 칸 띄우기)
                        dotsContainer.style.padding = "1px 2px 0 4px"; // 상단 여백을 줄여 점들을 위로 밀착
                        dotsContainer.style.flexWrap = "nowrap";
                        dotsContainer.style.overflow = "hidden";

                        if (daySchedules.length >= 6) {
                            // 6개 이상일 경우: 점 3개 + "..+n" 표시 (공간 절약)
                            daySchedules.slice(1, 4).forEach(sched => {
                                const dot = document.createElement("div");
                                dot.style.width = "5px";
                                dot.style.height = "5px";
                                dot.style.borderRadius = "50%";
                                dot.style.flexShrink = "0";
                                dot.style.backgroundColor = sched.color || "#3b82f6";
                                dotsContainer.appendChild(dot);
                            });

                            const remainingText = document.createElement("span");
                            remainingText.style.fontSize = "clamp(7px, 1.8cqw, 10px)";
                            remainingText.style.color = "#666";
                            remainingText.style.marginLeft = "1px";
                            remainingText.style.whiteSpace = "nowrap";
                            remainingText.style.transform = "translateY(-1.5px)"; // 점들과 수평을 맞추기 위해 약간 위로 이동
                            remainingText.textContent = `..+${daySchedules.length - 4}`;
                            dotsContainer.appendChild(remainingText);
                        } else {
                            // 3개 ~ 5개일 경우: 남은 모든 일정을 점으로 표시
                            daySchedules.slice(1).forEach(sched => {
                                const dot = document.createElement("div");
                                dot.style.width = "5px";
                                dot.style.height = "5px";
                                dot.style.borderRadius = "50%";
                                dot.style.flexShrink = "0";
                                dot.style.backgroundColor = sched.color || "#3b82f6";
                                dotsContainer.appendChild(dot);
                            });
                        }

                        div.appendChild(dotsContainer);
                    } else {
                        // 2개 이하일 때는 기존처럼 모두 바 형태로 표시
                        daySchedules.forEach(sched => {
                            const schedDiv = document.createElement("div");
                            const color = sched.color || "#3b82f6";
                            schedDiv.style.backgroundColor = `${color}20`;
                            schedDiv.style.borderLeft = `3px solid ${color}`;
                            schedDiv.style.padding = "1px 4px";
                            schedDiv.style.borderRadius = "2px";
                            schedDiv.style.color = color;
                            schedDiv.style.whiteSpace = "nowrap";
                            schedDiv.style.overflow = "hidden";
                            schedDiv.style.display = "flex";
                            schedDiv.style.justifyContent = "space-between";
                            schedDiv.style.alignItems = "center";

                            const titleSpan = document.createElement("span");
                            titleSpan.style.overflow = "hidden";
                            titleSpan.style.textOverflow = "ellipsis";
                            titleSpan.textContent = sched.title;
                            schedDiv.appendChild(titleSpan);

                            const delBtn = document.createElement("span");
                            delBtn.textContent = "✕";
                            delBtn.style.fontSize = "9px";
                            delBtn.style.cursor = "pointer";
                            delBtn.style.opacity = "0";
                            delBtn.style.marginLeft = "4px";
                            delBtn.onpointerdown = (e) => { e.stopPropagation(); onDeleteSchedule(sched.id); };
                            schedDiv.onmouseenter = () => { delBtn.style.opacity = "1"; };
                            schedDiv.onmouseleave = () => { delBtn.style.opacity = "0"; };
                            schedDiv.appendChild(delBtn);

                            div.appendChild(schedDiv);
                        });
                    }

                    fo.appendChild(div);
                }

                // 레이어 순서 조정: 툴팁과 클릭 판정을 모두 살리는 순서
                svgRef.current.appendChild(cellHitbox); // 1. 가장 아래: 칸 호버 감지
                if (fo) svgRef.current.appendChild(fo); // 2. 중간: 일정/공휴일 (툴팁 활성)
                svgRef.current.appendChild(plusFO); // 3. 최상단: + 버튼 컨테이너 (투명 사각 영역 포함)
            });
        }
    }, [viewDate, onPrev, onNext, canPrev, canNext, onTitleClick, onGoToday, onExpand, holidays, schedules, onDateClick, onScheduleDetailsClick, onDeleteSchedule]);
    return (
        <div className={`relative ${className}`}>
            <svg ref={svgRef} width="100%" className="absolute inset-0 w-full h-full" viewBox="0 0 522 506" preserveAspectRatio="none">
            </svg>
        </div>
    );
}

function Calendar({ user, onExpandStateChange, dailyStudyTime = {} }) {
    const sectionRef = useRef(null);
    const [isStudyTimeMode, setIsStudyTimeMode] = useState(false);

    const {
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
        categories,
        visibleCategoryIds,
        tempCategoryId, setTempCategoryId,
        toggleCategory,
        filteredSchedules,
        miniPickerMode, setMiniPickerMode,
        schedules,
        minDate, maxDate,
        handlePrevMonth,
        handleNextMonth,
        handleGoToday,
        handleDeleteSchedule,
        handleDateClick,
        handleScheduleDetailsClick,
        handleEditSchedule,
        saveSchedule
    } = useCalendar(user);

    // 사이드바 미니 캘린더를 위한 별도 보기 날짜 상태
    const [miniViewDate, setMiniViewDate] = useState(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));

    // 미니 캘린더 7x6 그리드 날짜 계산
    const miniDays = useMemo(() => {
        const days = [];
        const start = new Date(miniViewDate.getFullYear(), miniViewDate.getMonth(), 1);
        start.setDate(1 - start.getDay());
        for (let i = 0; i < 42; i++) {
            days.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }
        return days;
    }, [miniViewDate]);

    const expanded = useExpandedCalendar(onExpandStateChange, { 
        viewDate, 
        holidays: visibleCategoryIds.includes('holidays') ? holidays : [], 
        schedules: filteredSchedules,
        today 
    });

    const {
        isExpanded,
        handleExpand,
        handleClose,
        expandedCalendarDays,
        selectedDate,
        setSelectedDate
    } = expanded;

    // 연속 학습 일수(Streak) 계산 로직
    const streak = useMemo(() => {
        let count = 0;
        const now = new Date();
        const todayStr = getLocalDateString(now);
        
        let checkDate = new Date(now);
        // 오늘 공부 기록이 없다면 어제를 기점으로 스트레익이 유지되고 있는지 확인
        if (!dailyStudyTime[todayStr] || dailyStudyTime[todayStr] <= 0) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const ds = getLocalDateString(checkDate);
            if (dailyStudyTime[ds] && dailyStudyTime[ds] > 0) {
                count++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return count;
    }, [dailyStudyTime]);

    // 확장 모달에서 선택된 날짜의 최신 일정을 실시간으로 반영하기 위해 schedules 상태를 직접 필터링합니다.
    const currentModalSchedules = selectedDate ? filteredSchedules.filter(s => {
        const start = s.startDate || s.date;
        const end = s.endDate || start;
        return selectedDate.dateString >= start && selectedDate.dateString <= end;
    }) : [];

    // 날짜 설정 미니 모달(피커) 외부 클릭 시 닫기 로직
    const miniPickerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (miniPickerRef.current && !miniPickerRef.current.contains(event.target)) {
                setMiniPickerMode(null);
            }
        };
        if (miniPickerMode) {
            // 다른 요소의 stopPropagation 영향을 받지 않도록 capture: true 사용
            document.addEventListener("mousedown", handleClickOutside, true);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, [miniPickerMode, setMiniPickerMode]);

    const palette = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1', '#a855f7']; // 무지개 색상 팔레트

    // 일정 입력창 동적 높이 계산을 위한 상태와 Ref
    const [popoverHeight, setPopoverHeight] = useState(isExpanded ? 500 : 380);
    const popoverContentRef = useRef(null);

    useEffect(() => {
        if (scheduleInput && popoverContentRef.current) {
            const measure = () => {
                // 요소들이 차지하는 실제 높이 측정
                const contentH = popoverContentRef.current.offsetHeight;
                const rect = sectionRef.current?.getBoundingClientRect();
                const scale = rect ? rect.width / 522 : 1;
                // 상하 패딩(40px)과 RoughJS 테두리 여유분(20px)을 스케일에 맞춰 계산
                const verticalMargin = isExpanded ? 80 : (60 * scale);
                setPopoverHeight(contentH + verticalMargin);
            };
            measure();
            const observer = new ResizeObserver(measure);
            observer.observe(popoverContentRef.current);
            return () => observer.disconnect();
        }
    }, [scheduleInput, isExpanded]);

    // 일정 입력창용 RoughJS 말풍선 배경 그리기
    const inputSvgRef = useRef(null);
    useEffect(() => {
        if (scheduleInput && inputSvgRef.current) {
            inputSvgRef.current.innerHTML = "";
            const rc = rough.svg(inputSvgRef.current);

            const width = isExpanded ? 550 : 480; 
            const height = popoverHeight; 

            // 말풍선 본체 (사각형)
            const rect = rc.rectangle(5, 5, width - 10, height - 10, {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3,
                roughness: 2,
                seed: SEED + 999
            });
            
            inputSvgRef.current.appendChild(rect);

        }
    }, [scheduleInput, isExpanded, popoverHeight]);

    return (
        <section 
            ref={sectionRef} 
            className={`relative w-full aspect-[522/506] ${
                (scheduleInput || showScheduleDetails || showPicker) 
                ? 'z-[1000]' 
                : 'z-0'
            }`} 
            style={{ containerType: 'inline-size' }}
        >
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
                onClose={handleClose} 
                title={
                    <div className="relative inline-block">
                        <span 
                            className="text-3xl font-bold cursor-pointer hover:opacity-70 transition-opacity text-black"
                            onClick={() => setShowPicker(!showPicker)}
                        >
                            {viewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        {showPicker && (
                            <div className="absolute top-full left-0 mt-2 z-[101] bg-white border-2 border-black p-2 rounded shadow-lg flex gap-2 items-center min-w-max text-base font-sans not-italic">
                                <select 
                                    className="p-1 border border-gray-300 rounded text-black"
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
                                    className="p-1 border border-gray-300 rounded text-black"
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
                                <button onClick={() => setShowPicker(false)} className="px-2 text-gray-500 hover:text-black font-bold">✕</button>
                            </div>
                        )}
                    </div>
                }
            >
                <div className="calendar-mixed-font flex h-full w-full bg-white rounded-b-xl overflow-hidden">
                    {/* Sidebar: 1/4 */}
                    <aside className="w-[28%] flex-shrink-0 border-r border-gray-200 bg-gray-50/50 py-6 px-4 flex flex-col gap-4 overflow-y-auto h-full">
                        <button 
                            onClick={() => handleDateClick(today, { x: 0, y: 0, w: 0, h: 0 })}
                            className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex-shrink-0 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                        >
                            <span className="text-xl">+</span>
                            <span>일정</span>
                        </button>

                        {/* Mini Calendar Area */}
                        <div className="w-full select-none flex-shrink-0">
                            <div className="flex justify-between items-center mb-1 px-1">
                                <span className="text-sm font-bold text-gray-700">
                                    {miniViewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                                </span>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setMiniViewDate(new Date(miniViewDate.getFullYear(), miniViewDate.getMonth() - 1, 1))}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-md transition-colors text-xs font-bold"
                                    >
                                        &lt;
                                    </button>
                                    <button 
                                        onClick={() => setMiniViewDate(new Date(miniViewDate.getFullYear(), miniViewDate.getMonth() + 1, 1))}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-md transition-colors text-xs font-bold"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className={`text-center text-[10px] font-bold pb-1 ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {day}
                                    </div>
                                ))}
                                {miniDays.map((date, i) => {
                                    const isCurrentMonth = date.getMonth() === miniViewDate.getMonth();
                                    const isToday = date.toDateString() === today.toDateString();
                                    return (
                                        <div 
                                            key={i}
                                            onClick={() => {
                                                const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
                                                setViewDate(newDate);
                                                setMiniViewDate(newDate);
                                            }}
                                            className={`
                                                text-center text-[11px] py-1.5 cursor-pointer rounded-lg transition-all
                                                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                                                ${isToday ? 'bg-black text-white font-bold' : 'hover:bg-gray-200'}
                                            `}
                                        >
                                            {date.getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* My Calendars Filter Section */}
                        <div className="w-full mt-2 border-t pt-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">My Calendars</h3>
                            <div className="flex flex-col gap-2">
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group w-full">
                                        <input 
                                            type="checkbox" 
                                            checked={visibleCategoryIds.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                                            style={{ accentColor: cat.color }}
                                        />
                                        <span className={`text-sm font-medium ${visibleCategoryIds.includes(cat.id) ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {cat.name}
                                        </span>
                                        <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    </label>
                                ))}
                                {/* Holiday Toggle */}
                                <label className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mt-1">
                                    <input 
                                        type="checkbox" 
                                        checked={visibleCategoryIds.includes('holidays')}
                                        onChange={() => toggleCategory('holidays')}
                                            className="w-4 h-4 rounded cursor-pointer accent-red-500 flex-shrink-0"
                                    />
                                    <span className={`text-sm font-medium ${visibleCategoryIds.includes('holidays') ? 'text-gray-800' : 'text-gray-400'}`}>
                                        Holidays
                                    </span>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-red-500"></div>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Calendar Grid: 3/4 -> 72% */}
                    <main 
                        className="w-[72%] p-6 flex flex-col overflow-y-auto"
                        style={{ containerType: 'inline-size' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            {isStudyTimeMode ? (
                                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 shadow-sm animate-in fade-in slide-in-from-left-4">
                                    <span className="text-2xl">🔥</span>
                                    <span 
                                        className="text-lg font-bold text-orange-600"
                                        style={{ fontFamily: "'Comic Sans MS', 'Pretendard', cursive" }}
                                    >
                                        {streak} Day Streak
                                    </span>
                                </div>
                            ) : <div />}

                            <div className="flex gap-2 items-center">
                                <button 
                                    onClick={() => setIsStudyTimeMode(!isStudyTimeMode)} 
                                    className={`px-3 py-2 border border-black rounded-lg transition-colors text-[13px] font-bold ${isStudyTimeMode ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    Study Time
                                </button>
                                <button onClick={handlePrevMonth} className="px-4 py-2 border border-black rounded-lg hover:bg-gray-100 transition-colors">Prev</button>
                                <button onClick={handleGoToday} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Today</button>
                                <button onClick={handleNextMonth} className="px-4 py-2 border border-black rounded-lg hover:bg-gray-100 transition-colors">Next</button>
                            </div>
                        </div>

                        {/* 7x6 Grid Layout */}
                        <div className="grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(100px,1fr))] gap-2 flex-grow min-h-0">
                            {['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'].map((day, idx) => (
                                <div key={day} className={`text-center font-bold pb-2 text-sm ${idx === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                    {day}
                                </div>
                            ))}
                            {expandedCalendarDays.map((dayInfo, idx) => (
                                <div 
                                    key={idx}
                                    onClick={(e) => {
                                        // 클릭 시 상세 모달 열기
                                        setSelectedDate(dayInfo);
                                    }}
                                    className={`group relative p-2 border rounded-lg transition-all cursor-pointer hover:shadow-md hover:border-black flex flex-col gap-1
                                        ${dayInfo.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-300'}
                                        ${dayInfo.isToday ? 'border-2 border-black ring-2 ring-black/5' : 'border-gray-200'}
                                    `}
                                >
                                    {/* 일정 추가 버튼 (+): 호버 시에만 노출 */}
                                    <button
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // 확장 모달에서는 고정된 위치(중앙)에 뜨도록 더미 좌표 전달
                                            handleDateClick(dayInfo.date, { x: 0, y: 0, w: 0, h: 0 });
                                        }}
                                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white border border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black hover:text-white text-xs font-bold shadow-sm"
                                    >
                                        +
                                    </button>

                                    <span className={`text-sm font-bold ${dayInfo.isCurrentMonth && (idx % 7 === 0 || dayInfo.holiday) ? 'text-red-500' : ''}`}>
                                        {dayInfo.date.getDate()}
                                    </span>
                                    
                                    {/* Holiday/Schedules Preview */}
                                    <div className="flex flex-col gap-0.5 overflow-hidden flex-grow">
                                        {isStudyTimeMode ? (
                                            <div 
                                                className="text-center font-bold mt-auto mb-auto whitespace-nowrap overflow-hidden"
                                                style={{ fontSize: 'clamp(5px, 1.6cqw, 15px)' }}
                                            >
                                                {formatStudyTime(dailyStudyTime[dayInfo.dateString] || 0)}
                                            </div>
                                        ) : (
                                            <>
                                                {dayInfo.holiday && (
                                                    <div className="text-[10px] bg-green-100 text-green-700 px-1 rounded truncate" title={dayInfo.holiday.dateName}>
                                                        {dayInfo.holiday.dateName}
                                                    </div>
                                                )}
                                                {dayInfo.daySchedules.slice(0, 2).map(s => (
                                                    <div key={s.id} className="text-[10px] px-1 rounded truncate text-white" style={{ backgroundColor: s.color }}>
                                                        {s.title}
                                                    </div>
                                                ))}
                                                {dayInfo.daySchedules.length > 2 && (
                                                    <div className="text-[9px] text-gray-400 pl-1 font-bold">+{dayInfo.daySchedules.length - 2} more</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </ExpandedModal>

            {/* Expanded Day Details Modal (Rectangular) */}
            {selectedDate && (
                <Modal
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(null)}
                    title={`Schedule Info`}
                    width="400px"
                >
                    <div className="calendar-mixed-font flex flex-col gap-3 p-2">
                        <p className="text-center font-bold text-gray-400 mb-2">{selectedDate.dateString}</p>
                        {selectedDate.holiday && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
                                <p className="text-xs font-bold uppercase">Holiday</p>
                                <p className="text-lg font-bold">{selectedDate.holiday.dateName}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-gray-500">Schedules</p>
                            {currentModalSchedules.length > 0 ? (
                                currentModalSchedules.map(s => (
                                    <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg shadow-sm" style={{ borderLeftColor: s.color, borderLeftWidth: '6px' }}>
                                        <div className="flex flex-col flex-1 overflow-hidden">
                                            <span className="font-bold">{s.title}</span>
                                            <span className="text-[10px] text-gray-400">{(s.startDate || s.date)} ~ {(s.endDate || s.date)} | {s.startTime} - {s.endTime}</span>
                                            {s.description && (
                                                <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-dashed border-gray-200 italic whitespace-pre-wrap">{s.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-2 flex-shrink-0">
                                            <button 
                                                onClick={() => {
                                                    handleEditSchedule(s);
                                                    setSelectedDate(null); // 수정창을 명확히 보여주기 위해 상세 모달 닫기
                                                }} 
                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <EditIcon width="16" height="16" />
                                            </button>
                                            <button onClick={() => handleDeleteSchedule(s.id)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-gray-400 italic">No plans scheduled.</p>
                            )}
                        </div>
                        {dailyStudyTime[selectedDate.dateString] > 0 && (
                            <div className="mt-1 pt-2 border-t border-black/10 flex justify-between items-center italic text-gray-500">
                                <span>Study Time</span>
                                <span>{formatStudyTime(dailyStudyTime[selectedDate.dateString])}</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Schedule Input Popover */}
            {scheduleInput && sectionRef.current && createPortal(
                (() => {
                    const rect = sectionRef.current.getBoundingClientRect();
                    const scale = rect.width / 522;
                    
                    let containerStyle = {};
                    if (isExpanded) {
                        containerStyle = {
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                    width: '550px',
                                height: `${popoverHeight}px`,
                                containerType: 'both',
                                fontFamily: CALENDAR_FONT_STACK,
                                padding: '20px 30px',
                                gap: '8px',
                                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.2))'
                            };
                    } else {
                        const buttonRightPx = (scheduleInput.pos.x + scheduleInput.pos.w + 5) * scale;
                        // +버튼의 상단 y좌표에 맞춤 (+버튼은 cellY + 15에 위치)
                        const buttonTopYPx = (scheduleInput.pos.y + 15) * scale;
                        const modalWidth = 480 * scale;

                        let left = rect.left + buttonRightPx;
                        // 화면 우측을 벗어날 경우 왼쪽으로 배치
                        if (left + modalWidth > window.innerWidth) {
                            left = rect.left + (scheduleInput.pos.x * scale) - modalWidth;
                        }
                        containerStyle = {
                            left: `${left}px`,
                            top: `${rect.top + buttonTopYPx}px`,
                            width: `${modalWidth}px`,
                            height: `${popoverHeight}px`,
                            fontFamily: CALENDAR_FONT_STACK,
                            padding: `${20 * scale}px ${30 * scale}px`,
                            gap: `${12 * scale}px`,
                            transform: 'translate(0, 0)',
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
                        };
                    }

                    return (
                        <div
                            className="fixed z-[10000] flex flex-col"
                            style={containerStyle}
                    onPointerDown={(e) => e.stopPropagation()} // 팝업 내 클릭 시 드래그 방지
                >
                    {/* RoughJS 말풍선 SVG 배경 */}
                    <svg
                        ref={inputSvgRef}
                        className="absolute inset-0 w-full h-full -z-10 overflow-visible"
                        viewBox={`0 0 ${isExpanded ? 550 : 480} ${popoverHeight}`}
                        preserveAspectRatio="none"
                    />

                    <div ref={popoverContentRef} className="flex flex-col w-full">
                        <div className="flex justify-end items-start -mb-2 w-full">
                            <button
                                onClick={() => { setScheduleInput(null); setTempTitle(""); }}
                                className="font-bold hover:scale-110 leading-none"
                                style={{ fontSize: '16px' }}
                            >✕</button>
                        </div>

                        <input
                            autoFocus
                            className="border-black outline-none bg-transparent font-bold w-full text-center"
                            style={{
                                fontSize: '16px',
                                borderWidth: '0 0 2px 0',
                                paddingBottom: '8px'
                            }}
                            placeholder="Schedule Title"
                            value={tempTitle}
                            onChange={e => setTempTitle(e.target.value)}
                        />

                        <div className="flex flex-col gap-1 w-full items-center mt-3">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Calendar</span>
                            <div className="flex gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setTempCategoryId(cat.id);
                                            setTempColor(cat.color);
                                        }}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold border-2 transition-all ${tempCategoryId === cat.id ? 'text-white' : 'bg-white'}`}
                                        style={{ borderColor: cat.color, backgroundColor: tempCategoryId === cat.id ? cat.color : 'white', color: tempCategoryId === cat.id ? 'white' : cat.color }}
                                    >{cat.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full items-center mt-2">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Date Range</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setMiniPickerMode('start')}
                                    className={`px-2 py-1 border-2 border-black rounded font-bold text-xs ${miniPickerMode === 'start' ? 'bg-yellow-200' : 'bg-white'}`}
                                >{tempStartDate}</button>
                                <span className="font-bold text-xs">~</span>
                                <button 
                                    onClick={() => setMiniPickerMode('end')}
                                    className={`px-2 py-1 border-2 border-black rounded font-bold text-xs ${miniPickerMode === 'end' ? 'bg-yellow-200' : 'bg-white'}`}
                                >{tempEndDate}</button>
                            </div>
                        </div>

                        {/* Custom Mini Date Picker */}
                        {miniPickerMode && (
                            <div 
                                ref={miniPickerRef}
                                className="absolute top-16 left-8 z-[10001] bg-white border-[3px] border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                <p className="text-[10px] font-bold mb-2 underline decoration-2">SELECT {miniPickerMode.toUpperCase()} DATE</p>
                                <input 
                                    type="date" 
                                    value={miniPickerMode === 'start' ? tempStartDate : tempEndDate}
                                    onChange={(e) => {
                                        if (miniPickerMode === 'start') setTempStartDate(e.target.value);
                                        else setTempEndDate(e.target.value);
                                        setMiniPickerMode(null);
                                    }}
                                    className="font-sans text-xs outline-none p-1 border-2 border-black"
                                />
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 w-full justify-center mt-2" style={{ fontSize: '11px' }}>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold text-gray-500 ml-1">START</label>
                                <input
                                    type="time"
                                    value={tempStartTime}
                                    onChange={e => setTempStartTime(e.target.value)}
                                    className="border border-black rounded p-1 bg-transparent outline-none"
                                />
                            </div>
                            <span className="mt-4 font-bold">~</span>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold text-gray-500 ml-1">END</label>
                                <input
                                    type="time"
                                    value={tempEndTime}
                                    onChange={e => setTempEndTime(e.target.value)}
                                    className="border border-black rounded p-1 bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full items-center mt-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase">Description</label>
                            <textarea
                                    className="border-2 border-black rounded p-2 bg-transparent outline-none resize-none h-16 w-full"
                                style={{ fontSize: '12px' }}
                                placeholder="Add more details..."
                                value={tempDescription}
                                onChange={e => setTempDescription(e.target.value)}
                            />
                        </div>

                    <div className="flex justify-center w-full" style={{ gap: isExpanded ? '12px' : `${12 * scale}px`, padding: isExpanded ? '8px 0' : `${8 * scale}px 0` }}>
                        {palette.map(color => (
                            <button
                                key={color}
                                onClick={() => setTempColor(color)}
                                className={`rounded-full border-black transition-transform flex-shrink-0 ${tempColor === color ? 'scale-125' : 'hover:scale-110'}`}
                                style={{
                                    backgroundColor: color,
                                    width: isExpanded ? '40px' : `${40 * scale}px`,
                                    height: isExpanded ? '40px' : `${40 * scale}px`,
                                    borderWidth: '2px',
                                    boxShadow: tempColor === color ? '0 0 0 2px #9ca3af' : 'none'
                                }}
                            />
                        ))}
                    </div>

                        <button
                            onClick={saveSchedule}
                            className="bg-black text-white font-bold hover:bg-gray-800 transition-colors mt-auto w-full"
                            style={{
                                fontSize: '14px',
                                padding: '12px 0',
                                borderRadius: '4px'
                            }}
                        >
                            {scheduleInput.id ? 'UPDATE!' : 'SAVE IT!'}
                        </button>
                    </div>
                        </div>
                    );
                })(),
                document.body
            )}

            <CalendarBody 
                className="absolute w-[100%] aspect-[515.5/490] left-0 top-[6%] z-10"
                viewDate={viewDate}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                canPrev={viewDate > minDate}
                canNext={viewDate < maxDate}
                onTitleClick={() => setShowPicker(!showPicker)}
                onGoToday={handleGoToday}
                onExpand={handleExpand}
                holidays={visibleCategoryIds.includes('holidays') ? holidays : []}
                schedules={filteredSchedules}
                onDateClick={handleDateClick}
                onScheduleDetailsClick={handleScheduleDetailsClick}
                onDeleteSchedule={handleDeleteSchedule}
            />

            {/* Schedule Details Popover */}
            {showScheduleDetails && (
                <ScheduleDetailsPopover
                    isOpen={!!showScheduleDetails}
                    onClose={() => setShowScheduleDetails(null)}
                    date={showScheduleDetails.date}
                    holidayForDate={holidays.find(h => String(h.locdate) === showScheduleDetails.date.replace(/-/g, ''))}
                    schedulesForDate={filteredSchedules.filter(s => {
                        const start = s.startDate || s.date;
                        const end = s.endDate || start;
                        return showScheduleDetails.date >= start && showScheduleDetails.date <= end;
                    })}
                    pos={showScheduleDetails.pos}
                    widgetRect={sectionRef.current?.getBoundingClientRect()}
                    dailyStudyTime={dailyStudyTime}
                    onDeleteSchedule={handleDeleteSchedule}
                    onEditSchedule={handleEditSchedule}
                />
            )}
        </section>

    );
}

export default Calendar;
