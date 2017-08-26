const assert = require('assert');
const PartnerMatcher = require('./partner-matcher');

describe('PartnerMatcher', () => {
  // Define re-usable sample test data.
  const samplePartners = [{
    "id": 4,
    "urlName": "blue-square-360",
    "organization": "Blue Square 360",
    "customerLocations": "globally",
    "willWorkRemotely": true,
    "website": "http://www.bluesquare360.com/",
    "services": "Blue Square 360 provides a professionally managed service covering all areas of a 360° Feedback initiative. We're experienced in supporting projects of all sizes, and always deliver a personal service that provides the level of support you need to ensure your 360 initiative delivers results for the business.",
    "offices": [
      {
        "location": "Singapore",
        "address": "Ocean Financial Centre, Level 40, 10 Collyer Quay, Singapore, 049315",
        "coordinates": "1.28304,103.85199319999992"
      },
      {
        "location": "London, UK",
        "address": "St Saviours Wharf, London SE1 2BE",
        "coordinates": "51.5014767,-0.0713608999999451"
      }
    ]
  }];
  const sampleCentralLocation = '51.515419,-0.141099';

  describe('#constructor()', () => {
    it('should create instance storing provided partners and maxDistance', () => {
      const partnerMatcher = new PartnerMatcher(samplePartners, sampleCentralLocation, 100);
      assert.deepEqual(partnerMatcher.partners, samplePartners);
      assert.deepEqual(partnerMatcher.maxDistance, 100);
    });

    it('should create instance storing converted central coordinates', () => {
      const partnerMatcher = new PartnerMatcher([], sampleCentralLocation, 100);
      assert.deepEqual(partnerMatcher.centralLocation, {
        ln: -0.002462642121271479,
        lt: 0.8991136770944448
      });
    });
  });
  describe('#getPartnersWithinDistance()', () => {
    it('should return partners having offices inside maxDistance with "matchedOffices" extra object key in result', () => {
      const partnerMatcher = new PartnerMatcher(samplePartners, sampleCentralLocation, 100);
      const matchedPartners = partnerMatcher.getPartnersWithinDistance();
      assert.deepEqual(matchedPartners[0].matchedOffices, [{
        "location": "London, UK",
        "address": "St Saviours Wharf, London SE1 2BE",
        "coordinates": "51.5014767,-0.0713608999999451"
      }]);
    });
    it('should not return partners outside maxDistance', () => {
      const partnerMatcher = new PartnerMatcher(samplePartners, sampleCentralLocation, 0.1); // 0.1km maxDistance
      const matchedPartners = partnerMatcher.getPartnersWithinDistance();
      assert.deepEqual(matchedPartners, []);
    });
  });
});
