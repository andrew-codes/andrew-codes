type ConfigurationValue = string | undefined

type ParserFunction<T> = (originalValue?: ConfigurationValue) => T

type ResolverOptions<T = string> = {
  label?: string | undefined
  parser: ParserFunction<T>
}

type ConfigurationResolver<
  DataSourceAccessorNamesByResolverKeys extends Record<string, string>,
> = {
  getValue: (
    key: keyof DataSourceAccessorNamesByResolverKeys,
    options?: ResolverOptions<ReturnType<ResolverOptions["parser"]>>,
  ) => {
    key: keyof DataSourceAccessorNamesByResolverKeys
    name: DataSourceAccessorNamesByResolverKeys[keyof DataSourceAccessorNamesByResolverKeys]
    value: ReturnType<ResolverOptions["parser"]>
    originalValue: string
  }
}

type CombinedResolverKeys<
  DataSourceResolvers extends ConfigurationResolver<any>[],
> = DataSourceResolvers[number] extends infer R
  ? R extends ConfigurationResolver<infer B>
    ? keyof B
    : never
  : never

type CombineResolvers<
  DataSourceResolvers extends ConfigurationResolver<any>[],
> = ConfigurationResolver<
  Record<CombinedResolverKeys<DataSourceResolvers>, string>
>

export type {
  CombineResolvers,
  ConfigurationResolver,
  ParserFunction,
  ResolverOptions,
}
