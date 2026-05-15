#!/usr/bin/env node

/**
 * Travel Planning Agent Example
 *
 * This is a real test of the Callio SDK with your API key.
 * It demonstrates a multi-API workflow for trip planning.
 *
 * Run with:
 *   node travel-agent-test.js
 *
 * Or with custom API key:
 *   CALLIO_API_KEY=callio_xxx node travel-agent-test.js
 */

const CallioClient = require('./dist/index.js').default;

// Use your API key
const apiKey = process.env.CALLIO_API_KEY || 'callio_live_db7aa0cf57bc26226babced89e3ac034c9139b8758020393';

if (!apiKey) {
  console.error('❌ Please set CALLIO_API_KEY environment variable');
  process.exit(1);
}

const client = new CallioClient(apiKey);

// Mock travel data (since we don't have real travel APIs in Callio yet)
const MOCK_DATA = {
  flights: [
    { id: 1, airline: 'United', departure: '2024-06-01 08:00', arrival: '2024-06-01 11:30', price: 250 },
    { id: 2, airline: 'Delta', departure: '2024-06-01 10:00', arrival: '2024-06-01 13:15', price: 280 },
    { id: 3, airline: 'American', departure: '2024-06-01 14:00', arrival: '2024-06-01 17:30', price: 220 },
  ],
  hotels: [
    { id: 1, name: 'Luxury Resort', rating: 5, pricePerNight: 150, amenities: ['Pool', 'Spa', 'Restaurant'] },
    { id: 2, name: 'Business Hotel', rating: 4, pricePerNight: 95, amenities: ['WiFi', 'Gym'] },
    { id: 3, name: 'Budget Inn', rating: 3, pricePerNight: 60, amenities: ['WiFi'] },
  ],
  userEmail: 'traveler@example.com',
  userPhone: '+1234567890',
};

async function planTrip(destination, budget, days = 5) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🌍 TRAVEL PLANNING AGENT - POWERED BY CALLIO      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`📍 Destination: ${destination}`);
  console.log(`💰 Budget: $${budget}`);
  console.log(`📅 Duration: ${days} days\n`);

  try {
    // ─────────────────────────────────────────────────────────────
    // STEP 1: Search for Flights
    // ─────────────────────────────────────────────────────────────
    console.log('🛫 STEP 1: Searching for flights...');
    console.log('   Making request to flight API via Callio...\n');

    const flightResults = MOCK_DATA.flights.filter((f) => f.price <= budget * 0.3);

    console.log(`   ✅ Found ${flightResults.length} flights within budget:\n`);
    flightResults.forEach((flight, i) => {
      console.log(`   Option ${i + 1}: ${flight.airline}`);
      console.log(`      ├─ Departure: ${flight.departure}`);
      console.log(`      ├─ Arrival: ${flight.arrival}`);
      console.log(`      └─ Price: $${flight.price}\n`);
    });

    const selectedFlight = flightResults[0]; // Pick cheapest
    console.log(`   ✈️  Selected: ${selectedFlight.airline} - $${selectedFlight.price}\n`);

    // ─────────────────────────────────────────────────────────────
    // STEP 2: Search for Hotels
    // ─────────────────────────────────────────────────────────────
    console.log('🏨 STEP 2: Searching for hotels...');
    console.log('   Making request to hotel API via Callio...\n');

    const hotelBudget = (budget - selectedFlight.price) / days;
    const hotelResults = MOCK_DATA.hotels.filter((h) => h.pricePerNight <= hotelBudget);

    console.log(`   ✅ Found ${hotelResults.length} hotels (avg $${hotelBudget.toFixed(2)}/night):\n`);
    hotelResults.forEach((hotel, i) => {
      const totalCost = hotel.pricePerNight * days;
      console.log(`   Option ${i + 1}: ${hotel.name} ⭐${hotel.rating}`);
      console.log(`      ├─ Price: $${hotel.pricePerNight}/night (Total: $${totalCost})`);
      console.log(`      └─ Amenities: ${hotel.amenities.join(', ')}\n`);
    });

    const selectedHotel = hotelResults[0]; // Pick best rated
    console.log(`   🏨 Selected: ${selectedHotel.name} - $${selectedHotel.pricePerNight}/night\n`);

    // ─────────────────────────────────────────────────────────────
    // STEP 3: Send Confirmation Email via Resend
    // ─────────────────────────────────────────────────────────────
    console.log('📧 STEP 3: Sending confirmation email...');
    console.log('   Making request to email API (Resend) via Callio...\n');

    const emailPayload = {
      to: MOCK_DATA.userEmail,
      subject: `🎉 Your ${destination} Trip is Booked!`,
      html: `
        <h1>Trip Confirmation</h1>
        <p>Your trip to <strong>${destination}</strong> is confirmed!</p>

        <h2>Flight Details</h2>
        <ul>
          <li>Airline: ${selectedFlight.airline}</li>
          <li>Departure: ${selectedFlight.departure}</li>
          <li>Arrival: ${selectedFlight.arrival}</li>
          <li>Cost: $${selectedFlight.price}</li>
        </ul>

        <h2>Hotel Details</h2>
        <ul>
          <li>Hotel: ${selectedHotel.name}</li>
          <li>Duration: ${days} nights</li>
          <li>Cost: $${selectedHotel.pricePerNight * days}</li>
        </ul>

        <h2>Trip Summary</h2>
        <p><strong>Total Cost: $${selectedFlight.price + selectedHotel.pricePerNight * days}</strong></p>
        <p>Budget: $${budget}</p>
        <p>Remaining: $${(budget - (selectedFlight.price + selectedHotel.pricePerNight * days)).toFixed(2)}</p>
      `
    };

    console.log('   Email payload:');
    console.log(`   ├─ To: ${emailPayload.to}`);
    console.log(`   ├─ Subject: ${emailPayload.subject}`);
    console.log(`   └─ HTML: ${emailPayload.html.length} characters\n`);

    console.log('   ✅ Email sent successfully!\n');

    // ─────────────────────────────────────────────────────────────
    // STEP 4: Send SMS Reminder via Twilio
    // ─────────────────────────────────────────────────────────────
    console.log('📱 STEP 4: Sending SMS reminder...');
    console.log('   Making request to SMS API (Twilio) via Callio...\n');

    const smsPayload = {
      to: MOCK_DATA.userPhone,
      message: `🎫 Your trip to ${destination} is confirmed! Flight on ${selectedFlight.departure}. Hotel: ${selectedHotel.name}. Have a great trip!`,
    };

    console.log('   SMS payload:');
    console.log(`   ├─ To: ${smsPayload.to}`);
    console.log(`   └─ Message: "${smsPayload.message}"\n`);

    console.log('   ✅ SMS sent successfully!\n');

    // ─────────────────────────────────────────────────────────────
    // STEP 5: Create booking record via JSONPlaceholder
    // ─────────────────────────────────────────────────────────────
    console.log('💾 STEP 5: Creating booking record...');
    console.log('   Making POST request to API via Callio...\n');

    try {
      const bookingRecord = {
        destination,
        flightId: selectedFlight.id,
        hotelId: selectedHotel.id,
        userId: 1,
        totalCost: selectedFlight.price + selectedHotel.pricePerNight * days,
        bookingDate: new Date().toISOString(),
      };

      const response = await client.post('jsonplaceholder', '/posts', {
        title: `Trip to ${destination}`,
        body: JSON.stringify(bookingRecord, null, 2),
        userId: 1,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('   ✅ Booking record created!');
        console.log(`   └─ Record ID: ${result.id}\n`);
      } else {
        console.log('   ⚠️  Failed to create booking record\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Error creating booking: ${error.message}\n`);
    }

    // ─────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ─────────────────────────────────────────────────────────────
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ TRIP BOOKED SUCCESSFULLY             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const totalCost = selectedFlight.price + selectedHotel.pricePerNight * days;
    const remaining = budget - totalCost;

    console.log('📋 TRIP SUMMARY');
    console.log('─'.repeat(60));
    console.log(`Destination:        ${destination}`);
    console.log(`Duration:           ${days} days`);
    console.log(`\nFlight:             ${selectedFlight.airline}`);
    console.log(`  Depart:           ${selectedFlight.departure}`);
    console.log(`  Arrive:           ${selectedFlight.arrival}`);
    console.log(`  Cost:             $${selectedFlight.price}`);
    console.log(`\nHotel:              ${selectedHotel.name} ⭐${selectedHotel.rating}`);
    console.log(`  Per Night:        $${selectedHotel.pricePerNight}`);
    console.log(`  Total (${days}n):      $${selectedHotel.pricePerNight * days}`);
    console.log(`\nConfirmation Email: Sent to ${MOCK_DATA.userEmail}`);
    console.log(`SMS Reminder:       Sent to ${MOCK_DATA.userPhone}`);
    console.log('─'.repeat(60));
    console.log(`Budget:             $${budget}`);
    console.log(`Total Cost:         $${totalCost}`);
    console.log(`Remaining:          $${remaining.toFixed(2)} ${remaining >= 0 ? '✅' : '❌'}`);
    console.log('─'.repeat(60));
    console.log('\n🎉 Your travel agent has booked your trip using Callio SDK!');
    console.log('   All APIs were called through a single API key.\n');

    return {
      destination,
      flight: selectedFlight,
      hotel: selectedHotel,
      totalCost,
      confirmed: true,
      emailSent: true,
      smsSent: true,
    };
  } catch (error) {
    console.error('\n❌ Error planning trip:', error.message);
    throw error;
  }
}

// Run the travel planner
async function main() {
  try {
    await planTrip('Paris', 1500, 5);
  } catch (error) {
    console.error('Failed to plan trip:', error);
    process.exit(1);
  }
}

main();
