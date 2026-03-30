import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ─── Admin user ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@travelapp.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@travelapp.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ─── Sri Lanka Destinations ───────────────────────────────────────────────
  const destinations = [
    // HOTELS
    {
      name: 'Galle Face Hotel',
      slug: 'galle-face-hotel',
      description: 'One of Asia\'s oldest hotels, the iconic Galle Face Hotel sits on the shores of the Indian Ocean in Colombo. Dating back to 1864, it blends colonial grandeur with modern luxury, offering stunning ocean views, fine dining, and a historic ambiance that captures the soul of Sri Lanka.',
      type: 'HOTEL',
      address: '2 Kollupitiya Road',
      city: 'Colombo',
      country: 'Sri Lanka',
      latitude: 6.9166,
      longitude: 79.8420,
      pricePerNight: 180,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      amenities: ['Ocean View', 'Pool', 'Fine Dining', 'Spa', 'WiFi', 'Bar', 'Gym'],
    },
    {
      name: 'Jetwing Lighthouse',
      slug: 'jetwing-lighthouse-galle',
      description: 'Designed by renowned architect Geoffrey Bawa, the Jetwing Lighthouse in Galle is a masterpiece of Sri Lankan architecture perched on a rocky headland. Enjoy breathtaking ocean views, a beautiful infinity pool, and easy access to the UNESCO-listed Galle Fort.',
      type: 'HOTEL',
      address: 'Dadella',
      city: 'Galle',
      country: 'Sri Lanka',
      latitude: 6.0174,
      longitude: 80.2128,
      pricePerNight: 220,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
      amenities: ['Ocean View', 'Infinity Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar'],
    },
    {
      name: 'Heritance Kandalama',
      slug: 'heritance-kandalama',
      description: 'Built into the ancient rock face overlooking the Kandalama reservoir, Heritance Kandalama is another Geoffrey Bawa masterpiece. The hotel blends seamlessly into the jungle, offering panoramic views of Sigiriya Rock and Dambulla Cave Temple. A true eco-luxury experience.',
      type: 'HOTEL',
      address: 'Kandalama',
      city: 'Dambulla',
      country: 'Sri Lanka',
      latitude: 7.9403,
      longitude: 80.7718,
      pricePerNight: 195,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      amenities: ['Jungle View', 'Pool', 'Spa', 'WiFi', 'Multiple Restaurants', 'Yoga'],
    },
    {
      name: 'Cape Weligama',
      slug: 'cape-weligama',
      description: 'Perched dramatically on a headland above the Indian Ocean near Weligama Bay, Cape Weligama is one of Sri Lanka\'s most spectacular luxury resorts. Each villa has a private plunge pool with sweeping ocean views, perfect for honeymooners and luxury travellers.',
      type: 'HOTEL',
      address: 'Weligama Bay',
      city: 'Weligama',
      country: 'Sri Lanka',
      latitude: 5.9745,
      longitude: 80.4234,
      pricePerNight: 450,
      images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
      amenities: ['Private Plunge Pool', 'Ocean View', 'Butler Service', 'Spa', 'Fine Dining', 'Yoga'],
    },

    // CAMPSITES
    {
      name: 'Knuckles Mountain Forest Camp',
      slug: 'knuckles-mountain-forest-camp',
      description: 'Nestled in the heart of the UNESCO-listed Knuckles Mountain Range, this eco-campsite offers an authentic wilderness experience. Wake up to misty mountain views, explore pristine rainforest trails, and sleep under a blanket of stars far from city lights.',
      type: 'CAMPSITE',
      address: 'Knuckles Conservation Forest',
      city: 'Matale',
      country: 'Sri Lanka',
      latitude: 7.4667,
      longitude: 80.8167,
      pricePerNight: 35,
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
      amenities: ['Tent Hire', 'Campfire', 'Guided Hikes', 'Meals', 'Showers', 'Wildlife Spotting'],
    },
    {
      name: 'Yala Wild Safari Camp',
      slug: 'yala-wild-safari-camp',
      description: 'Experience the thrill of sleeping in the wild at the edge of Yala National Park, home to the world\'s highest density of leopards. Fall asleep to the sounds of the jungle and wake up for sunrise safari drives to spot elephants, leopards, crocodiles and colourful birds.',
      type: 'CAMPSITE',
      address: 'Yala National Park Buffer Zone',
      city: 'Tissamaharama',
      country: 'Sri Lanka',
      latitude: 6.3722,
      longitude: 81.5167,
      pricePerNight: 55,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'],
      amenities: ['Safari Jeep', 'Campfire', 'Meals Included', 'Wildlife Guide', 'Stargazing', 'Bird Watching'],
    },
    {
      name: 'Ella Rock Glamping',
      slug: 'ella-rock-glamping',
      description: 'Glamorous camping in the misty hills of Ella, surrounded by tea plantations and breathtaking mountain scenery. Enjoy comfortable safari tents with real beds, private decks with mountain views, and easy access to Ella Rock hiking trail and the famous Nine Arch Bridge.',
      type: 'CAMPSITE',
      address: 'Ella Hills',
      city: 'Ella',
      country: 'Sri Lanka',
      latitude: 6.8667,
      longitude: 81.0500,
      pricePerNight: 75,
      images: ['https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800'],
      amenities: ['Glamping Tents', 'Mountain View', 'Breakfast', 'Hiking Trails', 'Tea Plantation Tours'],
    },

    // ATTRACTIONS
    {
      name: 'Sigiriya Rock Fortress',
      slug: 'sigiriya-rock-fortress',
      description: 'Rising 200 metres above the surrounding jungle, Sigiriya is Sri Lanka\'s most iconic landmark and a UNESCO World Heritage Site. This 5th-century rock fortress built by King Kashyapa features ancient frescoes of celestial maidens, mirror wall inscriptions, and extraordinary water gardens at its base.',
      type: 'ATTRACTION',
      address: 'Sigiriya',
      city: 'Sigiriya',
      country: 'Sri Lanka',
      latitude: 7.9572,
      longitude: 80.7600,
      pricePerNight: null,
      images: ['https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800'],
      amenities: ['Guided Tours', 'Museum', 'Water Gardens', 'Photography', 'Viewing Platforms'],
    },
    {
      name: 'Temple of the Sacred Tooth Relic',
      slug: 'temple-of-the-tooth-kandy',
      description: 'Sri Lanka\'s most sacred Buddhist temple, located in the royal city of Kandy. The Temple of the Tooth houses a relic of the tooth of the Buddha and is a UNESCO World Heritage Site. Visit during the evening Puja ceremony to witness priests presenting offerings to the sacred relic with drumming and chanting.',
      type: 'ATTRACTION',
      address: 'Sri Dalada Veediya',
      city: 'Kandy',
      country: 'Sri Lanka',
      latitude: 7.2936,
      longitude: 80.6413,
      pricePerNight: null,
      images: ['https://images.unsplash.com/photo-1583309219338-a582f1db9a91?w=800'],
      amenities: ['Religious Ceremonies', 'Museum', 'Audio Guide', 'Cultural Shows', 'Lake Views'],
    },
    {
      name: 'Galle Fort',
      slug: 'galle-fort',
      description: 'A living UNESCO World Heritage Site, Galle Fort is a perfectly preserved Dutch colonial fort built in the 17th century on Sri Lanka\'s southern coast. Wander cobblestone streets lined with boutique hotels, galleries, cafés, and churches. The sunset from the ramparts over the Indian Ocean is unforgettable.',
      type: 'ATTRACTION',
      address: 'Galle Fort',
      city: 'Galle',
      country: 'Sri Lanka',
      latitude: 6.0269,
      longitude: 80.2167,
      pricePerNight: null,
      images: ['https://images.unsplash.com/photo-1598977054075-c66007497420?w=800'],
      amenities: ['Walking Tours', 'Museums', 'Boutique Shopping', 'Restaurants', 'Lighthouse', 'Sunset Views'],
    },
    {
      name: "Adam's Peak (Sri Pada)",
      slug: 'adams-peak-sri-pada',
      description: "Sri Lanka's most sacred mountain pilgrimage, Adam's Peak (2,243m) is revered by Buddhists, Hindus, Muslims and Christians alike. The famous footprint at the summit is believed to be that of the Buddha, Lord Shiva, Adam, or St. Thomas depending on your faith. The night hike to catch sunrise from the top is a bucket-list experience.",
      type: 'ATTRACTION',
      address: "Dalhousie",
      city: 'Ratnapura',
      country: 'Sri Lanka',
      latitude: 6.8096,
      longitude: 80.4994,
      pricePerNight: null,
      images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'],
      amenities: ['Pilgrimage Trail', 'Night Hike', 'Sunrise Views', 'Tea Stalls', 'Guided Climbs'],
    },
    {
      name: 'Mirissa Beach & Whale Watching',
      slug: 'mirissa-beach-whale-watching',
      description: "Mirissa is Sri Lanka's top beach destination and the world's best location for blue whale watching. Between November and April, join morning boat tours to spot the largest animals on Earth just offshore. The beach itself is a perfect crescent of golden sand lined with palm trees, perfect for surfing and sunsets.",
      type: 'ATTRACTION',
      address: 'Mirissa Beach',
      city: 'Mirissa',
      country: 'Sri Lanka',
      latitude: 5.9483,
      longitude: 80.4549,
      pricePerNight: null,
      images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800'],
      amenities: ['Whale Watching Tours', 'Surfing', 'Snorkelling', 'Beach Bars', 'Boat Trips'],
    },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: dest,
    });
    console.log('✅ Destination created:', dest.name);
  }

  // ─── Sample Blog Posts ────────────────────────────────────────────────────
  const posts = [
    {
      title: '10 Reasons Why Sri Lanka Should Be Your Next Destination',
      slug: '10-reasons-sri-lanka-next-destination',
      excerpt: 'From ancient ruins to pristine beaches, misty mountains to friendly locals — here\'s why Sri Lanka is one of the world\'s most incredible travel destinations.',
      content: `Sri Lanka, the teardrop-shaped island off the southern tip of India, packs an extraordinary diversity of experiences into a small land area. Here are 10 reasons to visit:

1. **Ancient History** — Explore UNESCO World Heritage Sites like Sigiriya, Polonnaruwa, and Anuradhapura, some of the best-preserved ancient cities in Asia.

2. **Wildlife** — Yala National Park has the world's highest density of leopards. Minneriya is famous for the "Gathering" — hundreds of wild elephants meeting at the reservoir.

3. **Beaches** — From the surf beaches of Arugam Bay to the calm turquoise waters of Mirissa and the golden stretches of Unawatuna, Sri Lanka has a beach for every traveller.

4. **Tea Country** — The hill country around Nuwara Eliya and Ella is blanketed in emerald tea plantations. Take a scenic train ride through mist-covered mountains.

5. **The Food** — Sri Lankan cuisine is bold and flavourful. Rice and curry, kottu roti, hoppers, and string hoppers are must-tries.

6. **Friendly Locals** — Sri Lankans are known for their warmth and hospitality. You'll receive smiles wherever you go.

7. **Affordability** — Sri Lanka offers excellent value for money, with world-class experiences at a fraction of the cost of other destinations.

8. **The Train Rides** — The Kandy to Ella train journey is regularly listed as one of the world's most beautiful train trips.

9. **Spiritual Sites** — From the Temple of the Tooth in Kandy to Adam's Peak and the ancient dagobas of the Cultural Triangle, Sri Lanka is deeply spiritual.

10. **Size** — The entire island can be explored in 2-3 weeks, making it perfect for a comprehensive holiday without endless travel days.`,
      tags: ['Sri Lanka', 'Travel Tips', 'Destinations'],
      published: true,
      authorId: admin.id,
    },
    {
      title: 'The Perfect 10-Day Sri Lanka Itinerary',
      slug: 'perfect-10-day-sri-lanka-itinerary',
      excerpt: 'Make the most of your Sri Lanka trip with this carefully planned 10-day itinerary covering the Cultural Triangle, hill country, and southern beaches.',
      content: `Here's our recommended 10-day route for first-time visitors to Sri Lanka:

**Day 1-2: Colombo**
Arrive in Colombo, explore Pettah Market, visit Gangaramaya Temple, and stroll along Galle Face Green at sunset. Stay at the iconic Galle Face Hotel.

**Day 3-4: Cultural Triangle (Sigiriya & Dambulla)**
Drive north to Dambulla. Climb Sigiriya Rock Fortress at sunrise. Visit the Dambulla Cave Temple with its 150 Buddha statues. Spot wild elephants at Minneriya National Park.

**Day 5: Kandy**
Drive to Kandy through spice gardens and rubber plantations. Visit the Temple of the Tooth Relic for the evening Puja ceremony. Explore the colourful Kandy market.

**Day 6-7: Ella via Scenic Train**
Take the famous train from Kandy to Ella — one of the world's most scenic train journeys. Hike to Ella Rock for panoramic views. Visit the Nine Arch Bridge at sunrise.

**Day 8: Yala National Park**
Drive south for an afternoon and morning safari at Yala National Park. Look for leopards, elephants, sloth bears, and crocodiles.

**Day 9-10: Southern Coast (Mirissa/Galle)**
Relax on Mirissa beach. Take a whale watching boat trip. Explore UNESCO-listed Galle Fort. Watch the sunset from the ramparts.

**Depart** from Colombo (3-hour drive from Galle).`,
      tags: ['Sri Lanka', 'Itinerary', 'Travel Planning'],
      published: true,
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log('✅ Blog post created:', post.title);
  }

  console.log('\n🎉 Seed complete!');
  console.log('Admin login: admin@travelapp.com / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
