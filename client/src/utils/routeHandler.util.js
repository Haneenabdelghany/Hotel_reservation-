import { authService } from "./auth.util";
import { appRoutes, ROUTE_TYPES } from "../config/routes.config";

export async function handleRouteAccess() {
    const currentPath = window.location.pathname;
    const routeType = appRoutes[currentPath] || ROUTE_TYPES.NEUTRAL;

    switch (routeType) {
        case ROUTE_TYPES.PROTECTED:
            return authService.protectRoute();

        case ROUTE_TYPES.ADMIN:
            return authService.protectAdminRoute();

        case ROUTE_TYPES.GUEST_ONLY:
            return authService.blockAuthenticated();

        case ROUTE_TYPES.NEUTRAL:
            return true;

        default:
            console.warn(`Unknown route type for path: ${currentPath}`);
            return true;
    }
}

// Initialize route protection on page load
document.addEventListener('DOMContentLoaded', async () => {
    await handleRouteAccess();
});