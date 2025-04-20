'use server';
/**
 * @fileOverview A financial literacy chatbot AI agent.
 *
 * - financialLiteracyChatbot - A function that handles the chatbot process.
 * - FinancialLiteracyChatbotInput - The input type for the financialLiteracyChatbot function.
 * - FinancialLiteracyChatbotOutput - The return type for the financialLiteracyChatbot function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {translate} from '@/services/google-translate';

const FinancialLiteracyChatbotInputSchema = z.object({
  question: z.string().describe('The question asked by the user.'),
  language: z.string().describe('The preferred language of the user (e.g., en, hi).'),
});
export type FinancialLiteracyChatbotInput = z.infer<typeof FinancialLiteracyChatbotInputSchema>;

const FinancialLiteracyChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer from the AI chatbot.'),
});
export type FinancialLiteracyChatbotOutput = z.infer<typeof FinancialLiteracyChatbotOutputSchema>;

export async function financialLiteracyChatbot(input: FinancialLiteracyChatbotInput): Promise<FinancialLiteracyChatbotOutput> {
  return financialLiteracyChatbotFlow(input);
}

const financialLiteracyChatbotPrompt = ai.definePrompt({
  name: 'financialLiteracyChatbotPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The question asked by the user.'),
      language: z.string().describe('The preferred language of the user (e.g., en, hi).'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer from the AI chatbot.'),
    }),
  },
  prompt: `You are a financial literacy assistant. Answer the following question clearly and concisely.

Question: {{{question}}}

Answer:`,
});

const financialLiteracyChatbotFlow = ai.defineFlow<
  typeof FinancialLiteracyChatbotInputSchema,
  typeof FinancialLiteracyChatbotOutputSchema
>(
  {
    name: 'financialLiteracyChatbotFlow',
    inputSchema: FinancialLiteracyChatbotInputSchema,
    outputSchema: FinancialLiteracyChatbotOutputSchema,
  },
  async input => {
    const {output} = await financialLiteracyChatbotPrompt(input);

    if (input.language !== 'en') {
      const translatedAnswer = await translate(output!.answer, {from: 'en', to: input.language});
      return {answer: translatedAnswer};
    }

    return output!;
  }
);
