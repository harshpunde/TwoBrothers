// Delivery partner data for Two Brothers Organic Farms
export const deliveryPartners = [
  {
    id: 'delhivery',
    name: 'Delhivery',
    logo: '🚀',
    active: true,
    options: [
      { speed: 'Economy', days: '3–5 days', price: 49 },
      { speed: 'Express', days: '1–2 days', price: 99 },
    ],
    trackingUrl: 'https://www.delhivery.com/track/package/',
  },
  {
    id: 'bluedart',
    name: 'BlueDart',
    logo: '✈️',
    active: true,
    options: [
      { speed: 'Standard', days: '2–4 days', price: 59 },
      { speed: 'Priority', days: 'Next day', price: 149 },
    ],
    trackingUrl: 'https://www.bluedart.com/tracking/',
  },
  {
    id: 'shiprocket',
    name: 'Shiprocket',
    logo: '📦',
    active: true,
    options: [
      { speed: 'Standard', days: '3–5 days', price: 0 }, // Free for orders ≥ ₹1499
      { speed: 'Express', days: '1–2 days', price: 79 },
    ],
    freeAbove: 1499, // Shipping free for Standard when order ≥ this
    trackingUrl: 'https://www.shiprocket.in/tracking/',
  },
  {
    id: 'indiapost',
    name: 'India Post',
    logo: '🏤',
    active: true,
    options: [
      { speed: 'Regular', days: '5–7 days', price: 29 },
    ],
    trackingUrl: 'https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx',
  },
];
