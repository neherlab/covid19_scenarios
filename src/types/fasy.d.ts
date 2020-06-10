export declare type PotentialPromise<T> = T | Promise<T>
export declare type MapperFn<I, O> = (value: I, idx: number, arr: I[]) => PotentialPromise<O>
export declare type EachFn<I> = MapperFn<I, any>
export declare type PredicateFn<I> = MapperFn<I, any>
export declare type ReducerFn<I, O> = (acc: O, v: I, idx: number, arr: I[]) => Promise<O>
export declare type Transducer<I, O> = (combinationFn: ReducerFn<I, O>) => ReducerFn<I, O>

export declare namespace serial {
  function forEach<I>(eachFn: EachFn<I>, arr?: I[]): Promise<void>
  function map<I, O>(mapperFn: MapperFn<I, O>, arr?: I[]): Promise<O[]>
  function flatMap<I, O>(mapperFn: MapperFn<I, O>, arr?: I[]): Promise<O[]>
  function filterIn<I>(predicateFn: PredicateFn<I>, arr?: I[]): Promise<I[]>
  function filterOut<I>(predicateFn: PredicateFn<I>, arr?: I[]): Promise<I[]>
  const filter: typeof filterIn
  function reduce<I, O>(reducerFn: ReducerFn<I, O>, initial: O, arr?: I[]): Promise<O>
  function reduceRight<I, O>(reducerFn: ReducerFn<I, O>, initial: O, arr?: I[]): Promise<O>
  function pipe(fns?: ((..._: any[]) => any)[]): (..._: any[]) => any
  function compose(fns?: ((..._: any[]) => any)[]): (..._: any[]) => any
}

export declare namespace concurrent {
  function forEach<I>(eachFn: EachFn<I>, arr?: I[]): Promise<void>
  function map<I, O>(mapperFn: MapperFn<I, O>, arr?: I[]): Promise<O[]>
  function flatMap<I, O>(mapperFn: MapperFn<I, O>, arr?: I[]): Promise<O[]>
  function filterIn<I>(predicateFn: PredicateFn<I>, arr?: I[]): Promise<I[]>
  function filterOut<I>(predicateFn: PredicateFn<I>, arr?: I[]): Promise<I[]>
  const filter: typeof filterIn
  const reduce: typeof serial.reduce
  const reduceRight: typeof serial.reduceRight
  const pipe: typeof serial.pipe
  const compose: typeof serial.compose
}

export declare namespace transducers {
  function filter<I, O>(predicateFn: PredicateFn<I>): (combinationFn: ReducerFn<I, O>) => ReducerFn<I, O>
  function map<I, O>(mapperFn: MapperFn<I, O>): (combinationFn: ReducerFn<I, O>) => ReducerFn<I, O>
  function transduce<I, O>(
    transducer: Transducer<I, O>,
    combinationFn: ReducerFn<I, O>,
    initialValue: O,
    arr?: I[],
  ): Promise<O>
  function into<I>(transducer: Transducer<I, I>, initialValue: I, arr?: I[]): Promise<I>
  function string(acc: string, v: string): string
  function number(acc: number, v: number): number
  function booleanAnd(acc: boolean, v: boolean): boolean
  function booleanOr(acc: boolean, v: boolean): boolean
  function array<I>(acc: I[], v: I): I[]
  function noop<I>(acc: I, v: I): I
}
