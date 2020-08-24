/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { AuthChecker } from 'type-graphql'

export const customAuthChecker: AuthChecker<ExpressContext> = ({
  root,
  args,
  context,
  info,
}) => {
  // TODO
  return true
}

export default customAuthChecker
