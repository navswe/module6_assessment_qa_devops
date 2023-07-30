const shuffle = require("../src/shuffle");
const bots = require("../src/botsData");

describe("shuffle should...", () => {
  // test 1:
  // In JEST.JS, we can use expect().toBeInstanceOf(Class) to check if an object is an instance of a class. In this case, .toBeInstanceOf(Array) can check if shuffle() function returns an array.
  test("shuffle function returns an array", () => {
    expect(shuffle()).toBeInstanceOf(Array);
  });
  //test 2:
  // JEST.JS checks for: expect(received).toEqual(expected)
  // bots is an object that contains an array of botsData declared above
  // toEqual() and expect.arrayContaining(array) can be used to test if the expected array is a matches the received array
  test("check that all the same items are in the original array", () => {
    expect(shuffle(bots)).toEqual(expect.arrayContaining(bots));
  });
  // test 3:
  // .toHaveLength() check that an object has a .length property and it is set to a certain numeric value. We set this numeric value to be the length of the original array 'bots'
  test("check that it returns an array of the same length as the argument sent in", () => {
    expect(shuffle(bots)).toHaveLength(bots.length);
  });
});
