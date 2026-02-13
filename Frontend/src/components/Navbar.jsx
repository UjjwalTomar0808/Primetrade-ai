import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BarChart2, User, LogOut } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/stats', label: 'Analytics', icon: BarChart2 },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="bg-card-bg/80 backdrop-blur-md border-b border-accent/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-10">
                        <Link to="/" className="text-2xl font-bold font-heading text-text-primary flex items-center gap-2 tracking-tight">
                            <span className="bg-btn-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10">T</span>
                            TaskMaster
                        </Link>
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={clsx(
                                                'flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-btn-primary text-white shadow-md shadow-black/10'
                                                    : 'text-text-secondary hover:bg-bg-light hover:text-text-primary'
                                            )}
                                        >
                                            <Icon className={clsx("w-4 h-4 mr-2", isActive ? "text-white/90" : "text-current")} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-6">
                            <div className="text-text-secondary text-sm font-medium">
                                Welcome, <span className="text-text-primary">{user?.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
