import { NODE_ENV } from "../config/constants.config";

export function getBEURL() {
    if (NODE_ENV === 'production') {
        return "https://simpleblog-production-e4f0.up.railway.app";
    } else {
        return 'http://localhost:5000';
    }
}