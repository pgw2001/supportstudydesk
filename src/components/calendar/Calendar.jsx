import { useEffect, useRef } from "react";
import rough from "roughjs";

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
            });

            triangle.setAttribute('transform', 'translate(10, 1)');

            const outerCircle = rc.circle(38.5,15,26, {
                fill: '#D43333',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 2,
                roughness: 1,  // 구불구불 정도
                bowing: 1      // 휘어짐 정도
            });

            const innerCircle = rc.circle(38.5,15,16, {
                fill: '#af4444',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 2,
                roughness: 1,
                bowing: 1
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

function CalendarBody({className}) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = "";

            const rc = rough.svg(svgRef.current);

            // 실제 날짜 정보 계산
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0-11
            const monthName = now.toLocaleString("en-US", { month: "long" });
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
                bowing: 2
            });
            svgRef.current.appendChild(rect);

            // "April" text
            const monthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            monthText.setAttribute("x", mainRectX + (mainRectWidth / 2)); // Center horizontally
            monthText.setAttribute("y", mainRectY + 55); // Position below top edge
            monthText.setAttribute("text-anchor", "middle"); // Center text based on x
            monthText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 40px; font-weight: bold; fill: #333;");
            monthText.textContent = monthName;
            svgRef.current.appendChild(monthText);

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
                    bowing: 1
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
                calendarDays.push({
                    day: tempDate.getDate(),
                    isCurrentMonth: tempDate.getMonth() === currentMonth,
                    isToday: tempDate.toDateString() === now.toDateString()
                });
            }

            // Draw internal vertical lines
            for (let i = 1; i < 7; i++) { // 6 lines for 7 columns
                const x = gridStartX + (i * cellWidth);
                const line = rc.line(x, gridStartY, x, gridStartY + gridTotalHeight, {
                    stroke: '#ccc',
                    strokeWidth: 1,
                    roughness: 0.5
                });
                svgRef.current.appendChild(line);
            }

            // Draw internal horizontal lines
            for (let i = 1; i < 5; i++) { // 4 lines for 5 rows
                const y = gridStartY + (i * cellHeight);
                const line = rc.line(gridStartX, y, gridStartX + gridTotalWidth, y, {
                    stroke: '#ccc',
                    strokeWidth: 1,
                    roughness: 0.5
                });
                svgRef.current.appendChild(line);
            }

            // 날짜 숫자 그리기
            calendarDays.forEach((dateInfo, index) => {
                const row = Math.floor(index / 7);
                const col = index % 7;
                const x = gridStartX + (col * cellWidth) + (cellWidth / 2);
                const y = gridStartY + (row * cellHeight) + (cellHeight / 2) + 7; // 약간 아래로 조정

                const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                dateText.setAttribute("x", x.toString());
                dateText.setAttribute("y", y.toString());
                dateText.setAttribute("text-anchor", "middle");
                dateText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 18px; font-weight: ${dateInfo.isToday ? 'bold' : 'normal'}; fill: ${dateInfo.isCurrentMonth ? '#333' : '#ccc'};`);
                dateText.textContent = dateInfo.day.toString();
                svgRef.current.appendChild(dateText);
            });
        }
    }, []);
    return (
        <div className={`relative ${className}`}>
            <svg ref={svgRef} width="100%" className="absolute inset-0 w-full h-full" viewBox="0 0 522 506" preserveAspectRatio="none">
            </svg>
        </div>
    );
}

function Calendar() {
    return (
        <section className="relative w-[clamp(180px,30vw,522px)] aspect-[522/506]">
            <CalendarPin className="absolute w-[15%] aspect-[77/71] left-1/2 -translate-x-1/2 z-0"/>
            <CalendarBody className="absolute w-[100%] aspect-[515.5/490] left-0 top-[6%] z-10">
            </CalendarBody>
        </section>

    );
}

export default Calendar;