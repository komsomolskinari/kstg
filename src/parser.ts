import { Context, State, addLocation } from './common';
import { Label } from './kstree';
import { readAsterisk, readAsStringUntil, readVerticalLine } from './lexer';
export function parseLabel(c: Context, s: State): Label {
    let s0 = JSON.parse(JSON.stringify(s));
    readAsterisk(s);
    const name = readAsStringUntil(s, '|');
    const n: Label = {
        type: 'Label',
        name: name
    };
    if (readVerticalLine(s)) {
        n.comment = readAsStringUntil(s, /\r|\n/);
    }
    return addLocation(c, s, s0, n) as Label;
}
