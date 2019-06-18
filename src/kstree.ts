/* KAG Script Syntax Tree for JavaScript */
/* eslint-disable @typescript-eslint/class-name-casing*/
// This is same as ESTree
export interface _Node<T extends string> {
    type: T;
    loc?: SourceLocation | null;
    start?: number;
    end?: number;
}

export interface SourceLocation {
    start: Position;
    end: Position;
    source?: string;
}

export interface Position {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
}

export type Node = Script | Content | CommandParameter | Literal | Identifier;

export interface Script extends _Node<'Script'> {
    flavor: 'vanilla' | 'yuzusoft'; //  kag|kagex?
    contents: Content[];
}

// Keep comments in it for further extending
export type Content = Command | Text | Label | Comment;

export interface Command extends _Node<'Command'> {
    name: string; // zero length (or newline): crlf virtual command
    parameters: CommandParameter[];
    raw?: string | undefined;
}

export interface CommandParameter extends _Node<'CommandParameter'> {
    name: string;
    value: string | number | undefined; // undefined means no value used
}

export interface Text extends _Node<'Text'> {
    raw: string; // always keep raw string
    speaker?: TextSpeaker; // KAGEX only
}

export interface TextSpeaker extends _Node<'TextSpeaker'> {
    name: string;
    as: string;
}

export interface Label extends _Node<'Label'> {
    name: Identifier;
    comment?: string;
}

export interface Comment extends _Node<'Comment'> {
    raw: string;
}

export interface Identifier extends _Node<'Identifier'> {
    name: string;
}

export interface Literal extends _Node<'Literal'> {
    value: string | number | boolean;
}
