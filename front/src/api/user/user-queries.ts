/* eslint-disable prettier/prettier */
import {gql} from '@apollo/client'

export const GET_ALL_CHARACTERS = gql`
  {
    characters {
      id
      name
      image
    }
  }
`;

export const GET_CHARACTER = gql`
  query ($name: String!) {
    character(name: $name) {
      id
      visible
      name
      image
      story
      events {
        event
        description
      }
      rumours
      notes
      healthMax
      healthCurrent
      healthDicesCurrent
      energyMax
      energyCurrent
      armorClass
      inspiration
      followers {
        type
        quantity
      }
      attributes {
        for
        des
        con
        int
        sab
        car
      }
      proficiencies {
        name
        ability
        trained
      }
      virus {
        name
        assimilation
        powers {
            name
            description
        }
        consequences {
            name
            level
            description
        }
        languages {
            word,
            meaning
        }
      }
      occupationName
      occupationLevel
      occupation {
        name
        proficiency
        resistanceTest
        healthDice
        skills {
          name
          level
          description
        }
      }
      equipment {
        armors {
          name
          defense
          effects
          value
          description
        }
        weapons {
          name
          damage
          effects
          value
          description
        }
        items {
          name
          effects
          value
          description
        }
      }
    }
  }
`;

export const UPDATE_CHARACTER_INFO = gql`
  mutation ($updateCharacterInfoInput: UpdateCharacterInfoInput!) {
    updateCharacterInfo(updateCharacterInfoInput: $updateCharacterInfoInput) {
      id
    }
  }
`;

export const EXCHANGE_EQUIPMENT = gql`
  mutation ($exchangeEquipmentInput: ExchangeEquipmentInput!) {
    exchangeEquipment(exchangeEquipmentInput: $exchangeEquipmentInput) {
      id
      name
      equipment {
        armors {
          name
          defense
          effects
          value
          description
        }
        weapons {
          name
          damage
          effects
          value
          description
        }
        items {
          name
          effects
          value
          description
        }
      }
    }
  }
`;

export const SUBSCRIBE_TO_CHARACTER_UPDATES = gql`
  subscription subscribeToCharacterUpdated($subscribeCharacterInput: SubscribeCharacterInput!) {
    characterUpdated(subscribeCharacterInput: $subscribeCharacterInput) {
      healthMax
      healthCurrent
      healthDicesCurrent
      energyMax
      energyCurrent
      inspiration
      story
      notes
      events {
        event
        description
      }
      equipment {
        armors {
          name
          defense
          effects
          value
          description
        }
        weapons {
          name
          damage
          effects
          value
          description
        }
        items {
          name
          effects
          value
          description
        }
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query ($name: String!) {
    messages(name: $name) {
      id
      from
      to
      time
      body
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation ($sendMessageInput: SendMessageInput!) {
    sendMessage(sendMessageInput: $sendMessageInput) {
      id
    }
  }
`;

export const SUBSCRIBE_TO_NEW_MESSAGES = gql`
  subscription subscribeToMessageSent($subscribeCharacterInput: SubscribeCharacterInput!) {
    messages(subscribeCharacterInput: $subscribeCharacterInput) {
      id
      from
      to
      time
      body
    }
  }
`;

export const GET_BATTLE_STATUS = gql`
  {
    battleStatus {
      id
      name
      icon
      position{
        row
        col
      }
      visible
      healthMax
      healthCurrent
      energyMax
      energyCurrent
    }
  }
`;

export const UPDATE_BATTLE_STATUS = gql`
  mutation UpdateBattleStatus($battleStatus: BattlePlayerInput!) {
    updateBattleStatus(battleStatus: $battleStatus) {
      id
      name
    }
  }
`;

export const SUBSCRIBE_TO_BATTLE_STATUS = gql`
  subscription subscribeToBattleStatus{
    battleStatus {
      id
      name
      visible
      healthMax
      healthCurrent
      energyMax
      energyCurrent
      icon
      position {
        row, col
      }
    }
  }
`;

export const TOOGLE_VISIBLE = gql`
  mutation ToogleVisible($name: String!) {
    toogleVisible(name: $name) {
      id
      name
      icon
      position{
        row
        col
      }
      visible
      healthMax
      healthCurrent
      energyMax
      energyCurrent
    }
  }
`;