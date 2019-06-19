import { Context, State, addLocation, e, copyState } from './common';
import {
    Label,
    Command,
    CommandParameter,
    Identifier,
    Literal
} from './kstree';
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

export function parseLiteral(c: Context, s: State): Literal {
    const s0 = copyState(s);
    let value: string | number | boolean = '';
    if (curChar(s) !== '"' && curChar(s) !== "'") {
        let rawValue = readNonQuoteString(s, [']', '='].concat(pZs));
        let intValue = parseInt(rawValue);
        value =
            isFinite(intValue) && rawValue.match(/^[0-9]+$/) // only decimal
                ? intValue
                : rawValue;
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
    } else {
        value = readQuotedString(c, s);
        stepChar(s);
    }
    const n: Literal = {
        type: 'Literal',
        value: value
    };

    return addLocation(c, s, s0, n) as Literal;
}

export function parseCommandParameter(c: Context, s: State): CommandParameter {
    let s0 = copyState(s);
    let key = parseIdentifier(c, s, [']', '=', EOF].concat(pZs));
    readSpaces(s);
    let n: CommandParameter = {
        type: 'CommandParameter',
        name: key
    };
    if (stepIf(s, '=')) {
        readSpaces(s);
        n.value = parseLiteral(c, s);
    }

    return addLocation(c, s, s0, n) as CommandParameter;
}

function parseCommandContent(
    c: Context,
    s: State
): [Identifier, CommandParameter[]] {
    const r: CommandParameter[] = [];
    readSpaces(s);
    const i = parseIdentifier(c, s, [']', ''].concat(pZs));

    readSpaces(s);
    while (!eolAhead(s) && curChar(s) !== ']') {
        r.push(parseCommandParameter(c, s));
        readSpaces(s);
    }
    return [i, r];
}

export function parseCommand(c: Context, s: State): Command {
    let s0 = copyState(s);
    let name: Identifier = { type: 'Identifier', name: '' };
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
