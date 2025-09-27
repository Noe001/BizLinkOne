import { addMinutes, addHours, subHours, subDays, addDays } from "date-fns";
import type { MeetingStatus } from "@/components/MeetingCard";
import type { MeetingDetails } from "@/components/MeetingDetailsModal";
import type { TranslationParams } from "@/contexts/LanguageContext";
import { sampleParticipants } from "./sampleWorkspace";

interface ParticipantRef {
  id: string;
  name: string;
  email?: string;
}

const participantMap = new Map(sampleParticipants.map((participant) => [participant.id, participant]));

const assignParticipants = (ids: string[]): ParticipantRef[] => {
  return ids.map((id) => participantMap.get(id) ?? { id, name: id });
};

export interface MeetingSeed {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: MeetingStatus;
  participants: ParticipantRef[];
  platform: "zoom" | "meet" | "teams";
  hasRecording?: boolean;
  hasNotes?: boolean;
  relatedChatId?: string;
}

export interface MeetingActionSeed {
  id: string;
  description: string;
  assigneeId?: string;
  dueInDays?: number;
  completed: boolean;
}

export interface MeetingExtraSeed {
  notes?: string;
  decisions?: string[];
  actionItems?: MeetingActionSeed[];
}

export interface SampleMeetingData {
  meetings: MeetingSeed[];
  extras: Record<string, MeetingExtraSeed>;
}

export const createSampleMeetingData = (referenceDate = new Date()): SampleMeetingData => {
  const meetings: MeetingSeed[] = [
    {
      id: "meeting-1",
      title: "Daily Standup",
      description: "Quick sync on progress, blockers, and today's goals",
      startTime: addMinutes(referenceDate, 30),
      endTime: addMinutes(referenceDate, 90),
      status: "scheduled",
      participants: assignParticipants(["john-doe", "sarah-wilson", "mike-johnson"]),
      platform: "zoom",
      relatedChatId: "development",
    },
    {
      id: "meeting-2",
      title: "Sprint Planning Session",
      description: "Planning upcoming sprint goals, story points, and task assignments",
      startTime: subMinutes(referenceDate, 15),
      endTime: addMinutes(referenceDate, 75),
      status: "ongoing",
      participants: assignParticipants(["john-doe", "sarah-wilson", "mike-johnson", "alice-cooper", "bob-smith"]),
      platform: "meet",
      hasNotes: true,
      relatedChatId: "general",
    },
    {
      id: "meeting-3",
      title: "Product Demo & Feedback",
      description: "Showcase new features and gather stakeholder feedback",
      startTime: subHours(referenceDate, 2),
      endTime: subHours(referenceDate, 1),
      status: "completed",
      participants: [
        ...assignParticipants(["alice-cooper", "bob-smith"]),
        { id: "stakeholder", name: "Product Stakeholder" },
      ],
      platform: "teams",
      hasRecording: true,
      hasNotes: true,
      relatedChatId: "product",
    },
    {
      id: "meeting-4",
      title: "Client Review & Approval",
      description: "Final review session with client for project milestone",
      startTime: subDays(referenceDate, 3),
      endTime: addHours(subDays(referenceDate, 3), 1),
      status: "cancelled",
      participants: [
        ...assignParticipants(["sarah-wilson"]),
        { id: "client-rep", name: "Client Representative" },
      ],
      platform: "teams",
    },
  ];

  const extras: Record<string, MeetingExtraSeed> = {
    "meeting-1": {
      notes: "Covered project progress and upcoming deliverables. No blockers reported.",
    },
    "meeting-2": {
      notes: "Sprint planning completed. Estimated 42 story points for upcoming sprint.",
      decisions: [
        "Focus on authentication system completion as priority",
        "Postpone advanced reporting features to next sprint",
      ],
      actionItems: [
        {
          id: "action-1",
          description: "Complete JWT implementation and testing",
          assigneeId: "john-doe",
          dueInDays: 3,
          completed: false,
        },
        {
          id: "action-2",
          description: "Update API documentation with new endpoints",
          assigneeId: "sarah-wilson",
          dueInDays: 5,
          completed: true,
        },
      ],
    },
    "meeting-3": {
      notes: "Product demo went well. Stakeholders provided positive feedback on new features.",
      decisions: [
        "Proceed with current UI design direction",
        "Schedule follow-up demo for additional stakeholders",
      ],
    },
    "meeting-4": {
      notes: "Meeting cancelled due to client scheduling conflict. Rescheduled for next week.",
    },
  };

  return { meetings, extras };
};

const subMinutes = (date: Date, minutes: number) => addMinutes(date, -minutes);

export type MeetingSeedDetails = MeetingSeed;
export type MeetingDetailsSeed = MeetingExtraSeed;

export const hydrateMeetingDetails = (
  seed: MeetingSeed,
  extras: MeetingExtraSeed | undefined,
  translate: (key: string, params?: TranslationParams) => string,
): MeetingDetails => {
  return {
    ...seed,
    title: seed.title,
    description: seed.description,
    platformUrl: undefined,
    participants: seed.participants,
    notes: extras?.notes,
    decisions: extras?.decisions ?? [],
    actionItems: extras?.actionItems?.map((item) => ({
      id: item.id,
      description: item.description,
      assignee: item.assigneeId,
      dueDate: item.dueInDays !== undefined ? addDays(new Date(), item.dueInDays) : undefined,
      completed: item.completed,
    })) ?? [],
    recordings: seed.hasRecording
      ? [
          {
            id: `${seed.id}-recording`,
            name: translate("meetings.samples.recordings.defaultName", { title: seed.title }),
            url: "https://example.com/recording",
            duration: 45 * 60,
          },
        ]
      : [],
  };
};
