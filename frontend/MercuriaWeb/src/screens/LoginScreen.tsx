import React, { useState, useContext } from 'react';
import { AuthContext } from '../store/authContext';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login({ Nombre: username });
      signIn(data.usuario.Nombre);
      navigate('/');
    } catch (error: any) {
      console.log('Error de login:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BIENVENIDO</h1>
      <h2 style={styles.mercuriaTitle}>Mercuria</h2>
      <p style={styles.subtitle}>"Organizá tu negocio. Acelerá tus ventas."</p>
      
      <label style={styles.label}>Usuario:</label>
      <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
      
      <label style={styles.label}>Contraseña:</label>
      <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <button style={styles.button} onClick={handleLogin}>
        INGRESAR
      </button>
      
      <p style={styles.link}>Olvidaste tu contraseña?</p>
      <button style={styles.registerLink}>REGISTRATE</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    display: 'flex', flexDirection: 'column', justifyContent: 'center', 
    alignItems: 'center', height: '100vh', backgroundColor: '#ebe4e3', padding: '20px'
  },
  title: { fontSize: '20px', color: '#3a2c19', fontFamily: 'serif' },
  mercuriaTitle: { fontSize: '48px', color: '#3a2c19', fontFamily: 'serif', margin: '10px 0' },
  subtitle: { fontSize: '16px', color: '#6e5332', marginBottom: '20px', fontFamily: 'serif' },
  label: { alignSelf: 'flex-start', color: '#3a2c19', marginBottom: '5px' },
  input: { 
    width: '100%', maxWidth: '300px', height: '50px', borderColor: '#a58762', 
    borderWidth: '1px', borderStyle: 'solid', borderRadius: '25px', marginBottom: '15px', padding: '0 15px'
  },
  button: { 
    backgroundColor: '#6e5332', color: '#ebe4e3', padding: '15px', 
    width: '100%', maxWidth: '300px', borderRadius: '5px', border: 'none', cursor: 'pointer'
  },
  link: { color: '#3a2c19', marginTop: '10px' },
  registerLink: { color: '#6e5332', marginTop: '10px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }
};

export default LoginScreen;
