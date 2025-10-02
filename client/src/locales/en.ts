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
      notifications: "Notifications",
      integrations: "Integrations",
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
      branding: {
        title: "Branding",
        description: "Customize the colors and logos for your workspace.",
        fields: {
          primaryColor: "Primary color",
          secondaryColor: "Secondary color",
          logoUrl: "Logo URL",
          faviconUrl: "Favicon URL",
        },
        preview: {
          title: "Live preview",
          description: "Preview how your updated branding appears across the product.",
        },
      },
      domains: {
        title: "Email domains",
        description: "Manage the domains that can join your workspace.",
        summary: "Allowlist includes {{count}} domain(s)",
        help: "Add trusted company domains to simplify onboarding and security.",
        actions: {
          addDomain: "Add domain",
        },
        metadata: "Added by {{addedBy}} on {{addedAt}}",
        types: {
          primary: "Primary domain",
          allowed: "Allowed domain",
        },
        modal: {
          title: "Add domain",
          description: "Specify the email domain you want to allow in this workspace.",
          fields: {
            domain: "Domain",
            type: "Type",
          },
          actions: {
            add: "Add domain",
          },
        },
      },
      dataRetention: {
        title: "Data retention & exports",
        description: "Control how long workspace data is stored and manage scheduled exports.",
        autoDelete: {
          label: "Auto-delete content",
          description: "Automatically purge workspace messages and files after the retention window ends.",
        },
        retentionPeriod: {
          label: "Retention period",
          helper: "Choose how long messages, files, and logs remain accessible before deletion.",
        },
        options: {
          "30": "30 days",
          "90": "90 days",
          "180": "180 days",
          "365": "1 year",
        },
        exports: {
          label: "Scheduled exports",
          description: "Deliver encrypted workspace exports to compliance contacts on an automated cadence.",
          actions: {
            configure: "Configure schedule",
          },
        },
        lastExport: "Last export: {{value}}",
        nextExport: "Next export: {{value}}",
        history: {
          title: "Export history",
          actions: {
            schedule: "Schedule export",
          },
          table: {
            generatedAt: "Generated",
            format: "Format",
            size: "Size",
            initiatedBy: "Initiated by",
            status: "Status",
          },
          status: {
            completed: "Completed",
            pending: "In progress",
            failed: "Failed",
          },
          empty: "No exports generated yet.",
        },
        modal: {
          title: "Configure export schedule",
          description: "Define how exports are generated and who receives them.",
          fields: {
            cadence: "Cadence",
            cadenceOptions: {
              weekly: "Weekly (every Monday)",
              monthly: "Monthly (1st of the month)",
              quarterly: "Quarterly (Jan/Apr/Jul/Oct)",
            },
            format: "Export format",
            formatOptions: {
              csv: "CSV (spreadsheets)",
              json: "JSON (structured)",
            },
            recipients: "Recipients",
            recipientsHelper: "Use commas to separate multiple email addresses.",
            includeAttachments: {
              label: "Include attachments",
              description: "Bundle file uploads in the export package.",
            },
          },
          actions: {
            runNow: "Run once now",
            save: "Save schedule",
          },
        },
      },
      apiAccess: {
        title: "API access",
        description: "Create and manage tokens for integrating with external systems.",
        summary: "{{count}} active token(s)",
        helper: "Rotate long-lived tokens regularly and revoke unused credentials.",
        actions: {
          create: "New token",
          revoke: "Revoke",
        },
        scopes: {
          full: "Full access",
          chat: "Chat & conversations",
          tasks: "Tasks & projects",
          read: "Read only",
        },
        status: {
          active: "Active",
          revoked: "Revoked",
        },
        createdAt: "Created {{value}}",
        lastUsed: {
          value: "Last used {{value}}",
          never: "Never used",
        },
        expiresIn: "Expires in {{days}} days",
        modal: {
          title: "Create API token",
          description: "Scope access and expiration before sharing the token.",
          fields: {
            name: "Token name",
            scope: "Scope",
            expires: "Expiration",
            expiresOption: "Expires in {{days}} days",
          },
          actions: {
            create: "Create token",
          },
        },
        generated: {
          title: "Token generated",
          description: "Copy this token now?we won't show it again.",
          helper: "Store this value securely in your secrets manager or integration settings.",
        },
        revoke: {
          title: "Revoke token?",
          description: "Revoking {{name}} immediately disables API access for any systems using it.",
          confirm: "Revoke token",
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
        disabled: "Suspended",
      },
      roles: {
        admin: "Admin",
        manager: "Manager",
        member: "Member",
      },
      rolesDescriptions: {
        admin: "Full access to workspace, security, and billing",
        manager: "Manage teams, projects, and knowledge",
        member: "Collaborate on tasks, meetings, and knowledge",
      },
      badges: {
        mfaEnforced: "2FA required",
      },
      editMemberTitle: "Edit member",
      editMemberDescription: "Adjust workspace access and notification settings.",
      deleteConfirmTitle: "Remove member",
      deleteConfirmDescription: "This member will lose access to the workspace immediately.",
      dialog: {
        fields: {
          role: "Role",
          status: "Status",
          notifications: "Notification cadence",
        },
        permissions: {
          title: "Permissions",
          description: "Choose the workspace areas this member can manage.",
          projects: {
            label: "Projects",
            description: "Create projects and update milestones",
          },
          tasks: {
            label: "Tasks",
            description: "Assign, edit, and close tasks",
          },
          meetings: {
            label: "Meetings",
            description: "Schedule and edit workspace meetings",
          },
          knowledge: {
            label: "Knowledge base",
            description: "Publish and archive workspace knowledge",
          },
          billing: {
            label: "Billing",
            description: "Manage billing details and invoices",
          },
        },
        notifications: {
          summary: "Receives {{cadence}} updates",
          options: {
            realtime: "Real-time",
            hourly: "Hourly digest",
            daily: "Daily summary",
            weekly: "Weekly roundup",
          },
        },
        enforcement: {
          label: "Require 2FA",
          description: "Force two-factor authentication for this member",
        },
      },
      rolesModal: {
        title: "Create custom role",
        description: "Define a reusable permission set for your team.",
        fields: {
          name: "Role name",
          description: "Description",
        },
        permissions: {
          title: "Permissions",
        },
        actions: {
          save: "Save role",
        },
      },
      inviteModal: {
        title: "Invite members",
        description: "Send workspace invitations via email.",
        fields: {
          emails: "Email addresses",
          role: "Default role",
          message: "Personal message",
        },
        placeholders: {
          emails: "john@example.com, sarah@example.com",
          message: "Optional note to include in the invitation",
        },
        hints: {
          emails: "Separate multiple addresses with commas.",
        },
        actions: {
          send: "Send invites",
        },
      },
      bulkInvite: {
        title: "Bulk invite",
        description: "Paste CSV rows or upload a template to invite many members at once.",
        fields: {
          csv: "CSV input",
        },
        placeholders: {
          csv: "name,email,role",
        },
        actions: {
          downloadTemplate: "Download template",
          upload: "Process invites",
        },
      },
      rolesCard: {
        title: "Roles overview",
        description: "Review default roles and their responsibilities.",
        actions: {
          create: "Create role",
        },
        hint: "Need something more tailored? Create a custom role to reuse across teams.",
      },
      requests: {
        title: "Access requests",
        description: "Review and approve pending workspace join requests.",
        badge: "{{count}} pending",
        empty: "No outstanding access requests.",
        requestedAt: "Requested {{value}}",
        actions: {
          review: "Review",
          dismiss: "Dismiss",
          approve: "Approve",
          deny: "Deny",
        },
        modal: {
          title: "Review access request",
          description: "Approve or decline the requested workspace permissions.",
          fields: {
            name: "Name",
            email: "Email",
            role: "Requested role",
            message: "Message",
            messageEmpty: "No additional details provided.",
            requestedAt: "Requested {{value}}",
          },
        },
      },
      automation: {
        title: "Member automation",
        description: "Automate onboarding workflows for new teammates.",
        inviteGuests: {
          label: "Auto-invite guests",
          description: "Automatically invite guests when they request access with a trusted domain.",
        },
        assignMentor: {
          label: "Assign onboarding mentor",
          description: "Pair new members with a mentor when they join.",
        },
        reminder: {
          label: "Reminder cadence",
          options: {
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
          },
          helper: "Send automated onboarding reminders on the selected schedule.",
        },
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
      mfa: {
        title: "Two-factor authentication",
        description: "Monitor enforcement coverage and manage member enrollment.",
        metrics: {
          enforced: "Enforced",
          pending: "Pending",
          coverage: "Coverage",
        },
        badges: {
          enabled: "Enabled",
          pending: "Not enrolled",
        },
        actions: {
          toggle: "Toggle two-factor for {{name}}",
        },
        empty: "No members found. Invite teammates to manage two-factor coverage.",
      },
      ip: {
        title: "IP allowlist",
        description: "Restrict workspace access to approved network ranges.",
        summary: "{{count}} rule(s) configured",
        help: "Add CIDR ranges to secure access and meet compliance requirements.",
        actions: {
          add: "Add IP rule",
        },
        metadata: "Added by {{addedBy}} ? {{location}}",
        statuses: {
          active: "Active",
          pending: "Pending",
          disabled: "Disabled",
        },
        modal: {
          title: "Add IP rule",
          description: "Provide the CIDR range and context for this rule.",
          fields: {
            label: "Label",
            cidr: "CIDR range",
            location: "Location",
          },
          actions: {
            add: "Add rule",
          },
        },
      },
      devices: {
        title: "Trusted devices",
        description: "Monitor remembered devices and revoke access when something looks off.",
        lastActive: "Last active {{value}}",
        ipLabel: "IP {{value}}",
        status: {
          trusted: "Trusted",
          needs_verification: "Needs verification",
          blocked: "Blocked",
        },
        actions: {
          verify: "Verify",
          revoke: "Remove",
        },
        remove: {
          title: "Remove device?",
          description: "Remove {{name}} to require a new sign-in and two-factor challenge.",
          confirm: "Remove device",
        },
      },
      password: {
        title: "Password policy",
        description: "Control the strength and rotation requirements for passwords.",
        minLength: {
          label: "Minimum length",
          helper: "Recommended: 12+ characters for enhanced security.",
        },
        rotation: {
          label: "Rotation frequency",
          helper: "Require users to reset passwords on a recurring schedule.",
          options: {
            "30": "Every 30 days",
            "60": "Every 60 days",
            "90": "Every 90 days",
            "180": "Every 180 days",
          },
        },
        requireMixedCase: {
          label: "Require mixed case",
          description: "Passwords must include both uppercase and lowercase characters.",
        },
        requireSpecial: {
          label: "Require special characters",
          description: "Passwords must include at least one symbol.",
        },
        lockout: {
          label: "Account lockout",
          helper: "Lock accounts after excessive failed attempts to prevent brute-force attacks.",
        },
      },
      audit: {
        title: "Audit log",
        description: "Track sensitive actions taken in your workspace.",
        table: {
          actor: "Actor",
          action: "Action",
          target: "Target",
          time: "Time",
          actions: "Actions",
        },
        viewEvent: "View details",
        statuses: {
          success: "Success",
          warning: "Warning",
          failure: "Failure",
        },
        actions: {
          roleUpdate: "Role updated",
          mfaReminder: "Two-factor reminder sent",
          ipAdded: "IP allowlist updated",
          export: "Workspace export started",
        },
        descriptions: {
          roleUpdate: "Admin changed a member role",
          mfaReminder: "Automated reminder sent to pending members",
          ipAdded: "New IP range added to allowlist",
          export: "Workspace data export was requested",
        },
        modal: {
          title: "Audit event",
          description: "Review the event metadata and context.",
          fields: {
            actor: "Actor",
            action: "Action",
            target: "Target",
            ip: "IP address",
            time: "Timestamp",
          },
        },
      },
    },
    notifications: {
      categories: {
        email: "Email",
        chat: "Chat",
        mobile: "Mobile",
        webhook: "Webhook",
      },
      channels: {
        title: "Notification channels",
        description: "Enable the delivery channels where teammates receive updates.",
        actions: {
          configureSlack: "Manage Slack app",
          configureWebhook: "Configure webhook",
        },
        emailDigest: {
          name: "Email digest",
          description: "Daily summary of important workspace activity.",
          cadence: "Cadence",
        },
        slackAlerts: {
          name: "Slack alerts",
          description: "Send real-time alerts to the connected Slack workspace.",
        },
        mobilePush: {
          name: "Mobile push",
          description: "Deliver high-priority alerts to the mobile app.",
        },
        dailySummary: {
          name: "Daily summary",
          description: "Brief recap of the previous day delivered each morning.",
        },
        webhook: {
          name: "Webhook",
          description: "Trigger custom automations via outbound webhook.",
        },
      },
      templates: {
        title: "Notification templates",
        description: "Customize and preview the messages sent across each channel.",
        updated: "Last updated {{value}}",
        actions: {
          preview: "Preview",
        },
        modal: {
          title: "{{name}} template",
          description: "Review the message content delivered to recipients.",
          channel: "Delivery channel",
        },
        items: {
          digest: {
            name: "Daily digest email",
            description: "Morning summary sent to stakeholders with highlights and reminders.",
            preview: "Subject: Your BizLinkOne daily digest\n\nGood morning! Here's what's happening today:\n? 3 projects approaching milestones\n? 5 tasks overdue across the workspace\n? Upcoming meetings: Product Sync, Customer Review\n\nVisit BizLinkOne to review the full details.",
          },
          slackSummary: {
            name: "Slack summary",
            description: "Posts a concise recap to the connected Slack channel.",
            preview: "*Workspace summary*\n? 2 new knowledge articles published\n? 8 tasks completed in the last 24h\n? Next meeting in 45 minutes (Marketing Standup)",
          },
          mobileAlert: {
            name: "Mobile critical alert",
            description: "Push notification for high priority incidents and escalations.",
            preview: "High priority alert: Infra incident #452 is impacting customer chat latency. Tap to open the incident room.",
          },
        },
      },
      policy: {
        title: "Notification policy",
        description: "Define organization-wide notification rules.",
        digestTime: {
          label: "Daily digest time",
          option: "Send at {{time}}",
          helper: "Choose when daily summaries should be delivered.",
        },
        escalation: {
          label: "Escalate urgent alerts to",
          options: {
            admins: "Workspace admins",
            owners: "Workspace owners",
            none: "Do not escalate",
          },
          helper: "Escalated alerts send real-time notifications to the selected group.",
        },
        quietHours: {
          label: "Enable quiet hours",
          description: "Suppress non-critical notifications during overnight hours.",
        },
        actions: {
          sendTest: "Send test notification",
        },
      },
    },
    integrations: {
      title: "Integrations",
      description: "Connect BizLinkOne with the tools your team already uses.",
      lastSync: "Last sync {{value}}",
      actions: {
        disconnect: "Disconnect",
        connect: "Connect",
        configure: "Configure",
      },
      status: {
        connected: "Connected",
        disconnected: "Disconnected",
        requiresAction: "Action required",
      },
      items: {
        googleCalendar: {
          name: "Google Calendar",
          description: "Sync meetings and keep calendars aligned.",
        },
        outlook: {
          name: "Outlook Calendar",
          description: "Connect Microsoft 365 to sync events.",
        },
        zoom: {
          name: "Zoom",
          description: "Attach meeting links and sync recordings automatically.",
        },
        teams: {
          name: "Microsoft Teams",
          description: "Keep Teams channels updated with BizLinkOne activity.",
        },
        slack: {
          name: "Slack",
          description: "Send messages and notifications to Slack workspaces.",
        },
        zapier: {
          name: "Zapier",
          description: "Automate workflows with thousands of Zapier connectors.",
        },
      },
      modal: {
        title: "Configure {{name}}",
        description: "Adjust sync settings for {{name}}.",
        sync: {
          heading: "Sync settings",
          description: "Choose which data BizLinkOne should send to this integration.",
          events: "Sync events",
          eventsHelper: "Send updates when new items are created in BizLinkOne.",
          reminders: "Send reminders",
          remindersHelper: "Deliver reminder notifications through this integration.",
          postSummary: "Post daily summary",
          postSummaryHelper: "Publish a recap of the day's activity.",
          alert: "Changes can take up to 10 minutes to propagate across systems.",
        },
      },
      automation: {
        title: "Automation recipes",
        description: "Enable prebuilt workflows that connect integrations with workspace events.",
        trigger: "Trigger: {{value}}",
        action: "Action: {{value}}",
        actions: {
          toggle: "Toggle {{name}}",
          view: "View details",
        },
        items: {
          calendarSync: {
            name: "Sync calendar invites",
            description: "Push newly scheduled BizLinkOne meetings to connected calendars.",
            trigger: "Meeting created in BizLinkOne",
            action: "Create or update calendar event",
          },
          slackAlerts: {
            name: "Slack incident alerts",
            description: "Send urgent incident updates directly to Slack channels.",
            trigger: "Incident state changes to critical",
            action: "Post structured alert to Slack",
          },
          zapierTasks: {
            name: "Zapier task sync",
            description: "Create follow-up tasks in external tools via Zapier.",
            trigger: "Task marked as blocked",
            action: "Trigger Zapier workflow",
          },
        },
        modal: {
          title: "{{name}}",
          description: "Adjust the automation and control whether it is active.",
          trigger: "Trigger",
          action: "Action",
          statusLabel: "Automation status",
          statusHelper: "Disable automations temporarily when troubleshooting integrations.",
        },
      },
      // Also expose meetings-specific integration labels expected by Meetings page
      meetings: {
        title: "Integrations",
        description: "Connect BizLinkOne with the tools your team already uses.",
        providers: {
          googleCalendar: "Google Calendar",
          outlookCalendar: "Outlook Calendar",
          zoom: "Zoom",
          teams: "Microsoft Teams",
        },
        status: {
          connected: "Connected",
          disconnected: "Disconnected",
        },
        actions: {
          connect: "Connect",
          disconnect: "Disconnect",
          configure: "Configure",
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
      paymentMethods: {
        title: "Payment methods",
        description: "Manage the cards used for subscription payments.",
        actions: {
          add: "Add payment method",
          setDefault: "Make default",
        },
        expires: "Expires {{expiry}}",
        default: "Default",
        modal: {
          title: "Add payment method",
          description: "Enter the card details to store on file.",
          fields: {
            brand: "Card brand",
            last4: "Last 4 digits",
            expiry: "Expiry",
            setDefault: "Set as default",
            setDefaultHelper: "New invoices will charge this payment method first.",
          },
          actions: {
            save: "Save payment method",
          },
        },
      },
      invoices: {
        title: "Invoices",
        description: "Download past invoices and confirm payment status.",
        table: {
          number: "Invoice #",
          period: "Billing period",
          amount: "Amount",
          status: "Status",
          actions: "Actions",
        },
        statuses: {
          paid: "Paid",
          open: "Open",
          overdue: "Overdue",
        },
        actions: {
          view: "View",
          exportAll: "Export all",
          download: "Download PDF",
        },
        modal: {
          title: "Invoice {{number}}",
          description: "Summary of charges for this billing period.",
          fields: {
            issuedAt: "Issued",
            dueAt: "Due",
            statusLabel: "Status",
          },
        },
      },
      usage: {
        title: "Usage analytics",
        description: "Track how the workspace is consuming plan allowances.",
        metrics: {
          seats: "Member seats",
          storage: "Storage used",
          automationRuns: "Automation runs",
          apiRequests: "API requests",
        },
        units: {
          members: "members",
          gb: "GB",
          runs: "runs",
          requests: "requests",
        },
        remaining: "{{value}} {{unit}} remaining",
      },
    },
  },
  common: {
    appName: "BizLinkOne",
    searchPlaceholder: "Search...",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    close: "Close",
    loading: "Loading...",
    confirmDelete: {
      cancel: "Cancel",
      confirm: "Delete",
      task: {
        title: "Delete Task",
        description: "Are you sure you want to delete this task? This action cannot be undone.",
        descriptionWithName: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      },
      knowledge: {
        title: "Delete Knowledge",
        description: "Are you sure you want to delete this knowledge article? This action cannot be undone.",
        descriptionWithName: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      },
      meeting: {
        title: "Delete Meeting",
        description: "Are you sure you want to delete this meeting? This action cannot be undone.",
        descriptionWithName: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      },
      message: {
        title: "Delete Message",
        description: "Are you sure you want to delete this message? This action cannot be undone.",
        descriptionWithName: "Are you sure you want to delete this message? This action cannot be undone.",
      },
      project: {
        title: "Delete Project",
        description: "Are you sure you want to delete this project? This action cannot be undone.",
        descriptionWithName: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      },
    },
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
      title: "Account Settings",
      back: "Back",
      description: "Manage your personal account settings and preferences.",
    },
    actions: {
      saveChanges: "Save Changes",
      saveProfile: "Save Profile",
      saving: "Saving...",
      cancel: "Cancel",
    },
    alert: {
      unsaved: 'You have unsaved changes. Click "{{action}}" to apply them.',
    },
    autoSave: {
      description: "Your changes are automatically saved.",
      saving: "Saving...",
      saved: "Saved",
      dismiss: "Dismiss",
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
  preferences: {
    header: {
      description: "Customize your workspace experience and personal settings.",
      lastSaved: "Last saved {{value}}",
    },
    alert: {
      unsaved: 'You have unsaved changes. Click "{{action}}" to apply them.',
    },
    actions: {
      save: "Save Changes",
      saving: "Saving...",
      reset: "Reset to defaults",
      preview: "Preview theme",
      testNotification: "Send test notification",
      cancel: "Cancel",
      editShortcut: "Edit",
    },
    tabs: {
      appearance: "Appearance",
      notifications: "Notifications",
      accessibility: "Accessibility",
      shortcuts: "Shortcuts",
      general: "General",
    },
    appearance: {
      title: "Theme & display",
      description: "Choose the look and feel that works best for you.",
      theme: {
        label: "Theme",
        options: {
          light: "Light",
          dark: "Dark",
          system: "System",
        },
        descriptions: {
          light: "Bright, high-contrast visuals for well-lit spaces.",
          dark: "Dimmed surfaces to reduce strain in low light.",
          system: "Follow your operating system preference automatically.",
        },
      },
      accent: {
        label: "Accent color",
        helper: "Used for highlights, buttons, and active interface states.",
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
      },
      fontSize: {
        label: "Font size",
        description: "Adjust text size across the interface.",
        options: {
          small: "Compact",
          medium: "Comfortable",
          large: "Large",
        },
      },
      density: {
        sidebar: {
          label: "Collapse sidebar by default",
          description: "Start each session with the navigation hidden.",
        },
        compact: {
          label: "Compact mode",
          description: "Reduce spacing for higher information density.",
        },
        avatars: {
          label: "Show avatars",
          description: "Display member avatars in lists and threads.",
        },
        animations: {
          label: "Enable animations",
          description: "Smooth transitions and hover feedback throughout the app.",
        },
      },
      preview: {
        sampleTitle: "Team stand-up notes",
        sampleDescription: "A snapshot of how cards and controls adapt to your settings.",
        cardTitle: "Product strategy",
        cardDescription: "Draft review schedule and follow-up owners.",
        toggleLabel: "Focus mode",
        toggleDescription: "Mute low-priority updates for 30 minutes.",
        button: "Send reminder",
      },
    },
    notifications: {
      title: "Notifications & sound",
      description: "Decide how alerts reach you.",
      sound: {
        label: "Sound notifications",
        description: "Play a chime when you receive important updates.",
        volumeLabel: "Volume {{value}}%",
      },
      desktop: {
        label: "Desktop notifications",
        description: "Show system alerts for mentions, tasks, and reminders.",
      },
      emailDigest: {
        label: "Email digest",
        description: "Receive summary emails that capture the highlights.",
        options: {
          never: "Never",
          daily: "Daily",
          weekly: "Weekly",
          monthly: "Monthly",
        },
      },
      quietHours: {
        label: "Quiet hours",
        description: "Pause notifications during the hours you choose.",
        start: "Start time",
        end: "End time",
      },
      quietHoursActive: {
        helper: "Notifications are paused between {{start}} and {{end}}.",
      },
      inAppBadges: {
        label: "In-app badges",
        description: "Show unread indicators on navigation items.",
      },
      mobilePush: {
        label: "Mobile push",
        description: "Send high priority alerts to the mobile app.",
      },
      importantOnly: {
        label: "Only notify for important events",
        description: "Filter routine alerts so you only see the critical ones.",
      },
      test: {
        description: "Preview how notifications will appear across your active channels.",
      },
    },
    accessibility: {
      title: "Accessibility",
      description: "Support focus, readability, and assistive technologies.",
      highContrast: {
        label: "High contrast mode",
        description: "Boost color contrast for better visibility.",
      },
      reducedMotion: {
        label: "Reduced motion",
        description: "Minimize large animations and parallax effects.",
      },
      screenReader: {
        label: "Screen reader enhancements",
        description: "Expose additional labels for assistive technologies.",
      },
      keyboardNavigation: {
        label: "Keyboard navigation",
        description: "Enable extended shortcuts and focus trapping.",
      },
      focusIndicators: {
        label: "Focus indicators",
        description: "Display prominent outlines on the element in focus.",
      },
      textScale: {
        label: "Text scale",
        options: {
          small: "Small",
          medium: "Default",
          large: "Large",
        },
      },
      focusOutline: {
        label: "Focus outline weight",
        helper: "Current thickness: {{value}} px",
      },
    },
    shortcuts: {
      title: "Keyboard shortcuts",
      description: "Tailor shortcuts to match your personal workflow.",
      reset: "Reset shortcuts",
      table: {
        headers: {
          action: "Action",
          shortcut: "Shortcut",
          category: "Category",
        },
      },
      categories: {
        navigation: "Navigation",
        communication: "Communication",
        productivity: "Productivity",
      },
      dialog: {
        title: "Update shortcut",
        description: "Combine keys with the + character (example: Ctrl + Shift + P).",
        helper: "Conflicting shortcuts will override the previous assignment.",
      },
      items: {
        commandPalette: {
          label: "Open command palette",
          description: "Jump anywhere with the universal launcher.",
        },
        quickSearch: {
          label: "Quick search",
          description: "Highlight the global search input.",
        },
        newMessage: {
          label: "Start new message",
          description: "Focus the composer in the current channel.",
        },
        createTask: {
          label: "Create task",
          description: "Open the task creation dialog.",
        },
        toggleTheme: {
          label: "Toggle theme",
          description: "Switch between light and dark mode.",
        },
        focusNotifications: {
          label: "Open notifications",
          description: "Jump to the notification center panel.",
        },
      },
    },
    general: {
      title: "General & region",
      description: "Language, regional formats, and advanced options.",
      language: {
        label: "Language",
        description: "Choose your preferred interface language.",
        options: {
          en: "English",
          ja: "Japanese",
          es: "Spanish",
          fr: "French",
          de: "German",
          ko: "Korean",
          zh: "Chinese",
          pt: "Portuguese",
        },
      },
      timezone: {
        label: "Timezone",
        description: "Time-sensitive features will follow this timezone.",
        options: {
          et: "Eastern Time (ET)",
          ct: "Central Time (CT)",
          mt: "Mountain Time (MT)",
          pt: "Pacific Time (PT)",
          gmt: "Greenwich Mean Time (GMT)",
          cet: "Central European Time (CET)",
          jst: "Japan Standard Time (JST)",
        },
      },
      dateFormat: {
        label: "Date format",
        options: {
          us: "MM/DD/YYYY (US)",
          intl: "DD/MM/YYYY (International)",
          iso: "YYYY-MM-DD (ISO)",
          written: "DD MMM YYYY (Written)",
        },
      },
      timeFormat: {
        label: "Time format",
        options: {
          "12h": "12 hour (AM/PM)",
          "24h": "24 hour",
        },
      },
      firstDay: {
        label: "First day of week",
        options: {
          sunday: "Sunday",
          monday: "Monday",
        },
      },
      autoStart: {
        label: "Launch app on startup",
        description: "Start BizLinkOne automatically when you sign in to your device.",
      },
      confirmExit: {
        label: "Confirm before closing",
        description: "Warn me if I try to close with drafts or active calls.",
      },
      betaFeatures: {
        label: "Enable early access features",
        description: "Try experimental functionality before it becomes generally available.",
      },
      analytics: {
        label: "Share anonymous analytics",
        description: "Help improve BizLinkOne by sharing usage insights.",
      },
      actions: {
        clearCache: "Clear local cache",
        cacheDescription: "Remove cached assets to free disk space. You'll remain signed in.",
      },
    },
    dialogs: {
      preview: {
        title: "Theme preview",
        description: "A quick look at how cards, buttons, and navigation adapt to your current choices.",
      },
      reset: {
        title: "Reset preferences",
        description: "Restore all preferences to their default values. Changes apply after you save.",
        confirm: "Reset anyway",
      },
      cache: {
        title: "Clear local cache",
        description: "Remove cached assets and temporary files stored on this device.",
        confirm: "Clear cache",
      },
      shortcut: {
        save: "Save shortcut",
      },
    },
    toast: {
      saved: {
        title: "Preferences saved",
        description: "Your personal settings are now in effect.",
      },
      reset: {
        title: "Defaults restored",
        description: "Review the changes, then save to apply them.",
      },
      notification: {
        title: "Test notification sent",
        description: "Check your active channels for the example alert.",
      },
      cacheCleared: {
        title: "Cache cleared",
        description: "Temporary files removed. Some assets may reload once.",
      },
    },
  },
  auth: {
    login: {
      title: "Sign in",
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
      project: {
        placeholder: "All projects",
        options: {
          all: "All projects",
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
      gantt: "Gantt view",
    },
    kanban: {
      columns: {
        todo: "To do",
        inProgress: "In progress",
        review: "Review",
        done: "Done",
      },
    },
    gantt: {
      unknownProject: "Unassigned project",
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
        today: "Due today • {{date}}",
        future: "Due {{date}} (in {{days}} days)",
        past: "Overdue {{date}} ({{days}} days ago)",
      },
      estimate: "Est.: {{hours}}h",
      related: {
        chat: "Open related chat",
        meeting: "Open related meeting",
      },
      actions: {
        menu: "Task actions menu",
        changeStatus: "Change status from {{status}}",
        edit: "Edit",
        favorite: "Add to favorites",
        unfavorite: "Remove from favorites",
        duplicate: "Duplicate",
        share: "Share",
        archive: "Archive",
        delete: "Delete",
      },
    },
    integrations: {
      title: "Calendar & conferencing",
      description: "Manage connected calendars and video platforms for automated scheduling.",
      status: {
        connected: "Connected",
        disconnected: "Not connected",
      },
      actions: {
        connect: "Connect",
        disconnect: "Disconnect",
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
        project: {
          label: "Project",
          placeholder: "Select a project",
          none: "No project linked",
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
      notifications: {
        dueSoon: {
          fallbackTitle: "Task",
          title: "\"{{title}}\" is due soon",
          message: "\"{{title}}\" is due in {{hours}} hours",
        },
        deleted: {
          title: "Task deleted",
          message: "Deleted \"{{title}}\"",
        },
        duplicated: {
          title: "Task duplicated",
          message: "Created a copy of the task",
        },
        archived: {
          title: "Task archived",
          message: "Moved task to archive",
        },
        shared: {
          title: "Task shared",
          message: "Copied task share link to clipboard",
        },
        favorited: {
          title: "Added to favorites",
          message: "Added task to your favorites",
        },
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
      accessNotes: "Access meeting notes",
      actions: {
        menu: "Meeting actions menu",
        edit: "Edit",
        favorite: "Add to favorites",
        unfavorite: "Remove from favorites",
        duplicate: "Duplicate",
        share: "Share",
        cancel: "Cancel",
        delete: "Delete",
      },
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
        select: "Select {{name}} project",
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
      title: "Project Timeline",
      duration: "{{count}} days",
      status: {
        todo: "To do",
        inProgress: "In progress",
        review: "Review",
        done: "Done",
      },
      actions: {
        previous: "Previous week",
        next: "Next week",
      },
      taskLabel: "{{title}} - {{progress}}% complete",
      log: {
        taskClick: "Timeline task clicked:",
      },
      empty: "No tasks to display",
    },
    create: {
      log: "Creating project:",
      title: "Create New Project",
      description: "Set up a new project with goals, team members, and milestones.",
      fields: {
        name: "Project Name",
        namePlaceholder: "Enter project name...",
        description: "Description",
        descriptionPlaceholder: "Describe this project...",
        template: "Template",
        templatePlaceholder: "Choose a template (optional)",
        manager: "Project Manager",
        managerPlaceholder: "Select a manager",
        team: "Team Members",
        priority: "Priority",
        priorityOptions: {
          low: "Low",
          medium: "Medium",
          high: "High",
          urgent: "Urgent",
        },
        startDate: "Start Date",
        endDate: "End Date",
        milestones: "Milestones",
      },
      templates: {
        software: {
          name: "Software Development",
          description: "API, frontend, QA phases",
        },
        marketing: {
          name: "Marketing Campaign",
          description: "Planning, execution, analysis",
        },
        research: {
          name: "Research Project",
          description: "Literature review, experiments, reports",
        },
        custom: {
          name: "Custom Project",
          description: "Start from scratch",
        },
      },
      milestones: {
        title: "Milestones ({{count}})",
        add: "Add",
        addTitle: "Add Milestone",
        addDescription: "Track major goals and deadlines for this project.",
        fields: {
          title: "Milestone Title",
          titlePlaceholder: "Milestone name...",
          dueDate: "Due Date",
          selectDate: "Select date",
        },
        cancel: "Cancel",
        save: "Add",
        empty: "No milestones yet",
      },
      cancel: "Cancel",
      submit: "Create Project",
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
    detail: {
      noDescription: "No description provided",
      tabs: {
        overview: "Overview",
        team: "Team",
        tasks: "Tasks",
      },
      overallProgress: "Overall Progress",
      tasks: "Tasks",
      milestones: "Milestones",
      timeline: "Timeline",
      startDate: "Start Date",
      endDate: "End Date",
      upcomingMilestones: "Upcoming Milestones",
      completed: "Completed",
      noMilestones: "No milestones defined",
      teamMembers: "Team Members ({{count}})",
      addMember: "Add Member",
      projectTasks: "Project Tasks ({{count}})",
      createTask: "Create Task",
      assignedTo: "Assigned to",
      noTasks: "No tasks yet",
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
          alphabetical: "A → Z",
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
    card: {
      anonymous: "Anonymous",
      views: "{{count}} views",
      openChat: "Open chat",
      share: "Share knowledge",
      actions: {
        menu: "Knowledge actions menu",
        edit: "Edit",
        favorite: "Add to favorites",
        unfavorite: "Remove from favorites",
        duplicate: "Duplicate",
        share: "Share",
        archive: "Archive",
        delete: "Delete",
      },
    },
    create: {
      title: "Create Knowledge Article",
      description: "Document and share team insights.",
      descriptionWithAuthor: "Create knowledge article from {{author}}'s message.",
      fields: {
        title: "Title",
        titlePlaceholder: "Enter article title...",
        summary: "Summary",
        summaryPlaceholder: "Brief summary (optional - auto-generated if empty)",
        content: "Content",
        contentPlaceholder: "Article content...",
        category: "Category",
        categoryPlaceholder: "Select category",
        tags: "Tags",
        tagPlaceholder: "Add custom tag...",
        quickAdd: "Quick add",
      },
      create: "Create Article",
    },
    detail: {
      author: "Author",
      created: "Created",
      updated: "Updated",
      views: "Views",
      tags: "Tags",
      tagsPlaceholder: "tag1, tag2, tag3...",
      content: "Content",
      relatedContext: "Related Context",
      fromChat: "From Chat",
      fromMeeting: "From Meeting",
      openChat: "Open Chat",
      openMeeting: "View Meeting",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      deleteConfirm: "Are you sure you want to delete this article? This action cannot be undone.",
    },
  },
  chat: {
    message: {
      actions: {
        messageActions: "Message actions",
        reply: "Reply",
        task: "Task",
        knowledge: "Knowledge",
        more: "More",
        edit: "Edit",
        copy: "Copy",
        pin: "Pin",
        unpin: "Unpin",
        share: "Share",
        flag: "Report",
        delete: "Delete",
      },
    },
  },
  workspace: {
    members: {
      title: "Workspace Members",
      tabs: {
        members: "Members",
        invites: "Invites",
      },
      inviteNew: "Invite New Member",
      emailPlaceholder: "email@company.com",
      sendInvite: "Send Invite",
      searchPlaceholder: "Search members...",
      you: "You",
      actions: "Actions",
      changeRole: "Change role to:",
      remove: "Remove Member",
      removeConfirm: "Remove {{name}} from this workspace?",
      close: "Close",
      noPendingInvites: "No pending invites",
      invitedBy: "Invited by {{name}}",
      expired: "Expired",
      pending: "Pending",
      resendInvite: "Resend Invite",
      cancelInvite: "Cancel Invite",
    },
  },
} as const;

export type Translation = typeof en;
