import { readEscapeSequence } from '../../src/lexer';
import { initState } from '../../src/common';
import { ReverseSolidus, BEL, BS, HT, LF, VT, FF, CR } from '../../src/tokens';

describe('string escape', () => {
    test('check invalid', () => {
        expect(() =>
            readEscapeSequence(initState('must start with \\'))
        ).toThrow();
    });
    describe('u', () => {
        test('basic', () => {
            let s = initState(ReverseSolidus + 'u4e00');
            expect(readEscapeSequence(s)).toBe('一');
        });
        test('twice', () => {
            let s = initState(
                ReverseSolidus + 'u4e01' + ReverseSolidus + 'u4e00'
            );
            expect(readEscapeSequence(s)).toBe('丁');
            expect(readEscapeSequence(s)).toBe('一');
        });
        test('bracketed', () => {
            let s = initState(
                ReverseSolidus + 'u{4e01}' + ReverseSolidus + 'u{414}'
            );
            expect(readEscapeSequence(s)).toBe('丁');
            expect(readEscapeSequence(s)).toBe('Д');
        });

        test('non hex', () => {
            let s = initState(ReverseSolidus + 'u{4q}');
            expect(() => readEscapeSequence(s)).toThrow();
        });
        test('correct step', () => {
            const s = initState('\\u1234');
            readEscapeSequence(s);
            expect(s.ptr).toBe(6);
        });
    });
    describe('x', () => {
        test('basic', () => {
            let s = initState(ReverseSolidus + 'x4e00');
            expect(readEscapeSequence(s)).toBe('一');
        });

        test('twice', () => {
            let s = initState(
                ReverseSolidus + 'x4e01' + ReverseSolidus + 'x4e00'
            );
            expect(readEscapeSequence(s)).toBe('丁');
            expect(readEscapeSequence(s)).toBe('一');
        });
        test('limit digit', () => {
            let s = initState(ReverseSolidus + 'x4e0123456');
            expect(readEscapeSequence(s)).toBe('丁');
            expect(s.ptr).toBe(6);
        });

        test('early limit digit', () => {
            let s = initState(ReverseSolidus + 'x4e' + ReverseSolidus + 'x4ek');
            expect(readEscapeSequence(s)).toBe('N');
            expect(readEscapeSequence(s)).toBe('N');
            expect(s.ptr).toBe(8);
        });
        test('correct step', () => {
            const s = initState('\\x1234');
            readEscapeSequence(s);
            expect(s.ptr).toBe(6);
        });
    });

    describe('alpha', () => {
        test('normal', () => {
            expect(readEscapeSequence(initState('\\a'))).toBe(BEL);
            expect(readEscapeSequence(initState('\\b'))).toBe(BS);
            expect(readEscapeSequence(initState('\\t'))).toBe(HT);
            expect(readEscapeSequence(initState('\\n'))).toBe(LF);
            expect(readEscapeSequence(initState('\\v'))).toBe(VT);
            expect(readEscapeSequence(initState('\\f'))).toBe(FF);
            expect(readEscapeSequence(initState('\\r'))).toBe(CR);
        });

        test('special', () => {
            expect(readEscapeSequence(initState('\\0'))).toBe('\0');
            expect(readEscapeSequence(initState('\\"'))).toBe('"');
            expect(readEscapeSequence(initState("\\'"))).toBe("'");
            expect(readEscapeSequence(initState('\\\\'))).toBe('\\');
        });

        test('correct step', () => {
            const s = initState("\\'\\0");
            expect(readEscapeSequence(s)).toBe("'");
            expect(s.ptr).toBe(2);
            expect(readEscapeSequence(s)).toBe('\0');
            expect(s.ptr).toBe(4);
        });

        test("don't escape", () => {
            expect(readEscapeSequence(initState('\\江'))).toBe('江');
        });

        test('continuous', () => {
            const s = initState(ReverseSolidus.repeat(4));
            expect(readEscapeSequence(s)).toBe('\\');
            expect(readEscapeSequence(s)).toBe('\\');
        });
    });
});
