import { useNavigate } from "react-router-dom";

function NotFound() {
    
    const navigate = useNavigate();

    const handleRedirect = () => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">

            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

            <p className="text-gray-600 text-lg mb-6">
                Oops! Page not found.
            </p>

            <button
                onClick={handleRedirect}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
                Go Back Home
            </button>

        </div>
    );
}

export default NotFound;
