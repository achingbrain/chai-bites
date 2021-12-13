/// <reference types="chai" />

declare global {
  namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      /**
       * Compares byte arrays on per-element basis.
       *
       * @param bytes Expected bytes encoded as a hex string or an array-like object
       *
       * @example
       *   expect(new Uint8Array([1, 2])).to.equalBytes([1, 2]);
       *   expect(new Uint8Array[65, 66, 67])).to.equalBytes('414243');
       */
      equalBytes(bytes?: string | ArrayLike<number>): Assertion;
    }

    interface Assert {
      /**
       * Compares byte arrays on per-element basis.
       *
       * @param buffer Actual byte buffer
       * @param bytes Expected bytes encoded as a hex string or an array-like object
       * @param msg Error message conforming to Chai spec
       *
       * @example
       *   Assert.equalBytes(new Uint8Array(3), [0, 0, 0]);
       *   Assert.equalBytes(new Uint8Array(2), '0000');
       */
      equalBytes(buffer?: Uint8Array, bytes?: string | ArrayLike<number>, msg?: string): void;
    }
  }
}

declare function chaiBytes(chai: any): any;
export = chaiBytes;
