// PATH: src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './context/AuthContext';
import AccueilPage from './pages/AccueilPage';
import CataloguePage from './pages/CataloguePage';
import DetailFormationPage from './pages/DetailFormationPage';
import DashboardFormateurPage from './pages/DashboardFormateurPage';
import DashboardApprenantPage from './pages/DashboardApprenantPage';
import ApprendrePage from './pages/ApprendrePage';
import ProfilPage from './pages/ProfilPage';

function RoutePrivee({ children }) {
    const { estConnecte } = useAuth();
    return estConnecte() ? children : <Navigate to="/" />;
}
RoutePrivee.propTypes = { children: PropTypes.node.isRequired };

function RouteFormateur({ children }) {
    const { estFormateur } = useAuth();
    return estFormateur() ? children : <Navigate to="/" />;
}
RouteFormateur.propTypes = { children: PropTypes.node.isRequired };

function RouteApprenant({ children }) {
    const { estApprenant } = useAuth();
    return estApprenant() ? children : <Navigate to="/" />;
}
RouteApprenant.propTypes = { children: PropTypes.node.isRequired };

function AppRoutes() {
    return (
        <Routes>
            <Route path="/"              element={<AccueilPage />} />
            <Route path="/formations"    element={<CataloguePage />} />
            <Route path="/formation/:id" element={<DetailFormationPage />} />

            <Route path="/profil" element={
                <RoutePrivee><ProfilPage /></RoutePrivee>
            } />

            <Route path="/dashboard/formateur" element={
                <RoutePrivee><RouteFormateur><DashboardFormateurPage /></RouteFormateur></RoutePrivee>
            } />

            <Route path="/dashboard/apprenant" element={
                <RoutePrivee><RouteApprenant><DashboardApprenantPage /></RouteApprenant></RoutePrivee>
            } />

            <Route path="/apprendre/:id" element={
                <RoutePrivee><RouteApprenant><ApprendrePage /></RouteApprenant></RoutePrivee>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}