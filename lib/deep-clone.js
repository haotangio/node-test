function _isObject(value) {
  return !!value && (typeof value === 'object');
}

/**
 * Deep clone a javascript Object object or Array object.
 *
 * @param originalObj {Object} The original object
 * @returns {Object} Returns the deep-cloned object if originalObj
 */
function deepClone(originalObj) {
  if (!_isObject(originalObj)) {
    return originalObj;
  }

  // Clone object prototype.
  const clonedObj = Object.create(Object.getPrototypeOf(originalObj));

  // Clone enumerable and non-enumerable properties.
  let key, propDescriptor;
  const keys = Object.getOwnPropertyNames(originalObj);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    propDescriptor = Object.getOwnPropertyDescriptor(originalObj, key);

    // Deep clone Object-type properties and shallow clone other types.
    if (propDescriptor && _isObject(propDescriptor.value)) {
      propDescriptor.value = deepClone(propDescriptor.value);
    }

    Object.defineProperty(clonedObj, key, propDescriptor);
  }

  return clonedObj;
}

module.exports = deepClone;