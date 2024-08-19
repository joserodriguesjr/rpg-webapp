/* eslint-disable prettier/prettier */
import {gql} from '@apollo/client'

export const MASTER_GET_ALL_CHARACTERS = gql`
  {
    characters {
      id
      visible
      image
      name
      healthMax
      healthCurrent
      healthDicesCurrent
      energyMax
      energyCurrent
      armorClass
      inspiration
      occupationLevel
      virus {
        name
      }
    }
  }
`;

export const MASTER_UPDATE_CHARACTER_STATUS = gql`
  mutation ($updateCharacterStatusInput: UpdateCharacterStatusInput!) {
    updateCharacterStatus(updateCharacterStatusInput: $updateCharacterStatusInput) {
      id
      visible
      image
      name
      healthMax
      healthCurrent
      healthDicesCurrent
      energyMax
      energyCurrent
      armorClass
      inspiration
      occupationLevel
      virus {
        name
      }
    }
  }
`;