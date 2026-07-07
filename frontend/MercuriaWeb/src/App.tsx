import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './store/authContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useContext(AuthContext);
  if (isLoading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

const AppNavigator = () => {
  const { token, isLoading } = useContext(AuthContext);
  
  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!token ? <LoginScreen /> : <Navigate to="/" />} />
      <Route path="/" element={
        <ProtectedRoute>
          <HomeScreen />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
