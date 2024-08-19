export interface CharacterMessages {
    name: string;
    messages: Message[];
}

export interface Message {
    id: number;
    from: string;
    to: string;
    time: string;
    body: string;
}
