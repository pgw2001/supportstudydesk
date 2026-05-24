import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import rough from 'roughjs';
import EditIcon from '../../assets/icons/edit';

const SEED = 3333; // Calendar.jsx와 동일한 시드 사용

const ScheduleDetailsPopover = ({ isOpen, onClose, date, schedulesForDate, pos, onDeleteSchedule, onEditSchedule, widgetRect }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (isOpen && svgRef.current) {
            svgRef.current.innerHTML = "";
            const rc = rough.svg(svgRef.current);
            
            const width = 320;
            const height = 220;

            // 말풍선 본체 (사각형)
            const rect = rc.rectangle(5, 5, width - 10, height - 10, {
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

    if (!isOpen || !widgetRect) return null;

    // 위젯의 현재 크기와 위치를 기반으로 픽셀 좌표 계산
    const scale = widgetRect.width / 522;
    const left = widgetRect.left + ((pos.x + pos.w) * scale);
    const top = widgetRect.top + ((pos.y + 15) * scale);
    const width = 320 * scale;
    const height = 220 * scale;

    return createPortal(
        <div
            className="fixed z-[999999] flex flex-col"
            style={{ 
                fontFamily: "'Comic Sans MS', cursive",
                containerType: 'both',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                padding: `${height * 0.1}px ${width * 0.1}px`,
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
                viewBox="0 0 320 220"
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
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditSchedule(sched); }}
                                    className="hover:scale-125 transition-transform"
                                >
                                    <EditIcon width="14" height="14" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteSchedule(sched.id); }}
                                    className="hover:scale-125 transition-transform px-1 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500 italic">No plans for this day.</span>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ScheduleDetailsPopover;