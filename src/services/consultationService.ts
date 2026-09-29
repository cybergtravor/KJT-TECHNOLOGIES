/**
 * =====================================================================
 * CONSULTATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Central domain service for the Kampala-Time Consultation Booking Engine.
 * 
 * FEATURES:
 * - Dynamic slot generation based on opening/closing hours and break intervals
 * - Africa/Kampala (UTC+3, EAT) timezone standardization
 * - Strict double-booking prevention at both application and database index level
 * - iCalendar (.ics) appointment download generation
 * - Reschedule history tracking
 * - Blocked dates and holiday blackout calendar
 * 
 * BACKEND SETUP:
 * // BACKEND SETUP: Supabase tables 'consultation_bookings', 'consultation_availability', 'blocked_dates'.
 * RLS enforces visitor booking submissions while restricting full calendar management to admins.
 * =====================================================================
 */

import * as baseConsultationService from '../lib/consultationService';

export const {
  DEFAULT_AVAILABILITY_CONFIG,
  DEFAULT_BLOCKED_DATES,
  getAvailabilityConfig,
  saveAvailabilityConfig,
  getBlockedDates,
  saveBlockedDates,
  addBlockedDate,
  removeBlockedDate,
  getLocalBookings,
  saveLocalBookings,
  generateBookingReference,
  getAvailableTimeSlotsForDate,
  submitConsultationBooking,
  getAllBookings,
  updateBookingStatus,
  rescheduleBooking,
  generateIcsCalendarFile,
  generateGoogleCalendarUrl,
} = baseConsultationService;

// Friendly alias
export const calculateAvailableSlotsForDate = baseConsultationService.getAvailableTimeSlotsForDate;

export default baseConsultationService;
