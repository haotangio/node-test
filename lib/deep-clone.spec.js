const assert = require('assert');
const deepClone = require('./deep-clone');

describe('deepClone()', () => {
  it('should clone object having primative properties', () => {
    const originalObj = { name: 'John' };
    const clonedObj = deepClone(originalObj);

    // Assertion
    assert.deepEqual(originalObj, clonedObj);

    originalObj.name = 'John1';
    assert.equal(originalObj.name, 'John1');
    assert.equal(clonedObj.name, 'John');
  });

  it('should clone nested Object-type properties', () => {
    const originalObj = {
      id: 1,
      profile: { name: 'John' }
    };
    const clonedObj = deepClone(originalObj);

    // Assertion
    assert.deepEqual(originalObj, clonedObj);

    originalObj.profile.name = 'John1';
    assert.equal(originalObj.profile.name, 'John1');
    assert.equal(clonedObj.profile.name, 'John');
  });

  it('should keep prototype methods', () => {
    function Student(name) {
      this.name = name;
    }
    Student.prototype.sayHello = function() {
      return `Hello ${ this.name }`;
    };
    const originalObj = new Student('John');
    let clonedObj = deepClone(originalObj);

    // Assertion
    assert.deepEqual(originalObj, clonedObj);
    clonedObj.name = 'Harry';
    assert.equal(originalObj.sayHello(), 'Hello John');
    assert.equal(clonedObj.sayHello(), 'Hello Harry');
  });

  it('should clone enumerable and non-enumerable properties', () => {
    const originalObj = { age: 18 };
    Object.defineProperty(originalObj, 'name', { value: 'John', enumerable: false });
    const clonedObj = deepClone(originalObj);

    // Assertion
    assert(clonedObj.name, 'John');
    assert(Object.keys(clonedObj), ['age']);
  });
});
