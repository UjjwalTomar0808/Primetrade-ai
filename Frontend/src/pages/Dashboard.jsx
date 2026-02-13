import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Search, Filter, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Filters and Search
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const p = new URLSearchParams();
            if (search) p.append('search', search);
            if (statusFilter) p.append('status', statusFilter);
            if (priorityFilter) p.append('priority', priorityFilter);
            p.append('sortBy', sortBy);
            p.append('order', sortOrder);

            const response = await api.get(`/tasks?${p.toString()}`);
            if (response.data.success) {
                setTasks(response.data.data.tasks);
            }
        } catch (error) {
            toast.error('Failed to fetch tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, priorityFilter, sortBy, sortOrder]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchTasks]);

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await api.delete(`/tasks/${taskId}`);
            if (response.data.success) {
                toast.success('Task deleted successfully');
                fetchTasks();
            }
        } catch (error) {
            toast.error('Failed to delete task');
            console.error(error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
            if (response.data.success) {
                toast.success('Task status updated');
                fetchTasks();
            }
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        try {
            if (editingTask) {
                const response = await api.put(`/tasks/${editingTask._id}`, data);
                if (response.data.success) {
                    toast.success('Task updated successfully');
                }
            } else {
                const response = await api.post('/tasks', data);
                if (response.data.success) {
                    toast.success('Task created successfully');
                }
            }
            setShowTaskForm(false);
            fetchTasks();
        } catch (error) {
            const msg = error.response?.data?.message || 'Operation failed';
            toast.error(msg);
            console.error(error);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-6xl font-bold font-heading text-text-primary tracking-tight mb-2">My Tasks</h1>
                    <p className="text-text-secondary text-lg">Manage your tasks efficiently</p>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="btn-primary flex items-center gap-2 shadow-xl shadow-black/10"
                >
                    <Plus className="w-5 h-5" />
                    Add New Task
                </button>
            </div>

            <div className="card-plush p-4 md:p-6 space-y-4 bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-bg-light border border-accent rounded-full text-text-primary focus:ring-2 focus:ring-black/5 focus:outline-none transition-all placeholder:text-text-muted"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-10 py-3 bg-bg-light border border-accent rounded-full text-text-primary focus:ring-2 focus:ring-black/5 focus:outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="pl-10 pr-10 py-3 bg-bg-light border border-accent rounded-full text-text-primary focus:ring-2 focus:ring-black/5 focus:outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
                            >
                                <option value="">All Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="flex items-center bg-bg-light border border-accent rounded-full overflow-hidden p-1">
                            <button
                                onClick={() => setSortBy('createdAt')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'createdAt' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Sort by Date"
                            >
                                Date
                            </button>
                            <button
                                onClick={() => setSortBy('dueDate')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'dueDate' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Sort by Due Date"
                            >
                                Due
                            </button>
                        </div>

                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-2 bg-bg-light border border-accent rounded-full text-text-secondary hover:bg-white hover:text-text-primary transition-colors flex items-center justify-center w-12 h-12"
                            title={sortOrder === 'asc' ? "Ascending" : "Descending"}
                        >
                            {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="card-plush p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-accent/50 bg-bg-light/30">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No tasks found</h3>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        We couldn't find any tasks matching your current filters. Try adjusting your search or create a new task.
                    </p>
                    <button
                        onClick={handleCreateTask}
                        className="btn-primary"
                    >
                        Create a new task
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleFormSubmit}
                    onClose={() => setShowTaskForm(false)}
                    loading={formLoading}
                />
            )}
        </div>
    );
};

export default Dashboard;
