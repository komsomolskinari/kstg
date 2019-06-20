import { Script } from './kstree';
import { initContext, initState } from './common';
import { parseScript } from './parser';

export function parse(src: string): Script {
    const c = initContext();
    const s = initState(src);

    const p = parseScript(c, s);
    return p;
}
