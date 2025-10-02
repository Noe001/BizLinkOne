export interface FaqEntry {
  id: string;
  triggers: RegExp[];
  question: string;
  answer: string;
  relatedKnowledgeId?: string;
}

export const faqEntries: FaqEntry[] = [
  {
    id: "faq-auth",
    triggers: [
      /how (do|can) i (set up|configure) auth/i,
      /authentication setup/i,
      /login setup/i,
    ],
    question: "How do I set up authentication for the platform?",
    answer:
      "Check the \"Authentication Setup Guide\" in the knowledge base for step-by-step instructions, including OAuth and SSO examples.",
    relatedKnowledgeId: "kb-1",
  },
  {
    id: "faq-meeting",
    triggers: [
      /how (do|can) i record a meeting/i,
      /meeting (recording|notes)/i,
    ],
    question: "How can I capture meeting notes automatically?",
    answer:
      "Enable \"Generate AI notes\" inside the meeting details panel and BizLinkOne will post the summary and TODOs when the session ends.",
  },
  {
    id: "faq-project",
    triggers: [
      /create (a )?project/i,
      /new project workflow/i,
    ],
    question: "What's the workflow for creating a new project?",
    answer:
      "Open Projects -> New Project to define goals, owners, and linked channels so tasks, meetings, and docs stay connected.",
  },
];

export function matchFaq(message: string): FaqEntry | undefined {
  const normalized = message.trim();
  return faqEntries.find((entry) => entry.triggers.some((pattern) => pattern.test(normalized)));
}
