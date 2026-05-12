# Mercuria - Sistema de Gestión de Stock y Comercio

Inspirada en la agilidad y precisión de Hermes, _Mercuria_ es una plataforma integral diseñada para transformar la gestión de inventarios. 

Creada originalmente para optimizar la cadena de producción de **Artemis BRC** (especialistas en sublimación y estampados), el proyecto ha evolucionado para convertirse en una solución robusta y escalable para diversos rubros comerciales.

## Evolución del Proyecto
Mercuria nació como una solución basada en arquitecturas tradicionales, pero tras un proceso de redefinición estratégica, el proyecto se encuentra actualmente en una fase de modernización tecnológica.

Esta transición busca abandonar las limitaciones de los sistemas monolíticos para adoptar una arquitectura de monorepo que separa claramente la lógica de negocio del cliente final, permitiendo un rendimiento superior y una mayor facilidad en el mantenimiento a largo plazo.

### Nueva Arquitectura Técnica
Para cumplir con los estándares actuales de desarrollo, el sistema se está reconstruyendo bajo el siguiente stack:
- **Backend**: Developed with `FastAPI (Python)` , taking advantage of its speed and typing for an efficient API that manages inventory and production logic.
- **Frontend**: A modern cross-platform interface built on `React Native`, designed to deliver a seamless experience on both mobile and POS terminals.
- **Base de Datos**: Estructura relacional en `MySQL`, diseñada para el seguimiento detallado de materias primas, productos terminados y trazabilidad de insumos.