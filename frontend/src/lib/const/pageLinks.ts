export type PageLink = {
  label: string;
  path: string;
};

export const pageLinks: PageLink[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Users',
    path: '/users',
  },
  {
    label: 'Create user',
    path: '/users/create',
  },
  {
    label: 'Vehicles',
    path: '/vehicles',
  },
];