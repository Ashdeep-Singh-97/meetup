import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [emailOrUsername, setEmailOrUsername] = useState(''); // Combined state for email or username
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://meetup-nxf4.vercel.app/api/v1/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: emailOrUsername,
                    password,
                    name: emailOrUsername,
                }),
                credentials: 'include'
            });
            

            const data = await response.json();
            if (response.ok) {
                // Handle successful sign-in (e.g., redirect or store user data)
                console.log('Sign In Success', data);
                navigate('/home'); // Redirect to the home page after successful sign-in
            } else {
                alert(data.error || 'Invalid credentials!');
            }
        } catch (error) {
            alert('Some error occurred. Please try again later.');
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-1/2">
            <input
                type="text"
                placeholder="Email or Username"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSignIn}
                className="w-full py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
            >
                Sign In
            </button>
        </div>
    );
}

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://meetup-nxf4.vercel.app/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name:username, email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                // Handle successful signup (e.g., redirect or show a success message)
                console.log('Sign Up Success', data);
                navigate('/home');
            } else {
                alert('Something went wrong!');
            }
        } catch (error) {
            alert('Some Error Occurred. Try Again Later');
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-1/2">
            <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSignUp}
                className="w-full py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
            >
                Sign Up
            </button>
        </div>
    );
}

function Landing() {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate('/home');
    };
    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex flex-col items-center justify-center space-y-6 p-8">
                {/* Top Section with absolute positioning and 50% width */}
                <div className="absolute top-20 w-1/2 flex flex-col items-center">
                    <div className="text-3xl font-bold">Meet Up</div>
                    <div className="text-center text-gray-800">Walk for your health</div> {/* Added subheading */}
                    <div className="text-center text-gray-800">(name: ibu, password: 123456)</div> {/* Added subheading */}

                    <div className="w-full h-[250px] flex items-end justify-center">
                        {isSigningUp ? <SignUp /> : <SignIn />}
                    </div>

                    <div
                        className="mt-4 text-center text-blue-500 cursor-pointer"
                        onClick={() => setIsSigningUp(!isSigningUp)}
                    >
                        {isSigningUp ? 'Click here to Sign In' : 'Click here to Sign Up'}
                    </div>

                    <div className="text-lg font-semibold my-4">OR</div>
                    <button
                    className="w-1/2 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={handleNavigation}
                    >
                        Go as guest
                    </button>
                    <div className="mt-10 text-center text-gray-800"> "What you aim at determines what you see"</div>
                    <div className="text-center text-gray-800"> Jordan Peterson</div>

                </div>
            </div>

            <div className="w-1/2 h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/walk.jpg')` }}
            ></div>

            {/* Bottom Section with absolute positioning */}
            <div className="absolute bottom-10 w-1/2 flex flex-col items-center justify-center space-y-4">
                <div className="text-center font-bold text-lg">
                    <span className="text-2xl flex items-center justify-center space-x-2">
                        <img src="/footstep.png" className="w-10 h-10" />
                        <span>Meet Up</span>
                    </span>
                </div>

                <div className="text-center flex items-center space-x-2">
                    <span>Aim</span>
                    <span className="text-xl">•</span>
                    <span>Move</span>
                    <span className="text-xl">•</span>
                    <span>Win</span>
                </div>
            </div>
        </div>
    );
}

export default Landing;
