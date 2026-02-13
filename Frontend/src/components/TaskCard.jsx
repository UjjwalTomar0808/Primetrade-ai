import { format } from 'date-fns';
import clsx from 'clsx';
import { Calendar, CheckCircle, Clock, AlertTriangle, Trash2, Edit2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const priorityColors = {
        low: 'bg-green-100 text-green-800 border-green-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
    };

    return (
        <div className="card-plush hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <h3 className={clsx("text-xl font-bold font-heading text-text-primary tracking-tight", task.completed && "line-through text-text-muted")}>
                    {task.title}
                </h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 bg-bg-light rounded-full text-text-secondary hover:text-btn-primary hover:bg-accent/30 transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 bg-bg-light rounded-full text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-text-secondary text-base mb-6 line-clamp-2 leading-relaxed">{task.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
                <span className={clsx('px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border', priorityColors[task.priority])}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className={clsx('px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider', statusColors[task.status])}>
                    {task.status.replace('-', ' ').toUpperCase()}
                </span>
            </div>

            <div className="flex items-center justify-between text-sm text-text-muted mt-auto pt-4 border-t border-accent/20">
                {task.dueDate && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(task.createdAt), 'MMM d')}</span>
                </div>
            </div>

            {!task.completed && (
                <button
                    onClick={() => onStatusChange(task._id, 'completed')}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-black/5 hover:bg-black/10 text-text-primary rounded-full transition-all group-hover:bg-btn-primary group-hover:text-white"
                >
                    <CheckCircle className="w-4 h-4" /> Mark as Completed
                </button>
            )}
        </div>
    );
};

export default TaskCard;
