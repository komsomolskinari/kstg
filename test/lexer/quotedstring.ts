import { initState } from '../../src/common';
import { readQuotedString } from '../../src/lexer';

describe('quoted string', () => {
    test('base - double', () => {
        let s = initState(`"asdfg hjkl"`);
        const r = readQuotedString(s);
        expect(r).toEqual('asdfg hjkl');
    });

    test('base - single', () => {
        let s = initState(`'asdfg hjkl'`);
        const r = readQuotedString(s);
        expect(r).toEqual('asdfg hjkl');
    });

    test('base - mixed', () => {
        let s = initState(`"asdfg'sss 'hjkl"`);
        const r = readQuotedString(s);
        expect(r).toEqual("asdfg'sss 'hjkl");
    });

    test('single escape', () => {
        expect(readQuotedString(initState('"\\u4e00"'))).toEqual('一');
    });

    test('base - escaped', () => {
        const lit = '"a\\"b"';
        let s = initState(lit);
        let ret = readQuotedString(s);
        console.log(lit, ret);
        expect(ret).toEqual('a"b');
    });

    test('base - escaped2', () => {
        const lit = "'a\\\"b'";
        let s = initState(lit);
        const r = readQuotedString(s);
        console.log(lit, r);
        expect(r).toEqual('a"b');
    });

    test('base - unicode escaped', () => {
        let s = initState('"a\\u4e00f"');
        const r = readQuotedString(s);
        expect(r).toEqual('a一f');
    });
});
