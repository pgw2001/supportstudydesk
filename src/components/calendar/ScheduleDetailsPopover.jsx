import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import rough from 'roughjs';
import EditIcon from '../../assets/icons/edit';
import Modal from '../common/modal';

const SEED = 3333; // Calendar.jsx와 동일한 시드 사용

const ScheduleDetailsPopover = ({ isOpen, onClose, date, schedulesForDate, holidayForDate, pos, onDeleteSchedule, onEditSchedule, widgetRect }) => {
    const svgRef = useRef(null);
    const [infoSchedule, setInfoSchedule] = useState(null);

    useEffect(() => {
        if (isOpen && svgRef.current) {
            svgRef.current.innerHTML = "";
            const rc = rough.svg(svgRef.current);
            
            const width = 350; // 너비 증가
            const height = 240; // 높이 증가

            // 말풍선 본체 (사각형)
            const rect = rc.rectangle(5, 5, width - 10, height - 10, {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3,
                roughness: 2,
                seed: SEED + 1001 // ScheduleInputPopover와 다른 시드
            });
            
            svgRef.current.appendChild(rect);
        }
    }, [isOpen]);

    if (!isOpen || !widgetRect) return null;

    // 위젯의 현재 크기와 위치를 기반으로 픽셀 좌표 계산
    const scale = widgetRect.width / 522;
    const left = widgetRect.left + ((pos.x + pos.w) * scale);
    const top = widgetRect.top + ((pos.y + 15) * scale);
    const width = 350 * scale;
    const height = 240 * scale;

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
                viewBox="0 0 350 240"
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
            
            <div 
                className="flex flex-col gap-1 overflow-y-auto mt-2 pr-4" 
                style={{ fontSize: 'clamp(9px, 4.8cqw, 14px)', scrollbarGutter: 'stable' }}
            >
                {holidayForDate && (
                    <div 
                        className="flex justify-between items-center"
                        style={{ color: '#D43333', borderLeft: '2px solid #D43333', paddingLeft: '5px' }}
                    >
                        <span className="truncate">{holidayForDate.dateName}</span>
                    </div>
                )}
                {schedulesForDate.length > 0 ? (
                    schedulesForDate.map(sched => (
                        <div 
                            key={sched.id} 
                            className="flex justify-between items-center group cursor-pointer hover:bg-black/5 rounded transition-colors"
                            style={{ color: sched.color, borderLeft: `2px solid ${sched.color}`, paddingLeft: '5px', marginBottom: '2px' }}
                            onClick={() => setInfoSchedule(sched)}
                        >
                            <span className="truncate flex-1">{sched.title}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
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

            {/* 일정 상세 정보 모달 */}
            {infoSchedule && (
                <Modal
                    isOpen={!!infoSchedule}
                    onClose={() => setInfoSchedule(null)}
                    title="Schedule Information"
                    width="350px"
                >
                    <div className="p-4 font-['Comic_Sans_MS',_cursive] flex flex-col gap-5">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Title</h3>
                            <p className="text-xl font-bold border-b-2 border-black/5 pb-2" style={{ color: infoSchedule.color }}>
                                {infoSchedule.title}
                            </p>
                        </div>
                        
                        {infoSchedule.description && (
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 whitespace-pre-wrap italic text-gray-700 leading-relaxed">
                                    {infoSchedule.description}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-start gap-4 pt-2">
                            <div className="flex-1">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Period</h3>
                                <p className="text-sm font-bold text-gray-800">
                                    {infoSchedule.startDate || infoSchedule.date}
                                    {infoSchedule.endDate && infoSchedule.endDate !== (infoSchedule.startDate || infoSchedule.date) ? ` ~ ${infoSchedule.endDate}` : ''}
                                </p>
                            </div>
                            <div className="flex-1 border-l pl-4 border-gray-100">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time</h3>
                                <p className="text-sm font-bold text-gray-800">{infoSchedule.startTime} - {infoSchedule.endTime}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>,
        document.body
    );
};

export default ScheduleDetailsPopover;