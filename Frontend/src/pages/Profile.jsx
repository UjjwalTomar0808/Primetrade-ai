import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import Security from '../components/Security';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email); // Read-only usually
            setValue('bio', user.bio || '');
            setValue('avatar', user.avatar || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.put('/users/profile', {
                name: data.name,
                bio: data.bio,
                avatar: data.avatar
            });

            if (response.data.success) {
                toast.success('Profile updated successfully');
                updateUser(response.data.data.user);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update profile';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-4xl font-bold font-heading text-text-primary">Profile Settings</h1>

            <div className="card-plush p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    Personal Information
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                    {/* Avatar URL Input */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Avatar URL</label>
                        <div className="flex gap-6 items-center">
                            {user?.avatar && (
                                <div className="relative">
                                    <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-[20px] object-cover border-4 border-white shadow-lg" />
                                    <div className="absolute inset-0 rounded-[20px] shadow-inner pointer-events-none"></div>
                                </div>
                            )}
                            <input
                                type="text"
                                {...register('avatar')}
                                className="input-plush flex-1"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            className="input-plush"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            disabled
                            className="w-full bg-black/5 border-transparent rounded-[100px] px-6 py-4 text-text-muted font-medium cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Bio</label>
                        <textarea
                            {...register('bio', { maxLength: { value: 200, message: 'Max 200 chars' } })}
                            rows="3"
                            className="w-full bg-bg-light border border-accent/20 rounded-[24px] px-6 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-black/5 resize-none transition-all placeholder:text-text-muted"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                        {errors.bio && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{errors.bio.message}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 px-8"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <Security />
        </div>
    );
};

export default Profile;
