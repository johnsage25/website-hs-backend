import { z } from "zod";
import { procedure, router } from "../trpc";
import { accountRouter } from "./accountRouter";
import { appRouter } from "./appRouter";
import { billingRouter } from "./billingRouter";
import { loginRouter } from "./loginRouter";
import { profileRouter } from "./profileRouter";
import { signupRouter } from "./signupRouter";
import { cartRouter } from "./cartRouter";
import { paymentRouter } from "./paymentRouter";
import { searchRouter } from "./searchRouter";
import { ordersRouter } from "./ordersRouter";
import { hostingPanelRouter } from "./hostingPanelRouter";
import { domainManagerRouter } from "./domainManagerRouter";
import { nodeRouter } from "./nodeRouter";
import { welcomeRouter } from "./welcomeRouter";
import { nodePaymentRouter } from "./nodePaymentRouter";


export const appRouterMain = router({
  app: appRouter,
  signup: signupRouter,
  billing: billingRouter,
  login: loginRouter,
  account: accountRouter,
  payment: paymentRouter,
  cart:cartRouter,
  profile: profileRouter,
  search:searchRouter,
  orders:ordersRouter,
  hostingpanel:hostingPanelRouter,
  domainManager: domainManagerRouter,
  node:nodeRouter,
  nodepayment:nodePaymentRouter,
  welcome: welcomeRouter
});

// export type definition of API
export type AppRouter = typeof appRouterMain;
