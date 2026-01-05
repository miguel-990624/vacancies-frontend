import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { client } from '../api/client';
import type { Vacancy, ApiResponse } from '../types';
import { useAuth } from '../context/AuthContext';

export const SaveVacancy: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salaryRange: '',
        seniority: '',
        technologies: '',
        softSkills: '',
        modality: 'remote',
        maxApplicants: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            client.get<ApiResponse<Vacancy>>(`/vacancies/${id}`)
                .then(res => {
                    const v: any = res.data.data;
                    setFormData({
                        title: v.title,
                        description: v.description,
                        company: v.company || '',
                        location: v.location || '',
                        salaryRange: v.salaryRange || '',
                        seniority: v.seniority || '',
                        technologies: v.technologies || '',
                        softSkills: v.softSkills || '',
                        modality: v.modality || 'remote',
                        maxApplicants: v.maxApplicants
                    });
                })
                .catch(() => setError('Failed to load vacancy details.'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxApplicants' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await client.put(`/vacancies/${id}`, formData);
            } else {
                await client.post('/vacancies', formData);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'coder') {
        return <div style={{ padding: '2rem' }}>Access Denied</div>;
    }

    if (loading && isEdit && !formData.title) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <div className="auth-box" style={{ maxWidth: '800px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    {isEdit ? 'Edit Vacancy' : 'Create New Vacancy'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Title</label>
                        <input name="title" type="text" required className="input" value={formData.title} onChange={handleChange} />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Description</label>
                        <textarea name="description" required className="input" style={{ minHeight: '80px', resize: 'vertical' }} value={formData.description} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Company</label>
                        <input name="company" type="text" required className="input" value={formData.company} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Location</label>
                        <input name="location" type="text" required className="input" value={formData.location} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Modality</label>
                        <select name="modality" className="input" value={formData.modality} onChange={handleChange}>
                            <option value="remote">Remote</option>
                            <option value="onsite">On-site</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Salary Range</label>
                        <input name="salaryRange" type="text" required className="input" value={formData.salaryRange} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Seniority</label>
                        <input name="seniority" type="text" required className="input" value={formData.seniority} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Max Applicants</label>
                        <input name="maxApplicants" type="number" min="1" required className="input" value={formData.maxApplicants} onChange={handleChange} />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Technologies (comma separated)</label>
                        <input name="technologies" type="text" required className="input" value={formData.technologies} onChange={handleChange} />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Soft Skills</label>
                        <input name="softSkills" type="text" required className="input" value={formData.softSkills} onChange={handleChange} />
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem', gridColumn: 'span 2' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', gridColumn: 'span 2' }}>
                        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Vacancy'}</button>
                        <button type="button" onClick={() => navigate('/')} className="btn btn-outline">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
