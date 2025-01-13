import { createContext } from "react";

export const InitData = createContext(
    {
        noteJSON: {},
        runTimeJSON: {day: "01", month:"01", year: "2025", hh:"00", mm:"00", ss:"00"}
    }
)