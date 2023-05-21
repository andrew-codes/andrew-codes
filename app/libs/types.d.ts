type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never
type OmitLast<T extends any[]> = T extends [...infer R, any] ? R : never

export type { OmitFirst, OmitLast }
