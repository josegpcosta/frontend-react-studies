import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Login from './Login';

jest.mock('../firebase', () => ({ auth: {}, db: {} }));
jest.mock('firebase/auth', () => ({ signInWithEmailAndPassword: jest.fn() }));

function renderLogin() {
  render(
    <MemoryRouter initialEntries={['/']}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<p>Página Home</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function preencher() {
  userEvent.type(screen.getByLabelText('E-mail'), 'jose@teste.com');
  userEvent.type(screen.getByLabelText('Senha'), '123456');
  userEvent.click(screen.getByRole('button', { name: 'Acessar' }));
}

test('renders email, password and access button', () => {
  renderLogin();

  expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Acessar' })).toBeInTheDocument();
});

test('redirects to home when credentials are valid', async () => {
  signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'abc123' } });
  renderLogin();

  preencher();

  expect(await screen.findByText('Página Home')).toBeInTheDocument();
  expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'jose@teste.com', '123456');
});

test('shows error message when user is not registered', async () => {
  signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-credential' });
  renderLogin();

  preencher();

  expect(await screen.findByText('Usuário não cadastrado ou senha incorreta.')).toBeInTheDocument();
});