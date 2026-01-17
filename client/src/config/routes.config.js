export const ROUTE_TYPES = {
    ADMIN: 'admin',
    PROTECTED: 'protected',
    GUEST_ONLY: 'guest_only',
    NEUTRAL: 'neutral'
};

export const appRoutes = {
    '/': ROUTE_TYPES.NEUTRAL,
    '/login': ROUTE_TYPES.GUEST_ONLY,
    '/register': ROUTE_TYPES.GUEST_ONLY,
    '/reservation': ROUTE_TYPES.PROTECTED,
    '/dashboard': ROUTE_TYPES.ADMIN,
    '/reservation/details': ROUTE_TYPES.ADMIN,
    '/reservation/edit': ROUTE_TYPES.ADMIN
}