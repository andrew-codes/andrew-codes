import type {
  ConfigurationResolver,
  ParserFunction,
  ResolverOptions,
} from "types"

type DefaultParsers = {
  returnTypeString: ParserFunction<string>
  returnTypeNumber: ParserFunction<number>
  returnTypeBoolean: ParserFunction<boolean>
}

const defaultParsers: DefaultParsers = {
  returnTypeString: (v) => v ?? "",
  returnTypeNumber: (v) => Number(v ?? 0),
  returnTypeBoolean: (v) => v?.toLowerCase() === "true",
}

const createEnvConfigResolver = <T extends Record<string, string>>(
  configDefinition: T,
): ConfigurationResolver<T> =>
  ({
    getValue: async (
      key: string,
      options: ResolverOptions = {
        parser: defaultParsers.returnTypeString,
      },
    ) => {
      const name = configDefinition[key]
      const originalValue = process.env[name]
      if (!originalValue || originalValue === undefined) {
        throw new Error(`Configuration value for ${key} is not defined`)
      }

      return {
        key,
        name,
        value: options.parser(originalValue),
        originalValue: originalValue,
      }
    },
  } as ConfigurationResolver<T>)

const envConfigurationDefintion = {
  internalPort: "INTERNAL_PORT",
  internalCommandToken: "INTERNAL_COMMAND_TOKEN",
  primaryRegion: "PRIMARY_REGION",
  fly: "FLY",
  litefsDir: "LITEFS_DIR",
  cacheDatabaseFilename: "CACHE_DATABASE_FILENAME",
  cacheDatabasePath: "CACHE_DATABASE_PATH",
  primaryHost: "PRIMARY_HOST",
  nodeEnv: "NODE_ENV",
  prNumber: "PR_NUMBER",
}

const configuration = createEnvConfigResolver(envConfigurationDefintion)

export default configuration
