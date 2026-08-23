/**
 * Calendar View Type
 * Available view modes for the calendar component
 * 
 * @example
 * // Usage in component
 * <KCalendar view="week" />
 * <KCalendar view="agenda" />
 * <KCalendar view="year" />
 */

export type CalendarView = 
    | 'month'    // Monthly grid view (default)
    | 'week'     // Weekly horizontal timeline
    | 'agenda'   // List view of events
    | 'day'      // Single day timeline with hours
    | 'year';    // 12-month mini grid overview
