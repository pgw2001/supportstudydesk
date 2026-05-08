import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

const SEED = 3333; // Calendar.jsx와 동일한 시드 사용

const ScheduleDetailsPopover = ({ isOpen, onClose, date, schedulesForDate, pos, onDeleteSchedule }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (isOpen && svgRef.current) {
            svgRef.current.innerHTML = "";
            const rc = rough.svg(svgRef.current);
            
            // 말풍선 본체 (사각형)
            const rect = rc.rectangle(5, 5, 270, 190, {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3,
                roughness: 2,
                seed: SEED + 1001 // ScheduleInputPopover와 다른 시드
            });
            
            // 말풍선 꼬리: 왼쪽 중앙에서 왼쪽 밖을 가리키도록 설정 (+버튼 조준)
            const tail = rc.polygon([[5, 90], [5, 110], [-15, 100]], {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3,
                roughness: 1.5,
                seed: SEED + 1002
            });

            svgRef.current.appendChild(rect);
            svgRef.current.appendChild(tail);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // 캘린더 위젯의 뷰박스 크기 (522x506)를 기준으로 백분율 위치 계산
    const popoverLeft = ((pos.x + pos.w) / 522) * 100;
    const popoverTop = ((pos.y + 15) / 506) * 100; // 15px는 날짜 숫자 아래 여백

    return (
        <div
            className="absolute z-[100] flex flex-col"
            style={{ 
                fontFamily: "'Comic Sans MS', cursive",
                containerType: 'both',
                left: `${popoverLeft}%`,
                top: `${popoverTop}%`,
                width: '53.6%', // 280px / 522px
                height: '39.5%', // 200px / 506px
                padding: '4% 5%',
                gap: '3%',
                transform: 'translate(5%, -50%)', // X축으로 살짝 띄우고 Y축 중앙 정렬
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
            }}
            onPointerDown={(e) => e.stopPropagation()} // 드래그 이벤트 전파 차단
        >
            {/* RoughJS 말풍선 SVG 배경 */}
            <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full -z-10 overflow-visible"
                viewBox="0 0 280 200"
                preserveAspectRatio="none"
            />

            <div className="flex justify-between items-center">
                <span className="font-bold italic" style={{ fontSize: 'clamp(10px, 5.5cqw, 16px)' }}>Plans for {date}</span>
                <button 
                    onClick={onClose} 
                    className="font-bold hover:scale-110 leading-none"
                    style={{ fontSize: 'clamp(12px, 7cqw, 20px)' }}
                >✕</button>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto mt-2" style={{ fontSize: 'clamp(9px, 4.8cqw, 14px)' }}>
                {schedulesForDate.length > 0 ? (
                    schedulesForDate.map(sched => (
                        <div 
                            key={sched.id} 
                            className="flex justify-between items-center group"
                            style={{ color: sched.color, borderLeft: `2px solid ${sched.color}`, paddingLeft: '5px' }}
                        >
                            <span className="truncate">{sched.title}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteSchedule(sched.id); }}
                                className="opacity-0 group-hover:opacity-100 hover:scale-125 transition-all px-1 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500 italic">No plans for this day.</span>
                )}
            </div>
        </div>
    );
};

export default ScheduleDetailsPopover;