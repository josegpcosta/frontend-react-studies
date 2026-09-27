import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Pages.css';

const mensagens = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
};

export default function Cadastro() {
  const [form, setForm] = useState({
    email: '',
    senha: '',
    nome: '',
    sobrenome: '',
    dataNascimento: '',
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.senha);

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        email: form.email,
        nome: form.nome,
        sobrenome: form.sobrenome,
        dataNascimento: form.dataNascimento,
      });

      await signOut(auth);
      navigate('/', { state: { mensagem: 'Cadastro realizado. Faça login para continuar.' } });
    } catch (err) {
      setErro(mensagens[err.code] || 'Não foi possível concluir o cadastro.');
    }
  }

  return (
    <div className="pagina">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" value={form.senha} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label htmlFor="sobrenome">Sobrenome</label>
          <input id="sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label htmlFor="dataNascimento">Data de nascimento</label>
          <input id="dataNascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} required />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p className="mensagem erro">{erro}</p>}
      <Link className="link" to="/">Já tenho conta</Link>
    </div>
  );
}