import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { googleAuth, registerUser, validUser } from '../apis/auth';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { VscHubot } from "react-icons/vsc";

const defaultData = {
    firstname: "",
    lastname: "",
    email: "",
    password: ""
};

function Register() {
    const [formData, setFormData] = useState(defaultData);
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (formData.email.includes("@") && formData.password.length > 6 && formData.firstname && formData.lastname) {
            setIsLoading(true);
            const { data } = await registerUser(formData);
            if (data?.token) {
                localStorage.setItem("userToken", data.token);
                toast.success("Successfully Registered! 😍");
                setIsLoading(false);
                navigate("/chats");
            } else {
                setIsLoading(false);
                toast.error(data?.error || "Invalid Credentials!");
            }
        } else {
            setIsLoading(false);
            toast.warning("Please provide valid credentials!");
            setFormData({ ...formData, password: "" });
        }
    };

    const googleSuccess = async (res) => {
        if (res?.tokenId) {
            setIsLoading(true);
            const response = await googleAuth({ tokenId: res.tokenId });
            setIsLoading(false);
            if (response.data.token) {
                localStorage.setItem("userToken", response.data.token);
                navigate("/chats");
            }
        }
    };
    
    const googleFailure = (error) => {
        // This function is intentionally left empty for now
    };

    useEffect(() => {
        const initClient = () => {
             if (process.env.REACT_APP_GOOGLE_CLIENT_ID) {
                gapi.client.init({
                    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    scope: 'email'
                });
            }
        };
        gapi.load('client:auth2', initClient);
        
        const checkUser = async () => {
            const data = await validUser();
            if (data?.user) {
                navigate("/chats");
            }
        };
        checkUser();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-bkg-dark p-4 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-bkg-light rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <VscHubot className="text-accent" size={40} />
                        <h1 className="text-4xl font-bold text-text-primary">Create Account</h1>
                    </div>
                     <p className="text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-accent hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleOnSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="flex gap-4">
                            <input name="firstname" type="text" required className="w-1/2 px-4 py-3 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition" placeholder="First Name" value={formData.firstname} onChange={handleOnChange} />
                            <input name="lastname" type="text" required className="w-1/2 px-4 py-3 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition" placeholder="Last Name" value={formData.lastname} onChange={handleOnChange} />
                        </div>
                        <input name="email" type="email" autoComplete="email" required className="w-full px-4 py-3 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition" placeholder="Email address" value={formData.email} onChange={handleOnChange} />
                        <div className="relative">
                            <input name="password" type={showPass ? "text" : "password"} autoComplete="new-password" required className="w-full px-4 py-3 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition" placeholder="Password" value={formData.password} onChange={handleOnChange} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showPass ? (
                                    <AiOutlineEye className="h-6 w-6 text-text-secondary cursor-pointer" onClick={() => setShowPass(false)} />
                                ) : (
                                    <AiOutlineEyeInvisible className="h-6 w-6 text-text-secondary cursor-pointer" onClick={() => setShowPass(true)} />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-accent hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-4 text-text-secondary">Or continue with</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    render={(renderProps) => (
                        <button 
                            onClick={renderProps.onClick} 
                            disabled={renderProps.disabled || isLoading} 
                            className="w-full flex items-center justify-center py-3 px-4 border border-border rounded-lg text-text-primary hover:bg-bkg-dark focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-border disabled:opacity-50 transition"
                        >
                             <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.464,44,28.756,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            Continue with Google
                        </button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    );
}

export default Register;