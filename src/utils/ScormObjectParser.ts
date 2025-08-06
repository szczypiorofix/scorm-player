import type { Dictionary } from "../shared/types";

export function getStateKeyByDictionaryKey<T extends object, K extends keyof T>(state: T, key: K, objectMap: Dictionary): string {
    const targetStateKey = objectMap[key as keyof Dictionary];
    if (targetStateKey && targetStateKey in state) {
        return targetStateKey;
    }
    return '';
}

export function updateStateValueByKey<T extends object, K extends keyof T>(state: T, key: K, value: T[K], objectMap: Dictionary): T {
    const foundKey: string | undefined = getStateKeyByDictionaryKey(state, key, objectMap);
    if (foundKey) {
        return {
        ...state,
        [foundKey]: value,
    };
    }
    return {...state};
}
