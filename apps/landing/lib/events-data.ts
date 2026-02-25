import fs from 'fs';
import path from 'path';

// Types for events data structure
export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees?: string;
  status: "upcoming" | "ongoing" | "completed";
  type: "online" | "offline" | "hybrid";
  image?: string;
  description?: string;
  organizer: string;
  registrationRequired: boolean;
  maxAttendees?: number | null;
}

// Path to events data directory
const EVENTS_DATA_PATH = path.join(process.cwd(), 'data', 'events');

/**
 * Fetch all events
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const agendaPath = path.join(EVENTS_DATA_PATH, 'agenda.json');
    const fileContents = fs.readFileSync(agendaPath, 'utf8');
    const events: Event[] = JSON.parse(fileContents);

    // Sort by date (upcoming first)
    const now = new Date();
    return events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Prioritize upcoming/ongoing events
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;

      // Then sort by date
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

/**
 * Fetch upcoming events
 */
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  try {
    const allEvents = await getAllEvents();
    const upcoming = allEvents.filter(event =>
      event.status === 'upcoming' || event.status === 'ongoing'
    );
    return limit ? upcoming.slice(0, limit) : upcoming;
  } catch (error) {
    console.error('Error loading upcoming events:', error);
    return [];
  }
}

/**
 * Fetch events by status
 */
export async function getEventsByStatus(status: "upcoming" | "ongoing" | "completed"): Promise<Event[]> {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event => event.status === status);
  } catch (error) {
    console.error(`Error loading events with status ${status}:`, error);
    return [];
  }
}

/**
 * Fetch events by category
 */
export async function getEventsByCategory(category: string): Promise<Event[]> {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event =>
      event.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error(`Error loading events for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const allEvents = await getAllEvents();
    return allEvents.find(event => event.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading event ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch events for a specific month
 */
export async function getEventsByMonth(year: number, month: number): Promise<Event[]> {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  } catch (error) {
    console.error(`Error loading events for ${year}-${month}:`, error);
    return [];
  }
}

/**
 * Get all unique event categories
 */
export async function getEventCategories(): Promise<string[]> {
  try {
    const allEvents = await getAllEvents();
    const categories = new Set(allEvents.map(event => event.category));
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error loading event categories:', error);
    return [];
  }
}

/**
 * Get event days for calendar widget
 */
export async function getEventDays(year: number, month: number): Promise<number[]> {
  try {
    const events = await getEventsByMonth(year, month);
    return events.map(event => new Date(event.date).getDate());
  } catch (error) {
    console.error(`Error loading event days for ${year}-${month}:`, error);
    return [];
  }
}
