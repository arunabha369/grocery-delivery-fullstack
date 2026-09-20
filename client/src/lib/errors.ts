import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
    if (isAxiosError(error)) return error.response?.data?.message || error.message || fallback;
    if (error instanceof Error) return error.message || fallback;
    return fallback;
}
