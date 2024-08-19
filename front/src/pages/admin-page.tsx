import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CharacterStatusEditor } from '@/components/characterStatus/statusEditor';
import { GridMap } from '@/components/gridMap/gridMap';

type PasswordInput = { password: string };

function AdminPage() {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const { register: registerPassword, handleSubmit: handleSubmitPassword } =
    useForm<PasswordInput>();
  const [errorPassword, setErrorPassword] = useState('');

  const onSubmitPassword = (data: { password: string }) => {
    if (data.password === 'mestregostoso123') {
      setShowPasswordPrompt(false);
    } else {
      setErrorPassword('Incorrect password. Please try again.');
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <input
            type="password"
            placeholder="Enter password"
            {...registerPassword('password')}
            className="border p-2 mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          {errorPassword && <div className="text-red-500">{errorPassword}</div>}
        </form>
        <Link to={`/`}>
          <span>Voltar</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-4xl font-extrabold">Mestre</h1>
          <Link to={`/`}>
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-y-8 p-4">
        <CharacterStatusEditor />
        <div className="flex flex-grow justify-center items-center pt-80 mt-32">
          <GridMap admin />
        </div>
      </div>
    </>
  );
}

export default AdminPage;
