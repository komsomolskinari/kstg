import { State, stepLocation, e } from './common';

function expectStr(s: State, str: string): boolean {
    const actual = s.src.substr(s.ptr, str.length);
    if (actual === str) {
        stepLocation(s, str.length);
        return true;
    } else return false;
}

function curStr(s: State): string {
    if (s.ptr > s.src.length) e(s, 'Read over EOF');
    return s.src[s.ptr];
}

function isSpace(str: string): boolean {
    if (str === undefined) return false;
    // Seems they supported it.
    else return str.match(/\p{Zs}/gu) !== null;
}

export function readAsterisk(s: State): boolean {
    return expectStr(s, '*');
}

export function readVerticalLine(s: State): boolean {
    return expectStr(s, '|');
}

export function readAsStringUntil(s: State, until: string | RegExp): string {
    let ret = '';

    const comp = // comparator, to support end when matched regex
        typeof until === 'string'
            ? (str: string): boolean => str !== until
            : (str: string): boolean =>
                  typeof str === 'string' ? str.match(until) === null : false;
    while (comp(curStr(s))) {
        ret += curStr(s);
        stepLocation(s);
    }
    return ret;
}

export function readSpaces(s: State): void {
    while (isSpace(curStr(s))) {
        stepLocation(s);
    }
}
