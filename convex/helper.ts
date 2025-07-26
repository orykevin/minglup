export function arraysHaveSameValues(a: string[], b: string[]) {
    return a.length === b.length &&
        [...a].sort().every((val, index) => [...b].sort()[index] === val);
}