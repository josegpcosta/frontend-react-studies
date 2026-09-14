import { useState } from 'react';
import './Login.css';

const EMAIL_VALIDO = 'jgprendimcosta@gmail.com';
const SENHA_VALIDA = '123456';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [resultado, setResultado] = useState(null);

  function handleSubmit(evento) {
    evento.preventDefault();

    if (email === EMAIL_VALIDO && senha === SENHA_VALIDA) {
      setResultado('sucesso');
    } else {
      setResultado('erro');
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="*******"
          />
        </div>

        <button type="submit">Acessar</button>
      </form>

      {resultado === 'sucesso' && (
        <p className="mensagem sucesso">Acessado com sucesso!</p>
      )}

      {resultado === 'erro' && (
        <p className="mensagem erro">Usuario ou senha incorretos!</p>
      )}
    </div>
  );
}

export default Login;