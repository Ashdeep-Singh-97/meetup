import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Send the logout request
            const response = await fetch('http://localhost:3000/api/v1/logout', {
                method: 'POST',
                credentials: 'include', // Include credentials to remove the session cookie
            });

            if (response.ok) {
                // Navigate to the home route on successful logout
                navigate('/');
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-center">
                <button
                    onClick={handleLogout}
                    className="text-white font-semibold bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
