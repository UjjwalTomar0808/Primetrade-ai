import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';

const Security = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.put('/users/password', data);
            if (response.data.success) {
                toast.success('Password updated successfully');
                reset();
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update password';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-plush p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                    <Lock className="w-6 h-6 text-purple-600" />
                </div>
                Security
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Current Password</label>
                    <input
                        type="password"
                        {...register('currentPassword', { required: 'Current password is required' })}
                        className="input-plush"
                    />
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{errors.currentPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">New Password</label>
                    <input
                        type="password"
                        {...register('newPassword', {
                            required: 'New password is required',
                            minLength: { value: 6, message: 'Min 6 characters' }
                        })}
                        className="input-plush"
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{errors.newPassword.message}</p>}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 px-8"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Security;
