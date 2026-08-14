/**
 * /faq content: categories, each holding questions with stable ids so
 * individual answers can be deep-linked. Populated by prompt 04.
 *
 * The home page keeps its own short FAQ — see home.ts.
 */

export type FaqQuestion = {
  id: string;
  question: string;
  /** Answer as HTML; may contain links and inline emphasis. */
  answerHtml: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  questions: FaqQuestion[];
};

export const faqCategories: FaqCategory[] = [];
