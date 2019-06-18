import { Context, State, addLocation, e } from './common';
import { Label, Command, CommandParameter } from './kstree';
import {
    readAsterisk,
    readNonQuoteString,
    readVerticalLine,
    readCommercialAt,
    readLeftSquareBracket,
    readSpaces,
    readEqualSign,
    curChar,
    readQuotedString,
    stepChar,
    eolAhead,
    readRightSquareBracket,
    readNewlines
} from './lexer';
import { pZs, EOF, EOL } from './tokens';
export function parseLabel(c: Context, s: State): Label {
    let s0 = JSON.parse(JSON.stringify(s));
    readAsterisk(s);
    const name = readNonQuoteString(
        s,
        ['|'].concat(c.noCommentLabel ? EOL : [])
    );
    const n: Label = {
        type: 'Label',
        name: name
    };
    if (readVerticalLine(s)) {
        n.comment = readNonQuoteString(s, EOL);
    }
    readNewlines(s);
    return addLocation(c, s, s0, n) as Label;
}

export function parseCommandParameter(c: Context, s: State): CommandParameter {
    let s0 = JSON.parse(JSON.stringify(s));
    let key = readNonQuoteString(s, [']', '=', EOF].concat(pZs));
    readSpaces(s);
    let value: string | number | undefined = undefined;
    if (readEqualSign(s)) {
        readSpaces(s);
        if (curChar(s) !== '"' && curChar(s) !== "'") {
            let rawValue = readNonQuoteString(s, [']', '='].concat(pZs));
            let intValue = parseInt(rawValue);
            value =
                isFinite(intValue) && rawValue.match(/^[0-9]+$/)
                    ? intValue
                    : rawValue;
        } else {
            value = readQuotedString(c, s);
            stepChar(s);
        }
    }

    let n: CommandParameter = {
        type: 'CommandParameter',
        name: key,
        value: value
    };
    return addLocation(c, s, s0, n) as CommandParameter;
}

function parseCommandContent(
    c: Context,
    s: State
): [string, CommandParameter[]] {
    const r: [string, CommandParameter[]] = ['', []];
    readSpaces(s);
    r[0] = readNonQuoteString(s, [']', ''].concat(pZs));

    readSpaces(s);
    while (!eolAhead(s) && curChar(s) !== ']') {
        r[1].push(parseCommandParameter(c, s));
        readSpaces(s);
    }
    return r;
}

export function parseCommand(c: Context, s: State): Command {
    let s0 = JSON.parse(JSON.stringify(s));
    let name = '';
    let param: CommandParameter[] = [];
    if (readCommercialAt(s)) {
        [name, param] = parseCommandContent(c, s);
        readNewlines(s);
    } else if (readLeftSquareBracket(s)) {
        [name, param] = parseCommandContent(c, s);
        readRightSquareBracket(s);
    } else {
        e(s, 'parseCommand fail');
    }
    const n: Command = {
        type: 'Command',
        name: name,
        parameters: param
    };
    return addLocation(c, s, s0, n) as Command;
}
