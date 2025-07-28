import type {
  PluginFunction,
  Types,
} from "@graphql-codegen/plugin-helpers";
import {
  plugin as basePlugin,
  TsVisitor,
} from "@graphql-codegen/typescript";
import { FieldDefinitionNode, GraphQLSchema } from "graphql";

export const plugin: PluginFunction = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: any,
  info: any
) => {
  const originalFieldDefinition = TsVisitor.prototype.FieldDefinition;

  // Override FieldDefinition method
  TsVisitor.prototype.FieldDefinition = function (
    this: any,
    node: FieldDefinitionNode
  ) {
    if (
      node.directives?.some((d) => d.name.value === "customResolver")
    ) {
      return "";
    }
    return originalFieldDefinition.call(this, node);
  };

  const result = await basePlugin(schema, documents, config, info);

  // Restore the original method after generation
  TsVisitor.prototype.FieldDefinition = originalFieldDefinition;

  return result;
};
