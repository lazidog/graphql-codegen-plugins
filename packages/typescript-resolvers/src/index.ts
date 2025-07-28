import type { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import { plugin as basePlugin } from "@graphql-codegen/typescript-resolvers";
import { filterSchema } from "@graphql-tools/utils";
import { GraphQLSchema } from "graphql";

export const plugin: PluginFunction = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: any,
  info: any,
) => {
  const newSchema = filterSchema({
    schema,
    fieldFilter: (typeName, fieldName, fieldConfig) => {
      if (typeName === "Query" || typeName === "Mutation") {
        return true;
      }
      return (
        fieldConfig.astNode?.directives?.some(
          (d) => d.name.value === "customResolver"
        ) ?? false
      );
    },
  });

  return basePlugin(newSchema, documents, config, info);
};
