import { useEffect, useRef, useState } from "react";
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

                // 일정 추가용 + 버튼 그룹 (반투명 호버용)
                const plusGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                plusGroup.style.opacity = "0"; // 초기 상태는 숨김
                plusGroup.style.transition = "opacity 0.2s";
                plusGroup.style.pointerEvents = "none";
                const pX = cellX + cellWidth - 15;
                const pY = cellY + 15;
                const pSize = 10;
                const l1 = rc.line(pX - pSize/2, pY, pX + pSize/2, pY, { strokeWidth: 2, roughness: 1, seed: SEED + index + 500 });
                const l2 = rc.line(pX, pY - pSize/2, pX, pY + pSize/2, { strokeWidth: 2, roughness: 1, seed: SEED + index + 501 });
                plusGroup.appendChild(l1);
                plusGroup.appendChild(l2);

                // + 버튼 전용 히트박스
                const plusBtnHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                plusBtnHitbox.setAttribute("x", (pX - 17.5).toString()); // 중심점 기준 더 넓게 설정
                plusBtnHitbox.setAttribute("y", (pY - 17.5).toString());
                plusBtnHitbox.setAttribute("width", "35");
                plusBtnHitbox.setAttribute("height", "35");
                plusBtnHitbox.setAttribute("fill", "transparent");
                plusBtnHitbox.style.cursor = "pointer";
                plusBtnHitbox.style.pointerEvents = "none"; // 초기에는 클릭 방지
                plusBtnHitbox.onpointerdown = (e) => {
                    e.stopPropagation();
                    onDateClick(dateInfo.date, { x: cellX, y: cellY, w: cellWidth, h: cellHeight }); // 위치 정보 전달
                };

                // 셀 호버 이벤트: + 버튼 표시 및 활성화
                cellHitbox.onpointerenter = () => {
                    plusGroup.style.opacity = "0.5";
                    plusBtnHitbox.style.pointerEvents = "auto"; // 호버 시 클릭 가능
                };
                cellHitbox.onpointerleave = () => {
                    plusGroup.style.opacity = "0";
                    plusBtnHitbox.style.pointerEvents = "none"; // 호버 해제 시 클릭 방지
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
                dateText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 17px; font-weight: ${dateInfo.isToday ? 'bold' : 'normal'}; fill: ${textColor}; pointer-events: none;`);
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
                    div.style.fontFamily = "'Comic Sans MS', cursive";
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
                        plusGroup.style.opacity = "0.5";
                        plusBtnHitbox.style.pointerEvents = "auto";
                    };
                    fo.onpointerleave = () => {
                        plusGroup.style.opacity = "0";
                        plusBtnHitbox.style.pointerEvents = "none";
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
                svgRef.current.appendChild(plusGroup); // 3. 상단: + 아이콘 시각 요소
                svgRef.current.appendChild(plusBtnHitbox); // 4. 최상단: + 버튼 실제 클릭 판정 (35x35)
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

function Calendar({ onExpandStateChange }) {
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
    } = useCalendar();

    const { 
        isExpanded, 
        handleExpand, 
        handleClose,
        expandedCalendarDays,
        selectedDate,
        setSelectedDate
    } = useExpandedCalendar(onExpandStateChange, { viewDate, holidays, schedules, today });

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
                // 요소들이 차지하는 높이 + 상하 패딩 여유분
                const contentH = popoverContentRef.current.offsetHeight;
                setPopoverHeight(contentH + (isExpanded ? 50 : 40));
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

            const width = isExpanded ? 450 : 280; // 40% 너비에 맞춰 280으로 조정
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

            // 위젯 모드(확장 안됨)일 때만 말풍선 꼬리 그리기
            if (!isExpanded) {
                const tail = rc.polygon([[5, 90], [5, 110], [-15, 100]], {
                    fill: '#fff',
                    fillStyle: 'solid',
                    stroke: '#000',
                    strokeWidth: 3,
                    roughness: 1.5,
                    seed: SEED + 1000
                });
                inputSvgRef.current.appendChild(tail);
            }
        }
    }, [scheduleInput, isExpanded, popoverHeight]);

    return (
        <section className="relative w-full aspect-[522/506]" style={{ containerType: 'inline-size' }}>
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
                title="Expanded Calendar View"
            >
                <div className="flex h-full w-full bg-white rounded-b-xl overflow-hidden font-['Comic_Sans_MS',_cursive]">
                    {/* Sidebar: 1/4 */}
                    <aside className="w-1/4 border-r border-gray-200 bg-gray-50/50 p-6 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Calendar Sidebar</h2>
                        <div className="flex-grow border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 italic p-4 text-center">
                            Sidebar content (Stats, Filters, etc.)
                        </div>
                    </aside>

                    {/* Calendar Grid: 3/4 */}
                    <main className="w-3/4 p-6 flex flex-col overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">
                                {viewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                            </h2>
                            <div className="flex gap-2">
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
                                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-white border border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black hover:text-white text-xs font-bold shadow-sm"
                                    >
                                        +
                                    </button>

                                    <span className={`text-sm font-bold ${dayInfo.isCurrentMonth && (idx % 7 === 0 || dayInfo.holiday) ? 'text-red-500' : ''}`}>
                                        {dayInfo.date.getDate()}
                                    </span>
                                    
                                    {/* Holiday/Schedules Preview */}
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
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
                    <div className="flex flex-col gap-3 font-['Comic_Sans_MS',_cursive] p-2">
                        <p className="text-center font-bold text-gray-400 mb-2">{selectedDate.dateString}</p>
                        {selectedDate.holiday && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
                                <p className="text-xs font-bold uppercase">Holiday</p>
                                <p className="text-lg font-bold">{selectedDate.holiday.dateName}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-gray-500">Schedules</p>
                            {selectedDate.daySchedules.length > 0 ? (
                                selectedDate.daySchedules.map(s => (
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
                    </div>
                </Modal>
            )}

            {/* Schedule Input Popover */}
            {scheduleInput && createPortal(
                <div
                    className={`${isExpanded ? 'fixed' : 'absolute'} z-[10000] flex flex-col`}
                    style={isExpanded ? {
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '450px',
                        height: `${popoverHeight}px`,
                        containerType: 'both',
                        fontFamily: "'Comic Sans MS', cursive",
                        padding: '20px 30px',
                        gap: '8px',
                        filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.2))'
                    } : {
                        fontFamily: "'Comic Sans MS', cursive",
                        containerType: 'both', // 내부 요소들이 컨테이너 크기에 반응하도록 설정
                        // 모달 너비: 40% (약 210px)
                        // 버튼 위치 기준으로 우측 배치, 화면 밖 시 좌측 배치
                        left: (() => {
                            const btnX = (scheduleInput.pos.x + scheduleInput.pos.w) / 522;
                            const modalWidth = 0.40; // 40%
                            // 우측 배치 시 화면 넘는지 확인 (버튼 우측 + 모달 너비 > 100%)
                            if (btnX + modalWidth > 1) {
                                // 좌측 배치: 버튼 좌측 - 모달 너비 - 여백(2%)
                                return `${Math.max(0, scheduleInput.pos.x / 522 * 100 - 42)}%`;
                            } else {
                                // 우측 배치: 버튼 우측 + 여백(2%)
                                return `${btnX * 100 + 2}%`;
                            }
                        })(),
                        top: `${(scheduleInput.pos.y + 15) / 506 * 100}%`,
                        width: '40%',  // 약 210px
                        height: `${popoverHeight}px`,
                        padding: '3% 5%',
                        gap: '2%',
                        transform: 'translate(0, -50%)',
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // 팝업 내 클릭 시 드래그 방지
                >
                    {/* RoughJS 말풍선 SVG 배경 */}
                    <svg
                        ref={inputSvgRef}
                        className="absolute inset-0 w-full h-full -z-10 overflow-visible"
                        viewBox={isExpanded ? "0 0 400 500" : "0 0 280 380"}
                        preserveAspectRatio="none"
                    />

                    <div className="flex justify-end items-start -mb-2">
                        <button 
                            onClick={() => { setScheduleInput(null); setTempTitle(""); }} 
                            className="font-bold hover:scale-110 leading-none"
                            style={{ fontSize: 'clamp(12px, 7cqw, 20px)' }}
                        >✕</button>
                    </div>

                    <input 
                        autoFocus
                        className="border-black outline-none bg-transparent font-bold"
                        style={{ 
                            fontSize: 'clamp(11px, 5.5cqw, 18px)', 
                            borderWidth: '0 0 clamp(2px, 0.5cqw, 3px) 0',
                            paddingBottom: '2%'
                        }}
                        placeholder="Schedule Title"
                        value={tempTitle}
                        onChange={e => setTempTitle(e.target.value)}
                    />

                    <div className="flex flex-col gap-1">
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
                    
                    <div className="flex items-center gap-2" style={{ fontSize: 'clamp(8px, 4cqw, 12px)' }}>
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

                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Description</label>
                        <textarea 
                            className="border-2 border-black rounded p-2 bg-transparent outline-none resize-none h-16"
                            style={{ fontSize: 'clamp(9px, 4cqw, 13px)' }}
                            placeholder="Add more details..."
                            value={tempDescription}
                            onChange={e => setTempDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center" style={{ gap: '2.5%', padding: '2% 0' }}>
                        {palette.map(color => (
                            <button 
                                key={color}
                                onClick={() => setTempColor(color)}
                                className={`rounded-full border-black transition-transform ${tempColor === color ? 'scale-125' : 'hover:scale-110'}`}
                                style={{ 
                                    backgroundColor: color, 
                                    width: '10%', 
                                    aspectRatio: '1/1',
                                    borderWidth: 'min(1.5px, 0.5cqw)',
                                    boxShadow: tempColor === color ? '0 0 0 min(1.5px, 0.5cqw) #9ca3af' : 'none'
                                }}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={saveSchedule}
                        className="bg-black text-white font-bold hover:bg-gray-800 transition-colors mt-auto"
                        style={{ 
                            fontSize: 'clamp(10px, 5.5cqw, 16px)', 
                            padding: '3% 0',
                            borderRadius: 'clamp(2px, 1.5cqw, 5px)'
                        }}
                    >
                        {scheduleInput.id ? 'UPDATE!' : 'SAVE IT!'}
                    </button>
                </div>,
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
                holidays={holidays}
                schedules={schedules}
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
                    schedulesForDate={schedules.filter(s => {
                        const start = s.startDate || s.date;
                        const end = s.endDate || start;
                        return showScheduleDetails.date >= start && showScheduleDetails.date <= end;
                    })}
                    pos={showScheduleDetails.pos}
                    onDeleteSchedule={handleDeleteSchedule}
                    onEditSchedule={handleEditSchedule}
                />
            )}
        </section>

    );
}

export default Calendar;