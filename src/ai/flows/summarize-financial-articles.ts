'use server';
/**
 * @fileOverview Summarizes financial articles into key points.
 *
 * - summarizeFinancialArticle - A function that summarizes a financial article.
 * - SummarizeFinancialArticleInput - The input type for the summarizeFinancialArticle function.
 * - SummarizeFinancialArticleOutput - The return type for the summarizeFinancialArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeFinancialArticleInputSchema = z.object({
  articleUrl: z.string().describe('The URL of the financial article to summarize.'),
});
export type SummarizeFinancialArticleInput = z.infer<typeof SummarizeFinancialArticleInputSchema>;

const SummarizeFinancialArticleOutputSchema = z.object({
  summary: z.string().describe('A summary of the key points in the financial article.'),
});
export type SummarizeFinancialArticleOutput = z.infer<typeof SummarizeFinancialArticleOutputSchema>;

export async function summarizeFinancialArticle(input: SummarizeFinancialArticleInput): Promise<SummarizeFinancialArticleOutput> {
  return summarizeFinancialArticleFlow(input);
}

const summarizeFinancialArticlePrompt = ai.definePrompt({
  name: 'summarizeFinancialArticlePrompt',
  input: {
    schema: z.object({
      articleUrl: z.string().describe('The URL of the financial article to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the key points in the financial article.'),
    }),
  },
  prompt: `You are a financial expert. Please summarize the key points of the financial article at the following URL in a simple, easy-to-understand way.\n\nArticle URL: {{{articleUrl}}}`,
});

const summarizeFinancialArticleFlow = ai.defineFlow<
  typeof SummarizeFinancialArticleInputSchema,
  typeof SummarizeFinancialArticleOutputSchema
>(
  {
    name: 'summarizeFinancialArticleFlow',
    inputSchema: SummarizeFinancialArticleInputSchema,
    outputSchema: SummarizeFinancialArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeFinancialArticlePrompt(input);
    return output!;
  }
);
