import { initState, initContext } from '../../src/common';
import { parseLabel } from '../../src/parser';

describe('parser - label', () => {
    test('basic', () => {
        var s = initState('*tag|cmt\r\n');
        const l = parseLabel(initContext(), s);
        expect(l).toEqual({
            type: 'Label',
            name: 'tag',
            comment: 'cmt',
            start: 0,
            end: 10,
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 0 },
                source: '*tag|cmt'
            }
        });
    });

    test('more comment', () => {
        var s = initState('*tag|cmt ; more');
        const l = parseLabel(initContext(), s);
        expect(l).toEqual({
            type: 'Label',
            name: 'tag',
            comment: 'cmt ; more',
            start: 0,
            end: 15,
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 15 },
                source: '*tag|cmt ; more'
            }
        });
    });

    test('twice', () => {
        var s = initState('*tag|cmt\r\n\r\n*tag2|cmt\r\n');
        let c = initContext();
        expect(parseLabel(c, s)).toEqual({
            type: 'Label',
            name: 'tag',
            comment: 'cmt',
            start: 0,
            end: 12,
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 3, column: 0 },
                source: '*tag|cmt'
            }
        });
        expect(parseLabel(c, s)).toEqual({
            type: 'Label',
            name: 'tag2',
            comment: 'cmt',
            start: 12,
            end: 23,
            loc: {
                start: { line: 3, column: 0 },
                end: { line: 4, column: 0 },
                source: '*tag2|cmt'
            }
        });
    });

    test('no comment', () => {
        var s = initState('*tag\n');
        const l = parseLabel(initContext(), s);
        expect(l).toEqual({
            type: 'Label',
            name: 'tag',
            start: 0,
            end: 5,
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 0 },
                source: '*tag'
            }
        });
    });

    test('no comment disabled', () => {
        var s = initState('*tag\n');
        expect(() =>
            parseLabel(initContext({ noCommentLabel: false }), s)
        ).toThrow();
    });
});
