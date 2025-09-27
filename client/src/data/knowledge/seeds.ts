export type LocalizedKey = string;

export interface KnowledgeArticleSeed {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  authorId?: string;
  createdDaysAgo: number;
  updatedDaysAgo?: number;
  views?: number;
  relatedChatId?: string;
}

export const knowledgeArticleSeeds: KnowledgeArticleSeed[] = [
  {
    id: 'kb-1',
    title: 'JWT Authentication Implementation Guide',
    excerpt: 'Complete guide for implementing JWT-based authentication with refresh tokens and role-based access control.',
    tags: ['authentication', 'security', 'jwt', 'backend', 'api'],
    authorId: 'john-doe',
    createdDaysAgo: 3,
    updatedDaysAgo: 0,
    views: 142,
    relatedChatId: 'development',
  },
  {
    id: 'kb-2',
    title: 'API Documentation Standards',
    excerpt: 'Best practices and guidelines for maintaining comprehensive API documentation.',
    tags: ['documentation', 'api', 'standards', 'guidelines'],
    authorId: 'sarah-wilson',
    createdDaysAgo: 7,
    views: 89,
    relatedChatId: 'development',
  },
  {
    id: 'kb-3',
    title: 'Production Deployment Guide',
    excerpt: 'Step-by-step guide for deploying applications to production with CI/CD pipelines.',
    tags: ['deployment', 'devops', 'production', 'ciCd', 'testing'],
    authorId: 'mike-johnson',
    createdDaysAgo: 14,
    updatedDaysAgo: 2,
    views: 234,
    relatedChatId: 'devops',
  },
  {
    id: 'kb-4',
    title: 'Database Schema Design Principles',
    excerpt: 'Guidelines for designing efficient and scalable database schemas with performance considerations.',
    tags: ['database', 'schema', 'design', 'performance', 'sql'],
    authorId: 'alice-cooper',
    createdDaysAgo: 21,
    views: 67,
  },
  {
    id: 'kb-5',
    title: 'React Component Library Guide',
    excerpt: 'Building and maintaining a consistent React component library with design system integration.',
    tags: ['frontend', 'components', 'ui', 'react', 'designSystem'],
    authorId: 'bob-smith',
    createdDaysAgo: 5,
    updatedDaysAgo: 0,
    views: 156,
    relatedChatId: 'design',
  },
  {
    id: 'kb-6',
    title: 'Security Best Practices Checklist',
    excerpt: 'Comprehensive checklist for application security, covering common vulnerabilities and compliance requirements.',
    tags: ['security', 'bestPractices', 'compliance', 'vulnerabilities'],
    authorId: 'john-doe',
    createdDaysAgo: 10,
    views: 203,
  },
];

export const knowledgePopularTagKeys = [
  'authentication', 'api', 'security', 'deployment', 'frontend'
] as const;

export const knowledgeThisWeekCount = 2;
