export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}
export declare function chatWithEdith(userPrompt: string, history?: ChatMessage[], contextData?: any): Promise<{
    text: string;
    modelUsed: string;
    isFounders?: boolean;
    tag?: string;
}>;
