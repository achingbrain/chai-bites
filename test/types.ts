import * as chai from 'chai';
import chaiBytes from '..';

const { expect, assert } = chai.use(chaiBytes);
const buffer = Uint8Array.from([1, 2, 3]);

// Check `expect` behavior.
expect(buffer).to.equalBytes([1, 2, 3], 'what went wrong');
expect(buffer).to.equalBytes('010203');
expect(buffer).to.equalBytes(Uint8Array.from([1, 2, 3]));
// Check chaining
expect(buffer).to.not.equalBytes('0102');
buffer[2] += 1;
expect(buffer).to.have.lengthOf(3).and.equalBytes([1, 2, 4]);

// Check `assert` behavior.
buffer[2] -= 1;
assert.equalBytes(buffer, [1, 2, 3], 'some message');
assert.equalBytes(buffer, '010203');
assert.equalBytes(buffer, Uint8Array.from([1, 2, 3]));
