import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onClose, loading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            dueDate: ''
        }
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
            });
        } else {
            reset({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                dueDate: ''
            });
        }
    }, [task, reset]);

    return (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="card-plush w-full max-w-lg bg-white relative p-0 overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-8 pb-4">
                    <h2 className="text-3xl font-bold font-heading text-text-primary tracking-tight">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-bg-light rounded-full text-text-secondary hover:bg-zinc-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Title</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 chars' } })}
                            className="input-plush"
                            placeholder="Task title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows="3"
                            className="w-full bg-bg-light border border-accent rounded-[24px] px-6 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-black/5 resize-none transition-all placeholder:text-text-muted"
                            placeholder="Task details..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Priority</label>
                            <div className="relative">
                                <select
                                    {...register('priority')}
                                    className="input-plush appearance-none cursor-pointer"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Status</label>
                            <div className="relative">
                                <select
                                    {...register('status')}
                                    className="input-plush appearance-none cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2 ml-1">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="input-plush"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-accent/20">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-bg-light rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
