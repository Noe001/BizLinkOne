export interface SampleParticipant {
  id: string;
  name: string;
  email?: string;
  roleKey?: string;
  avatar?: string;
}

export interface SampleChannel {
  id: string;
  name: string;
}

export const sampleParticipants: SampleParticipant[] = [
  { id: "john-doe", name: "John Doe", email: "john@company.com", roleKey: "tasks.create.team.roles.engineer" },
  { id: "sarah-wilson", name: "Sarah Wilson", email: "sarah@company.com", roleKey: "tasks.create.team.roles.designer" },
  { id: "mike-johnson", name: "Mike Johnson", email: "mike@company.com", roleKey: "tasks.create.team.roles.pm" },
  { id: "alice-cooper", name: "Alice Cooper", email: "alice@company.com", roleKey: "tasks.create.team.roles.devops" },
  { id: "bob-smith", name: "Bob Smith", email: "bob@company.com", roleKey: "tasks.create.team.roles.qa" },
];

export const sampleChannels: SampleChannel[] = [
  { id: "general", name: "general" },
  { id: "development", name: "development" },
  { id: "design", name: "design" },
  { id: "product", name: "product" },
  { id: "support", name: "support" },
];
