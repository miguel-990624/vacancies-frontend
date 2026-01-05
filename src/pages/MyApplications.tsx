import React, { useEffect, useState } from 'react';
import { client } from '../api/client';
import type { Application, ApiResponse } from '../types';
import { Link } from 'react-router-dom';

export const MyApplications: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await client.get<ApiResponse<Application[]>>('/applications/my');
                setApplications(res.data.data || []);
            } catch (err) {
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>;

    return (
        <div>
            <h1 className="page-title">My Applications</h1>

            {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>You haven't applied to any vacancies yet.</p>
                    <Link to="/" className="btn btn-primary">Browse Vacancies</Link>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {applications.map((app, index) => (
                            <li key={app.id} style={{ padding: '1.5rem', borderBottom: index < applications.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.25rem' }}>
                                            {app.vacancy?.title || 'Vacancy unavailable'}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {app.vacancy?.description}
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
