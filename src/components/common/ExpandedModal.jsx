import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import rough from 'roughjs';

const MODAL_SEED = 9999; // 모달 전용 고정 시드

const ExpandedModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    width = "w-full max-w-6xl", // w-full을 추가하여 너비 고정
    height = "aspect-video" // 기본 높이
}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (isOpen && svgRef.current) {
            svgRef.current.innerHTML = "";
            const rc = rough.svg(svgRef.current);
            
            // 16:9 비율의 viewBox (1000x562)를 기준으로 메인 배경 사각형 그리기
            const rect = rc.rectangle(5, 5, 990, 552, {
                fill: '#fff',
                fillStyle: 'solid',
                stroke: '#000',
                strokeWidth: 3.5,
                roughness: 2.5,
                bowing: 2,
                seed: MODAL_SEED
            });
            svgRef.current.appendChild(rect);
        }
    }, [isOpen, width, height]);

    if (!isOpen) return null;

    // 유틸리티: 숫자인 경우 px를 붙이고, Tailwind 클래스인지 판단하여 스타일 객체 반환
    const isTailwind = (val) => typeof val === 'string' && (val.includes('-') || val.startsWith('aspect-') || val.includes('['));
    
    const getDimensionStyle = (val, type) => {
        if (!val || isTailwind(val)) return {};
        return { [type]: typeof val === 'number' ? `${val}px` : val };
    };

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-10"
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div 
                className={`relative flex flex-col overflow-hidden max-w-full max-h-full ${isTailwind(width) ? width : 'w-full'} ${isTailwind(height) ? height : ''}`}
                style={{
                    ...getDimensionStyle(width, 'width'),
                    ...getDimensionStyle(height, 'height'),
                }}
            >
                {/* RoughJS Background SVG */}
                <svg ref={svgRef} className="absolute inset-0 w-full h-full -z-10 drop-shadow-2xl pointer-events-none" viewBox="0 0 1000 562" preserveAspectRatio="none"/>

                {/* Header Area: 독립적인 영역을 확보하여 스크롤바 침범 방지 */}
                <div className="w-full flex justify-between items-center px-10 pt-8 pb-2 z-[100] flex-shrink-0">
                    <div className="flex-1">
                        {title && (
                            <span className="text-gray-400 italic text-2xl" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                                {title}
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-5xl font-bold hover:scale-110 transition-transform text-black leading-none"
                        style={{ fontFamily: "'Comic Sans MS', cursive" }}
                    >
                        ✕
                    </button>
                </div>

                <div className="w-full flex-grow p-4 md:p-6 pt-0 flex overflow-hidden">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExpandedModal;