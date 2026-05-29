# API Backend — Gestión de Usuarios · Examen Final Tecsup

API REST desarrollada en **Spring Boot 4 + JPA + PostgreSQL** para el CRUD de usuarios.

---

## Cambios agregados al proyecto original

El proyecto base solo traía `GET`, `POST` y `DELETE`. Se agregaron las siguientes modificaciones para completar el CRUD y permitir la conexión con el frontend React:

---

### 1. Endpoint `PUT /api/usuarios/{id}` — Actualizar usuario

**Archivos modificados en cadena (capa por capa):**

#### `persistencia/IUsuarioDAO.java`
Se agregó la firma del método en la interfaz:
```java
void ActualizarUsuario(long id, Usuario usuario);
```

#### `persistencia/Implementacion/UsuarioImplementacion.java`
Se agregó la implementación. Usa `setId(id)` para asignar la clave primaria y `save()` de JPA que hace upsert:
```java
@Override
public void ActualizarUsuario(long id, Usuario usuario) {
    usuario.setId(id);
    repositorio.save(usuario);
}
```

#### `servicio/IUsuarioServicio.java`
Se agregó la firma en la interfaz de servicio:
```java
void ActualizarUsuario(long id, Usuario usuario);
```

#### `servicio/Implementacion/UsuarioImplementacionServicio.java`
Se agregó la implementación con las mismas validaciones que `GuardarUsuario`:
```java
@Override
public void ActualizarUsuario(long id, Usuario usuario) {
    if (id == 0) throw new IllegalArgumentException("El Id debe ser mayor de 0");
    if (usuario.getNombre() == null || usuario.getNombre().isBlank())
        throw new IllegalArgumentException("El nombre del usuario es obligatorio.");
    if (usuario.getApellido() == null || usuario.getApellido().isBlank())
        throw new IllegalArgumentException("El apellido del usuario es obligatorio.");
    if (usuario.getEmail() == null || usuario.getEmail().isBlank())
        throw new IllegalArgumentException("El email del usuario es obligatorio.");
    if (usuario.getContrasena() == null || usuario.getContrasena().isBlank())
        throw new IllegalArgumentException("La contrasena del usuario es obligatoria.");
    persistencia.ActualizarUsuario(id, usuario);
}
```

#### `controlador/UsuarioControlador.java`
Se agregó el endpoint `PUT`:
```java
@PutMapping("/{id}")
public ResponseEntity<?> ActualizarUsuario(@PathVariable long id, @RequestBody Usuario usuario) {
    try {
        servicio.ActualizarUsuario(id, usuario);
        return ResponseEntity.ok("Usuario actualizado correctamente.");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

---

### 2. Configuración CORS — `config/CorsConfig.java` *(archivo nuevo)*

Permite que el frontend React en `localhost:5173` consuma la API sin ser bloqueado por el navegador:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:4173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

> Si el frontend se despliega en otra URL (Vercel, Netlify, etc.), agrega esa URL a `allowedOrigins`.

---

### 3. Base de datos local con Docker — `docker-compose.yml` *(archivo nuevo)*

El proyecto original apuntaba a una base de datos Neon (cloud). Se reemplazó por un contenedor PostgreSQL local para desarrollo:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: tecsup-postgres
    environment:
      POSTGRES_DB: tecsupdb
      POSTGRES_USER: tecsup
      POSTGRES_PASSWORD: tecsup123
    ports:
      - "5432:5432"
    volumes:
      - tecsup_data:/var/lib/postgresql/data

volumes:
  tecsup_data:
```

---

### 4. `application.properties` — Cambiado a BD local

| Propiedad | Antes (Neon cloud) | Después (Docker local) |
|---|---|---|
| `spring.datasource.url` | `jdbc:postgresql://ep-broad-...neon.tech/neondb` | `jdbc:postgresql://localhost:5432/tecsupdb` |
| `spring.datasource.username` | `neondb_owner` | `tecsup` |
| `spring.datasource.password` | `npg_l1fY4do...` | `tecsup123` |

Archivo actual:
```properties
spring.application.name=ExamenFinalTecsup

server.port=8081

# Conexion PostgreSQL - Docker local
spring.datasource.url=jdbc:postgresql://localhost:5432/tecsupdb
spring.datasource.username=tecsup
spring.datasource.password=tecsup123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## Endpoints disponibles (CRUD completo)

| Método | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| `GET` | `/api/usuarios` | Listar todos los usuarios | `200` + array JSON |
| `GET` | `/api/usuarios/{id}` | Obtener usuario por ID | `200` + objeto JSON |
| `POST` | `/api/usuarios` | Crear nuevo usuario | `201` + mensaje |
| `PUT` | `/api/usuarios/{id}` | Actualizar usuario *(agregado)* | `200` + mensaje |
| `DELETE` | `/api/usuarios/{id}` | Eliminar usuario | `200` + mensaje |

### Body para `POST` y `PUT`
```json
{
  "nombre":    "Juan",
  "apellido":  "Pérez",
  "email":     "juan.perez@gmail.com",
  "contrasena":"Clave123",
  "telefono":  "987654321",
  "activo":    true
}
```

---

## Cómo levantar el proyecto

### Requisitos
- Java 21
- Maven 3.9+
- Docker Desktop

### Pasos

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Compilar
mvn clean package -DskipTests

# 3. Ejecutar
java -jar target/ExamenFinalTecsup-0.0.1-SNAPSHOT.jar
```

La API queda disponible en `http://localhost:8081/api/usuarios`.

---

## Frontend relacionado

Repositorio del frontend: [g14-crud-usuarios-tecsup](https://github.com/Miguel-Sanchez241001/g14-crud-usuarios-tecsup)
