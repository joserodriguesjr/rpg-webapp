import { GET_ALL_CHARACTERS } from '@/api/user/user-queries';
import { useQuery } from '@apollo/client';

import { mountImagePath } from '@/api/api';
import { Link } from 'react-router-dom';
import { Character } from '@/types/character';
import { useState } from 'react';

interface CharacterLinkProps {
  name: string;
  image: string;
  admin?: boolean;
}

const CharacterLink: React.FC<CharacterLinkProps> = ({
  name,
  image,
  admin,
}) => (
  <Link
    to={`${admin ? '/admin' : `/${name}`}`}
    className="link-item"
    style={{ backgroundImage: `url(${mountImagePath(image)})` }}
  >
    <span className="link-text">{name}</span>
    <div className="fade-overlay"></div>
  </Link>
);

function HomePage() {
  const [characters, setCharacters] = useState<Character[] | null>(null);

  const { error, loading } = useQuery(GET_ALL_CHARACTERS, {
    onCompleted: (data) => setCharacters(data.characters),
  });

  if (loading || characters == null) {
    return (
      <div className="flex flex-col items-center justify-between p-4">
        <div>Carregando...</div>
        <Link to={`/`}>
          <span>Voltar</span>
        </Link>
      </div>
    );
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className="bg-gradient-to-l from-slate-800/75 to-slate-800 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-y-5 py-5 pl-16">
        {characters.map((char) => (
          <CharacterLink key={char.name} name={char.name} image={char.image} />
        ))}
        {/* TODO - API USER MASTER ROLE */}
        <CharacterLink
          admin
          key={'Mestre'}
          name={'Mestre'}
          image={'mestre.png'}
        />
      </div>
    </div>
  );
}

export default HomePage;
