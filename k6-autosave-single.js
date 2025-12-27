import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
    vus: 10,
    duration: "10s",
};

const BASE =  "http://localhost:3000";
const TASK_ID = '272472ea-f4de-4109-a19d-ed8eaf8c3fb3'
const RATE = 20; // 초당 20번 = 10초에 200회

export default function () {
    const url = `${BASE}/task/${TASK_ID}`;
    const payload = JSON.stringify({ title: `typing_${Date.now()}` });

    const params = {
        headers: {
            "Content-Type": "application/json",
            "X-Client-Event": "autosave",
        },
    };

    const res = http.put(url, payload, params);
    check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
    if (res.status >= 400) {
        console.log(`status=${res.status} body=${res.body}`);
    }
    sleep(1 / RATE); // 초당 RATE번
}
