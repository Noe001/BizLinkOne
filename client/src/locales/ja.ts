export const ja = {
  language: {
    label: "言語",
    english: "英語",
    japanese: "日本語",
  },
  settings: {
    header: {
      description: "ワークスペースの設定と環境設定を管理します。",
    },
    tabs: {
      general: "一般",
      team: "チーム",
      security: "セキュリティ",
      billing: "請求",
    },
    actions: {
      saveChanges: "変更を保存",
    },
    alert: {
      unsaved: "未保存の変更があります。\n\"{{action}}\" をクリックして適用してください。",
    },
    general: {
      workspaceInfo: {
        title: "ワークスペース情報",
        description: "ワークスペースレベルの設定と詳細を管理します。",
      },
      fields: {
        name: "ワークスペース名",
        domain: "ワークスペースドメイン",
        description: "説明",
        timezone: "タイムゾーン",
        language: "言語",
      },
      timezones: {
        et: "東部標準時 (US)",
        ct: "中央標準時 (US)",
        mt: "山岳標準時 (US)",
        pt: "太平洋標準時 (US)",
        gmt: "グリニッジ標準時",
        cet: "中央ヨーロッパ時間",
        jst: "日本標準時",
      },
      languages: {
        en: "英語",
        es: "スペイン語",
        fr: "フランス語",
        de: "ドイツ語",
        ja: "日本語",
      },
      access: {
        title: "アクセスと権限",
        description: "ワークスペースへアクセスできる人と操作範囲を制御します。",
        guestAccess: {
          label: "ゲストアクセスを許可",
          description: "招待されたゲストに閲覧やコメントを許可します（権限に応じて）。",
        },
      },
    },
    team: {
      title: "チーム管理",
      description: "ワークスペースのメンバーを招待・管理します。",
      membersBadge: "{{count}} メンバー",
      actions: {
        inviteMembers: "メンバーを招待",
        bulkInvite: "一括招待",
      },
      statuses: {
        active: "アクティブ",
        pending: "保留中",
      },
      roles: {
        admin: "管理者",
        manager: "マネージャー",
        member: "メンバー",
      },
    },
    security: {
      title: "セキュリティ",
      description: "ワークスペースのセキュリティ設定。",
      requireTwoFactor: {
        label: "二要素認証を必須にする",
        description: "有効にすると全メンバーに2FAを要求します。",
      },
      sessionTimeout: {
        label: "セッションのタイムアウト",
        options: {
          "15": "15分",
          "30": "30分",
          "60": "1時間",
          "240": "4時間",
          "480": "8時間",
        },
      },
    },
    billing: {
      currentPlan: {
        title: "現在のプラン",
        description: "このワークスペースの請求とプラン情報。",
        planLabel: "プラン",
        seatsLabel: "シート数",
        costLabel: "費用",
      },
      nextBilling: {
        title: "次回の請求",
      },
      actions: {
        changePlan: "プランを変更",
        addSeats: "シートを追加",
      },
    },
  },
  common: {
    appName: "BizLinkOne",
    searchPlaceholder: "検索...",
    cancel: "キャンセル",
    confirm: "確定",
    loading: "読み込み中...",
  },
  nav: {
    dashboard: "ダッシュボード",
    projects: "プロジェクト",
    tasks: "タスク",
    knowledge: "ナレッジ",
    meetings: "ミーティング",
    settings: "設定",
    chat: "チャット",
    platform: "プラットフォーム",
    directMessages: "ダイレクトメッセージ",
    createChannel: "チャンネルを作成",
    newDm: "新しいDM",
    accountSettings: "アカウント設定",
    workspaceSettings: "ワークスペース設定",
    createWorkspace: "ワークスペース作成",
    joinWorkspace: "ワークスペース参加",
  },
  header: {
    notificationsAria: "通知",
    searchLabel: "検索",
  },
  userMenu: {
    viewProfile: "プロフィールを表示",
    accountSettings: "アカウント設定",
    preferences: "環境設定",
    notifications: "通知",
    securityPrivacy: "セキュリティとプライバシー",
    darkMode: "ダークモード",
    language: "言語",
    helpSupport: "ヘルプとサポート",
    signOut: "サインアウト",
    auto: "自動",
    languageTag: {
      en: "EN",
      ja: "JA",
    },
  },
  accountSettings: {
    header: {
      back: "戻る",
      description: "個人のアカウント設定と各種環境設定を管理します。",
    },
    actions: {
      saveChanges: "変更を保存",
    },
    alert: {
      unsaved: "未保存の変更があります。「{{action}}」をクリックして適用してください。",
    },
    tabs: {
      profile: "プロフィール",
      notifications: "通知",
      appearance: "外観",
      security: "セキュリティとプライバシー",
    },
    profile: {
      title: "プロフィール情報",
      description: "個人情報と連絡先を更新します。",
      avatar: {
        memberSince: "メンバー登録日: {{date}}",
        upload: "写真をアップロード",
        remove: "削除",
      },
      fields: {
        name: "氏名",
        email: "メールアドレス",
        department: "部署",
        timezone: "タイムゾーン",
      },
      departments: {
        engineering: "エンジニアリング",
        design: "デザイン",
        marketing: "マーケティング",
        sales: "セールス",
        support: "サポート",
        humanResources: "人事",
      },
    },
    notifications: {
      email: {
        title: "メール通知",
        description: "メール通知を受け取るタイミングを設定します。",
        items: {
          mentions: {
            label: "メンション",
            description: "メッセージであなたが言及されたとき",
          },
          directMessages: {
            label: "ダイレクトメッセージ",
            description: "ダイレクトメッセージを受信したとき",
          },
          taskAssignments: {
            label: "タスク割り当て",
            description: "タスクを割り当てられたとき",
          },
          meetingReminders: {
            label: "会議リマインダー",
            description: "予定された会議のリマインダー",
          },
          weeklyDigest: {
            label: "週間サマリー",
            description: "1週間のアクティビティ概要",
          },
        },
      },
      push: {
        title: "プッシュ通知",
        description: "リアルタイムのプッシュ通知を設定します。",
        items: {
          mentions: {
            label: "メンション",
            description: "メンションの即時通知",
          },
          directMessages: {
            label: "ダイレクトメッセージ",
            description: "DMの即時通知",
          },
          taskDeadlines: {
            label: "タスク期限",
            description: "迫っているタスク期限の通知",
          },
          meetingStart: {
            label: "会議開始",
            description: "会議開始時の通知",
          },
        },
      },
    },
    appearance: {
      title: "テーマと表示設定",
      description: "ワークスペースの見た目や表示方法をカスタマイズします。",
      themeLabel: "テーマモード",
      themes: {
        light: "ライトモード",
        dark: "ダークモード",
        system: "システムに合わせる",
      },
      accentLabel: "アクセントカラー",
      colors: {
        blue: "青",
        green: "緑",
        purple: "紫",
        red: "赤",
        orange: "オレンジ",
        yellow: "黄",
        pink: "ピンク",
        indigo: "インディゴ",
      },
      options: {
        compactMode: {
          label: "コンパクトモード",
          description: "余白とパディングを減らし、よりコンパクトなインターフェースにします。",
        },
        sidebarCollapsed: {
          label: "サイドバーを初期状態で折りたたむ",
          description: "アプリを開いた際にサイドバーを折りたたんだ状態で表示します。",
        },
      },
    },
    security: {
      title: "パスワードと認証",
      description: "アカウントのセキュリティと認証方法を管理します。",
      currentPassword: {
        label: "現在のパスワード",
        description: "最終変更日: 3か月前",
      },
      changePassword: "パスワードを変更",
      twoFactor: {
        label: "二要素認証",
        description: "アカウントに追加のセキュリティ層を追加します",
        enabled: "有効",
      },
      sessions: {
        title: "アクティブなセッション",
        current: {
          label: "現在のセッション",
          description: "Windows 上の Chrome ・ ニューヨーク",
          status: "アクティブ",
        },
        mobile: {
          label: "モバイルアプリ",
          description: "iOS ・ 最終アクセス 2時間前",
          action: "取り消す",
        },
      },
      privacy: {
        title: "プライバシー設定",
        description: "情報の共有方法と表示方法を管理します。",
        profileVisibility: {
          label: "プロフィールの公開範囲",
          description: "プロフィール情報を表示できる範囲",
          options: {
            everyone: "全員",
            team: "チームのみ",
            private: "非公開",
          },
        },
        showOnlineStatus: {
          label: "オンライン状況を表示",
          description: "オンライン状態を他のメンバーに知らせます",
        },
        shareActivity: {
          label: "アクティビティステータスを共有",
          description: "作業中の内容をチームに共有します",
        },
        dataAnalytics: {
          title: "データと分析",
          usageAnalytics: {
            label: "利用状況分析",
            description: "利用データを共有してプラットフォーム改善に協力します",
          },
          download: "データをダウンロード",
          delete: "アカウントを削除",
        },
      },
    },
  },
  auth: {
    login: {
      title: "BizLinkOne にサインイン",
      subtitle: "ワークスペースにアクセス",
      emailLabel: "メールアドレス",
      emailPlaceholder: "you@example.com",
      passwordLabel: "パスワード",
      passwordPlaceholder: "パスワードを入力",
      signIn: "サインイン",
      signingIn: "サインインしています...",
      forgotPassword: "パスワードをお忘れですか?",
      passwordResetNotice: "このデモではパスワードのリセットは利用できません。",
      createAccount: "新しいアカウントを作成",
      joinWorkspace: "ワークスペースに招待されましたか?",
      showPassword: "パスワードを表示",
      hidePassword: "パスワードを非表示",
    },
    signup: {
      title: "アカウントを作成",
      subtitle: "チームのワークスペースを開始",
      nameLabel: "氏名",
      namePlaceholder: "山田 太郎",
      emailLabel: "メールアドレス",
      emailPlaceholder: "you@example.com",
      passwordLabel: "パスワード",
      passwordPlaceholder: "8文字以上のパスワード",
      confirmPasswordLabel: "パスワードを再入力",
      confirmPasswordPlaceholder: "パスワードを再入力",
      createAccount: "アカウントを作成",
      creatingAccount: "アカウントを作成しています...",
      backToLogin: "サインインに戻る",
      agreeToTerms: "利用規約とプライバシーポリシーに同意します",
      passwordMismatch: "パスワードが一致しません。",
      termsAgreementRequired: "利用規約とプライバシーポリシーへの同意が必要です。",
    },
    workspaceCreate: {
      title: "ワークスペースを作成",
      subtitle: "新しいコラボレーションスペースを設定",
      workspaceNameLabel: "ワークスペース名",
      workspaceNamePlaceholder: "株式会社サンプル",
      workspaceUrlLabel: "ワークスペースURL",
      workspaceUrlPlaceholder: "your-workspace",
      workspaceUrlHelp: "後から設定で変更できます。",
      descriptionLabel: "説明 (任意)",
      descriptionPlaceholder: "このワークスペースの目的や概要を入力してください",
      industryLabel: "業種",
      industryPlaceholder: "業種を選択",
      industryOptions: {
        technology: "テクノロジー",
        finance: "金融",
        healthcare: "ヘルスケア",
        education: "教育",
        retail: "小売",
        manufacturing: "製造",
        consulting: "コンサルティング",
        other: "その他",
      },
      teamSizeLabel: "チーム人数",
      teamSizePlaceholder: "人数を選択",
      teamSizeOptions: {
        "1-5": "1?5人",
        "6-15": "6?15人",
        "16-50": "16?50人",
        "51-100": "51?100人",
        "100+": "100人以上",
      },
      createWorkspace: "ワークスペースを作成",
      creatingWorkspace: "ワークスペースを作成しています...",
      backToLogin: "サインインに戻る",
      joinExisting: "既存のワークスペースに参加",
      benefits: {
        teamManagement: "チーム管理",
        projectTracking: "プロジェクト管理",
        integratedPlatform: "統合プラットフォーム",
      },
      benefitsDescription: "ワークスペース作成後にチームメンバーを招待して、すぐにプロジェクトを開始できます。",
    },
    workspaceJoin: {
      title: "ワークスペースに参加",
      subtitle: "招待情報を入力して開始しましょう",
      inviteCodeLabel: "招待コードまたはワークスペースURL",
      inviteCodePlaceholder: "ABC123 または your-workspace",
      inviteCodeHelp: "ワークスペース管理者から共有された招待情報を使用してください。",
      emailLabel: "メールアドレス",
      emailHelp: "招待を受け取ったメールアドレスを入力してください。",
      joinWorkspace: "ワークスペースに参加",
      joiningWorkspace: "ワークスペースに参加しています...",
      createNewWorkspace: "新しいワークスペースを作成",
      missingInvite: "招待が見つかりませんか?",
      teamWorkspaceTitle: "チームワークスペース",
      teamWorkspaceDescription: "既存のチームワークスペースに参加して、すぐにコラボレーションを開始できます。",
      inviteSentNotice: "招待リンクはメールで送信されます。",
    },
  },
  dashboard: {
    log: {
      convertToTask: "メッセージからタスクを作成:",
      convertToKnowledge: "メッセージをナレッジに保存:",
      reply: "メッセージに返信:",
    },
    notifications: {
      taskCreated: {
        title: "タスクを作成しました",
        message: "新しいタスクをワークスペースに追加しました。",
      },
      knowledgeCreated: {
        title: "ナレッジを保存しました",
        message: "内容をナレッジベースに保存しました。",
      },
      title: "通知",
      markAllRead: "すべて既読にする",
      empty: "通知はありません",
      viewAll: "すべての通知を表示",
      types: {
        task: {
          dueSoon: "タスク期限間近",
          reminder: "タスクリマインダー",
          messages: {
            dueSoon: "{{taskName}}の期限まで{{timeLeft}}です",
            reminder: "{{taskName}}をお忘れなく"
          }
        },
        meeting: {
          starting: "ミーティング開始",
          reminder: "ミーティングリマインダー",
          messages: {
            starting: "{{meetingName}}が{{timeLeft}}で開始します",
            reminder: "{{meetingName}}が予定されています"
          }
        },
        message: {
          new: "新しいメッセージ",
          mention: "あなたがメンションされました",
          messages: {
            mention: "{{userName}}が{{channelName}}であなたにメンションしました",
            new: "{{userName}}からの新しいメッセージ"
          }
        },
        knowledge: {
          updated: "ナレッジが更新されました",
          new: "新しいナレッジ",
          messages: {
            updated: "{{documentName}}が更新されました",
            new: "新しいナレッジ記事: {{documentName}}"
          }
        },
        reminder: {
          general: "リマインダー",
          messages: {
            general: "セキュリティ要件の確認をお忘れなく"
          }
        },
      },
    },
    header: {
      description: "会話・タスク・ミーティングの状況をまとめて把握できます。",
    },
    actions: {
      new: "クイックアクション",
    },
    stats: {
      chats: {
        title: "アクティブなチャット",
        hint: "前日比 +{{delta}}",
      },
      tasks: {
        title: "今日の期限",
        hint: "本日対応が必要なタスク {{count}} 件",
      },
      projects: {
        title: "順調なプロジェクト",
        hint: "計画通り進行中 {{count}} 件",
      },
      knowledge: {
        title: "ナレッジ更新",
        hint: "今週追加 {{count}} 件",
      },
      meetings: {
        title: "予定されたミーティング",
        hint: "次の開始まで {{hours}} 時間",
      },
    },
    sections: {
      messages: {
        title: "最近のメッセージ",
        description: "重要な更新をすばやくチェックできます。",
        emptyTitle: "メッセージがありません",
        emptyDescription: "チャットを開始するかチャンネルを参照するとここに表示されます。",
        browse: "チャンネル一覧を見る",
        viewAll: "すべてのメッセージを表示",
      },
      tasks: {
        title: "進行中のタスク",
        description: "優先度の高い作業を管理しましょう。",
        emptyTitle: "タスクがまだありません",
        emptyDescription: "最初のタスクを作成して進捗を追跡しましょう。",
        actions: {
          create: "タスクを作成",
        },
        viewAll: "すべてのタスクを表示",
      },
      knowledge: {
        title: "ナレッジベース",
        description: "チームで共有されたハイライトを確認できます。",
        emptyTitle: "記事がありません",
        emptyDescription: "ミーティングノートや要約を保存するとここに表示されます。",
        actions: {
          create: "ナレッジを追加",
        },
        viewAll: "すべてのナレッジを表示",
      },
      meetings: {
        title: "今後のミーティング",
        description: "予定されているセッションを確認します。",
        emptyTitle: "ミーティングは予定されていません",
        emptyDescription: "最初のミーティングをスケジュールしてコラボレーションを始めましょう。",
        actions: {
          schedule: "ミーティングを予約",
        },
        viewAll: "すべてのミーティングを表示",
      },
    },
    projects: {
      core: {
        name: "コアプラットフォーム刷新",
        description: "認証・権限・ワークスペース基盤の安定化。",
      },
      frontend: {
        name: "フロントエンド改善",
        description: "ダッシュボードとUIインタラクションの磨き込み。",
      },
      documentation: {
        name: "ナレッジ導入",
        description: "新しいAPIとオンボーディングガイドの整備。",
      },
    },
  },
  tasks: {
    header: {
      title: "タスク",
      description: "ワークスペース全体の作業を計画・割り当て・追跡します。",
    },
    actions: {
      new: "タスクを追加",
    },
    filters: {
      title: "フィルター",
      description: "ステータスや優先度、キーワードで絞り込みます。",
      searchPlaceholder: "タスク・担当者・タグを検索...",
      status: {
        placeholder: "すべてのステータス",
        options: {
          all: "すべて",
          todo: "未着手",
          inProgress: "進行中",
          review: "レビュー待ち",
          done: "完了",
        },
      },
      priority: {
        placeholder: "すべての優先度",
        options: {
          all: "すべて",
          urgent: "最優先",
          high: "高",
          medium: "中",
          low: "低",
        },
      },
      clear: "フィルターをクリア",
    },
    stats: {
      showing: "全 {{total}} 件中 {{count}} 件を表示",
    },
    viewModes: {
      list: "リスト表示",
      kanban: "カンバン表示",
    },
    kanban: {
      columns: {
        todo: "未着手",
        inProgress: "進行中",
        review: "レビュー",
        done: "完了",
      },
    },
    empty: {
      column: "この列にはタスクがありません",
      list: "条件に一致するタスクがありません",
    },
    card: {
      priority: {
        low: "低",
        medium: "中",
        high: "高",
        urgent: "最優先",
      },
      status: {
        todo: "未着手",
        inProgress: "進行中",
        review: "レビュー",
        done: "完了",
      },
      due: {
        today: "本日が期限 ・ {{date}}",
        future: "期限 {{date}} (あと {{days}} 日)",
        past: "期限切れ {{date}} ({{days}} 日前)",
      },
      estimate: "目安: {{hours}} 時間",
      related: {
        chat: "関連チャットを開く",
        meeting: "関連ミーティングを開く",
      },
    },
    create: {
      title: "タスクを作成",
      description: "必要な情報を入力して作業を割り当てます。",
      validation: {
        titleRequired: "件名は必須です。",
        titleTooShort: "件名は3文字以上で入力してください。",
        descriptionTooLong: "説明は2000文字以内で入力してください。",
        estimateRange: "見積もり時間は0?999の範囲で入力してください。",
        tagLimit: "タグは最大5個まで追加できます。",
      },
      fields: {
        title: {
          label: "件名",
          placeholder: "タスク名を入力",
        },
        description: {
          label: "説明",
          placeholder: "作業内容を記載してください",
        },
        status: {
          label: "ステータス",
          options: {
            todo: "未着手",
            "in-progress": "進行中",
            review: "レビュー",
            done: "完了",
          },
        },
        priority: {
          label: "優先度",
          options: {
            low: "低",
            medium: "中",
            high: "高",
            urgent: "最優先",
          },
        },
        assignee: {
          label: "担当者",
          placeholder: "担当者を選択",
          unassigned: "未割り当て",
        },
        dueDate: {
          label: "期限",
          placeholder: "日付を選択",
        },
        estimate: {
          label: "見積もり時間",
          placeholder: "例: 4.5",
        },
        relatedChat: {
          label: "関連チャット",
          placeholder: "チャンネルを選択",
          none: "関連チャットなし",
        },
        tags: {
          label: "タグ",
          placeholder: "タグを追加...",
          add: "追加",
          help: "{{limit}} 個まで追加できます (現在 {{count}} 個)",
        },
      },
      actions: {
        cancel: "キャンセル",
        reset: "リセット",
        submitting: "作成中...",
        submit: "タスクを作成",
      },
      team: {
        roles: {
          engineer: "ソフトウェアエンジニア",
          designer: "プロダクトデザイナー",
          pm: "プロダクトマネージャー",
          devops: "DevOps エンジニア",
          qa: "QA エンジニア",
        },
      },
    },
    samples: {
      tags: {
        backend: "バックエンド",
        security: "セキュリティ",
        documentation: "ドキュメント",
        api: "API",
        frontend: "フロントエンド",
        mobile: "モバイル",
        css: "CSS",
        devops: "DevOps",
        automation: "自動化",
        database: "データベース",
        performance: "パフォーマンス",
        ux: "UX",
      },
      auth: {
        title: "認証サービスを実装",
        description: "安全なログイン・リフレッシュトークン・権限管理を提供します。",
        subtasks: {
          0: "既存のサインインフローを調査",
          1: "JWT 発行サービスを構築",
          2: "設定画面に多要素認証のトグルを追加",
        },
        comments: {
          0: "課金プロジェクトの暗号化ヘルパーを再利用しましょう。",
          1: "本番展開の移行計画をまとめておきます。",
        },
        timeEntries: {
          0: "要件確認とAPI契約の調整",
          1: "トークンリフレッシュ処理を実装",
        },
      },
      documentation: {
        title: "APIドキュメントを更新",
        description: "新しい認証エンドポイントとWebhookをドキュメントへ反映します。",
        subtasks: {
          0: "追加エンドポイントをレビュー",
        },
        comments: {
          0: "エラーケースのペイロード例も載せておきましょう。",
        },
        timeEntries: {
          0: "認証セクションの草案を作成",
        },
      },
      responsive: {
        title: "レスポンシブ表示を修正",
        description: "ダッシュボードカードとチャットのモバイル表示を改善します。",
        subtasks: {
          0: "iPhone 13 でレイアウトを確認",
          1: "サイドバーのflex挙動を調整",
        },
        comments: {
          0: "デザイントークンのスペーシングに合わせましょう。",
        },
        timeEntries: {
          0: "グリッドユーティリティとメディアクエリを調整",
        },
      },
      cicd: {
        title: "CI/CD パイプライン構築",
        description: "ビルド・テスト・ステージングデプロイを自動化します。",
        subtasks: {
          0: "ステージング用シークレットを定義",
        },
        comments: {
          0: "Lint ステップで古い設定が原因の失敗あり。明日修正します。",
        },
      },
      database: {
        title: "データベース最適化",
        description: "ボトルネックを特定し、主要クエリへインデックスを追加します。",
        comments: {
          0: "リリース後のクエリ時間を監視するチケットを追加しました。",
        },
        timeEntries: {
          0: "監査ログテーブルにインデックスを追加しベンチマーク",
        },
      },
      onboarding: {
        title: "オンボーディングフロー設計",
        description: "ワークスペース管理者向けの初回体験を改善します。",
        subtasks: {
          0: "ウェルカムガイドをスケッチ",
          1: "コピーをマーケと確認",
        },
        comments: {
          0: "マーケティングからステップ2のスクリーンショット更新あり。",
        },
        timeEntries: {
          0: "Storybook でプロトタイプを作成",
        },
      },
    },
  },
  meetings: {
    log: {
      join: "ミーティングに参加:",
      create: "ミーティングを作成:",
      createTask: "ミーティングからタスクを作成:",
      createKnowledge: "ミーティングからナレッジを作成:",
      share: "チャットへ共有:",
    },
    header: {
      description: "ミーティング予定や録画・ノートをまとめて管理します。",
    },
    actions: {
      schedule: "ミーティングを予約",
      scheduleFirst: "最初のミーティングを予約",
      clearSearch: "検索条件をクリア",
    },
    stats: {
      total: { label: "全ミーティング", hint: "すべての予定" },
      upcoming: { label: "今後の予定", hint: "これから始まるミーティング" },
      ongoing: { label: "進行中", hint: "現在進行中のミーティング" },
      completedToday: { label: "本日完了", hint: "本日終了したミーティング" },
    },
    filters: {
      searchPlaceholder: "ミーティング・説明・参加者を検索...",
      toggle: "フィルター",
      sort: {
        placeholder: "並び替え",
        options: {
          date: "日付",
          title: "タイトル",
          status: "ステータス",
        },
      },
      status: {
        label: "ステータス",
        placeholder: "すべてのステータス",
        options: {
          all: "すべて",
          scheduled: "予定",
          ongoing: "進行中",
          completed: "完了",
          cancelled: "キャンセル",
        },
      },
      date: {
        label: "日付",
        placeholder: "期間を選択",
        options: {
          all: "すべての日程",
          today: "今日",
          tomorrow: "明日",
          week: "今週",
        },
      },
      summary: {
        status: "ステータス: {{value}}",
        date: "日付: {{value}}",
        clear: "フィルターを解除",
      },
    },
    statusLabels: {
      scheduled: "予定",
      ongoing: "進行中",
      completed: "完了",
      cancelled: "キャンセル",
    },
    results: {
      summary: "{{total}} 件中 {{count}} 件を表示",
      searchTag: "「{{query}}」",
      empty: {
        defaultTitle: "予定されたミーティングがありません",
        defaultDescription: "最初のミーティングを予約してコラボレーションを始めましょう。",
        searchTitle: "ミーティングが見つかりません",
        searchDescription: "「{{query}}」に一致するミーティングはありません。検索条件を調整してください。",
      },
    },
    card: {
      status: {
        upcoming: "もうすぐ開始",
        live: "ライブ",
        ended: "終了",
        cancelled: "キャンセル",
      },
      joinNow: "今すぐ参加",
      join: "参加",
      accessNotes: "ノートを開く",
    },
    samples: {
      dailyStandup: {
        title: "デイリースタンドアップ",
        description: "進捗とブロッカーを共有する短時間の同期",
        notes: "認証ロールアウトへの依存があることを共有しました。",
      },
      sprintPlanning: {
        title: "スプリント計画",
        description: "次のスプリントの見積もりとキャパシティ計画を行います。",
        notes: "スプリント目標を合意。認証改善とダッシュボードの磨き込みに注力します。",
        decisions: {
          0: "新しい認証システムを導入する",
          1: "APIドキュメントを更新する",
        },
        actionItems: {
          0: "開発環境をセットアップ",
          1: "セキュリティ要件を確認",
        },
      },
      productDemo: {
        title: "プロダクトデモ",
        description: "新機能をステークホルダーにデモします。",
        notes: "機能セットは承認され、次回までに分析ダッシュボード案を準備することになりました。",
        decisions: {
          0: "フィーチャーフラグを本番に展開",
          1: "分析ダッシュボード案を準備",
        },
      },
      clientReview: {
        title: "クライアントレビュー",
        description: "クライアントと進捗を確認する定例ミーティング",
        notes: "認証アップデートがテスト可能になったらフォローアップを依頼されました。",
      },
      recordings: {
        defaultName: "{{title}} の録画",
      },
    },
    details: {
      subtitle: "ミーティングのノート・アクション・録画を確認します。",
      tabs: {
        overview: "概要",
        notes: "ノート",
        actions: "アクションアイテム",
        recordings: "録画",
      },
      overview: {
        schedule: "スケジュール",
        platform: "プラットフォーム",
        duration: "所要時間",
        description: "説明",
        participants: "参加者 ({{count}})",
        link: "ミーティングリンク",
        copyLink: "リンクをコピー",
      },
      platform: {
        zoom: "Zoom",
        meet: "Google Meet",
        teams: "Microsoft Teams",
        other: "その他",
      },
      actionItemTaskDescription: "ミーティングのアクション: {{title}}",
      summary: {
        heading: "## ミーティングサマリー: {{title}}",
        date: "**日付:** {{value}}",
        duration: "**所要時間:** {{minutes}} 分",
        participants: "**参加者:** {{names}}",
        decisionsHeading: "## 決定事項",
        decisionItem: "{{index}}. {{text}}",
        actionItemsHeading: "## アクションアイテム",
        actionItem: "{{index}}. {{text}}{{assignee}}{{due}}",
        actionAssignee: " (担当: {{assignee}})",
        actionDue: " - 期限: {{due}}",
      },
      notes: {
        title: "ミーティングノート",
        placeholder: "ここにメモを追加...",
        knowledgeTitle: "ミーティングノート: {{title}}",
        category: "ミーティングノート",
        saveKnowledge: "ナレッジとして保存",
        shareSummary: "サマリーをチャットに共有",
      },
      decisions: {
        title: "決定事項",
        placeholder: "決定事項を追加...",
        add: "追加",
      },
      actions: {
        title: "アクションアイテム",
        assignedTo: "担当: {{assignee}}",
        due: "期限: {{date}}",
        placeholder: "新しいアクションを追加...",
        createTask: "タスクを作成",
      },
      recordings: {
        title: "録画・ファイル",
        duration: "再生時間: {{minutes}} 分",
        view: "表示",
        empty: "利用可能な録画はありません",
      },
      footer: {
        close: "閉じる",
        endMeeting: "ミーティングを終了",
      },
    },
    create: {
      title: "新しいミーティングを予約",
      description: "参加者へ自動通知されるミーティングを作成します。",
      form: {
        titleLabel: "タイトル *",
        titlePlaceholder: "ミーティングタイトルを入力...",
        descriptionLabel: "説明",
        descriptionPlaceholder: "アジェンダや共有事項...",
        dateLabel: "日付 *",
        datePlaceholder: "日付を選択",
        timeLabel: "開始時刻 *",
        durationLabel: "所要時間 (分)",
        durationPlaceholder: "所要時間を選択",
        durationOptions: {
          15: "15分",
          30: "30分",
          60: "60分",
          90: "90分",
          120: "120分",
        },
        platformLabel: "プラットフォーム",
        platformPlaceholder: "プラットフォームを選択",
        platformUrlLabel: "ミーティングURL",
        platformUrlPlaceholder: "https://...",
        participantsLabel: "参加者",
        removeParticipant: "{{name}} を削除",
        addParticipant: "{{name}} を追加",
        participantsAllAdded: "参加者はすべて追加済みです。",
        channelLabel: "関連チャット",
        channelPlaceholder: "チャンネルを選択 (任意)",
        channelNone: "関連チャットなし",
        recurringLabel: "定期ミーティング",
        recurringPatternLabel: "繰り返しパターン",
        recurringOptions: {
          daily: "毎日",
          weekly: "毎週",
          monthly: "毎月",
        },
        remindersLabel: "リマインダー通知を送信",
        notesLabel: "ミーティングノートのテンプレートを自動作成",
      },
      actions: {
        cancel: "キャンセル",
        submit: "ミーティングを予約",
      },
    },
  },
  projects: {
    header: {
      description: "ワークスペースの主要な取り組みを計画・追跡・分析します。",
    },
    actions: {
      new: "新規プロジェクト",
    },
    status: {
      planning: "計画中",
      active: "進行中",
      "on-hold": "一時停止",
      completed: "完了",
    },
    filters: {
      searchPlaceholder: "プロジェクトを検索...",
      status: {
        placeholder: "すべてのステータス",
        options: {
          all: "すべて",
          planning: "計画中",
          active: "進行中",
          onHold: "一時停止",
          completed: "完了",
        },
      },
    },
    tabs: {
      overview: "概要",
      timeline: "タイムライン",
      tasks: "タスク",
      analytics: "分析",
    },
    overview: {
      stats: {
        total: { title: "総プロジェクト数", delta: "今月 +{{value}}" },
        active: { title: "進行中", hint: "現在進行中のプロジェクト" },
        tasks: { title: "タスク数", hint: "完了 {{completed}} 件" },
        team: { title: "チーム人数", hint: "全プロジェクトの合計人数" },
      },
      project: {
        progress: "進捗",
        team: "チーム ({{count}})",
        tasks: "タスク {{completed}} / {{total}}",
        timeline: "開始 {{start}} / 終了 {{end}}",
        milestones: "マイルストーン ({{total}})",
        upcoming: "今後のマイルストーン",
        completed: "完了 {{completed}} / {{total}}",
        milestoneCompleted: "完了",
        milestoneWarning: "期限切れのマイルストーンがあります",
      },
    },
    timeline: {
      log: {
        taskClick: "タイムラインタスクをクリック:",
      },
    },
    create: {
      log: "プロジェクトを作成:",
    },
    tasks: {
      heading: "プロジェクトタスク ? {{project}}",
      progress: "進捗: {{value}}%",
      empty: "プロジェクトを選択するとタスクが表示されます",
    },
    analytics: {
      progress: { title: "プロジェクト進捗" },
      milestones: {
        title: "今後のマイルストーン",
        overdue: "期限超過",
        upcoming: "予定",
      },
    },
    samples: {
      core: {
        name: "コアプラットフォーム刷新",
        description: "認証・権限・基盤サービスの安定化。",
        health: "概ね順調 (DBリファクタ待ち)",
        milestones: {
          auth: "認証サービス再設計",
          database: "DBインデックス監査",
          api: "公開API v2 展開",
        },
      },
      frontend: {
        name: "フロントエンド改善",
        description: "UIパターンとレスポンシブ体験の近代化。",
        health: "デザイントークン統合進行中",
        milestones: {
          library: "コンポーネントライブラリ統合",
          responsive: "レスポンシブ改善",
          accessibility: "アクセシビリティ検証",
        },
      },
      documentation: {
        name: "ドキュメント拡充",
        description: "開発者ガイドとオンボーディング資料の拡張。",
        health: "API最終化待ち",
        milestones: {
          api: "APIリファレンス更新",
          userGuide: "ユーザーガイド改訂",
          review: "編集レビュー",
        },
      },
      tasks: {
        core: {
          auth: "認証モジュールリファクタ",
          database: "インデックス/クエリ最適化",
          monitoring: "メトリクス & トレーシング導入",
        },
        frontend: {
          library: "重複UIコンポーネント統合",
          a11y: "アクセシビリティ修正バッチ",
          docs: "Storybook ドキュメント更新",
        },
        documentation: {
          outline: "拡張ドキュメントアウトライン作成",
          guides: "初期ガイド執筆",
          review: "技術/編集レビュー",
        },
      },
    },
  },
  knowledge: {
    header: {
      title: "ナレッジ",
      description: "チームの知見を蓄積・整理・発見できます。",
    },
    actions: {
      new: "新規",
    },
    stats: {
      totalArticles: { title: "記事数", hint: "公開済みの合計" },
      views: { title: "閲覧数", hint: "累計閲覧数" },
      thisWeek: { title: "今週", hint: "今週の新規" },
      popularTags: { title: "人気のタグ" },
    },
    filters: {
      searchPlaceholder: "タイトル・タグ・作成者を検索...",
      sort: {
        placeholder: "並び替え",
        options: {
          recent: "新しい順",
          popular: "閲覧数順",
          alphabetical: "A → Z",
          oldest: "古い順",
        },
      },
      hideAdvanced: "詳細を隠す",
      showAdvanced: "詳細フィルター",
      tag: {
        label: "タグ",
        placeholder: "すべてのタグ",
        options: { all: "すべて" },
      },
      date: {
        label: "期間",
        placeholder: "すべての期間",
        options: {
          all: "すべて",
          week: "直近1週間",
          month: "直近1か月",
          quarter: "直近3か月",
        },
      },
      author: {
        label: "作成者",
        placeholder: "すべての作成者",
        options: { all: "すべて" },
      },
      summary: {
        tag: "タグ: {{value}}",
        date: "期間: {{value}}",
        author: "作成者: {{value}}",
      },
      clear: "フィルターをクリア",
    },
    results: {
      summary: "{{total}} 件中 {{count}} 件を表示",
      searchTag: '"{{query}}"',
    },
    empty: {
      searchTitle: "結果がありません",
      searchDescription: '"{{query}}" に一致する記事はありません。',
      defaultTitle: "記事がありません",
      defaultDescription: "ミーティングノートや要約を保存してナレッジを構築しましょう。",
      clearSearch: "検索をクリア",
      createFirst: "最初の記事を作成",
    },
    sidebar: {
      popular: { title: "人気" },
      recent: { title: "最新" },
      authors: { title: "作成者", count: "{{count}} 件" },
      suggestions: {
        title: "クイック検索",
        command: "検索を開く",
        placeholder: "入力して絞り込み...",
        empty: "候補がありません",
      },
    },
    log: {
      open: "記事を開く:",
      share: "記事を共有:",
    },
    samples: {
      auth: {
        title: "安全な認証アーキテクチャ",
        excerpt: "トークンライフサイクル・リフレッシュ戦略・ローテーション方針の概要。",
      },
      apiDocs: {
        title: "公開APIドキュメント標準",
        excerpt: "エンドポイント構造・例・エラーモデルのガイドライン。",
      },
      deployment: {
        title: "ブルー/グリーンデプロイ戦略",
        excerpt: "安全なリリース手法とロールバック手順。",
      },
      database: {
        title: "データベース索引設計原則",
        excerpt: "複合インデックス追加の判断基準と効果。",
      },
      frontend: {
        title: "コンポーネントライブラリ運用",
        excerpt: "バージョニング/変更管理/貢献ワークフロー。",
      },
      security: {
        title: "セキュリティベストプラクティス",
        excerpt: "安全なコーディング・依存関係管理・秘密情報の扱いチェックリスト。",
      },
    },
    tags: {
      authentication: "認証",
      security: "セキュリティ",
      jwt: "JWT",
      backend: "バックエンド",
      api: "API",
      documentation: "ドキュメント",
      standards: "標準",
      guidelines: "ガイドライン",
      deployment: "デプロイ",
      devops: "DevOps",
      production: "本番",
      ciCd: "CI/CD",
      testing: "テスト",
      database: "データベース",
      schema: "スキーマ",
      design: "設計",
      performance: "パフォーマンス",
      sql: "SQL",
      frontend: "フロントエンド",
      components: "コンポーネント",
      ui: "UI",
      react: "React",
      designSystem: "デザインシステム",
      bestPractices: "ベストプラクティス",
      compliance: "コンプライアンス",
      vulnerabilities: "脆弱性",
    },
  },
} as const;

export type Translation = typeof ja;
