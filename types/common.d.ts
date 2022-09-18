declare type Length<T extends any[]> = T extends { length: infer L } ? L : never
declare type BuildTuple<
  L extends number,
  T extends any[] = [],
  D = any
> = T extends { length: L } ? T : BuildTuple<L, [...T, D], D>

declare type DropFirstElement<T extends any[]> = T extends [
  infer drop,
  ...infer rest
]
  ? rest
  : []
