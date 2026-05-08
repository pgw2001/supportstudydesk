/**
 * 공공데이터 포털 API를 통해 공휴일 정보를 가져오는 함수
 * @param {number} year 연도
 * @param {number} month 월
 */
export const getHolidays = async (year, month) => {
    // Vite 환경에서는 process.env 대신 import.meta.env를 사용하며, 접두사는 VITE_여야 합니다.
    const serviceKey = import.meta.env.VITE_HOLIDAY_SERVICE_KEY;
    const solMonth = String(month).padStart(2, '0');
    
    // URL을 https로 변경하고 서비스키를 안전하게 포함합니다.
    // 만약 API 키가 이미 인코딩되어 있다면 decodeURIComponent로 한 번 풀어서 사용하는 것이 안전할 수 있습니다.
    const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${encodeURIComponent(serviceKey)}&solYear=${year}&solMonth=${solMonth}&_type=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP 에러 발생! 상태: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`${year}년 ${month}월 공휴일 데이터:`, data);
        
        // 데이터 구조에 따른 예외 처리 (데이터가 1개일 때와 여러 개일 때 대응)
        const items = data.response?.body?.items?.item;
        if (!items) return [];
        return Array.isArray(items) ? items : [items];
    } catch (error) {
        console.error("공휴일 정보를 불러오는 중 오류 발생:", error);
        return [];
    }
};