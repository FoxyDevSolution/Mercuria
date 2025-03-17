use mercuria;
-- Insertar datos en MateriaPrima
INSERT INTO MateriaPrima (Tipo, Color, Talle, CantidadStock)
VALUES ('Remera', 'Blanco', 'M', 100),
       ('Remera', 'Negro', 'L', 150);

-- Insertar datos en Estampa
INSERT INTO Estampa (Diseño, MetrosDisponibles, CantidadUtilizada)
VALUES ('Diseño A', 50.0, 0.0),
       ('Diseño B', 30.0, 0.0);

-- Insertar datos en ProductoVenta
INSERT INTO ProductoVenta (Tipo, PrecioVenta, CostoProduccion, StockVenta, EstampaID)
VALUES ('Remera Estampada', 25.0, 15.0, 50, 1),
       ('Taza Estampada', 10.0, 5.0, 100, 2);

-- Insertar datos en MateriaPrimaProductoVenta
INSERT INTO MateriaPrimaProductoVenta (ID_MaterialPrima, ID_ProductoVenta, CantidadUtilizada)
VALUES (1, 1, 1.0),  -- Remera blanca M usada en ProductoVenta 1
       (2, 1, 1.0);  -- Remera negra L usada en ProductoVenta 1

DESCRIBE AlertaStock;

-- Insertar datos en AlertaStock
INSERT INTO AlertaStock (Tipo, NivelCriticoStock, FechaGeneracion, ProductoVentaID, MateriaPrimaID)
VALUES ('Bajo stock', 10, NOW(), 1, NULL),  -- Alerta para ProductoVenta 1
       ('Bajo stock', 20, NOW(), NULL, 1);  -- Alerta para MateriaPrima 1
       
       
       
INSERT INTO AlertaStock (Tipo, NivelCriticoStock, FechaGeneracion, ProductoVentaID, MateriaPrimaID)
VALUES ('Bajo stock', 10, NOW(), 1, NULL),  -- Alerta para ProductoVenta 1
       ('Bajo stock', 20, NOW(), NULL, 1);  -- Alerta para MateriaPrima 1
       
       
       SELECT * FROM AlertaStock;
       
       SELECT * FROM AlertaStock
WHERE ProductoVentaID = 1;

SELECT * FROM AlertaStock
WHERE MateriaPrimaID = 1;
       
SELECT pv.ID AS ProductoVentaID, pv.Tipo AS Producto, mp.Tipo AS MateriaPrima
FROM ProductoVenta pv
JOIN MateriaPrimaProductoVenta mppv ON pv.ID = mppv.ID_ProductoVenta
JOIN MateriaPrima mp ON mppv.ID_MaterialPrima = mp.ID;