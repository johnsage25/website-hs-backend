import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '../../../server/createContext';
import { appRouterMain } from '../../../server/routers/_app';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouterMain,
  createContext:createContext
});