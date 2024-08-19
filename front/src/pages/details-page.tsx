import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { HiIdentification } from 'react-icons/hi';
import { GiBullseye, GiDna1, GiSkills, GiSwordsEmblem } from 'react-icons/gi';
import { FaExchangeAlt } from 'react-icons/fa';

import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';

import { useQuery, useSubscription, useMutation } from '@apollo/client';
import {
  GET_CHARACTER,
  SUBSCRIBE_TO_CHARACTER_UPDATES,
  UPDATE_CHARACTER_INFO,
  TOOGLE_VISIBLE,
  EXCHANGE_EQUIPMENT,
} from '@/api/user/user-queries';
import { mountImagePath } from '../api/api';

import { Character, Proficiency, ImportantEvent } from '@/types/character';
import { AIMessageBox } from '@/components/messages/messages';

function calculateModifier(attributeValue: number) {
  return Math.floor((attributeValue - 10) / 2);
}

function calculateProficiencyBonus(level: number) {
  return Math.floor((level - 1) / 4 + 2);
}

function calculateProficiencyModifier(
  character: Character,
  proficiency: Proficiency,
) {
  let modifier = 0;

  switch (proficiency.ability) {
    case 'for':
      modifier = calculateModifier(character.attributes.for);
      break;
    case 'des':
      modifier = calculateModifier(character.attributes.des);
      break;
    case 'con':
      modifier = calculateModifier(character.attributes.con);
      break;
    case 'int':
      modifier = calculateModifier(character.attributes.int);
      break;
    case 'sab':
      modifier = calculateModifier(character.attributes.sab);
      break;
    case 'car':
      modifier = calculateModifier(character.attributes.car);
      break;
    default:
      modifier = 0;
      break;
  }

  const bonusProficiency = calculateProficiencyBonus(character.occupationLevel);
  if (proficiency.trained === true) {
    modifier += bonusProficiency;
  }
  return modifier;
}

function DetailsPage() {
  const { name } = useParams();

  const [character, setCharacter] = useState<Character | null>(null);
  const [story, setStory] = useState<string>();
  const [events, setEvents] = useState<ImportantEvent[]>();
  const [notes, setNotes] = useState<string>();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEquipmentName, setSelectedEquipmentName] = useState<
    string | null
  >(null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<
    string | null
  >(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null,
  );

  const handleEditCharacterStoryButton = () => {
    updateInformation({
      variables: {
        updateCharacterInfoInput: {
          id: character!.id,
          story: story,
        },
      },
    });
  };

  const handleEditCharacterEventsButton = () => {
    updateInformation({
      variables: {
        updateCharacterInfoInput: {
          id: character!.id,
          events: events,
        },
      },
    });
  };

  const handleEditCharacterNotesButton = () => {
    updateInformation({
      variables: {
        updateCharacterInfoInput: {
          id: character!.id,
          notes: notes,
        },
      },
    });
  };

  const handleSelectEquipmentButton = (type: string, equipment: string) => {
    setSelectedEquipmentType(type);
    setSelectedEquipmentName(equipment);
    setShowPopup(true);
  };

  const handleSelectCharacterButton = (character: string) => {
    setSelectedCharacter(character);
    setShowPopup(false);
  };

  // Character Management
  const { error, loading } = useQuery(GET_CHARACTER, {
    variables: { name: name },
    onCompleted: (data) => {
      setCharacter(data.character);
      setStory(data.character.story);
      setEvents(data.character.events);
      setNotes(data.character.notes);
    },
  });

  useSubscription(SUBSCRIBE_TO_CHARACTER_UPDATES, {
    skip: character === undefined || character == null,
    variables: {
      subscribeCharacterInput: {
        id: character?.id,
        name: name,
      },
    },
    onData: (option) =>
      setCharacter((prevCharacter) => ({
        ...prevCharacter,
        ...option.data.data.characterUpdated,
      })),
  });

  const [updateInformation] = useMutation(UPDATE_CHARACTER_INFO);
  const [toogleVisible] = useMutation(TOOGLE_VISIBLE);

  // Equipment Management
  const [exchangeEquipment] = useMutation(EXCHANGE_EQUIPMENT);

  useEffect(() => {
    if (selectedEquipmentType && selectedEquipmentName && selectedCharacter) {
      exchangeEquipment({
        variables: {
          exchangeEquipmentInput: {
            from: name,
            to: selectedCharacter,
            type: selectedEquipmentType,
            equipment: selectedEquipmentName,
          },
        },
      });
      setSelectedEquipmentType(null);
      setSelectedEquipmentName(null);
      setSelectedCharacter(null);
    }
  }, [
    character,
    exchangeEquipment,
    name,
    selectedCharacter,
    selectedEquipmentName,
    selectedEquipmentType,
  ]);

  if (loading || character == null) {
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

  let background = '';
  let buttonBackground = '';
  if (character.virus.name === 'Aerium') {
    background = 'bg-gradient-to-r from-gray-800/70 to-gray-500/20';
    buttonBackground = 'bg-gray-800/30 bg-opacity-40';
  } else if (character.virus.name === 'Ignium') {
    background = 'bg-gradient-to-r from-red-800/70 to-red-500/20';
    buttonBackground = 'bg-red-800/40 bg-opacity-40';
  } else if (character.virus.name === 'Geonium') {
    background = 'bg-gradient-to-r from-yellow-700/70 to-yellow-700/30';
    buttonBackground = 'bg-amber-800 bg-opacity-40';
  } else if (character.virus.name === 'Fluvium') {
    background = 'bg-gradient-to-r from-blue-900/70 to-blue-300/60';
    buttonBackground = 'bg-blue-900/40 bg-opacity-40';
  }

  if (character.inspiration === true) {
    background = 'bg-gradient-to-r from-yellow-200/90 to-yellow-100/10';
    buttonBackground = 'bg-yellow-300/50 bg-opacity-40';
  }

  return (
    <>
      <div className="flex flex-grow">
        <div className={background}>
          <div className="fixed bottom-0 w-full p-4 z-10">
            <ul className="flex justify-center">
              <li className={`mx-auto p-4 rounded-full ${buttonBackground}`}>
                <a href="#informacoes" className="hover:text-white-400">
                  <HiIdentification />
                </a>
              </li>
              <li className={`mx-auto p-4 rounded-full ${buttonBackground}`}>
                <a href="#vitimas" className="hover:text-white-400">
                  <GiBullseye />
                </a>
              </li>
              <li className={`mx-auto p-4 rounded-full ${buttonBackground}`}>
                <a href="#atributos" className="hover:text-white-400">
                  <GiSkills />
                </a>
              </li>
              <li className={`mx-auto p-4 rounded-full ${buttonBackground}`}>
                <a href="#virus" className="hover:text-white-400">
                  <GiDna1 />
                </a>
              </li>
              <li className={`mx-auto p-4 rounded-full ${buttonBackground}`}>
                <a href="#equipamento" className="hover:text-white-400">
                  <GiSwordsEmblem />
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-4xl font-extrabold">{character.name}</h1>
              <Link to={`/`} className="text-2xl">
                <span>Voltar</span>
              </Link>
            </div>
            <img
              className="h-[600px] w-[600px] mx-auto my-auto object-cover  object-center"
              src={mountImagePath(character.image)}
              alt={character.name}
            />
          </div>

          <div className="flex flex-col gap-y-8 p-4 pb-20">
            <fieldset className="border p-4">
              <legend id="informacoes">Informações</legend>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>{character.occupationName}</TableCell>
                    <TableCell className="text-right">
                      Nível {character.occupationLevel}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{character.virus.name}</TableCell>
                    <TableCell className="text-right">
                      Nível {character.virus.assimilation}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bônus de Proficiência</TableCell>
                    <TableCell className="text-right">
                      {calculateProficiencyBonus(character.occupationLevel)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>História</AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    <Textarea
                      placeholder="Escreva a história do personagem"
                      className="h-60"
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                    />
                    <Button
                      className="ml-auto mt-2"
                      onClick={() => handleEditCharacterStoryButton()}
                    >
                      Salvar
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Eventos Marcantes</AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    {events?.map((event, index) => (
                      <div key={event.event} className="flex flex-col">
                        {<a className="font-bold my-4">{event.event}</a>}
                        <Textarea
                          placeholder="Descreva como o personagem se sentiu"
                          className="h-40 overflow-hidden"
                          value={event.description}
                          onChange={(e) => {
                            const newEvents = events.map((ev, idx) =>
                              idx === index
                                ? { ...ev, description: e.target.value }
                                : ev,
                            );
                            setEvents(newEvents);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      className="ml-auto mt-3"
                      onClick={() => handleEditCharacterEventsButton()}
                    >
                      Salvar
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Anotações</AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    <Textarea
                      placeholder="Anote o que desejar"
                      className="h-60"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button
                      className="ml-auto mt-2"
                      onClick={() => handleEditCharacterNotesButton()}
                    >
                      Salvar
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Rumores</AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    <Textarea
                      className="h-60"
                      value={character.rumours ? character.rumours : ''}
                      readOnly
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AIMessageBox character={character} />
                </AccordionItem>
              </Accordion>
            </fieldset>

            <fieldset className="border p-4">
              <legend id="batalha">Batalha</legend>
              <div className="flex flex-col">
                <div className="flex justify-center items-center p-4 text-white bg-slate-600 w-16 h-8 rounded-lg mx-auto mb-4">
                  <Link to={`/battle/${name}`}>Entrar</Link>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p>1 Quadrado = 1.5 metros</p>
                  <p>Esconder status dos outros jogadores?</p>
                  <Input
                    className="mx-2 w-8"
                    defaultChecked={!character.visible}
                    type="checkbox"
                    onClick={() => {
                      toogleVisible({
                        variables: {
                          name: character.name,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4">
              <legend id="status">Status</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Máximo</TableHead>
                    <TableHead>Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Vida
                      <Progress
                        value={
                          (character.healthCurrent / character.healthMax) * 100
                        }
                        className="w-[200px] bg-red-800/20 dark:bg-red-50/20"
                        indicatorClassName="bg-red-800 dark:bg-red-50"
                      />
                    </TableCell>
                    <TableCell>{character.healthMax}</TableCell>
                    <TableCell>{character.healthCurrent}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Energia
                      <Progress
                        value={
                          (character.energyCurrent / character.energyMax) * 100
                        }
                        className="w-[200px] bg-sky-800/20 dark:bg-sky-50/20"
                        indicatorClassName="bg-sky-800 dark:bg-sky-50"
                      />
                    </TableCell>
                    <TableCell>{character.energyMax}</TableCell>
                    <TableCell>{character.energyCurrent}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Dados de Vida ({character.occupation?.healthDice})
                    </TableCell>
                    <TableCell>{character.occupationLevel}</TableCell>
                    <TableCell>{character.healthDicesCurrent}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Teste de Resistência</TableCell>
                    <TableCell>
                      {character.occupation?.resistanceTest}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Classe de Armadura</TableCell>
                    <TableCell>{character.armorClass}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </fieldset>

            {character.occupationName === 'Profeta' && (
              <fieldset className="border p-4">
                <legend id="seguidores">Seguidores</legend>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {character.followers?.map((follower) => (
                      <TableRow key={follower.type}>
                        <TableCell>{follower.type}</TableCell>
                        <TableCell className="text-right">
                          {follower.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </fieldset>
            )}

            {/* <fieldset className="border p-4">
              <legend id="vitimas">Vítimas</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raça</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.victims.map((victim) => (
                    <TableRow key={victim.race}>
                      <TableCell>{victim.race}</TableCell>
                      <TableCell className="text-right">
                        {victim.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </fieldset> */}

            <fieldset className="border p-4">
              <legend id="atributos">Atributos</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Atributo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Modificador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Força</TableCell>
                    <TableCell>{character.attributes.for}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.for)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Destreza</TableCell>
                    <TableCell>{character.attributes.des}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.des)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Constituição</TableCell>
                    <TableCell>{character.attributes.con}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.con)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inteligência</TableCell>
                    <TableCell>{character.attributes.int}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.int)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sabedoria</TableCell>
                    <TableCell>{character.attributes.sab}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.sab)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carisma</TableCell>
                    <TableCell>{character.attributes.car}</TableCell>
                    <TableCell className="text-right">
                      {calculateModifier(character.attributes.car)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </fieldset>

            <fieldset className="border p-4">
              <legend id="proficiencias">Proficiências</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Proficiência</TableHead>
                    <TableHead>Atributo Chave</TableHead>
                    <TableHead>Bônus</TableHead>
                    <TableHead className="text-right">Treino</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.proficiencies.map((proficiency) => (
                    <TableRow key={proficiency.name}>
                      <TableCell>{proficiency.name}</TableCell>
                      <TableCell>{proficiency.ability}</TableCell>
                      <TableCell>
                        {calculateProficiencyModifier(character, proficiency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {proficiency.trained ? 'Sim' : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </fieldset>

            <fieldset className="flex flex-col gap-y-4 border p-4">
              <legend id="virus">
                Vírus - {character.virus.name} - Nível{' '}
                {character.virus.assimilation}
              </legend>
              {/* <legend>Poderes</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poder</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.virus.powers.map((power, index) => (
                    <TableRow key={index}>
                      <TableCell>{power.name}</TableCell>
                      <TableCell className="text-right">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Detalhes</AccordionTrigger>
                            <AccordionContent>
                              {power.description
                                .split('\n')
                                .map((line, lineIndex) => (
                                  <Fragment key={lineIndex}>
                                    {line}
                                    <br />
                                  </Fragment>
                                ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
              <legend>Consequências</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Consequência</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.virus.consequences.map((consequence) => (
                    <TableRow key={consequence.name}>
                      <TableCell>{consequence.name}</TableCell>
                      <TableCell>{consequence.level}</TableCell>
                      <TableCell className="text-right">
                        {consequence.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <legend>Idioma</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Símbolo / Palavra</TableHead>
                    <TableHead className="text-right">Significado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.virus.languages.map((language) => (
                    <TableRow key={language.word}>
                      <TableCell>{language.word}</TableCell>
                      <TableCell className="text-right">
                        {language.meaning}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </fieldset>

            <fieldset className="border p-4">
              <legend id="ocupacao">
                Ocupação - {character.occupationName} - Nível{' '}
                {character.occupationLevel}
              </legend>
              <legend>Habilidades</legend>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Habilidade</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.occupation?.skills.map((skill) => (
                    <TableRow key={skill.name}>
                      <TableCell>{skill.name}</TableCell>
                      <TableCell>{skill.level}</TableCell>
                      <TableCell className="text-right">
                        {skill.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </fieldset>

            <fieldset className="flex flex-col gap-y-4 border p-4">
              <legend id="equipamento">Equipamento</legend>
              <legend>Armas</legend>
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[4px]"></TableHead>
                    <TableHead className="w-[60px]">Nome</TableHead>
                    <TableHead>Dano</TableHead>
                    <TableHead>Efeitos</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.equipment?.weapons.map((weapon) => (
                    <TableRow key={weapon.name}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            handleSelectEquipmentButton('weapons', weapon.name)
                          }
                        >
                          <FaExchangeAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{weapon.name}</TableCell>
                      <TableCell>
                        {weapon.damage.split(' ')[0]}{' '}
                        {weapon.damage.split(' ')[1].substring(0, 4)}
                      </TableCell>
                      <TableCell>{weapon.effects}</TableCell>
                      <TableCell>{weapon.value}</TableCell>
                      <TableCell className="text-right">
                        {weapon.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <legend>Armaduras</legend>
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[4px]"></TableHead>
                    <TableHead className="w-[60px]">Nome</TableHead>
                    <TableHead>Defesa</TableHead>
                    <TableHead>Efeitos</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.equipment?.armors.map((armor) => (
                    <TableRow key={armor.name}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            handleSelectEquipmentButton('armors', armor.name)
                          }
                        >
                          <FaExchangeAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{armor.name}</TableCell>
                      <TableCell>{armor.defense}</TableCell>
                      <TableCell>{armor.effects}</TableCell>
                      <TableCell>{armor.value}</TableCell>
                      <TableCell className="text-right">
                        {armor.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <legend>Itens</legend>
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[4px]"></TableHead>
                    <TableHead className="w-[60px]">Nome</TableHead>
                    <TableHead>Efeitos</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {character.equipment?.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            handleSelectEquipmentButton('items', item.name)
                          }
                        >
                          <FaExchangeAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.effects}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell className="text-right">
                        {item.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </fieldset>

            {/* {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-70 overflow-y-auto">
                <div className="flex flex-col items-center justify-center gap-y-5 py-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div
                      className="w-40 h-40 bg-center bg-cover rounded-full"
                      style={{
                        backgroundImage: `url(${mountImagePath('baigo.png')})`,
                      }}
                      onClick={() => handleSelectCharacterButton('Baigo')}
                    ></div>
                  </div>
                  <Button onClick={() => setShowPopup(false)}>Fechar</Button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsPage;
