import { initContext, initState } from '../../src/common';
import { parseCommandParameter } from '../../src/parser';

describe('parser - command parameter', () => {
    test('without value', () => {
        let c = initContext();
        let s = initState('t a');
        expect(parseCommandParameter(c, s)).toEqual({
            type: 'CommandParameter',
            name: {
                type: 'Identifier',
                name: 't',
                start: 0,
                end: 1,
                loc: {
                    start: { column: 0, line: 1 },
                    end: { column: 1, line: 1 },
                    source: 't'
                }
            },
            value: undefined,
            loc: {
                end: { column: 2, line: 1 },
                source: 't',
                start: { column: 0, line: 1 }
            },
            start: 0,
            end: 2
        });
    });

    test('with value', () => {
        let c = initContext();
        let s = initState('t = a123 ');
        expect(parseCommandParameter(c, s)).toEqual({
            type: 'CommandParameter',
            name: {
                type: 'Identifier',
                name: 't',
                start: 0,
                end: 1,
                loc: {
                    start: { column: 0, line: 1 },
                    end: { column: 1, line: 1 },
                    source: 't'
                }
            },
            value: 'a123',
            start: 0,
            end: 8,
            loc: {
                end: { column: 8, line: 1 },
                source: 't = a123',
                start: { column: 0, line: 1 }
            }
        });
    });

    test('quoted value', () => {
        let c = initContext();
        let s = initState('t = "123" ');
        expect(parseCommandParameter(c, s)).toEqual({
            type: 'CommandParameter',
            name: {
                type: 'Identifier',
                name: 't',
                start: 0,
                end: 1,
                loc: {
                    start: { column: 0, line: 1 },
                    end: { column: 1, line: 1 },
                    source: 't'
                }
            },
            value: '123',
            start: 0,
            end: 9,
            loc: {
                end: { column: 9, line: 1 },
                source: 't = "123"',
                start: { column: 0, line: 1 }
            }
        });
    });

    test('convert number', () => {
        let c = initContext();
        let s = initState('t = 123 ');
        expect(parseCommandParameter(c, s)).toEqual({
            type: 'CommandParameter',
            name: {
                type: 'Identifier',
                name: 't',
                start: 0,
                end: 1,
                loc: {
                    start: { column: 0, line: 1 },
                    end: { column: 1, line: 1 },
                    source: 't'
                }
            },
            value: 123,
            start: 0,
            end: 7,
            loc: {
                end: { column: 7, line: 1 },
                source: 't = 123',
                start: { column: 0, line: 1 }
            }
        });
    });

    test('equalsign without space', () => {
        let c = initContext();
        let s = initState('t=123 ');
        expect(parseCommandParameter(c, s)).toEqual({
            type: 'CommandParameter',
            name: {
                type: 'Identifier',
                name: 't',
                start: 0,
                end: 1,
                loc: {
                    start: { column: 0, line: 1 },
                    end: { column: 1, line: 1 },
                    source: 't'
                }
            },
            value: 123,
            start: 0,
            end: 5,
            loc: {
                end: { column: 5, line: 1 },
                source: 't=123',
                start: { column: 0, line: 1 }
            }
        });
    });
});
