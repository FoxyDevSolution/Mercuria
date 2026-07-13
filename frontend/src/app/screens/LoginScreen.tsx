import React, { useState, useContext } from 'react';
import { AuthContext } from '../store/authContext';
import { login } from '../services/authService';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    try {
      // Usamos el backend configurado
      const data = await login({ Nombre: username });
      signIn(data.usuario.Nombre);
      onLoginSuccess(); // Esta función activará el estado en App.tsx
    } catch (error) {
      alert('Usuario no encontrado');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#ebe4e3] p-6">
      <h1 className="text-4xl font-serif text-[#3a2c19] mb-8">Mercuria</h1>
      <input 
        className="w-full max-w-xs p-3 border border-[#a58762] rounded-full mb-4"
        placeholder="Usuario" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <button 
        className="w-full max-w-xs bg-[#6e5332] text-[#ebe4e3] p-3 rounded font-bold" 
        onClick={handleLogin}
      >
        INGRESAR
      </button>
    </div>
  );
}
