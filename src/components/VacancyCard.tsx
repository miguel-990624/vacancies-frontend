import React from 'react';
import type { Vacancy } from '../types';
import { useAuth } from '../context/AuthContext';
import { Users, Pencil, Trash2, Power } from 'lucide-react';

interface VacancyCardProps {
    vacancy: Vacancy;
    onApply: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onToggle?: (id: number) => void;
    applying: boolean;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onApply, onEdit, onDelete, onToggle, applying }) => {
    const { user } = useAuth();
    const isCoder = user?.role === 'coder';
    const isAdminOrGestor = user?.role === 'admin' || user?.role === 'gestor';
    const isOpen = vacancy.isActive;

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <h3 className="card-title">{vacancy.title}</h3>
                    <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {vacancy.description}
                    </p>
                </div>
                <span className={`badge ${isOpen ? 'badge-active' : 'badge-inactive'}`}>
                    {isOpen ? 'Active' : 'Closed'}
                </span>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', color: '#4b5563', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={16} />
                    <span>Max: {vacancy.maxApplicants}</span>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                {isCoder && isOpen && (
                    <button
                        onClick={() => onApply(vacancy.id)}
                        disabled={applying}
                        className="btn btn-primary"
                    >
                        {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                )}

                {isAdminOrGestor && (
                    <>
                        <button
                            onClick={() => onToggle && onToggle(vacancy.id)}
                            className="btn btn-outline"
                            title={isOpen ? "Deactivate" : "Activate"}
                            style={{ padding: '0.5rem' }}
                        >
                            <Power size={18} color={isOpen ? "#ef4444" : "#166534"} />
                        </button>
                        <button
                            onClick={() => onEdit && onEdit(vacancy.id)}
                            className="btn btn-outline"
                            title="Edit"
                            style={{ padding: '0.5rem' }}
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(vacancy.id)}
                            className="btn btn-outline"
                            title="Delete"
                            style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#fee2e2' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                )}

                {/* Logic Fix: Show closed message to Coder if not open */}
                {isCoder && !isOpen && (
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af', alignSelf: 'center' }}>
                        Closed
                    </span>
                )}

                {/* Logic Fix: Show message to Guest */}
                {!user && (
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af', alignSelf: 'center' }}>
                        {!isOpen ? 'Closed' : 'Login to Apply'}
                    </span>
                )}
            </div>
        </div>
    );
};
