import { GraphQLSchema, defaultFieldResolver } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { ApolloError } from 'apollo-server-express'

export function userAuthDirective() {
 
  return schema =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: fieldConfig => {

        const directive = getDirective(schema, fieldConfig, "userAuth")

        if (directive) {

          const { resolve = defaultFieldResolver } = fieldConfig

          return {
            ...fieldConfig,
            resolve: async function (source, args, context, info) {
              if (context.isUserAuth == false) {

                throw new ApolloError("Unauthorized", 403);
              }

              return await resolve(source, args, context, info);
            }
          }
        }
      }
    })
}