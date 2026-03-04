
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    const category = await prisma.eventCategory.findFirst();

    if (!user || !category) {
        console.error('No user or category found. Please seed users and categories first.');
        return;
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    const testEvents = [
        {
            title: 'Event Kemarin',
            slug: 'event-kemarin',
            date: yesterday,
            time: '10:00',
            location: 'Aula Kantor',
            organizer: 'Panitia Naiera',
            status: 'PUBLISHED',
            categoryId: category.id,
            createdById: user.id,
            showInMenu: true,
        },
        {
            title: 'Event Minggu Lalu',
            slug: 'event-minggu-lalu',
            date: lastWeek,
            time: '09:00',
            location: 'Lapangan Kota',
            organizer: 'Dinas Kebudayaan',
            status: 'PUBLISHED',
            categoryId: category.id,
            createdById: user.id,
            showInMenu: true,
        },
        {
            title: 'Event Hari Ini',
            slug: 'event-hari-ini',
            date: now,
            time: '14:00',
            location: 'Ruang Rapat 1',
            organizer: 'Sekretariat Daerah',
            status: 'PUBLISHED',
            categoryId: category.id,
            createdById: user.id,
            showInMenu: true,
        },
        {
            title: 'Event Besok',
            slug: 'event-besok',
            date: tomorrow,
            time: '08:00',
            location: 'Gedung Serbaguna',
            organizer: 'Karang Taruna',
            status: 'PUBLISHED',
            categoryId: category.id,
            createdById: user.id,
            showInMenu: true,
        },
        {
            title: 'Event Minggu Depan',
            slug: 'event-minggu-depan',
            date: nextWeek,
            time: '13:00',
            location: 'Stadion Utama',
            organizer: 'Dinas Pemuda & Olahraga',
            status: 'PUBLISHED',
            categoryId: category.id,
            createdById: user.id,
            showInMenu: true,
        }
    ];

    console.log('Seeding test events...');

    for (const event of testEvents) {
        await prisma.event.upsert({
            where: { slug: event.slug },
            update: event,
            create: event,
        });
        console.log(`- ${event.title} (${event.date.toISOString().split('T')[0]})`);
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
