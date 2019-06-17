import { readSpaces, eolAhead } from '../../src/lexer';
import { initState } from '../../src/common';
describe('lexer - space', () => {
    test('end with eof', () => {
        let s = initState('    ');
        readSpaces(s);
        expect(s.ptr).toBe(4);
    });

    test('end with token', () => {
        let s = initState('    aaa');
        readSpaces(s);
        expect(s.ptr).toBe(4);
    });

    test('end with eol', () => {
        let s = initState('    \n   ');
        readSpaces(s);
        expect(s.ptr).toBe(4);
    });

    test('tab is space', () => {
        let s = initState('    \t\n   ');
        readSpaces(s);
        expect(s.ptr).toBe(4);
    });
});

describe('eol', () => {
    test('eof is', () => {
        expect(eolAhead(initState(''))).toBe(true);
    });

    test('cr is', () => {
        expect(eolAhead(initState('\r'))).toBe(true);
    });
    test('lf is', () => {
        expect(eolAhead(initState('\n'))).toBe(true);
    });
    test('crlf is', () => {
        expect(eolAhead(initState('\r\n'))).toBe(true);
    });
    test('space not', () => {
        expect(eolAhead(initState('  '))).toBe(false);
    });
});
