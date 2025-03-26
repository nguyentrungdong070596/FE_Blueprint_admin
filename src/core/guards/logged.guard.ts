import { CanActivateFn } from "@angular/router";

export const loggedGuard: CanActivateFn = (router, state) => {
  return true;
}
