var Range = function (min, max) {
  this.min = min;
  this.max = max;
  this.length = max - min + 1;
};

/**
* Divide this range into sub-ranges and return
* the specified segment.  For range[1 - 12],
* getSegment(2, 3) -> range[5 - 8]
* getSegment(2, 4) -> range[4 - 6]
* @param {Number} segment the nth sub-range
* @param {Number} divisor how many segments to divide this range in to
* @return {Range}
*/
Range.prototype.getSegment = function (segment, divisor) {
  var segmentLength = this.length / divisor;
  var start = this.min + (segmentLength * (segment - 1));
  var end = start + segmentLength - 1;
  return new Range(start, end);
};

// ================================================
var assert = require('assert');
var range;
var segment;

range = new Range(1, 3);
segment = range.getSegment(2, 3);
assert.deepEqual(segment.length, 1, 'should return range of one');
assert.deepEqual(segment.min, 2, 'should equal 2');

range = new Range(1, 12);
segment = range.getSegment(2, 3);
assert.deepEqual(segment.length, 4, 'range should have length of 4');
assert.deepEqual(segment.min, 5, 'range should start with 5');
assert.deepEqual(segment.max, 8, 'range should end with 8');

segment = range.getSegment(2, 4);
assert.deepEqual(segment.length, 3, 'range should have length of 3');
assert.deepEqual(segment.min, 4, 'range should start with 4');
assert.deepEqual(segment.max, 6, 'range should end with 6');
