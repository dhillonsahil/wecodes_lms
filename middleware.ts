// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// // import { authMiddleware } from '@clerk/nextjs';

// const isDashboardRoute = createRouteMatcher(['/']);
// // const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
// const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// export default clerkMiddleware((auth, req) => {
//   // Restrict admin route to users with specific role
//   if (isAdminRoute(req)) auth().protect({ role: 'org:admin' });

//   // Restrict dashboard routes to signed in users
//   if (isDashboardRoute(req)) auth().protect();
  
// });



import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes :["/api/webhook","/api/uploadthing"]
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
