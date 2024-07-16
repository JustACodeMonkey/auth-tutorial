import authConfig from './auth.config';
import NextAuth from 'next-auth';
import {
  DEFAULT_URL_WHEN_LOGGED_IN,
  DEFAULT_URL_WHEN_NOT_LOGGED_IN,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from '@/routes';

const { auth } = NextAuth(authConfig);
 
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn  = !!req.auth;
  const path        = nextUrl.pathname;

  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isPublicRoute  = publicRoutes.includes(path);
  const isAuthRoute    = authRoutes.includes(path);

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_URL_WHEN_LOGGED_IN, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_URL_WHEN_NOT_LOGGED_IN, nextUrl));
  }
});
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
