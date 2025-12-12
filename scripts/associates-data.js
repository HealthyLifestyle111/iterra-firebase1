/**
 * iTerra Concierge Wellness Platform - Associates Data
 * 
 * INSTRUCTIONS:
 * Replace the sample data below with real associate information.
 * 
 * Fields:
 * - name: Full name of the associate
 * - email: Valid email address (will auto-generate slug)
 * - phone: Phone number in E.164 format (e.g., +15555555555)
 * - doterraUrl: Associate's doTERRA URL
 * - role: 'associate' or 'admin'
 * 
 * The following fields will be auto-generated:
 * - slug: Generated from email (e.g., jane.doe@iterra.com → janedoe)
 * - referralCode: 8-character unique code
 * - referralCounter: Initialized to 0
 * - createdAt: Current timestamp
 * - updatedAt: Current timestamp
 */

const associates = [
  {
    name: "Jane Doe",
    email: "jane.doe@iterra.com",
    phone: "+15555555555",
    doterraUrl: "https://www.doterra.com/US/en/site/janedoe",
    role: "associate"
  },
  {
    name: "John Smith",
    email: "john.smith@iterra.com",
    phone: "+15555555556",
    doterraUrl: "https://www.doterra.com/US/en/site/johnsmith",
    role: "admin"
  },
  // Add more associates below following the same format
  // {
  //   name: "Your Name",
  //   email: "your.email@iterra.com",
  //   phone: "+15555555557",
  //   doterraUrl: "https://www.doterra.com/US/en/site/yourname",
  //   role: "associate"
  // },
];

module.exports = associates;
