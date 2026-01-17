import { authService } from '../utils/auth.util';
import Navbar from '../components/Navbar';

const navbar = new Navbar();
navbar.render().then(element => {
    document.body.prepend(element);
    navbar.addLogoutListener(() => {
        authService.destroySession();
        window.location.href = '/';
    });
});
