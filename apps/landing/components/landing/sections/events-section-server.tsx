import { EventsSectionClient } from './events-section-client';
import { getAllEvents } from '@/lib/events-data';

/**
 * Server Component wrapper for EventsSection
 * Fetches events data from directories and passes to client component
 */
export async function EventsSection() {
  // Fetch all events to show them in the calendar (including past ones)
  const events = await getAllEvents();

  return <EventsSectionClient events={events} />;
}
