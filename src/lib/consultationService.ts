/**
 * =====================================================================
 * CONSULTATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Handles availability configuration, dynamic time slot calculation,
 * double-booking prevention, and lifecycle state management for the
 * Consultation Booking System.
 * 
 * Features:
 * - Working hours, weekdays, and break period calculation
 * - Blocked dates and holiday blackout management
 * - Strict database-level & client-level double booking prevention
 * - Reschedule history preservation
 * - iCalendar (.ics) and Google Calendar generation
 * - Web3Forms email notification relay
 * - Resilient LocalStorage fallback
 * =====================================================================
 */

import {
  ConsultationBooking,
  ConsultationAvailabilityConfig,
  BlockedDateItem,
  ConsultationStatus,
  MeetingMethod,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { companyConfig } from '../config/company';

const LOCAL_BOOKINGS_KEY = 'kjt_consultation_bookings_v1';
const LOCAL_AVAILABILITY_KEY = 'kjt_consultation_availability_v1';
const LOCAL_BLOCKED_DATES_KEY = 'kjt_consultation_blocked_dates_v1';

export const DEFAULT_AVAILABILITY_CONFIG: ConsultationAvailabilityConfig = {
  id: 'default_availability',
  availableWeekdays: [1, 2, 3, 4, 5], // Monday - Friday
  openingTime: '08:30',
  closingTime: '17:30',
  consultationDurationMinutes: 45,
  breakPeriods: [{ start: '13:00', end: '14:00' }], // Lunch / maintenance break
  maxBookingsPerDay: 6,
  minimumBookingNoticeHours: 12,
  maxAdvanceBookingDays: 60,
  timeZone: 'Africa/Kampala',
};

export const DEFAULT_BLOCKED_DATES: BlockedDateItem[] = [
  {
    id: 'blk-1',
    date: '2026-12-25',
    reason: 'Christmas Holiday',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'blk-2',
    date: '2026-12-26',
    reason: 'Boxing Day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'blk-3',
    date: '2027-01-01',
    reason: 'New Year Day',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Read local availability configuration
 */
export function getAvailabilityConfig(): ConsultationAvailabilityConfig {
  if (typeof window === 'undefined') return DEFAULT_AVAILABILITY_CONFIG;
  try {
    const raw = localStorage.getItem(LOCAL_AVAILABILITY_KEY);
    if (!raw) return DEFAULT_AVAILABILITY_CONFIG;
    return { ...DEFAULT_AVAILABILITY_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_AVAILABILITY_CONFIG;
  }
}

/**
 * Save availability configuration
 */
export async function saveAvailabilityConfig(
  config: ConsultationAvailabilityConfig
): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_AVAILABILITY_KEY, JSON.stringify(config));
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('consultation_availability').upsert([
        {
          id: config.id,
          available_weekdays: config.availableWeekdays,
          opening_time: config.openingTime,
          closing_time: config.closingTime,
          consultation_duration_minutes: config.consultationDurationMinutes,
          break_periods: config.breakPeriods,
          max_bookings_per_day: config.maxBookingsPerDay,
          minimum_booking_notice_hours: config.minimumBookingNoticeHours,
          max_advance_booking_days: config.maxAdvanceBookingDays,
          time_zone: config.timeZone,
          updated_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn('Supabase availability config upsert notice:', err);
    }
  }
}

/**
 * Read blocked dates
 */
export function getBlockedDates(): BlockedDateItem[] {
  if (typeof window === 'undefined') return DEFAULT_BLOCKED_DATES;
  try {
    const raw = localStorage.getItem(LOCAL_BLOCKED_DATES_KEY);
    if (!raw) return DEFAULT_BLOCKED_DATES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_BLOCKED_DATES;
  } catch (e) {
    return DEFAULT_BLOCKED_DATES;
  }
}

/**
 * Save blocked dates
 */
export async function saveBlockedDates(dates: BlockedDateItem[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_BLOCKED_DATES_KEY, JSON.stringify(dates));
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      // In Supabase, can sync or replace
      await supabase.from('blocked_dates').upsert(
        dates.map((d) => ({
          id: d.id,
          date: d.date,
          reason: d.reason,
          created_at: d.createdAt,
        }))
      );
    } catch (err) {
      console.warn('Supabase blocked dates sync notice:', err);
    }
  }
}

/**
 * Add a single blocked date
 */
export async function addBlockedDate(date: string, reason: string): Promise<BlockedDateItem> {
  const current = getBlockedDates();
  const newItem: BlockedDateItem = {
    id: `blk-${Date.now()}`,
    date,
    reason: reason || 'Reserved / Unavailable',
    createdAt: new Date().toISOString(),
  };
  const updated = [...current.filter((c) => c.date !== date), newItem];
  await saveBlockedDates(updated);
  return newItem;
}

/**
 * Remove a blocked date
 */
export async function removeBlockedDate(id: string): Promise<void> {
  const current = getBlockedDates();
  const updated = current.filter((c) => c.id !== id);
  await saveBlockedDates(updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('blocked_dates').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase remove blocked date notice:', e);
    }
  }
}

/**
 * Read bookings stored locally
 */
export function getLocalBookings(): ConsultationBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading bookings from localStorage:', e);
    return [];
  }
}

/**
 * Save bookings list locally
 */
export function saveLocalBookings(list: ConsultationBooking[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving bookings to localStorage:', e);
  }
}

/**
 * Generate sequential booking reference: KJT-C-0001, KJT-C-0002...
 */
export function generateBookingReference(existingCount: number = 0): string {
  const sequence = (existingCount + 1).toString().padStart(4, '0');
  return `KJT-C-${sequence}`;
}

/**
 * Helper to convert "HH:MM" string to minutes from midnight
 */
function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Helper to convert minutes from midnight to "HH:MM" string
 */
function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface GeneratedTimeSlot {
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  available: boolean;
  reason?: string;
}

/**
 * Compute all available time slots for a given calendar date (YYYY-MM-DD)
 */
export async function getAvailableTimeSlotsForDate(
  dateStr: string,
  existingBookings?: ConsultationBooking[]
): Promise<{ slots: GeneratedTimeSlot[]; message?: string }> {
  const config = getAvailabilityConfig();
  const blockedDates = getBlockedDates();
  const bookings = existingBookings || (await getAllBookings());

  const targetDate = new Date(`${dateStr}T00:00:00`);
  if (isNaN(targetDate.getTime())) {
    return { slots: [], message: 'Invalid calendar date selected.' };
  }

  // 1. Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (targetDate < today) {
    return { slots: [], message: 'Consultations cannot be scheduled for past dates.' };
  }

  // 2. Check maximum advance booking window
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + config.maxAdvanceBookingDays);
  if (targetDate > maxDate) {
    return {
      slots: [],
      message: `Bookings are only accepted up to ${config.maxAdvanceBookingDays} days in advance.`,
    };
  }

  // 3. Check weekday availability (0 = Sunday, 1 = Monday ... 6 = Saturday)
  const dayOfWeek = targetDate.getDay();
  if (!config.availableWeekdays.includes(dayOfWeek)) {
    return {
      slots: [],
      message: 'KJT TECHNOLOGIES consultations are not scheduled on weekends or closed days.',
    };
  }

  // 4. Check if date is explicitly blocked
  const blockedMatch = blockedDates.find((b) => b.date === dateStr);
  if (blockedMatch) {
    return {
      slots: [],
      message: `Date unavailable: ${blockedMatch.reason || 'Reserved date'}`,
    };
  }

  // 5. Check maximum bookings per day limit
  const activeBookingsOnDate = bookings.filter(
    (b) => b.date === dateStr && b.status !== 'Cancelled'
  );
  if (activeBookingsOnDate.length >= config.maxBookingsPerDay) {
    return {
      slots: [],
      message: 'All consultation slots for this date are fully reserved. Please pick another date.',
    };
  }

  // 6. Generate time slots from openingTime to closingTime
  const openMinutes = timeStringToMinutes(config.openingTime);
  const closeMinutes = timeStringToMinutes(config.closingTime);
  const duration = config.consultationDurationMinutes;
  const breakRanges = config.breakPeriods.map((bp) => ({
    start: timeStringToMinutes(bp.start),
    end: timeStringToMinutes(bp.end),
  }));

  const now = new Date();
  const minNoticeMs = config.minimumBookingNoticeHours * 60 * 60 * 1000;

  const candidateSlots: GeneratedTimeSlot[] = [];
  let currentStart = openMinutes;

  while (currentStart + duration <= closeMinutes) {
    const currentEnd = currentStart + duration;
    const startStr = minutesToTimeString(currentStart);
    const endStr = minutesToTimeString(currentEnd);

    // Check if slot overlaps with any break period
    const overlapsBreak = breakRanges.some(
      (br) => currentStart < br.end && currentEnd > br.start
    );

    if (!overlapsBreak) {
      // Check minimum notice requirement if target date is today or soon
      const slotDateTime = new Date(`${dateStr}T${startStr}:00`);
      const isTooSoon = slotDateTime.getTime() - now.getTime() < minNoticeMs;

      // Check if slot is already booked
      const isAlreadyBooked = activeBookingsOnDate.some(
        (b) => b.startTime === startStr
      );

      candidateSlots.push({
        startTime: startStr,
        endTime: endStr,
        available: !isTooSoon && !isAlreadyBooked,
        reason: isAlreadyBooked
          ? 'Slot already reserved'
          : isTooSoon
          ? 'Requires at least 12h advance notice'
          : undefined,
      });
    }

    // Step forward by duration + 15 min buffer if desired, or duration
    currentStart += duration + 15; // 15 min buffer between senior engineer consultations
  }

  return { slots: candidateSlots };
}

/**
 * Submit a new consultation booking
 * Strictly verifies no other client has reserved the slot before confirming
 */
export async function submitConsultationBooking(
  payload: Omit<ConsultationBooking, 'id' | 'bookingReference' | 'createdAt' | 'status'>
): Promise<{ success: boolean; booking?: ConsultationBooking; error?: string }> {
  const localList = getLocalBookings();

  // 1. Double booking validation check against local & cloud records
  const allBookings = await getAllBookings();
  const duplicate = allBookings.find(
    (b) =>
      b.date === payload.date &&
      b.startTime === payload.startTime &&
      b.status !== 'Cancelled'
  );

  if (duplicate) {
    return {
      success: false,
      error: `The ${payload.startTime} time slot on ${payload.date} was just reserved by another client. Please select an alternate slot.`,
    };
  }

  const id = `cons-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const bookingReference = generateBookingReference(localList.length);
  const now = new Date().toISOString();

  const newBooking: ConsultationBooking = {
    ...payload,
    id,
    bookingReference,
    createdAt: now,
    status: 'Pending', // Pending until administrator confirms
  };

  // 2. Insert into Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = {
        id: newBooking.id,
        booking_reference: newBooking.bookingReference,
        full_name: newBooking.fullName,
        organization: newBooking.organization || null,
        email: newBooking.email,
        phone: newBooking.phone,
        whatsapp: newBooking.whatsapp,
        service: newBooking.service,
        topic: newBooking.topic,
        description: newBooking.description,
        booking_date: newBooking.date,
        start_time: newBooking.startTime,
        end_time: newBooking.endTime,
        time_zone: newBooking.timeZone,
        meeting_method: newBooking.meetingMethod,
        additional_notes: newBooking.additionalNotes || null,
        privacy_consent: newBooking.privacyConsent,
        status: newBooking.status,
        created_at: newBooking.createdAt,
      };

      const { error } = await supabase.from('consultation_bookings').insert([dbRow]);
      if (error) {
        if (error.code === '23505') {
          // Database unique violation: slot reserved atomically
          return {
            success: false,
            error: `This time slot was just confirmed by another client. Please choose another time.`,
          };
        }
        console.warn('Supabase booking insert notice:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase connection error for booking:', err?.message || err);
    }
  }

  // 3. Save to localStorage
  saveLocalBookings([newBooking, ...localList]);

  // 4. Trigger Web3Forms notification email to company
  const accessKey =
    ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string) ||
    companyConfig.contactFormKey;

  const isKeyConfigured =
    accessKey &&
    !accessKey.includes('YOUR_WEB3FORMS') &&
    accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

  if (isKeyConfigured) {
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Consultation Requested [${newBooking.bookingReference}] - ${newBooking.fullName} (${newBooking.date} at ${newBooking.startTime})`,
          from_name: 'KJT Booking Desk',
          booking_reference: newBooking.bookingReference,
          client_name: newBooking.fullName,
          organization: newBooking.organization || 'Individual',
          client_email: newBooking.email,
          client_phone: newBooking.phone,
          client_whatsapp: newBooking.whatsapp,
          service: newBooking.service,
          topic: newBooking.topic,
          date: newBooking.date,
          time: `${newBooking.startTime} - ${newBooking.endTime} (${newBooking.timeZone})`,
          meeting_method: newBooking.meetingMethod,
          description: newBooking.description,
          status: 'Pending Confirmation',
          timestamp: newBooking.createdAt,
        }),
      }).catch((e) => console.warn('Email gateway notice:', e));
    } catch (e) {
      // Non-blocking
    }
  }

  return {
    success: true,
    booking: newBooking,
  };
}

/**
 * Fetch all consultation bookings (Admin access)
 */
export async function getAllBookings(): Promise<ConsultationBooking[]> {
  const localList = getLocalBookings();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (!error && Array.isArray(data)) {
        const mapped: ConsultationBooking[] = data.map((row: any) => ({
          id: row.id,
          bookingReference: row.booking_reference || row.id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          status: row.status || 'Pending',
          fullName: row.full_name,
          organization: row.organization || '',
          email: row.email,
          phone: row.phone,
          whatsapp: row.whatsapp || '',
          service: row.service,
          topic: row.topic,
          description: row.description || '',
          date: row.booking_date,
          startTime: row.start_time,
          endTime: row.end_time,
          timeZone: row.time_zone || 'Africa/Kampala',
          meetingMethod: row.meeting_method || 'Google Meet',
          additionalNotes: row.additional_notes,
          privacyConsent: !!row.privacy_consent,
          adminNotes: row.admin_notes || '',
          rescheduledFrom: row.rescheduled_from || undefined,
        }));

        const cloudIds = new Set(mapped.map((m) => m.id));
        const missingFromCloud = localList.filter((l) => !cloudIds.has(l.id));
        return [...mapped, ...missingFromCloud];
      }
    } catch (err) {
      console.warn('Supabase bookings query notice, using local records:', err);
    }
  }

  return localList;
}

/**
 * Update a booking status or administrator notes
 */
export async function updateBookingStatus(
  id: string,
  status: ConsultationStatus,
  adminNotes?: string
): Promise<boolean> {
  const localList = getLocalBookings();
  const updatedList = localList.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : b.adminNotes,
        updatedAt: new Date().toISOString(),
      };
    }
    return b;
  });
  saveLocalBookings(updatedList);

  if (isSupabaseConfigured() && supabase) {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (adminNotes !== undefined) updates.admin_notes = adminNotes;

      await supabase.from('consultation_bookings').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase booking update notice:', e);
    }
  }

  return true;
}

/**
 * Reschedule a consultation booking
 * Preserves the previous date and time in rescheduledFrom
 */
export async function rescheduleBooking(
  id: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const allBookings = await getAllBookings();
  const target = allBookings.find((b) => b.id === id);
  if (!target) {
    return { success: false, error: 'Booking not found.' };
  }

  // Check if slot is occupied by another booking
  const duplicate = allBookings.find(
    (b) =>
      b.id !== id &&
      b.date === newDate &&
      b.startTime === newStartTime &&
      b.status !== 'Cancelled'
  );
  if (duplicate) {
    return {
      success: false,
      error: `The ${newStartTime} slot on ${newDate} is already booked. Please choose a different slot.`,
    };
  }

  const rescheduledRecord = {
    date: target.date,
    startTime: target.startTime,
    endTime: target.endTime,
    rescheduledAt: new Date().toISOString(),
  };

  const localList = getLocalBookings();
  const updatedList = localList.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        status: 'Rescheduled' as ConsultationStatus,
        rescheduledFrom: rescheduledRecord,
        adminNotes: adminNotes !== undefined ? adminNotes : b.adminNotes,
        updatedAt: new Date().toISOString(),
      };
    }
    return b;
  });
  saveLocalBookings(updatedList);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from('consultation_bookings')
        .update({
          booking_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
          status: 'Rescheduled',
          rescheduled_from: rescheduledRecord,
          admin_notes: adminNotes !== undefined ? adminNotes : target.adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase reschedule update notice:', e);
    }
  }

  return { success: true };
}

/**
 * Generate iCalendar (.ics) content for downloading
 */
export function generateIcsCalendarFile(booking: ConsultationBooking): string {
  const startIso = booking.date.replace(/-/g, '') + 'T' + booking.startTime.replace(/:/g, '') + '00';
  const endIso = booking.date.replace(/-/g, '') + 'T' + booking.endTime.replace(/:/g, '') + '00';
  const createdIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KJT TECHNOLOGIES//Consultation System//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.bookingReference}@kjttechnologies.com
DTSTAMP:${createdIso}
DTSTART;TZID=${booking.timeZone}:${startIso}
DTEND;TZID=${booking.timeZone}:${endIso}
SUMMARY:KJT TECHNOLOGIES Consultation [${booking.bookingReference}] - ${booking.topic}
DESCRIPTION:Technical consultation regarding ${booking.service}. Meeting Method: ${booking.meetingMethod}. Client: ${booking.fullName} (${booking.phone}).
LOCATION:${booking.meetingMethod === 'Physical meeting' ? 'KJT TECHNOLOGIES Headquarters (Kampala, Uganda)' : booking.meetingMethod}
STATUS:CONFIRMED
ORGANIZER;CN=KJT TECHNOLOGIES:mailto:${companyConfig.contact.primaryEmail}
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate Google Calendar URL for quick browser addition
 */
export function generateGoogleCalendarUrl(booking: ConsultationBooking): string {
  const startIso = booking.date.replace(/-/g, '') + 'T' + booking.startTime.replace(/:/g, '') + '00';
  const endIso = booking.date.replace(/-/g, '') + 'T' + booking.endTime.replace(/:/g, '') + '00';
  const text = encodeURIComponent(`KJT TECHNOLOGIES Consultation: ${booking.topic}`);
  const details = encodeURIComponent(
    `Engineering Consultation for ${booking.service}.\nReference: ${booking.bookingReference}\nMeeting Method: ${booking.meetingMethod}\nClient: ${booking.fullName}`
  );
  const location = encodeURIComponent(
    booking.meetingMethod === 'Physical meeting'
      ? 'KJT TECHNOLOGIES Office (Kampala, Uganda)'
      : booking.meetingMethod
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startIso}/${endIso}&details=${details}&location=${location}&ctz=${encodeURIComponent(
    booking.timeZone
  )}`;
}
