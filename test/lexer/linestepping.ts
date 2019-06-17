import { stepLocation } from '../../src/lexer';
import { initState } from '../../src/common';

describe('line stepping', () => {
    test('dos', () => {
        const s = initState('\r\n1\r\n');
        expect(s.line).toBe(1);
        expect(s.column).toBe(0);
        stepLocation(s, 5);
        expect(s.line).toBe(3); // end of line 2 is start of line 3
        expect(s.column).toBe(0);
    });

    test('unix', () => {
        const s = initState('1\n1\n');
        expect(s.line).toBe(1);
        expect(s.column).toBe(0);
        stepLocation(s, 4);
        expect(s.line).toBe(3);
        expect(s.column).toBe(0);
    });

    test('mac', () => {
        // I don't believe there's still any old mac format text.
        // Neither in Kirikiri, nor in 2019, but test it for safe
        const s = initState('1\r1\r');
        expect(s.line).toBe(1);
        expect(s.column).toBe(0);
        stepLocation(s, 4);
        expect(s.line).toBe(3);
        expect(s.column).toBe(0);
    });

    test('mix', () => {
        const s = initState('\n\n\r\n\r\n\r\r');
        expect(s.line).toBe(1);
        expect(s.column).toBe(0);
        stepLocation(s, 8);
        expect(s.line).toBe(7);
        expect(s.column).toBe(0);
    });
});
