import { initContext, initState } from '../src/common';
import { parseCommand } from '../src/parser';

/* Just try to achieve 100% coverage*/

describe('other', () => {
    test('disable location data', () => {
        const r = parseCommand(
            initContext({ range: false, loc: false }),
            initState('[a]')
        );
        expect(r).not.toHaveProperty('loc');
        expect(r).not.toHaveProperty('start');
        expect(r).not.toHaveProperty('end');
    });
});
