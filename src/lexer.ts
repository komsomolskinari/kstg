import { State, stepLocation, e, Context } from './common';
import { NUL, BS, BEL, HT, LF, VT, FF, CR } from './tokens';

/**
 * Check next string, without step
 * @param s
 * @param str
 */
function nextIs(s: State, str: string): boolean {
    const actual = s.src.substr(s.ptr, str.length);
    return actual === str;
}

/**
 * Step if next string match
 * @param s
 * @param str
 */
function stepIf(s: State, str: string): boolean {
    if (nextIs(s, str)) {
        stepLocation(s, str.length);
        return true;
    } else return false;
}

/**
 * Get current character
 * @param s
 */
export function curChar(s: State): string {
    if (s.ptr > s.src.length) e(s, 'Current char Read over EOF');
    return s.src[s.ptr];
}

/**
 * Get next char
 * @param s
 */
function nextChar(s: State): string {
    if (s.ptr + 1 > s.src.length) e(s, 'Next char Read over EOF');
    return s.src[s.ptr + 1];
}

/**
 * Step to next character and return it
 * @param s
 */
export function stepChar(s: State): string {
    stepLocation(s, 1);
    return curChar(s);
}

function isSpace(str: string): boolean {
    if (str === undefined) return false;
    // Seems they supported it.
    else return str.match(/\p{Zs}/gu) !== null;
}

export function readAsterisk(s: State): boolean {
    return stepIf(s, '*');
}

export function readVerticalLine(s: State): boolean {
    return stepIf(s, '|');
}

export function readCommercialAt(s: State): boolean {
    return stepIf(s, '@');
}

export function readLeftSquareBracket(s: State): boolean {
    return stepIf(s, '[');
}

export function readEqualSign(s: State): boolean {
    return stepIf(s, '=');
}

export function readAsStringUntil(s: State, until: string | RegExp): string {
    let ret = '';

    const comp = // comparator, to support end when matched regex
        typeof until === 'string'
            ? (str: string): boolean => str !== until
            : (str: string): boolean =>
                  typeof str === 'string' ? str.match(until) === null : false;
    while (comp(curChar(s))) {
        ret += curChar(s);
        stepLocation(s);
    }
    return ret;
}

export function readSpaces(s: State): void {
    while (isSpace(curChar(s))) {
        stepLocation(s);
    }
}

export function readEscapeSequence(c: Context, s: State): string {
    if (!stepIf(s, '\\')) e(s, 'Expected Escape sequence:' + curChar(s));
    const ch = curChar(s);
    switch (ch) {
        case 'u':
            if (!c.unicodeEscape) e(s, '\\u support disabled');
            // JS Unicode mode
            // \uxxxx
            // \u{??????}
            const digit1 = stepChar(s);
            let cpStr = '';
            if (digit1 === '{') {
                do {
                    cpStr += stepChar(s);
                } while (curChar(s) !== '}');
                cpStr = cpStr.replace(/\}$/, '');
                stepChar(s);
            } else {
                cpStr += digit1;
                cpStr += stepChar(s);
                cpStr += stepChar(s);
                cpStr += stepChar(s);
                stepChar(s);
            }
            if (!cpStr.match(/^[0-9a-f]+$/i)) {
                e(s, 'Unexpected Unicode codepoint');
            }
            const cpNum = parseInt(cpStr, 16);
            return String.fromCodePoint(cpNum);
        case 'x':
            // TJS Unicode
            // \xu{1,4},max match
            let xStr = '';
            for (let p = 0; p < 4; p++) {
                let nch = nextChar(s);
                if (nch === undefined || !nch.match(/^[0-9a-f]+$/i)) break;
                xStr += nch;
                stepChar(s);
            }
            stepChar(s);
            const xNum = parseInt(xStr, 16);
            return String.fromCodePoint(xNum);
        default:
            const convMap: {
                [key: string]: string;
            } = {
                '0': NUL,
                a: BEL, // \a defined in TJS
                b: BS,
                f: FF,
                n: LF,
                r: CR,
                t: HT,
                v: VT
            };
            const mch = convMap[ch];
            stepChar(s);
            if (mch === undefined) {
                return ch;
            } else return mch;
    }
}

export function readQuotedString(c: Context, s: State): string {
    const q = curChar(s);
    if (q !== '"' && q !== "'") {
        e(s, 'Unexpected quote char, actual:' + q);
    }
    stepIf(s, q);
    let r = '';
    outerLoop: while (1) {
        switch (curChar(s)) {
            case '\\':
                const es = readEscapeSequence(c, s);
                r += es;
                break;
            case q:
                break outerLoop;
            case '\r':
            case '\n':
                e(s, 'newline is not allowed');
            default:
                r += curChar(s);
                stepChar(s);
                break;
        }
    }
    return r;
}
