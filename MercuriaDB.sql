-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS mercuria;
USE mercuria;

-- Tabla MateriaPrima
CREATE TABLE MateriaPrima (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(50),
    Color VARCHAR(30),
    Talle VARCHAR(10),
    CantidadStock INT,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Estampa
CREATE TABLE Estampa (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Descripcion TEXT,
    Stock INT,
    FechaCreacion DATE
);

-- Tabla ProductoVenta
CREATE TABLE ProductoVenta (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(50),
    PrecioVenta DECIMAL(10,2),
    CostoProduccion DECIMAL(10,2),
    StockVenta INT
);

-- Tabla ProductoEstampa (relaciona cada producto con una estampa usada)
CREATE TABLE ProductoEstampa (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    id_estampa INT,
    FOREIGN KEY (id_producto) REFERENCES ProductoVenta(ID),
    FOREIGN KEY (id_estampa) REFERENCES Estampa(ID)
);

-- Tabla AlertaStock
CREATE TABLE AlertaStock (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(50),
    NivelCriticoStock INT,
    FechaGeneracion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ProductoVentaID INT,
    MateriaPrimaID INT,
    FOREIGN KEY (ProductoVentaID) REFERENCES ProductoVenta(ID),
    FOREIGN KEY (MateriaPrimaID) REFERENCES MateriaPrima(ID)
);

-- Tabla intermedia MateriaPrimaProductoVenta
CREATE TABLE MateriaPrimaProductoVenta (
    ID_MaterialPrima INT,
    ID_ProductoVenta INT,
    CantidadUtilizada DECIMAL(10, 2),
    PRIMARY KEY (ID_MaterialPrima, ID_ProductoVenta),
    FOREIGN KEY (ID_MaterialPrima) REFERENCES MateriaPrima(ID),
    FOREIGN KEY (ID_ProductoVenta) REFERENCES ProductoVenta(ID)
);

-- Tabla Usuario
CREATE TABLE Usuario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Rol ENUM('Admin', 'Vendedor')
);

-- Tabla Venta
CREATE TABLE Venta (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TipoVenta ENUM('Online', 'Presencial'),
    TotalVenta DECIMAL(10,2),
    UsuarioID INT,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(ID)
);

-- Tabla DetalleVenta
CREATE TABLE DetalleVenta (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_venta INT,
    ID_producto_venta INT,
    Cantidad_vendida INT,
    FechaVentaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_venta) REFERENCES Venta(ID),
    FOREIGN KEY (ID_producto_venta) REFERENCES ProductoVenta(ID)
);
