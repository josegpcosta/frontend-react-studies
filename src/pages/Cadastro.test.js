import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Cadastro from './Cadastro';

jest.mock('../firebase', () => ({ auth: {}, db: {} }));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

function renderCadastro() {
  render(
    <MemoryRouter initialEntries={['/cadastro']}>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<p>Página Login</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function preencher() {
  userEvent.type(screen.getByLabelText('E-mail'), 'jose@teste.com');
  userEvent.type(screen.getByLabelText('Senha'), '123456');
  userEvent.type(screen.getByLabelText('Nome'), 'José');
  userEvent.type(screen.getByLabelText('Sobrenome'), 'Prendin');
  fireEvent.change(screen.getByLabelText('Data de nascimento'), { target: { value: '1990-05-10' } });
  userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));
}

test('creates the user and saves profile data with the uid', async () => {
  createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: 'abc123' } });
  doc.mockReturnValue('docRef');
  setDoc.mockResolvedValue();
  signOut.mockResolvedValue();
  renderCadastro();

  preencher();

  expect(await screen.findByText('Página Login')).toBeInTheDocument();
  expect(doc).toHaveBeenCalledWith({}, 'usuarios', 'abc123');
  expect(setDoc).toHaveBeenCalledWith('docRef', {
    uid: 'abc123',
    email: 'jose@teste.com',
    nome: 'José',
    sobrenome: 'Prendin',
    dataNascimento: '1990-05-10',
  });
});

test('shows message when email is already registered', async () => {
  createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });
  renderCadastro();

  preencher();

  expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument();
  expect(setDoc).not.toHaveBeenCalled();
});