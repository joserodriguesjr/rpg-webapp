import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MessageRepository } from './message.repository';
import { CharacterMessages, Message } from './models/message.model';
import { CharacterService } from 'src/modules/game/characters/services/character.service';
// import OpenAI from "openai"; TODO

interface GPTResponse {
  message: string;
  created: number;
}

@Injectable()
export class MessageService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly messageRepository: MessageRepository,
    private readonly characterService: CharacterService,
  ) {}

  private logger = new Logger(MessageService.name);

  private readonly chatGPTKey = this.configService.get<string>('chatGPTKey');

  getAllMessages(): CharacterMessages[] {
    return this.messageRepository.getMessageData();
  }

  saveAllMessages(messages: CharacterMessages[]): void {
    this.messageRepository.saveMessageData(messages);
  }

  getMessagesByName(name: string): Message[] {
    const allMessages = this.getAllMessages();
    const characterMessagesIndex = allMessages.findIndex(
      (char) => char.name === name,
    );

    if (characterMessagesIndex !== -1) {
      const characterMessages = allMessages[characterMessagesIndex].messages;
      return characterMessages.slice(-5);
    } else {
      throw new Error('Personagem não encontrado.');
    }
  }

  async fetchGPTResponse(prompt: string): Promise<GPTResponse> {
    try {
      const apiKey = this.chatGPTKey;
      const url = 'https://api.openai.com/v1/chat/completions';

      const { data } = await firstValueFrom(
        this.httpService
          .post(
            url,
            {
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );

      const gptResponse: GPTResponse = {
        message: data.choices[0].message.content,
        created: data.created,
      };

      return gptResponse;
    } catch (error) {
      console.error('Erro ao chamar a API do GPT:', error);
      throw error;
    }
  }

  async sendMessage(name: string, question: string): Promise<Message[]> {
    const character = await this.characterService.getCharacterByName(name);

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const trainedProficiencies = character.proficiencies
      .filter((proficiency) => proficiency.trained)
      .map((proficiency) => proficiency.name);

    const element = (virusName: string): string => {
      if (virusName === 'Aerium') {
        return 'do ar';
      }
      if (virusName === 'Ignium') {
        return 'do fogo';
      }
      if (virusName === 'Geonium') {
        return 'da terra';
      }
      if (virusName === 'Fluvium') {
        return 'da água';
      }
      return '';
    };

    const message = `
            Você deve interpretar o personagem com base nas informações que receber.
            Você irá receber informações sobre o mundo e o personagem.
            Os eventos que aconteceram estarão em ordem do mais antigo para o mais recente. Dê mais importância aos mais recentes.
            Quero somente sua resposta atuando como personagem. Não inclua o nome do personagem no começo.
            Deve ser no máximo um parágrafo. NÃO SAIA DO PERSONAGEM.

            Mundo:
            Em um mundo devastado por uma guerra apocalíptica e pela invasão de uma raça alienígena, os humanos restantes
            se encontram em uma luta desesperada pela sobrevivência. A terra árida e desolada testemunha a ascensão de
            indivíduos infectados por vírus criados em experimentos desesperados, conferindo-lhes habilidades elementais únicas.
            Ar, fogo, terra e água se entrelaçam em uma dança de poder e destruição, moldando o destino dos portadores desses vírus.
            Em um cenário de desespero e caos, cada indivíduo é forçado a confrontar seus próprios demônios internos e lutar pela sua
            existência em um mundo dominado pela incerteza e pelo perigo iminente.

            Nome do Personagem:
            ${character.name}

            História e Background: 
            ${character.story}

            Eventos Marcantes:
            ${character.events.map((event) => `${event.event}: ${event.description}\n`)}

            Status de saúde e energia: 
            ${character.name} tem ${character.healthCurrent} pontos de vida restantes de um máximo de ${character.healthMax} e 
            ${character.energyCurrent} pontos de energia restantes de um máximo de ${character.energyMax}.
            
            Habilidades e características: 
            ${character.name} é proficiente em ${trainedProficiencies}.
            
            Vírus e habilidades elementais: 
            ${character.name} foi infectado pelo vírus ${character.virus.name}, concedendo-lhe habilidades de manipulação ${element(character.virus.name)}. 
            Ele também aprendeu as seguintes palavras rúnicas que envolvem os vírus: 
            ${character.virus.languages.map((lang) => `${lang.word}: ${lang.meaning}\n`)}
            
            Equipamento e armamento:
            ${character.name} possui as armas:
            ${character.equipment!.weapons.map((weapon) => `Nome: ${weapon.name} - Efeito: ${weapon.effects} - Descrição: ${weapon.description}\n`)}
            e armaduras:
            ${character.equipment!.armors.map((armor) => `Nome: ${armor.name} - Efeito: ${armor.effects} - Descrição: ${armor.description}\n`)}

            Ocupação e nível: 
            ${character.name} é um ${character.occupationName} de nível ${character.occupationLevel}.

            Pergunta:
            "${question}"
        `;

    const gptResponse = await this.fetchGPTResponse(message);

    const allMessages: CharacterMessages[] = this.getAllMessages();

    const characterMessagesIndex = allMessages.findIndex(
      (char) => char.name === name,
    );

    if (characterMessagesIndex !== -1) {
      const characterMessages = allMessages[characterMessagesIndex].messages;

      const epochTimestamp = gptResponse.created * 1000;
      const date = new Date(epochTimestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const formattedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      characterMessages.push({
        id: characterMessages.slice(-1)[0].id + 1,
        from: 'Jogador',
        to: `${character.name}`,
        time: formattedDateTime,
        body: question,
      });

      characterMessages.push({
        id: characterMessages.slice(-1)[0].id + 1,
        from: `${character.name}`,
        to: 'Jogador',
        time: formattedDateTime,
        body: gptResponse.message,
      });

      allMessages[characterMessagesIndex].messages = characterMessages;
      this.saveAllMessages(allMessages);
      return allMessages[characterMessagesIndex].messages.slice(-5);
    } else {
      throw new Error('Personagem não encontrado.');
    }
  }
}
