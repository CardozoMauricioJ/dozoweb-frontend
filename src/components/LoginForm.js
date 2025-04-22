import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si estás usando React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'usernameOrEmail') {
      setUsernameOrEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Limpiar cualquier error previo

    try {
      const response = await fetch('https://localhost:7060/api/auth/login', { // Reemplaza '/api/auth/login' si tu ruta es diferente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.Token;
        // Guardar el token de forma segura (localStorage, sessionStorage, o un contexto/estado global)
        localStorage.setItem('authToken', token);
        // Redirigir al usuario a la página principal o a la página deseada después del login
        navigate('http://localhost:3000'); // Reemplaza '/dashboard' con tu ruta
        console.log('Inicio de sesión exitoso, token:', token);
      } else {
        const errorData = await response.json();
        setError(errorData.Message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
        console.error('Error al iniciar sesión:', errorData);
      }
    } catch (error) {
      setError('Error de conexión con el servidor.');
      console.error('Error de conexión:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Iniciar Sesión</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="usernameOrEmail" className="form-label">Nombre de usuario o Correo Electrónico</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    value={usernameOrEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;