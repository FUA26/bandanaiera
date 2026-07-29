const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || "http://localhost:3001";

export interface Event {
  id: string; slug: string; title: string; date: string; time?: string; location?: string; locationUrl?: string; category: string; categorySlug?: string; categoryColor?: string; attendees?: string; status: "upcoming" | "ongoing" | "completed"; type: "ONLINE" | "OFFLINE" | "HYBRID"; image?: string | null; description?: string; organizer: string; organizerContact?: string; registrationRequired: boolean; registrationUrl?: string; maxAttendees?: number | null; featured?: boolean;
}

function calculateEventStatus(eventDate: Date | string): "upcoming" | "ongoing" | "completed" {
  const date = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (eventDay.getTime() < startOfToday.getTime()) return "completed";
  if (eventDay.getTime() === startOfToday.getTime()) return "ongoing";
  return "upcoming";
}

function addStatusToEvents(events: any[]): Event[] { return events.map((event) => ({ ...event, status: calculateEventStatus(event.date) })); }
async function fetchEvents(path: string) { const res = await fetch(`${BACKOFFICE_API_URL}/api/public${path}`, { next: { revalidate: 3600 } }); if (!res.ok) return null; return res.json(); }
export async function getAllEvents(): Promise<Event[]> { try { const data = await fetchEvents('/events'); return addStatusToEvents((data as any)?.items || []); } catch (error) { console.error('Error loading events:', error); return []; } }
export async function getUpcomingEvents(limit?: number): Promise<Event[]> { try { const data = await fetchEvents(`/events/upcoming${limit ? `?limit=${limit}` : ''}`); return addStatusToEvents((data as any) || []); } catch (error) { console.error('Error loading upcoming events:', error); return []; } }
export async function getEventsByStatus(status: 'upcoming' | 'ongoing' | 'completed'): Promise<Event[]> { try { const data = await fetchEvents('/events'); const events = (data as any)?.items || []; const now = new Date(); return events.filter((event: Event) => { const eventDate = new Date(event.date); if (status === 'completed') return eventDate < now; if (status === 'ongoing') return eventDate <= now && eventDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000); return eventDate >= now; }); } catch (error) { console.error(`Error loading events with status ${status}:`, error); return []; } }
export async function getEventsByCategory(category: string): Promise<Event[]> { try { const data = await fetchEvents(`/events?category=${category}`); return (data as any)?.items || []; } catch (error) { console.error(`Error loading events for category ${category}:`, error); return []; } }
export async function getEventBySlug(slug: string): Promise<Event | null> { try { return await fetchEvents(`/events/${slug}`) as Event | null; } catch (error) { console.error(`Error loading event ${slug}:`, error); return null; } }
export async function getEventsByMonth(year: number, month: number): Promise<Event[]> { try { const data = await fetchEvents(`/events/calendar?year=${year}&month=${month}`); return (data as any) || []; } catch (error) { console.error(`Error loading events for ${year}-${month}:`, error); return []; } }
export async function getEventCategories(): Promise<string[]> { try { const data = await fetchEvents('/events/categories'); return ((data as any) || []).map((c: any) => c.name); } catch (error) { console.error('Error loading event categories:', error); return []; } }
export async function getEventDays(year: number, month: number): Promise<number[]> { try { const events = await getEventsByMonth(year, month); return events.map((event) => new Date(event.date).getDate()); } catch (error) { console.error(`Error loading event days for ${year}-${month}:`, error); return []; } }
