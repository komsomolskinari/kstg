import { Context, State, addLocation, e, copyState } from './common';
import { Label, Command, CommandParameter, Identifier } from './kstree';
import {
    readNonQuoteString,
    readSpaces,
    curChar,
    readQuotedString,
    stepChar,
    eolAhead,
    readNewlines,
    stepIf
} from './lexer';
import { pZs, EOF, EOL } from './tokens';

export function parseIdentifier(
    c: Context,
    s: State,
    end: string | string[] = EOL
): Identifier {
    let s0 = copyState(s);
    const i: Identifier = {
        type: 'Identifier',
        name: readNonQuoteString(s, end)
    };
    return addLocation(c, s, s0, i) as Identifier;
}

export function parseLabel(c: Context, s: State): Label {
    let s0 = copyState(s);
    stepIf(s, '*');
    const name = parseIdentifier(
        c,
        s,
        ['|'].concat(c.noCommentLabel ? EOL : [])
    );
    /*const name = readNonQuoteString(
        s,
        ['|'].concat(c.noCommentLabel ? EOL : [])
    );*/
    const n: Label = {
        type: 'Label',
        name: name
    };
    if (stepIf(s, '|')) {
        n.comment = readNonQuoteString(s, EOL);
    }
    readNewlines(s);
    return addLocation(c, s, s0, n) as Label;
}

export function parseCommandParameter(c: Context, s: State): CommandParameter {
    let s0 = copyState(s);
    let key = readNonQuoteString(s, [']', '=', EOF].concat(pZs));
    readSpaces(s);
    let value: string | number | undefined = undefined;
    if (stepIf(s, '=')) {
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
    let s0 = copyState(s);
    let name = '';
    let param: CommandParameter[] = [];
    if (stepIf(s, '@')) {
        [name, param] = parseCommandContent(c, s);
        readNewlines(s);
    } else if (stepIf(s, '[')) {
        [name, param] = parseCommandContent(c, s);
        stepIf(s, ']');
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
