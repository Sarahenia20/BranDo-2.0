import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('userToken'); // Retrieve the token from local storage

  return token ? <Outlet /> : <Navigate to="/signup" />;
};

export default ProtectedRoute;
