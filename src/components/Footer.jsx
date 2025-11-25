import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid d-flex justify-content-between">
                <nav className="pull-left">
                    <ul className="nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/admindashboard">
                                Duty-Mangement
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admindashboard"> Help </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admindashboard"> Licenses </Link>
                        </li>
                    </ul>
                </nav>
                <div className="copyright">
                    {/* 2024, made with <i className="fa fa-heart heart text-danger"></i> by */}
                    <Link to="/admindashboard">Duty-Mangement</Link>
                </div>
                <div>
                    Distributed by
                    <Link to="/admindashboard">Duty-Mangement</Link>.
                </div>
            </div>
        </footer>
    )
}
