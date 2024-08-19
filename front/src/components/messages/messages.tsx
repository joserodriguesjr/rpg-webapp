import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useSubscription, useMutation } from '@apollo/client';

import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { Message } from '../../../../types/messages';
import { Character } from '../../../../types/character';
import {
  SUBSCRIBE_TO_NEW_MESSAGES,
  GET_MESSAGES,
  SEND_MESSAGE,
} from '@/api/user/user-queries';

interface MessageProps {
  character: Character;
}

const AIMessageBox: React.FC<MessageProps> = ({ character }) => {
  const [inputMessage, setInputMessage] = useState<string>();
  const [lastMessages, setLastMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const textareaRef = useRef<HTMLDivElement>(null);

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useQuery(GET_MESSAGES, {
    onCompleted: (data) => processChatMessages(data.messages),
    variables: { name: character.name },
  });

  useSubscription(SUBSCRIBE_TO_NEW_MESSAGES, {
    onData: (option) => processChatMessages(option.data.data.messages),
    variables: {
      subscribeCharacterInput: {
        id: character.id,
        name: character.name,
      },
    },
  });

  const processChatMessages = (incommingMessages: Message[]) => {
    setLastMessages((prevMessages) => {
      // Filtra as mensagens de incommingMessages que não
      // estão presentes em lastMessages com base no ID
      const newMessages = incommingMessages.filter(
        (message: Message) =>
          !prevMessages.find((prevMessage) => prevMessage.id === message.id),
      );
      // Retorna a concatenação de prevMessages e newMessages
      return [...prevMessages, ...newMessages];
    });
    setThinking(false);
  };

  const handleSendMessageButton = () => {
    setThinking(true);
    sendMessage({
      variables: {
        sendMessageInput: {
          name: character.name,
          question: inputMessage,
        },
      },
    });
  };

  // Effect to scroll to latest message
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      });
    }
  }, [lastMessages]);

  return (
    <>
      <AccordionTrigger className="flex flex-row items-center justify-center">
        <span className="text-center">
          {thinking
            ? `${character.name} está pensando...`
            : `Fale com ${character.name}`}
        </span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col">
        <div className="h-80 mb-2 overflow-y-auto">
          {lastMessages?.map((msg) => {
            const time = new Date(msg.time);
            const formattedTime = time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div ref={textareaRef} key={msg.id} className="p-1">
                <strong>
                  [{msg.from} - {formattedTime}]
                </strong>{' '}
                : {msg.body}
              </div>
            );
          })}
        </div>
        <Textarea
          className="h-20"
          placeholder={
            thinking
              ? `${character.name} está pensando`
              : `Fale com ${character.name}`
          }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button
          className="ml-auto mt-3"
          onClick={() => {
            setInputMessage('');
            handleSendMessageButton();
          }}
        >
          Enviar
        </Button>
      </AccordionContent>
    </>
  );
};

export { AIMessageBox };
