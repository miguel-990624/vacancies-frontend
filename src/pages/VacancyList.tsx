import React, { useEffect, useState } from 'react';
import { client } from '../api/client';
import type { Vacancy, ApiResponse } from '../types';
import { VacancyCard } from '../components/VacancyCard';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const VacancyList: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyingId, setApplyingId] = useState<number | null>(null);
    const { user } = useAuth();
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const fetchVacancies = async () => {
        try {
            const res = await client.get<ApiResponse<Vacancy[]>>('/vacancies');
            setVacancies(res.data.data || []);
        } catch (err) {
            setError('Failed to load vacancies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies();
    }, []);

    const handleApply = async (id: number) => {
        if (!user) return;
        setApplyingId(id);
        setSuccessMsg('');
        setError('');
        try {
            await client.post('/applications', { vacancyId: id });
            setSuccessMsg('Application submitted successfully!');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to apply.';
            setError(msg);
        } finally {
            setApplyingId(null);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await client.put(`/vacancies/${id}/toggle`);
            fetchVacancies();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
        try {
            await client.delete(`/vacancies/${id}`);
            fetchVacancies();
        } catch (err) {
            alert('Failed to delete vacancy');
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/vacancies/edit/${id}`);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading vacancies...</div>;

    return (
        <div>
            <div className="section-between">
                <h1 className="page-title">Open Vacancies</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {!user && (
                        <Link to="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            Register to apply
                        </Link>
                    )}
                    {user && (user.role === 'admin' || user.role === 'gestor') && (
                        <Link to="/vacancies/new" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
                            <Plus size={16} />
                            Create Vacancy
                        </Link>
                    )}
                </div>
            </div>

            {successMsg && (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                    {successMsg}
                </div>
            )}

            {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                    {error}
                </div>
            )}

            {vacancies.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No vacancies available at the moment.</p>
            ) : (
                <div className="grid-list">
                    {vacancies.slice().reverse().map((v) => (
                        <VacancyCard
                            key={v.id}
                            vacancy={v}
                            onApply={handleApply}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            applying={applyingId === v.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
