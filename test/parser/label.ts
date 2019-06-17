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
            end: 8,
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 8 },
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
});
