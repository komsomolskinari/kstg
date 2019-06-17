import { initState, initContext } from '../../src/common';
import { readQuotedString } from '../../src/lexer';

describe('quoted string', () => {
    test('double', () => {
        expect(readQuotedString(initContext(), initState(`"aws l"`))).toEqual(
            'aws l'
        );
    });

    test('single', () => {
        expect(readQuotedString(initContext(), initState(`'aws l'`))).toEqual(
            'aws l'
        );
    });

    test('mixed', () => {
        expect(
            readQuotedString(initContext(), initState(`"as'sss 'h"`))
        ).toEqual("as'sss 'h");
    });

    test('single escape', () => {
        expect(readQuotedString(initContext(), initState('"\\u4e00"'))).toEqual(
            '一'
        );
    });

    test('escaped', () => {
        const c = initContext();
        expect(readQuotedString(c, initState('"a\\"b"'))).toEqual('a"b');
        expect(readQuotedString(c, initState("'a\\\"b'"))).toEqual('a"b');
    });

    test('unicode escaped', () => {
        const c = initContext();
        expect(readQuotedString(c, initState('"a\\u4e00f"'))).toEqual('a一f');
        expect(readQuotedString(c, initState('"a\\x4e00f"'))).toEqual('a一f');
    });

    test('early eof should fail', () => {
        expect(() =>
            readQuotedString(initContext(), initState('"awsl'))
        ).toThrow();
    });

    test('crlf should fail', () => {
        expect(() =>
            readQuotedString(initContext(), initState('"awsl\n"'))
        ).toThrow();
    });

    test('invalid start should fail', () => {
        expect(() => readQuotedString(initContext(), initState('a'))).toThrow();
    });
});
