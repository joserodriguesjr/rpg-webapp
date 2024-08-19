import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  MASTER_GET_ALL_CHARACTERS,
  MASTER_UPDATE_CHARACTER_STATUS,
} from '@/api/master/master-queries';
import { useForm } from 'react-hook-form';
import { CharacterPartial } from '@/types/character';
import TableRowNumberInputWithButtons from './numberInput';
import { Inputs } from './types';

const CharacterStatusEditor: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterPartial[]>();
  const [openFormIndex, setOpenFormIndex] = useState<number | null>(null);
  const { register, handleSubmit, getValues, reset, setValue } =
    useForm<Inputs>();

  const [updateCharacter] = useMutation(MASTER_UPDATE_CHARACTER_STATUS);

  const { error, loading } = useQuery(MASTER_GET_ALL_CHARACTERS, {
    onCompleted: (data) => setCharacters(data.characters),
  });

  useEffect(() => {
    reset();
  }, [openFormIndex, reset]);

  const onSubmitValid = (data) => {
    // console.log(data);
  };

  const onSubmitInvalid = (data) => {
    alert('Dados estão incorretos');
  };

  const handleEditCharacter = (id: number) => {
    const formData = getValues();
    const numericData = {
      healthCurrent: parseInt(formData.healthCurrent),
      energyCurrent: parseInt(formData.energyCurrent),
      healthDicesCurrent: parseInt(formData.healthDicesCurrent),
    };

    if (!characters) {
      return;
    }

    const character: CharacterPartial = characters.find(
      (char) => char.id === id,
    )!;

    const newCharacter = {
      id: id,
      healthCurrent: isNaN(numericData.healthCurrent)
        ? character.healthCurrent
        : numericData.healthCurrent,
      energyCurrent: isNaN(numericData.energyCurrent)
        ? character.energyCurrent
        : numericData.energyCurrent,
      healthDicesCurrent: isNaN(numericData.healthDicesCurrent)
        ? character.healthDicesCurrent
        : numericData.healthDicesCurrent,
      inspiration: Boolean(formData.inspiration),
    };

    updateCharacter({
      variables: { updateCharacterStatusInput: newCharacter },
      onCompleted: (data) => {
        setCharacters((prevCharacters) => {
          if (!prevCharacters || !Array.isArray(prevCharacters)) {
            prevCharacters = [];
          }
          const updatedCharacterIndex = prevCharacters.findIndex(
            (character) => character.id === data.updateCharacterStatus.id,
          );
          if (updatedCharacterIndex !== -1) {
            const updatedCharacters = [...prevCharacters];
            updatedCharacters[updatedCharacterIndex] =
              data.updateCharacterStatus;
            return updatedCharacters;
          }
          // If the character is not found, simply return the previous state
          return prevCharacters;
        }),
          reset();
      },
    });
  };

  const getBackground = (char: CharacterPartial) => {
    if (char.inspiration) {
      return 'from-yellow-400/70 to-yellow-100/40';
    }
    if (char.virus.name === 'Aerium') {
      return 'bg-gradient-to-r from-gray-800/70 to-gray-500/20';
    } else if (char.virus.name === 'Ignium') {
      return 'bg-gradient-to-r from-red-800/70 to-red-500/20';
    } else if (char.virus.name === 'Geonium') {
      return 'bg-gradient-to-r from-yellow-700/70 to-yellow-700/30';
    } else if (char.virus.name === 'Fluvium') {
      return 'bg-gradient-to-r from-blue-900/70 to-blue-300/60';
    }
  };

  if (loading || characters == null) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <>
      {characters.map((char, index) => (
        <div key={char.name}>
          <fieldset
            className="border p-4"
            onClick={() =>
              index === openFormIndex
                ? setOpenFormIndex(null)
                : setOpenFormIndex(index)
            }
          >
            <legend
              className={`border p-2 bg-gradient-to-r ${getBackground(char)} `}
            >
              {char.name}
            </legend>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vida</TableHead>
                  <TableHead>Energia</TableHead>
                  <TableHead>DV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {char.healthCurrent}/{char.healthMax}
                  </TableCell>
                  <TableCell>
                    {char.energyCurrent}/{char.energyMax}
                  </TableCell>
                  <TableCell>
                    {char.healthDicesCurrent}/{char.occupationLevel}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </fieldset>
          {openFormIndex === index && (
            <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
              <Table>
                <TableBody>
                  <TableRowNumberInputWithButtons
                    placeholder="Vida"
                    defaultValue={char.healthCurrent}
                    register={register}
                    setter={setValue}
                    getter={getValues}
                    varName="healthCurrent"
                  />
                  <TableRowNumberInputWithButtons
                    placeholder="Energia"
                    defaultValue={char.energyCurrent}
                    register={register}
                    setter={setValue}
                    getter={getValues}
                    varName="energyCurrent"
                  />
                  <TableRowNumberInputWithButtons
                    placeholder="Dados de Vida"
                    defaultValue={char.healthDicesCurrent}
                    register={register}
                    setter={setValue}
                    getter={getValues}
                    varName="healthDicesCurrent"
                  />
                  <TableRow>
                    <TableCell>
                      <div className="flex flex-col items-center mb-4">
                        <p className="">Inspirado?</p>
                        <Input
                          defaultChecked={char.inspiration}
                          type="checkbox"
                          {...register('inspiration')}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Button
                        type="submit"
                        onClick={() => handleEditCharacter(char.id)}
                        className="w-[100%]"
                      >
                        Salvar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          )}
        </div>
      ))}
    </>
  );
};

export { CharacterStatusEditor };
