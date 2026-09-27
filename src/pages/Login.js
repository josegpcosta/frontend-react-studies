import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Pages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const sucesso = location.state?.mensagem;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/home');
    } catch {
      setErro('Usuário não cadastrado ou senha incorreta.');
    }
  }

  return (
    <div className="pagina">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button type="submit">Acessar</button>
      </form>
      {sucesso && !erro && <p className="mensagem sucesso">{sucesso}</p>}
      {erro && <p className="mensagem erro">{erro}</p>}
      <Link className="link" to="/cadastro">Criar conta</Link>
    </div>
  );
}