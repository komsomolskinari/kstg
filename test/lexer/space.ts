import { readSpaces } from '../../src/lexer';
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
