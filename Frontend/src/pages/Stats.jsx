import { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, CheckCircle, Clock, List, AlertTriangle } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/tasks/stats');
                if (response.data.success) {
                    setStats(response.data.data.stats);
                }
            } catch (error) {
                toast.error('Failed to fetch statistics');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!stats) return null;

    const statusData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                label: '# of Tasks',
                data: [stats.pending, stats.inProgress, stats.completed],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const priorityData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: '# of Tasks',
                data: [stats.lowPriority, stats.mediumPriority, stats.highPriority],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold font-heading text-text-primary">Analytics Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-plush p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider">Total Tasks</p>
                            <h3 className="text-4xl font-bold text-text-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-full">
                            <List className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="card-plush p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider">Completed</p>
                            <h3 className="text-4xl font-bold text-text-primary mt-1">{stats.completed}</h3>
                        </div>
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="card-plush p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider">Pending</p>
                            <h3 className="text-4xl font-bold text-text-primary mt-1">{stats.pending}</h3>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="card-plush p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider">High Priority</p>
                            <h3 className="text-4xl font-bold text-text-primary mt-1">{stats.highPriority}</h3>
                        </div>
                        <div className="bg-red-100 p-4 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-plush p-8">
                    <h3 className="text-2xl font-bold font-heading text-text-primary mb-6">Task Status Distribution</h3>
                    <div className="h-80 flex justify-center">
                        <Doughnut data={statusData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card-plush p-8">
                    <h3 className="text-2xl font-bold font-heading text-text-primary mb-6">Task Priority Breakdown</h3>
                    <div className="h-80">
                        <Bar
                            data={priorityData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { color: '#64748b', font: { family: 'Inter' } },
                                        grid: { color: '#e2e8f0', borderDash: [5, 5] },
                                        border: { display: false }
                                    },
                                    x: {
                                        ticks: { color: '#64748b', font: { family: 'Inter' } },
                                        grid: { display: false },
                                        border: { display: false }
                                    }
                                },
                                plugins: {
                                    legend: { display: false }
                                },
                                layout: {
                                    padding: { top: 10 }
                                },
                                elements: {
                                    bar: {
                                        borderRadius: 20,
                                        borderSkipped: false
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
