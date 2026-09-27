import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import Home from './Home';

jest.mock('../firebase', () => ({ auth: {}, db: {} }));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<p>Página Login</p>} />
      </Routes>
    </MemoryRouter>
  );
}

test('shows user data loaded from Firestore', async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback({ uid: 'abc123' });
    return jest.fn();
  });
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({
      nome: 'José',
      sobrenome: 'Prendin',
      email: 'jose@teste.com',
      dataNascimento: '1990-05-10',
    }),
  });
  renderHome();

  expect(await screen.findByText('Olá, José')).toBeInTheDocument();
  expect(screen.getByText('10/05/1990')).toBeInTheDocument();
});

test('redirects to login when there is no authenticated user', async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null);
    return jest.fn();
  });
  renderHome();

  expect(await screen.findByText('Página Login')).toBeInTheDocument();
});