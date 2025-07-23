export type TimezoneInfo = {
    value: string;        // e.g. "US Mountain Standard Time"
    abbr: string;         // e.g. "UMST"
    offset: number;       // e.g. -7
    isdst: boolean;       // e.g. false
    text: string;         // e.g. "(UTC-07:00) Arizona"
    utc: string[];        // e.g. list of time zone names like "America/Phoenix"
};