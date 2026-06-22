-- Ejecuta estos comandos en tu terminal de MySQL (donde entraste con sudo mysql)
-- Esto creará un usuario específico para el proyecto y le dará permisos.

CREATE USER IF NOT EXISTS 'republica_dev'@'localhost' IDENTIFIED BY 'republica123';
GRANT ALL PRIVILEGES ON republicas_db.* TO 'republica_dev'@'localhost';
FLUSH PRIVILEGES;
