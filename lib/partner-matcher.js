/**
 * Convert degree value to radians.
 * TODO: Migrate to utility class in future.
 * @param angle {number} Input value in degree
 * @returns {number} Converted value in radians
 */
function _toRadians(angle) {
  return angle * (Math.PI / 180);
}

/**
 * Transform coordinates value from string to json.
 * TODO: Abstract into class in future to handle more complex logics.
 * @param stringVal {String} coordinate value in string format separated by ","
 * @returns {{ln: *, lt: *}}
 * @private
 */
function _standadizeCoordinate(stringVal) {
  const spittedStrings = stringVal.split(',');
  const lt = _toRadians(parseFloat(spittedStrings[0]));
  const ln = _toRadians(parseFloat(spittedStrings[1]));
  return { lt, ln };
}

/**
 * Calculate distance between 2 geo-location points
 * @param location1
 * @param location2
 * @returns {number} distance between 2 points in kilometer
 * @private
 */
function _getDistance(location1, location2) {
  const MEAN_EARTH_RADIUS = 6371; // in kilometer
  const centralAngle = Math.acos(Math.sin(location1.lt) * Math.sin(location2.lt)
    + Math.cos(location1.lt) * Math.cos(location2.lt) * Math.cos(Math.abs(location1.ln - location2.ln)));
  return MEAN_EARTH_RADIUS * centralAngle;
}

/**
 * Check if distance between to geo-location is within maxDistance
 * @param location1
 * @param location2
 * @param maxDistance
 * @returns {boolean}
 * @private
 */
function _isWithinDistance(location1, location2, maxDistance) {
  return _getDistance(location1, location2) <= maxDistance;
}

/**
 * Abstract all complexity of data transformation, calculation and comparision.
 * Allow extendability in future to extract more complex data. E.g: Get list of partners outside
 * of distance.
 *
 * @param partners
 * @param centralLocation
 * @param maxDistance {number} in kilometer
 * @constructor
 */
function PartnerMatcher(partners, centralLocation, maxDistance) {
  this.partners = partners;
  this.maxDistance = maxDistance;

  // Convert provided centralLocation value from string with degree value into
  // json object with radians value.
  this.centralLocation = _standadizeCoordinate(centralLocation);
}

/**
 * Get list of partners having offices within max distance.
 * @returns {Array} Result with new key "matchedLocations" to each array item
 */
PartnerMatcher.prototype.getPartnersWithinDistance = function() {
  let matchedPartners = [];
  this.partners.forEach(partner => {
    const matchedOffices = partner.offices.filter(office =>
      _isWithinDistance(
        _standadizeCoordinate(office.coordinates),
        this.centralLocation,
        this.maxDistance
      )
    );
    if (matchedOffices.length > 0) {
      // Clone new object with extra field "matchedOffices" and put into result array.
      matchedPartners.push(Object.assign({}, partner, { matchedOffices }));
    }
  });
  return matchedPartners;
};

module.exports = PartnerMatcher;
