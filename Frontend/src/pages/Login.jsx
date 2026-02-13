import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                navigate(from, { replace: true });
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
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="card-plush max-w-md w-full bg-white/80 backdrop-blur-xl border-white/50 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold font-heading text-text-primary mb-3">Welcome Back</h2>
                    <p className="text-text-secondary">Login to manage your tasks</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center bg-bg-light/50 py-4 rounded-[20px] -mx-4 -mb-4">
                    <p className="text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-text-primary hover:text-text-secondary transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
