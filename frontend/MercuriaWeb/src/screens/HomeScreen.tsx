import React from 'react';

const StatCard = ({ title, subtitle, percentage }: { title: string, subtitle: string, percentage: string }) => (
  <div style={styles.card}>
    <div style={styles.circle}><span style={styles.percentage}>{percentage}</span></div>
    <div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardSubtitle}>{subtitle}</p>
    </div>
  </div>
);

const HomeScreen = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Bienvenido de vuelta [Nombre]!</h1>
      <StatCard title="Producción" subtitle="MATERIA PRIMA Y CONTROL DE ESTAMPAS" percentage="50 %" />
      <StatCard title="Ventas" subtitle="ARTICULOS PARA LA VENTA, REGISTROS Y GANANCIAS" percentage="75 %" />
      <StatCard title="Inventario" subtitle="CONTROL DE STOCK Y ESTADISTICAS" percentage="30 %" />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', backgroundColor: '#cfb798', padding: '20px', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: '24px', color: '#3a2c19', fontFamily: 'serif', marginBottom: '30px' },
  card: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebe4e3', padding: '15px', borderRadius: '10px', marginBottom: '15px', width: '100%', maxWidth: '400px' },
  circle: { width: '60px', height: '60px', borderRadius: '30px', border: '5px solid #3a2c19', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px' },
  percentage: { fontSize: '14px', color: '#3a2c19' },
  cardTitle: { fontSize: '18px', color: '#3a2c19', margin: '0 0 5px 0' },
  cardSubtitle: { fontSize: '10px', color: '#6e5332', margin: 0 }
};

export default HomeScreen;
