import { Node } from './kstree';

export interface Context {
    loc?: boolean;
    range?: boolean;
}

export interface State {
    src: string; // source string
    ptr: number; // read pointer
    line: number;
    column: number;
}

export function initState(src: string): State {
    return {
        src: src,
        ptr: 0,
        line: 1,
        column: 0
    };
}

export function e(state: State, msg: string): never {
    throw new SyntaxError(`Error at (${state.line},${state.column}):` + msg);
}

export function addLocation(c: Context, s: State, s0: State, node: Node): Node {
    if (c.range) {
        node.start = s0.ptr;
        node.end = s.ptr;
    }
    if (c.loc) {
        node.loc = {
            start: {
                line: s0.line,
                column: s0.column
            },
            end: {
                line: s.line,
                column: s.column
            }
        };
        node.loc.source = s.src.substring(s0.ptr, s.ptr);
    }
    return node;
}

export function deleteLocation(node: Node): Node {
    delete node.start;
    delete node.end;
    delete node.loc;
    return node;
}

export function stepLocation(s: State, step = 1): void {
    const jumped = s.src.substr(s.ptr, step);
    const lines = jumped.split(/\r?\n|\n/g);
    s.line += lines.length - 1;
    if (lines.length > 1) s.column = 0;
    s.column += (lines.pop() || []).length;
    s.ptr++;
}
