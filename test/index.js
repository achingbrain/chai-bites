'use strict';
/* eslint-env node, mocha */

import * as chai from 'chai'
import bites from '../index.js'

chai.use(bites)

const expect = chai.expect;
const assert = chai.assert;

describe('chai-bytes', function () {
  it('should fail on Array input', function () {
    const array = [1, 2, 3, 4];
    expect(function () { expect(array).to.equalBytes('01020304'); }).to.throw(chai.AssertionError);
    expect(function () { expect(array).to.not.equalBytes('01020304'); }).to.throw(chai.AssertionError);
  });

  let name;
  const invalidInputs = {
    boolean: true,
    object: {},
    function: function () { },
    undefined: undefined,
    number: 123,
    string: 'abcdef'
  };
  for (name in invalidInputs) {
    (function (input) {
      it('should fail on ' + name + ' input', function () {
        expect(function () { expect(input).to.equalBytes(''); }).to.throw(chai.AssertionError);
        expect(function () { expect(input).to.not.equalBytes(''); }).to.throw(chai.AssertionError);
      });
    })(invalidInputs[name]);
  }

  const invalidExpectedValues = {
    boolean: true,
    object: {},
    number: 123
  };
  for (name in invalidExpectedValues) {
    (function (expected) {
      it('should fail on ' + name + ' expected value', function () {
        const input = new Uint8Array([1, 2, 3]);
        expect(function () { expect(input).to.equalBytes(expected); }).to.throw(TypeError, /equalBytes/);
        expect(function () { expect(input).to.not.equalBytes(expected); }).to.throw(TypeError, /equalBytes/);
      });
    })(invalidExpectedValues[name]);
  }

  it('should succeed with expected value stated as string', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes('01020304'); }).to.not.throw();
  });

  it('should fail with a different expected value stated as string', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes('01020305'); }).to.throw(chai.AssertionError);
  });

  it('should succeed with expected value stated as array', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes([1, 2, 3, 4]); }).to.not.throw();
  });

  it('should fail with a different expected value stated as array', function () {
    const buffer = new Uint8Array([1, 2, 3, 256]); // it's equal to [1, 2, 3, 0]
    expect(function () { expect(buffer).to.equalBytes([1, 2, 3, 256]); }).to.throw(chai.AssertionError);
  });

  it('should succeed with expected value stated as Uint8Array', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    const expected = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes(expected); }).to.not.throw();
  });

  it('should fail with a different expected value stated as Uint8Array', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    const expected = new Uint8Array([1, 2, 2, 4]);
    expect(function () { expect(buffer).to.equalBytes(expected); }).to.throw(chai.AssertionError);
  });

  it('should fail with a short expected value', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes('010203'); }).to.throw(chai.AssertionError);
  });

  it('should fail with a long expected value', function () {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(function () { expect(buffer).to.equalBytes('0102030405'); }).to.throw(chai.AssertionError);
  });

  it('should succeed with an empty buffer', function () {
    const buffer = new Uint8Array(0);
    expect(function () { expect(buffer).to.equalBytes(''); }).to.not.throw();
  });

  it('should properly decode hex string', function () {
    const buffer = new Uint8Array([0xab, 0xcd]);
    expect(function () { expect(buffer).to.equalBytes('abcd'); }).to.not.throw();
    expect(function () { expect(buffer).to.equalBytes('AbCd'); }).to.not.throw();
    expect(function () { expect(buffer).to.equalBytes('aBC0'); }).to.throw(chai.AssertionError);
  });

  [
    'abc',
    '?abc',
    'АБЦД',
    'abcd f'
  ].forEach(function (str) {
    it('should throw a TypeError for invalid hex string "' + str + '"', function () {
      const buffer = new Uint8Array([0xab, 0xcd]);
      expect(function () { expect(buffer).to.equalBytes(str); }).to.throw(TypeError, /invalid/i);
    });
  });

  it('should work with preceding negation', function () {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(function () { expect(buffer).to.not.equalBytes('c0ffee'); }).to.throw(chai.AssertionError);
    expect(function () { expect(buffer).to.not.equalBytes('deadbeef'); }).to.not.throw();
  });

  it('should be chainable', function () {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(function () {
      expect(buffer).to.equalBytes('c0ffee')
        .and.have.lengthOf(3);
    }).to.not.throw();
    expect(function () {
      expect(buffer).to.equalBytes('c0ffee')
        .and.have.lengthOf(2);
    }).to.throw(chai.AssertionError, /length/i);
  });

  it('should work with `assert`', function () {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(function () {
      assert.equalBytes(buffer, 'c0ffee');
    }).to.not.throw();

    expect(function () {
      assert.equalBytes(buffer, 'c0ff');
    }).to.throw(chai.AssertionError);
  });

  it('should work with `assert` with custom message', function () {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(function () {
      assert.equalBytes(buffer, 'c0ff', 'bottom text');
    }).to.throw(chai.AssertionError, 'bottom text');
  });

  describe('when Uint8Array.prototype.every is undefined', function () {
    const uint8ArrayEvery = Uint8Array.prototype.every;

    before(function () {
      // eslint-disable-next-line
      Uint8Array.prototype.every = undefined;
      expect(typeof Uint8Array.prototype.every).to.equal('undefined');
    });

    after(function () {
      // eslint-disable-next-line
      Uint8Array.prototype.every = uint8ArrayEvery;
    });

    it('should fail on non-matching arrays', function () {
      const buffer = new Uint8Array([1, 2, 3, 4]);
      expect(function () { expect(buffer).to.equalBytes('01020504'); }).to.throw(chai.AssertionError);
    });

    it('should succeed with expected value stated as string', function () {
      const buffer = new Uint8Array([1, 2, 3, 4]);
      expect(function () { expect(buffer).to.equalBytes('01020304'); }).to.not.throw();
    });
  });
});
