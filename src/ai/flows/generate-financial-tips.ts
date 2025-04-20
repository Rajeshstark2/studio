// src/ai/flows/generate-financial-tips.ts
'use server';

/**
 * @fileOverview A flow for generating financial tips on a specific topic.
 *
 * - generateFinancialTips - A function that generates financial tips.
 * - GenerateFinancialTipsInput - The input type for the generateFinancialTips function.
 * - GenerateFinancialTipsOutput - The return type for the generateFinancialTips function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFinancialTipsInputSchema = z.object({
  topic: z.string().describe('The financial topic to get tips on (e.g., saving, investing, budgeting).'),
  userContext: z.string().optional().describe('Additional information about the user to personalize the tips.'),
});

export type GenerateFinancialTipsInput = z.infer<typeof GenerateFinancialTipsInputSchema>;

const GenerateFinancialTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized financial tips related to the topic.'),
});

export type GenerateFinancialTipsOutput = z.infer<typeof GenerateFinancialTipsOutputSchema>;

export async function generateFinancialTips(input: GenerateFinancialTipsInput): Promise<GenerateFinancialTipsOutput> {
  return generateFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialTipsPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The financial topic to get tips on (e.g., saving, investing, budgeting).'),
      userContext: z.string().optional().describe('Additional information about the user to personalize the tips.'),
    }),
  },
  output: {
    schema: z.object({
      tips: z.array(z.string()).describe('A list of personalized financial tips related to the topic.'),
    }),
  },
  prompt: `You are a financial advisor. Please provide personalized financial tips on the following topic:

Topic: {{{topic}}}

{{#if userContext}}
User Context: {{{userContext}}}
{{/if}}

Tips:
`, // Ensure the prompt ends with "Tips:" for the LLM to generate the list
});

const generateFinancialTipsFlow = ai.defineFlow<
  typeof GenerateFinancialTipsInputSchema,
  typeof GenerateFinancialTipsOutputSchema
>(
  {
    name: 'generateFinancialTipsFlow',
    inputSchema: GenerateFinancialTipsInputSchema,
    outputSchema: GenerateFinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
