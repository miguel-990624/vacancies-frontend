import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Briefcase, User as UserIcon } from 'lucide-react';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <Briefcase size={24} />
                        <span>Vacancies</span>
                    </Link>

                    <nav className="nav-menu">
                        {user ? (
                            <>
                                <Link to="/" className="nav-item">Vacancies</Link>
                                {user.role === 'coder' && (
                                    <Link to="/my-applications" className="nav-item">My Applications</Link>
                                )}

                                <div className="user-menu">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <UserIcon size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-danger">
                                        <LogOut size={16} style={{ marginRight: '4px' }} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div>&copy; {new Date().getFullYear()} Vacancies Platform. All rights reserved.</div>
            </footer>
        </div>
    );
};
