import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Pages.css';

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function calcularIdade(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const mesAtual = hoje.getMonth() + 1;

  if (mesAtual < mes || (mesAtual === mes && hoje.getDate() < dia)) {
    idade--;
  }

  return idade;
}

function iniciais(nome, sobrenome) {
  return `${nome?.[0] ?? ''}${sobrenome?.[0] ?? ''}`.toUpperCase();
}

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      if (snap.exists()) {
        setUsuario(snap.data());
      } else {
        setErro('Dados do usuário não encontrados.');
      }
    });

    return unsubscribe;
  }, [navigate]);

  if (erro) {
    return (
      <div className="pagina">
        <p className="mensagem erro">{erro}</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="pagina">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <aside className="perfil">
        <div className="avatar">{iniciais(usuario.nome, usuario.sobrenome)}</div>
        <h2>{usuario.nome} {usuario.sobrenome}</h2>
        <p className="email">{usuario.email}</p>
        <button onClick={() => signOut(auth)}>Sair</button>
      </aside>

      <main className="conteudo">
        <h1>Olá, {usuario.nome}</h1>
        <p className="subtitulo">Estes são os dados da sua conta.</p>

        <section className="card">
          <h3>Dados pessoais</h3>
          <dl className="info">
            <div>
              <dt>Nome</dt>
              <dd>{usuario.nome}</dd>
            </div>
            <div>
              <dt>Sobrenome</dt>
              <dd>{usuario.sobrenome}</dd>
            </div>
            <div>
              <dt>Data de nascimento</dt>
              <dd>{formatarData(usuario.dataNascimento)}</dd>
            </div>
            <div>
              <dt>Idade</dt>
              <dd>{calcularIdade(usuario.dataNascimento)} anos</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}