const test = require("node:test");
const assert = require("node:assert/strict");

const { genderVerification, isValidVotingWindow } = require("./index");

test("genderVerification accepts the supported normalized values", () => {
  assert.equal(genderVerification("male"), true);
  assert.equal(genderVerification("FEMALE"), true);
  assert.equal(genderVerification("others"), true);
});

test("genderVerification rejects missing and unsupported values", () => {
  assert.equal(genderVerification(undefined), false);
  assert.equal(genderVerification("unknown"), false);
});

test("isValidVotingWindow requires a positive duration below 24 hours", () => {
  assert.equal(isValidVotingWindow(100, 200), true);
  assert.equal(isValidVotingWindow(100, 100), false);
  assert.equal(isValidVotingWindow(200, 100), false);
  assert.equal(isValidVotingWindow(0, 86400), false);
  assert.equal(isValidVotingWindow(undefined, 100), false);
});
