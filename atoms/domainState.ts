import { atom } from "recoil";

const domainState = atom({
  key: "textStates",
  default: { inner: [] },
});

export {domainState}