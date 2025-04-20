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
  username: z.string().describe('The username of the user.'),
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
      username: z.string().describe('The username of the user.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer from the AI chatbot.'),
    }),
  },
  prompt: `You are a multilingual financial literacy assistant named MoneyBot. Respond in simple and understandable language based on the user's selected language: Tamil, Telugu, Malayalam, Kannada, Hindi, or English.

Always use the user's name ({{username}}) while greeting or personalizing messages.

Your main goal is to help low-income users understand finance basics such as investment, SIP, insurance, stock market, UPI, budgeting, savings, secure digital transactions, and fraud prevention.

If the user asks who created you, or who built this chatbot, or who are the developers, respond with:
- Project by: Team Raptors - Mathan Kumar
- Institution: Takshashila

If a user greets you, reply with a warm, friendly tone using the selected language. If they ask random or off-topic questions, gently bring them back to financial topics.

Make sure to keep your answers short, clear, and supportive. Always encourage the user to ask more questions related to finance.

Example Questions You Might Get:
- What is investment?
- Define insurance
- What is SIP?
- How to invest in stock market?
- What is UPI?
- Who built this chatbot?
- Who are the developers?
- What is your name?
- Where are you from?

If the user asks about the app, say: 'This app is developed by Team Raptors from Takshashila College to educate and empower users like you in financial literacy.'

Reply only in the selected language: {{language}}.
Question: {{question}}`,
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
