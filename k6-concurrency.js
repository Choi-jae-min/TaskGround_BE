import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
    vus: Number(__ENV.VUS || 20),
    duration: __ENV.DURATION || "20s",
    thresholds: {
        http_req_failed: ["rate<0.01"], // 실패율 1% 미만(원하면 조절)
    },
};

const BASE = "http://localhost:3000";
const TASK_ID = __ENV.TASK_ID;
const TOKEN = __ENV.TOKEN || "";

function headers() {
    return {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        "X-Client-Event": "autosave",
    };
}

// (선택) 서버가 GET으로 version을 내려준다고 가정하면 각 루프마다 최신 version을 가져오는 방식도 가능.
// 여기선 "충돌 유도"를 위해 일부러 stale version을 유지하게 만들 수도 있음.
export default function () {
    const url = `${BASE}/task/${TASK_ID}`;

    // ✅ 낙관적 락 "후" 테스트 시: version을 고정/랜덤으로 보내 충돌 유도
    const version = Number(__ENV.VERSION || 1); // 실제로는 시작 version을 넣거나, 일부러 stale로 둠

    const body = JSON.stringify({
        description: `vu${__VU}_iter${__ITER}_${Date.now()}`,
        version,
    });

    const res = http.patch(url, body, { headers: headers() });

    check(res, {
        "2xx or 409": (r) => (r.status >= 200 && r.status < 300) || r.status === 409,
    });

    sleep(0.1);
}
