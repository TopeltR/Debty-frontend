export const fromArray = (array: []) => {
    const fns = {
        remove: (fromIndex: number, toIndex?: number) => {
            const rest = array.slice((toIndex || fromIndex) + 1 || array.length);
            // @ts-ignore
            array.length = Number(fromIndex < 0 ? array.length + fromIndex : fromIndex);
            return array.push.apply(array, rest);
        },
        removeElement(element: any, keyExtractor: (object: any) => any) {
            for (let i = 0; i < array.length; i++) {
                if (keyExtractor(array[i]) === keyExtractor(element)) {
                    fns.remove(i);
                }
            }
        },
    };
    return fns;
};

export default fromArray;
