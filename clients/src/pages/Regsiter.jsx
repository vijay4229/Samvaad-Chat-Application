import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, validUser } from '../apis/auth';
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
        }
    };

    useEffect(() => {
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
            </div>
        </div>
    );
}

export default Register;