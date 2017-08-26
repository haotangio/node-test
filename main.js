const fs = require('fs');
const path = require('path');
const PartnerMatcher = require('./lib/partner-matcher');

function _getPartnerData() {
  const PARTNERS_FILE_PATH = path.resolve(__dirname, './assets/partners.json');
  const data = fs.readFileSync(PARTNERS_FILE_PATH);
  return JSON.parse(data);
}

function main() {
  // Read partner data.
  const partners = _getPartnerData();

  // Search for matched partners.
  // Use PartnerMatcher to abstract all complexity of data transformation, calculation and comparision.
  const MAX_DISTANCE = 100; // in kilometers
  const FROM_LOCATION = '51.515419,-0.141099';
  const partnerMatcher = new PartnerMatcher(partners, FROM_LOCATION, MAX_DISTANCE);
  const matchedPartners = partnerMatcher.getPartnersWithinDistance();

  // Sort the result by organization name.
  const sortedMatchedPartners = matchedPartners.sort((partner1, partner2) =>
    partner1.organization.localeCompare(partner2.organization)
  );

  // Printing matched partners with matched office locations.
  sortedMatchedPartners.forEach(partner => {
    console.log(`${partner.organization}`);
    partner.matchedOffices.forEach(office => console.log(` - ${ office.address }`));
  });
}

main();