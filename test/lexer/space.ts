import { readSpaces } from '../../src/lexer';
import { initState } from '../../src/common';

test('read space - end with eof', () => {
    let s = initState('    ');
    readSpaces(s);
    expect(s.ptr).toBe(4);
});

test('read space - end with token', () => {
    let s = initState('    aaa');
    readSpaces(s);
    expect(s.ptr).toBe(4);
});

test('read space - end with eol', () => {
    let s = initState('    \n');
    readSpaces(s);
    expect(s.ptr).toBe(4);
});

test('read space - tab', () => {
    let s = initState('    \t\n');
    readSpaces(s);
    expect(s.ptr).toBe(4);
});
