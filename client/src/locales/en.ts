export const en = {
  language: {
    label: "Language",
    english: "English",
    japanese: "Japanese",
  },
  settings: {
    header: {
      description: "Workspace settings and preferences.",
    },
    tabs: {
      general: "General",
      team: "Team",
      security: "Security",
      billing: "Billing",
    },
    actions: {
      saveChanges: "Save Changes",
    },
    alert: {
      unsaved: 'You have unsaved changes. Click "{{action}}" to apply them.',
    },
    general: {
      workspaceInfo: {
        title: "Workspace Information",
        description: "Manage workspace-level settings and details.",
      },
      fields: {
        name: "Workspace name",
        domain: "Workspace domain",
        description: "Description",
        timezone: "Timezone",
        language: "Language",
      },
      timezones: {
        et: "Eastern Time (US)",
        ct: "Central Time (US)",
        mt: "Mountain Time (US)",
        pt: "Pacific Time (US)",
        gmt: "Greenwich Mean Time",
        cet: "Central European Time",
        jst: "Japan Standard Time",
      },
      languages: {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        ja: "Japanese",
      },
      access: {
        title: "Access & Permissions",
        description: "Control who can access the workspace and what they can do.",
        guestAccess: {
          label: "Allow guest access",
          description: "Permit invited guests to view or comment depending on permissions.",
        },
      },
    },
    team: {
      title: "Team Management",
      description: "Invite and manage members of your workspace.",
      membersBadge: "{{count}} members",
      actions: {
        inviteMembers: "Invite Members",
        bulkInvite: "Bulk Invite",
      },
      statuses: {
        active: "Active",
        pending: "Pending",
      },
      roles: {
        admin: "Admin",
        manager: "Manager",
        member: "Member",
      },
    },
    security: {
      title: "Security",
      description: "Security settings for the workspace.",
      requireTwoFactor: {
        label: "Require two-factor authentication",
        description: "Require 2FA for all members when enabled.",
      },
      sessionTimeout: {
        label: "Session timeout",
        options: {
          "15": "15 minutes",
          "30": "30 minutes",
          "60": "1 hour",
          "240": "4 hours",
          "480": "8 hours",
        },
      },
    },
    billing: {
      currentPlan: {
        title: "Current Plan",
        description: "Billing and plan information for this workspace.",
        planLabel: "Plan",
        seatsLabel: "Seats",
        costLabel: "Cost",
      },
      nextBilling: {
        title: "Next billing",
      },
      actions: {
        changePlan: "Change plan",
        addSeats: "Add seats",
      },
    },
  },
  common: {
    appName: "BizLinkOne",
    searchPlaceholder: "Search...",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading...",
  },
  nav: {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    knowledge: "Knowledge",
    meetings: "Meetings",
    settings: "Settings",
    chat: "Chat",
    platform: "Platform",
    directMessages: "Direct Messages",
    createChannel: "Create channel",
    newDm: "New DM",
    accountSettings: "Account Settings",
    workspaceSettings: "Workspace Settings",
    createWorkspace: "Create Workspace",
    joinWorkspace: "Join Workspace",
  },
  header: {
    notificationsAria: "Notifications",
    searchLabel: "Search",
  },
  userMenu: {
    viewProfile: "View Profile",
    accountSettings: "Account Settings",
    preferences: "Preferences",
    notifications: "Notifications",
    securityPrivacy: "Security & Privacy",
    darkMode: "Dark Mode",
    language: "Language",
    helpSupport: "Help & Support",
    signOut: "Sign Out",
    auto: "Auto",
    languageTag: {
      en: "EN",
      ja: "JA",
    },
  },
  accountSettings: {
    header: {
      back: "Back",
      description: "Manage your personal account settings and preferences.",
    },
    actions: {
      saveChanges: "Save Changes",
    },
    alert: {
      unsaved: 'You have unsaved changes. Click "{{action}}" to apply them.',
    },
    tabs: {
      profile: "Profile",
      notifications: "Notifications",
      appearance: "Appearance",
      security: "Security & Privacy",
    },
    profile: {
      title: "Profile Information",
      description: "Update your personal information and contact details.",
      avatar: {
        memberSince: "Member since {{date}}",
        upload: "Upload Photo",
        remove: "Remove",
      },
      fields: {
        name: "Full Name",
        email: "Email Address",
        department: "Department",
        timezone: "Timezone",
      },
      departments: {
        engineering: "Engineering",
        design: "Design",
        marketing: "Marketing",
        sales: "Sales",
        support: "Support",
        humanResources: "Human Resources",
      },
    },
    notifications: {
      email: {
        title: "Email Notifications",
        description: "Configure when you receive email notifications.",
        items: {
          mentions: {
            label: "Mentions",
            description: "When someone mentions you in a message",
          },
          directMessages: {
            label: "Direct messages",
            description: "When you receive a direct message",
          },
          taskAssignments: {
            label: "Task assignments",
            description: "When you are assigned to a task",
          },
          meetingReminders: {
            label: "Meeting reminders",
            description: "Reminders before scheduled meetings",
          },
          weeklyDigest: {
            label: "Weekly digest",
            description: "Weekly summary of your activity",
          },
        },
      },
      push: {
        title: "Push Notifications",
        description: "Configure real-time push notifications.",
        items: {
          mentions: {
            label: "Mentions",
            description: "Instant notifications for mentions",
          },
          directMessages: {
            label: "Direct messages",
            description: "Instant notifications for DMs",
          },
          taskDeadlines: {
            label: "Task deadlines",
            description: "Alerts for approaching task deadlines",
          },
          meetingStart: {
            label: "Meeting start",
            description: "Notifications when meetings begin",
          },
        },
      },
    },
    appearance: {
      title: "Theme & Display",
      description: "Customize the look and feel of your workspace.",
      themeLabel: "Theme",
      themes: {
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      accentLabel: "Accent Color",
      colors: {
        blue: "Blue",
        green: "Green",
        purple: "Purple",
        red: "Red",
        orange: "Orange",
        yellow: "Yellow",
        pink: "Pink",
        indigo: "Indigo",
      },
      options: {
        compactMode: {
          label: "Compact Mode",
          description: "Reduce spacing and padding for a more compact interface",
        },
        sidebarCollapsed: {
          label: "Sidebar Collapsed by Default",
          description: "Start with the sidebar in collapsed state",
        },
      },
    },
    security: {
      title: "Password & Authentication",
      description: "Manage your account security and authentication methods.",
      currentPassword: {
        label: "Current Password",
        description: "Last changed 3 months ago",
      },
      changePassword: "Change Password",
      twoFactor: {
        label: "Two-Factor Authentication",
        description: "Add an extra layer of security to your account",
        enabled: "Enabled",
      },
      sessions: {
        title: "Active Sessions",
        current: {
          label: "Current Session",
          description: "Chrome on Windows ? New York, NY",
          status: "Active",
        },
        mobile: {
          label: "Mobile App",
          description: "iOS ? Last seen 2 hours ago",
          action: "Revoke",
        },
      },
      privacy: {
        title: "Privacy Settings",
        description: "Control how your information is shared and displayed.",
        profileVisibility: {
          label: "Profile Visibility",
          description: "Who can see your profile information",
          options: {
            everyone: "Everyone",
            team: "Team Only",
            private: "Private",
          },
        },
        showOnlineStatus: {
          label: "Show Online Status",
          description: "Let others see when you're online",
        },
        shareActivity: {
          label: "Share Activity Status",
          description: "Share what you're working on with your team",
        },
        dataAnalytics: {
          title: "Data & Analytics",
          usageAnalytics: {
            label: "Usage Analytics",
            description: "Help improve the platform by sharing usage data",
          },
          download: "Download My Data",
          delete: "Delete Account",
        },
      },
    },
  },
  auth: {
    login: {
      title: "Sign in to BizLinkOne",
      subtitle: "Access your workspace",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      signIn: "Sign In",
      signingIn: "Signing in...",
      forgotPassword: "Forgot your password?",
      passwordResetNotice: "Password reset is not available in the demo.",
      createAccount: "Create a new account",
      joinWorkspace: "Invited to a workspace?",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    signup: {
      title: "Create your account",
      subtitle: "Start your team's workspace",
      nameLabel: "Full name",
      namePlaceholder: "Jane Doe",
      emailLabel: "Work email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Re-enter your password",
      createAccount: "Create Account",
      creatingAccount: "Creating account...",
      backToLogin: "Back to sign in",
      agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
      passwordMismatch: "Passwords do not match.",
      termsAgreementRequired: "Please accept the terms of service and privacy policy.",
    },
    workspaceCreate: {
      title: "Create a workspace",
      subtitle: "Set up a new collaboration space",
      workspaceNameLabel: "Workspace name",
      workspaceNamePlaceholder: "Acme Inc",
      workspaceUrlLabel: "Workspace URL",
      workspaceUrlPlaceholder: "your-workspace",
      workspaceUrlHelp: "You can change this later from settings.",
      descriptionLabel: "Description (optional)",
      descriptionPlaceholder: "Describe the purpose of this workspace",
      industryLabel: "Industry",
      industryPlaceholder: "Select an industry",
      industryOptions: {
        technology: "Technology",
        finance: "Finance",
        healthcare: "Healthcare",
        education: "Education",
        retail: "Retail",
        manufacturing: "Manufacturing",
        consulting: "Consulting",
        other: "Other",
      },
      teamSizeLabel: "Team size",
      teamSizePlaceholder: "Select team size",
      teamSizeOptions: {
        "1-5": "1-5 people",
        "6-15": "6-15 people",
        "16-50": "16-50 people",
        "51-100": "51-100 people",
        "100+": "100+ people",
      },
      createWorkspace: "Create Workspace",
      creatingWorkspace: "Creating workspace...",
      backToLogin: "Back to sign in",
      joinExisting: "Join an existing workspace",
      benefits: {
        teamManagement: "Team management",
        projectTracking: "Project tracking",
        integratedPlatform: "Integrated platform",
      },
      benefitsDescription: "Once the workspace is ready you can invite teammates and kick off projects immediately.",
    },
    workspaceJoin: {
      title: "Join a workspace",
      subtitle: "Enter invitation details to get started",
      inviteCodeLabel: "Invitation code or workspace URL",
      inviteCodePlaceholder: "ABC123 or your-workspace",
      inviteCodeHelp: "Use the invitation shared by your workspace administrator.",
      emailLabel: "Email",
      emailHelp: "Enter the email address that received the invitation.",
      joinWorkspace: "Join Workspace",
      joiningWorkspace: "Joining workspace...",
      createNewWorkspace: "Create a new workspace",
      missingInvite: "Don't have an invitation?",
      teamWorkspaceTitle: "Team workspace",
      teamWorkspaceDescription: "Join your existing team workspace and start collaborating instantly.",
      inviteSentNotice: "Invitation links are sent by email.",
    },
  },
  dashboard: {
    log: {
      convertToTask: "Creating task from message:",
      convertToKnowledge: "Saving message to knowledge base:",
      reply: "Replying to message:",
    },
    notifications: {
      taskCreated: {
        title: "Task created",
        message: "We added the new task to your workspace.",
      },
      knowledgeCreated: {
        title: "Knowledge captured",
        message: "The summary is now saved in Knowledge.",
      },
      title: "Notifications",
      markAllRead: "Mark all read",
      empty: "No notifications yet",
      viewAll: "View all notifications",
      types: {
        task: {
          dueSoon: "Task Due Soon",
          reminder: "Task Reminder",
          messages: {
            dueSoon: "{{taskName}} is due in {{timeLeft}}",
            reminder: "Don't forget about {{taskName}}"
          }
        },
        meeting: {
          starting: "Meeting Starting",
          reminder: "Meeting Reminder",
          messages: {
            starting: "{{meetingName}} starts in {{timeLeft}}",
            reminder: "{{meetingName}} is coming up"
          }
        },
        message: {
          new: "New Message",
          mention: "You were mentioned",
          messages: {
            mention: "{{userName}} mentioned you in {{channelName}}",
            new: "New message from {{userName}}"
          }
        },
        knowledge: {
          updated: "Knowledge Updated",
          new: "New Knowledge",
          messages: {
            updated: "{{documentName}} has been updated",
            new: "New knowledge article: {{documentName}}"
          }
        },
        reminder: {
          general: "Reminder",
          messages: {
            general: "Don't forget to review the security requirements"
          }
        },
      },
    },
    header: {
      description: "Stay on top of conversations, tasks, and meetings in one place.",
    },
    actions: {
      new: "New quick action",
    },
    stats: {
      chats: {
        title: "Active chats",
        hint: "Up {{delta}} vs yesterday",
      },
      tasks: {
        title: "Tasks due",
        hint: "{{count}} task(s) need attention today",
      },
      projects: {
        title: "Projects on track",
        hint: "{{count}} project(s) tracking to plan",
      },
      knowledge: {
        title: "Knowledge updates",
        hint: "{{count}} new article(s) this week",
      },
      meetings: {
        title: "Upcoming meetings",
        hint: "Next meeting in {{hours}} hour(s)",
      },
    },
    sections: {
      messages: {
        title: "Recent messages",
        description: "Review the latest updates from your channels.",
        emptyTitle: "No recent messages",
        emptyDescription: "Start a chat or browse channels to see updates here.",
        browse: "Browse channels",
        viewAll: "View all messages",
      },
      tasks: {
        title: "Active tasks",
        description: "Keep important work moving forward.",
        emptyTitle: "No tasks yet",
        emptyDescription: "Create your first task to begin tracking work.",
        actions: {
          create: "Create task",
        },
        viewAll: "View all tasks",
      },
      knowledge: {
        title: "Knowledge base",
        description: "Curated highlights from your workspace.",
        emptyTitle: "No articles yet",
        emptyDescription: "Capture meeting notes or summaries to build knowledge.",
        actions: {
          create: "Add knowledge",
        },
        viewAll: "View all knowledge",
      },
      meetings: {
        title: "Upcoming meetings",
        description: "Prepare for scheduled sessions at a glance.",
        emptyTitle: "No meetings scheduled",
        emptyDescription: "Schedule your first meeting to collaborate with the team.",
        actions: {
          schedule: "Schedule meeting",
        },
        viewAll: "View all meetings",
      },
    },
    projects: {
      core: {
        name: "Core platform overhaul",
        description: "Stabilise auth, permissions, and workspace foundations.",
      },
      frontend: {
        name: "Frontend polish",
        description: "Elevate dashboard widgets and modernise UI interactions.",
      },
      documentation: {
        name: "Knowledge rollout",
        description: "Document new API capabilities and onboarding guides.",
      },
    },
  },
  tasks: {
    header: {
      title: "Tasks",
      description: "Plan, assign, and monitor work across the workspace.",
    },
    actions: {
      new: "New task",
    },
    filters: {
      title: "Filters",
      description: "Narrow results by status, priority, or keywords.",
      searchPlaceholder: "Search tasks, assignees, or tags...",
      status: {
        placeholder: "All statuses",
        options: {
          all: "All statuses",
          todo: "To do",
          inProgress: "In progress",
          review: "In review",
          done: "Done",
        },
      },
      priority: {
        placeholder: "All priorities",
        options: {
          all: "All priorities",
          urgent: "Urgent",
          high: "High",
          medium: "Medium",
          low: "Low",
        },
      },
      clear: "Clear filters",
    },
    stats: {
      showing: "Showing {{count}} of {{total}} tasks",
    },
    viewModes: {
      list: "List view",
      kanban: "Kanban view",
    },
    kanban: {
      columns: {
        todo: "To do",
        inProgress: "In progress",
        review: "Review",
        done: "Done",
      },
    },
    empty: {
      column: "No tasks in this column yet",
      list: "No tasks match your filters",
    },
    card: {
      priority: {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      },
      status: {
        todo: "To do",
        inProgress: "In progress",
        review: "Review",
        done: "Done",
      },
      due: {
        today: "Due today ÅE {{date}}",
        future: "Due {{date}} (in {{days}} days)",
        past: "Overdue {{date}} ({{days}} days ago)",
      },
      estimate: "Est.: {{hours}}h",
      related: {
        chat: "Open related chat",
        meeting: "Open related meeting",
      },
    },
    create: {
      title: "Create task",
      description: "Capture the details and assign work to your team.",
      validation: {
        titleRequired: "A title is required.",
        titleTooShort: "Title must be at least 3 characters.",
        descriptionTooLong: "Description must be less than 2000 characters.",
        estimateRange: "Estimated hours must be between 0 and 999.",
        tagLimit: "You can add up to 5 tags.",
      },
      fields: {
        title: {
          label: "Title",
          placeholder: "Enter task title",
        },
        description: {
          label: "Description",
          placeholder: "What needs to be done?",
        },
        status: {
          label: "Status",
          options: {
            todo: "To do",
            "in-progress": "In progress",
            review: "Review",
            done: "Done",
          },
        },
        priority: {
          label: "Priority",
          options: {
            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent",
          },
        },
        assignee: {
          label: "Assignee",
          placeholder: "Choose a teammate",
          unassigned: "Unassigned",
        },
        dueDate: {
          label: "Due date",
          placeholder: "Pick a date",
        },
        estimate: {
          label: "Estimated hours",
          placeholder: "e.g. 4.5",
        },
        relatedChat: {
          label: "Related chat",
          placeholder: "Select a channel",
          none: "No chat linked",
        },
        tags: {
          label: "Tags",
          placeholder: "Add a tag...",
          add: "Add",
          help: "{{count}} of {{limit}} tags used",
        },
      },
      actions: {
        cancel: "Cancel",
        reset: "Reset",
        submitting: "Creating...",
        submit: "Create task",
      },
      team: {
        roles: {
          engineer: "Software Engineer",
          designer: "Product Designer",
          pm: "Product Manager",
          devops: "DevOps Engineer",
          qa: "QA Engineer",
        },
      },
    },
    samples: {
      tags: {
        backend: "Backend",
        security: "Security",
        documentation: "Documentation",
        api: "API",
        frontend: "Frontend",
        mobile: "Mobile",
        css: "CSS",
        devops: "DevOps",
        automation: "Automation",
        database: "Database",
        performance: "Performance",
        ux: "UX",
      },
      auth: {
        title: "Implement authentication service",
        description: "Ship secure login, refresh tokens, and role-based access for the platform.",
        subtasks: {
          0: "Audit existing sign-in flows",
          1: "Create JWT issuance service",
          2: "Add MFA toggle to settings",
        },
        comments: {
          0: "Let's reuse the encryption helper from the billing project.",
          1: "I'll draft the migration plan for production roll-out.",
        },
        timeEntries: {
          0: "Discovery and API contract alignment",
          1: "Implemented token refresh handler",
        },
      },
      documentation: {
        title: "Update API documentation",
        description: "Ensure the public docs reflect the new auth endpoints and webhooks.",
        subtasks: {
          0: "Review new endpoints",
        },
        comments: {
          0: "Remember to include example payloads for error cases.",
        },
        timeEntries: {
          0: "Drafted authentication section updates",
        },
      },
      responsive: {
        title: "Fix responsive layout issues",
        description: "Improve mobile breakpoints for dashboard cards and chat.",
        subtasks: {
          0: "Test layouts on iPhone 13",
          1: "Adjust flex behaviour for sidebar",
        },
        comments: {
          0: "We should align the spacing scale with the design tokens.",
        },
        timeEntries: {
          0: "Refined grid utilities and media queries",
        },
      },
      cicd: {
        title: "Set up CI/CD pipeline",
        description: "Automate builds, testing, and staging deployments.",
        subtasks: {
          0: "Define staging environment secrets",
        },
        comments: {
          0: "Linting step is failing due to outdated config; I'll patch it tomorrow.",
        },
      },
      database: {
        title: "Database optimisation",
        description: "Profile hotspots and introduce indexes for heavy queries.",
        comments: {
          0: "Added a ticket to monitor query timings after release.",
        },
        timeEntries: {
          0: "Indexed audit log table and ran benchmarks",
        },
      },
      onboarding: {
        title: "Design onboarding flow",
        description: "Create an intuitive first-time experience for workspace owners.",
        subtasks: {
          0: "Sketch welcome walkthrough",
          1: "Validate copy with marketing",
        },
        comments: {
          0: "Marketing provided updated screenshots for step two.",
        },
        timeEntries: {
          0: "Built prototype in Storybook",
        },
      },
    },
  },
  meetings: {
    log: {
      join: "Joining meeting:",
      create: "Creating meeting:",
      createTask: "Creating task from meeting:",
      createKnowledge: "Creating knowledge from meeting:",
      share: "Sharing to chat:",
    },
    header: {
      description: "Manage your meetings and track session recordings and notes.",
    },
    actions: {
      schedule: "Schedule Meeting",
      scheduleFirst: "Schedule first meeting",
      clearSearch: "Clear search",
    },
    stats: {
      total: { label: "Total Meetings", hint: "All scheduled meetings" },
      upcoming: { label: "Upcoming", hint: "Scheduled meetings" },
      ongoing: { label: "Ongoing", hint: "Active meetings" },
      completedToday: { label: "Completed Today", hint: "Meetings finished today" },
    },
    filters: {
      searchPlaceholder: "Search meetings, descriptions, or participants...",
      toggle: "Filters",
      sort: {
        placeholder: "Sort by",
        options: {
          date: "Date",
          title: "Title",
          status: "Status",
        },
      },
      status: {
        label: "Status",
        placeholder: "All statuses",
        options: {
          all: "All statuses",
          scheduled: "Scheduled",
          ongoing: "Ongoing",
          completed: "Completed",
          cancelled: "Cancelled",
        },
      },
      date: {
        label: "Date",
        placeholder: "All dates",
        options: {
          all: "All dates",
          today: "Today",
          tomorrow: "Tomorrow",
          week: "This week",
        },
      },
      summary: {
        status: "Status: {{value}}",
        date: "Date: {{value}}",
        clear: "Clear filters",
      },
    },
    statusLabels: {
      scheduled: "Scheduled",
      ongoing: "Ongoing",
      completed: "Completed",
      cancelled: "Cancelled",
    },
    results: {
      summary: "Showing {{count}} of {{total}} meetings",
      searchTag: "\"{{query}}\"",
      empty: {
        defaultTitle: "No meetings scheduled",
        defaultDescription: "Schedule your first meeting to get started with team collaboration.",
        searchTitle: "No meetings found",
        searchDescription: "No meetings match \"{{query}}\". Try adjusting your search or filters.",
      },
    },
    card: {
      status: {
        upcoming: "Upcoming",
        live: "Live",
        ended: "Ended",
        cancelled: "Cancelled",
      },
      joinNow: "Join Now",
      join: "Join",
      accessNotes: "Open meeting notes",
    },
    samples: {
      dailyStandup: {
        title: "Daily Standup",
        description: "Quick sync on current progress and blockers",
        notes: "Team members shared updates and flagged an auth rollout dependency.",
      },
      sprintPlanning: {
        title: "Sprint Planning",
        description: "Planning session for the upcoming sprint, including story estimation and capacity planning",
        notes: "Sprint goal agreed. Team will focus on authentication improvements and dashboard polish.",
        decisions: {
          0: "Implement new authentication system",
          1: "Update API documentation",
        },
        actionItems: {
          0: "Set up development environment",
          1: "Review security requirements",
        },
      },
      productDemo: {
        title: "Product Demo",
        description: "Demonstration of new features for stakeholders",
        notes: "Stakeholders approved the feature set and requested analytics for the next review.",
        decisions: {
          0: "Ship feature flag to production",
          1: "Prepare analytics dashboard proposal",
        },
      },
      clientReview: {
        title: "Client Review",
        description: "Weekly client check-in and progress review",
        notes: "Client requested a follow-up once the authentication update is ready for testing.",
      },
      recordings: {
        defaultName: "Recording for {{title}}",
      },
    },
    details: {
      subtitle: "Review meeting notes, action items, and recordings.",
      tabs: {
        overview: "Overview",
        notes: "Notes",
        actions: "Action Items",
        recordings: "Recordings",
      },
      overview: {
        schedule: "Schedule",
        platform: "Platform",
        duration: "Duration",
        description: "Description",
        participants: "Participants ({{count}})",
        link: "Meeting Link",
        copyLink: "Copy meeting link",
      },
      platform: {
        zoom: "Zoom",
        meet: "Google Meet",
        teams: "Microsoft Teams",
        other: "Other",
      },
      actionItemTaskDescription: "Action item from meeting: {{title}}",
      summary: {
        heading: "## Meeting Summary: {{title}}",
        date: "**Date:** {{value}}",
        duration: "**Duration:** {{minutes}} minutes",
        participants: "**Participants:** {{names}}",
        decisionsHeading: "## Key Decisions",
        decisionItem: "{{index}}. {{text}}",
        actionItemsHeading: "## Action Items",
        actionItem: "{{index}}. {{text}}{{assignee}}{{due}}",
        actionAssignee: " (@{{assignee}})",
        actionDue: " - Due: {{due}}",
      },
      notes: {
        title: "Meeting Notes",
        placeholder: "Add your meeting notes here...",
        knowledgeTitle: "Meeting Notes: {{title}}",
        category: "Meeting Notes",
        saveKnowledge: "Save as Knowledge",
        shareSummary: "Share Summary to Chat",
      },
      decisions: {
        title: "Key Decisions",
        placeholder: "Add a decision...",
        add: "Add",
      },
      actions: {
        title: "Action Items",
        assignedTo: "Assigned to: {{assignee}}",
        due: "Due: {{date}}",
        placeholder: "Add new action item...",
        createTask: "Create Task",
      },
      recordings: {
        title: "Recordings & Files",
        duration: "Duration: {{minutes}} minutes",
        view: "View",
        empty: "No recordings available",
      },
      footer: {
        close: "Close",
        endMeeting: "End Meeting",
      },
    },
    create: {
      title: "Schedule New Meeting",
      description: "Create a new meeting and automatically notify participants.",
      form: {
        titleLabel: "Title *",
        titlePlaceholder: "Enter meeting title...",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Meeting agenda and details...",
        dateLabel: "Date *",
        datePlaceholder: "Pick a date",
        timeLabel: "Start Time *",
        durationLabel: "Duration (minutes)",
        durationPlaceholder: "Select duration",
        durationOptions: {
          15: "15 minutes",
          30: "30 minutes",
          60: "1 hour",
          90: "1.5 hours",
          120: "2 hours",
        },
        platformLabel: "Platform",
        platformPlaceholder: "Select platform",
        platformUrlLabel: "Meeting URL",
        platformUrlPlaceholder: "https://...",
        participantsLabel: "Participants",
        removeParticipant: "Remove {{name}}",
        addParticipant: "Add {{name}}",
        participantsAllAdded: "All participants have been added.",
        channelLabel: "Related Chat Channel",
        channelPlaceholder: "Select channel (optional)",
        channelNone: "No channel",
        recurringLabel: "Recurring meeting",
        recurringPatternLabel: "Repeat pattern",
        recurringOptions: {
          daily: "Daily",
          weekly: "Weekly",
          monthly: "Monthly",
        },
        remindersLabel: "Send reminder notifications",
        notesLabel: "Auto-generate meeting notes template",
      },
      actions: {
        cancel: "Cancel",
        submit: "Schedule Meeting",
      },
    },
  },
  projects: {
    header: {
      description: "Plan, track and analyse your workspace initiatives.",
    },
    actions: {
      new: "New project",
    },
    status: {
      planning: "Planning",
      active: "Active",
      "on-hold": "On hold",
      completed: "Completed",
    },
    filters: {
      searchPlaceholder: "Search projects...",
      status: {
        placeholder: "All statuses",
        options: {
          all: "All statuses",
          planning: "Planning",
          active: "Active",
          onHold: "On hold",
          completed: "Completed",
        },
      },
    },
    tabs: {
      overview: "Overview",
      timeline: "Timeline",
      tasks: "Tasks",
      analytics: "Analytics",
    },
    overview: {
      stats: {
        total: { title: "Total projects", delta: "+{{value}} this month" },
        active: { title: "Active", hint: "Currently in progress" },
        tasks: { title: "Tasks", hint: "Completed {{completed}} tasks" },
        team: { title: "Team size", hint: "Total team members across projects" },
      },
      project: {
        progress: "Progress",
        team: "Team ({{count}})",
        tasks: "Tasks {{completed}} / {{total}}",
        timeline: "Start {{start}} / End {{end}}",
        milestones: "Milestones ({{total}})",
        upcoming: "Upcoming milestones",
        completed: "Completed {{completed}} / {{total}}",
        milestoneCompleted: "Done",
        milestoneWarning: "Some milestones are overdue",
      },
    },
    timeline: {
      log: {
        taskClick: "Timeline task clicked:",
      },
    },
    create: {
      log: "Creating project:",
    },
    tasks: {
      heading: "Project tasks ? {{project}}",
      progress: "Progress: {{value}}%",
      empty: "Select a project to view its tasks",
    },
    analytics: {
      progress: { title: "Project progress" },
      milestones: {
        title: "Upcoming milestones",
        overdue: "Overdue",
        upcoming: "Upcoming",
      },
    },
    samples: {
      core: {
        name: "Core platform overhaul",
        description: "Stabilise authentication, permissions, and foundational services.",
        health: "Mostly on track ? database refactor pending",
        milestones: {
          auth: "Auth service refactor",
          database: "Database index audit",
          api: "Public API v2 rollout",
        },
      },
      frontend: {
        name: "Frontend polish",
        description: "Modernise UI patterns and responsive experience.",
        health: "Design tokens integration ongoing",
        milestones: {
          library: "Component library consolidation",
          responsive: "Responsive layout improvements",
          accessibility: "WCAG accessibility pass",
        },
      },
      documentation: {
        name: "Documentation expansion",
        description: "Extend developer guides and onboarding content.",
        health: "Waiting on API finalisation",
        milestones: {
          api: "API reference updates",
          userGuide: "User guide revision",
          review: "Editorial review",
        },
      },
      tasks: {
        core: {
          auth: "Authentication module refactor",
          database: "Apply indexing & query optimisation",
          monitoring: "Introduce metrics & tracing",
        },
        frontend: {
          library: "Merge duplicated UI components",
          a11y: "Accessibility fixes batch",
          docs: "Storybook documentation updates",
        },
        documentation: {
          outline: "Draft extended documentation outline",
          guides: "Write initial how?to guides",
          review: "Editorial & technical review",
        },
      },
    },
  },
  knowledge: {
    header: {
      title: "Knowledge",
      description: "Capture, refine, and discover shared team knowledge.",
    },
    actions: {
      new: "New article",
    },
    stats: {
      totalArticles: { title: "Articles", hint: "Total published articles" },
      views: { title: "Views", hint: "All?time views" },
      thisWeek: { title: "This week", hint: "New this week" },
      popularTags: { title: "Popular tags" },
    },
    filters: {
      searchPlaceholder: "Search titles, tags, or authors...",
      sort: {
        placeholder: "Sort",
        options: {
          recent: "Most recent",
          popular: "Most viewed",
          alphabetical: "A Å® Z",
          oldest: "Oldest",
        },
      },
      hideAdvanced: "Hide advanced",
      showAdvanced: "Advanced filters",
      tag: {
        label: "Tag",
        placeholder: "Any tag",
        options: { all: "All tags" },
      },
      date: {
        label: "Date",
        placeholder: "Any time",
        options: {
          all: "All time",
          week: "Past week",
          month: "Past month",
          quarter: "Past quarter",
        },
      },
      author: {
        label: "Author",
        placeholder: "Any author",
        options: { all: "All authors" },
      },
      summary: {
        tag: "Tag: {{value}}",
        date: "Date: {{value}}",
        author: "Author: {{value}}",
      },
      clear: "Clear filters",
    },
    results: {
      summary: "Showing {{count}} of {{total}} articles",
      searchTag: '"{{query}}"',
    },
    empty: {
      searchTitle: "No results",
      searchDescription: "No articles match \"{{query}}\".",
      defaultTitle: "No articles yet",
      defaultDescription: "Capture meeting notes or summaries to build knowledge.",
      clearSearch: "Clear search",
      createFirst: "Create first article",
    },
    sidebar: {
      popular: { title: "Popular" },
      recent: { title: "Recent" },
      authors: { title: "Authors", count: "{{count}} article(s)" },
      suggestions: {
        title: "Quick search",
        command: "Open search",
        placeholder: "Type to filter...",
        empty: "No suggestions",
      },
    },
    log: {
      open: "Open article:",
      share: "Share article:",
    },
    samples: {
      auth: {
        title: "Secure authentication architecture",
        excerpt: "Design overview of token lifecycles, refresh strategy, and rotation policies.",
      },
      apiDocs: {
        title: "Public API documentation standards",
        excerpt: "Guidelines for structuring endpoints, examples, and error models.",
      },
      deployment: {
        title: "Blue/green deployment strategy",
        excerpt: "Safe release patterns and rollback procedures in production.",
      },
      database: {
        title: "Database indexing principles",
        excerpt: "When and how to add composite indexes for performance gains.",
      },
      frontend: {
        title: "Component library governance",
        excerpt: "Versioning, change control, and contribution workflow for UI components.",
      },
      security: {
        title: "Security best practices overview",
        excerpt: "Checklist for secure coding, dependency hygiene, and secret handling.",
      },
    },
    tags: {
      authentication: "Authentication",
      security: "Security",
      jwt: "JWT",
      backend: "Backend",
      api: "API",
      documentation: "Documentation",
      standards: "Standards",
      guidelines: "Guidelines",
      deployment: "Deployment",
      devops: "DevOps",
      production: "Production",
      ciCd: "CI/CD",
      testing: "Testing",
      database: "Database",
      schema: "Schema",
      design: "Design",
      performance: "Performance",
      sql: "SQL",
      frontend: "Frontend",
      components: "Components",
      ui: "UI",
      react: "React",
      designSystem: "Design System",
      bestPractices: "Best Practices",
      compliance: "Compliance",
      vulnerabilities: "Vulnerabilities",
    },
  },
} as const;

export type Translation = typeof en;
