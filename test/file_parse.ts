/* Parse test/examples/*.ks, (done)
use test/examples/*-config.json if exist,
compare with test/example/*-expected.json if exist
TODO: WIP
*/
import { parse } from '../src/index';
import { readdirSync, readFileSync } from 'fs';

const exampleRoot = 'test/examples';
const f = readdirSync(exampleRoot);

f.forEach(n => {
    test(n, () => {
        const s = readFileSync(exampleRoot + '/' + n).toString();
        expect(() => parse(s)).not.toThrow();
    });
});
