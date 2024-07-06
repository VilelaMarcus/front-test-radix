import { handleLogout } from '@auth0/nextjs-auth0';

export default handleLogout({
  returnTo: 'http://localhost:3000/',
});