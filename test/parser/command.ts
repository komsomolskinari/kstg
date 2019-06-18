import { initState, initContext } from '../../src/common';
import { parseCommand } from '../../src/parser';

describe('parser - command', () => {
    describe('@', () => {
        test('basic, start with at', () => {
            const s = initState('@name');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [],
                start: 0,
                end: 5,
                loc: {
                    end: { column: 5, line: 1 },
                    source: '@name',
                    start: { column: 0, line: 1 }
                }
            });
        });

        test('one param', () => {
            const s = initState('@name p1');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [
                    {
                        type: 'CommandParameter',
                        name: 'p1',
                        value: undefined,
                        start: 6,
                        end: 8,
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 8 },
                            source: 'p1'
                        }
                    }
                ],
                start: 0,
                end: 8,
                loc: {
                    end: { column: 8, line: 1 },
                    source: '@name p1',
                    start: { column: 0, line: 1 }
                }
            });
        });

        test('some param', () => {
            const s = initState('@name p1 p2 = str p3');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [
                    {
                        type: 'CommandParameter',
                        name: 'p1',
                        value: undefined,
                        start: 6,
                        end: 9,
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 9 },
                            source: 'p1'
                        }
                    },
                    {
                        type: 'CommandParameter',
                        name: 'p2',
                        value: 'str',
                        start: 9,
                        end: 17,
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 17 },
                            source: 'p2 = str'
                        }
                    },
                    {
                        type: 'CommandParameter',
                        name: 'p3',
                        value: undefined,
                        start: 18,
                        end: 20,
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 20 },
                            source: 'p3'
                        }
                    }
                ],
                start: 0,
                end: 20,
                loc: {
                    end: { column: 20, line: 1 },
                    source: '@name p1 p2 = str p3',
                    start: { column: 0, line: 1 }
                }
            });
        });
    });
    describe('[]', () => {
        test('basic', () => {
            const s = initState('[name]');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [],
                start: 0,
                end: 6,
                loc: {
                    end: { column: 6, line: 1 },
                    source: '[name]',
                    start: { column: 0, line: 1 }
                }
            });
        });

        test('one param', () => {
            const s = initState('[  name p1]');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [
                    {
                        type: 'CommandParameter',
                        name: 'p1',
                        value: undefined,
                        start: 8,
                        end: 10,
                        loc: {
                            start: { line: 1, column: 8 },
                            end: { line: 1, column: 10 },
                            source: 'p1'
                        }
                    }
                ],
                start: 0,
                end: 11,
                loc: {
                    end: { column: 11, line: 1 },
                    source: '[  name p1]',
                    start: { column: 0, line: 1 }
                }
            });
        });

        test('some param', () => {
            const s = initState('[name p1 p2 = str p3 ]');
            const c = initContext();

            expect(parseCommand(c, s)).toEqual({
                type: 'Command',
                name: 'name',
                parameters: [
                    {
                        type: 'CommandParameter',
                        name: 'p1',
                        value: undefined,
                        start: 6,
                        end: 9,
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 9 },
                            source: 'p1'
                        }
                    },
                    {
                        type: 'CommandParameter',
                        name: 'p2',
                        value: 'str',
                        start: 9,
                        end: 17,
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 17 },
                            source: 'p2 = str'
                        }
                    },
                    {
                        type: 'CommandParameter',
                        name: 'p3',
                        value: undefined,
                        start: 18,
                        end: 21,
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 21 },
                            source: 'p3'
                        }
                    }
                ],
                start: 0,
                end: 22,
                loc: {
                    end: { column: 22, line: 1 },
                    source: '[name p1 p2 = str p3 ]',
                    start: { column: 0, line: 1 }
                }
            });
        });
    });

    test('unexpected start', () => {
        expect(() => parseCommand(initContext(), initState('aaa'))).toThrow();
    });
});
