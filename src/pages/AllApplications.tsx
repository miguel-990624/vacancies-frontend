import React, { useEffect, useState } from 'react';
import { client } from '../api/client';
import type { Application, ApiResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AllApplications: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchApplications = async () => {
            try {
                const res = await client.get<ApiResponse<Application[]>>('/applications');
                setApplications(res.data.data || []);
            } catch (err) {
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user, navigate]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading all applications...</div>;

    return (
        <div>
            <h1 className="page-title">All Applications (Admin)</h1>

            {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <p style={{ color: '#6b7280' }}>No applications found in the system.</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {applications.map((app, index) => (
                            <li key={app.id} style={{ padding: '1.5rem', borderBottom: index < applications.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                                            {app.vacancy?.title}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            Applicant: <span style={{ fontWeight: 500, color: '#374151' }}>{app.user?.name} ({app.user?.email})</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="badge badge-active">Applied</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
