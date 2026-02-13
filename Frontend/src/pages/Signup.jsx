import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await signup(data);
            if (result.success) {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="card-plush max-w-md w-full bg-white/80 backdrop-blur-xl border-white/50 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold font-heading text-text-primary mb-3">Create Account</h2>
                    <p className="text-text-secondary">Join TaskMaster today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="text"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                className="input-plush pl-12"
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="mt-2 ml-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="input-plush pl-12"
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && <p className="mt-2 ml-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className="input-plush pl-12"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="mt-2 ml-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex justify-center text-base"
                    >
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center bg-bg-light/50 py-4 rounded-[20px] -mx-4 -mb-4">
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-text-primary hover:text-text-secondary transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
