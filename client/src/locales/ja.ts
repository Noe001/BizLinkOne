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
      notifications: "通知",
      integrations: "連携",
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
      devices: {
        title: "信頼済みデバイス",
        description: "記憶されたデバイスを監視し、不審なものはアクセスを取り消します。",
        lastActive: "最終アクティブ: {{value}}",
        ipLabel: "IP: {{value}}",
        status: {
          trusted: "信頼済み",
          needs_verification: "確認待ち",
          blocked: "ブロック済み",
        },
        actions: {
          verify: "確認",
          revoke: "削除",
        },
        remove: {
          title: "デバイスを削除しますか？",
          description: "{{name}} を削除すると、再ログインと二要素認証が必要になります。",
          confirm: "デバイスを削除",
        },
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
        description: "誰がワークスペースにアクセスでき、どこまで操作できるかを制御します。",
        guestAccess: {
          label: "ゲストアクセスを許可",
          description: "招待されたゲストに閲覧やコメントを許可します（権限に応じて）。",
        },
      },
      branding: {
        title: "ブランド設定",
        description: "ワークスペースで使用するカラーやロゴをカスタマイズします。",
        fields: {
          primaryColor: "メインカラー",
          secondaryColor: "サブカラー",
          logoUrl: "ロゴURL",
          faviconUrl: "ファビコンURL",
        },
        preview: {
          title: "ライブプレビュー",
          description: "更新したブランド設定がアプリ内でどのように表示されるかを確認できます。",
        },
      },
      domains: {
        title: "メールドメイン",
        description: "ワークスペースに参加できるドメインを管理します。",
        summary: "許可済みドメイン: {{count}} 件",
        help: "信頼できる自社ドメインを追加して、オンボーディングとセキュリティを強化しましょう。",
        actions: {
          addDomain: "ドメインを追加",
        },
        metadata: "追加者: {{addedBy}} / {{addedAt}}",
        types: {
          primary: "プライマリードメイン",
          allowed: "許可ドメイン",
        },
        modal: {
          title: "ドメインを追加",
          description: "許可したいメールドメインを指定します。",
          fields: {
            domain: "ドメイン",
            type: "種別",
          },
          actions: {
            add: "ドメインを追加",
          },
        },
      },
      dataRetention: {
        title: "データ保持とエクスポート",
        description: "ワークスペースデータの保存期間と定期エクスポートを管理します。",
        autoDelete: {
          label: "コンテンツを自動削除",
          description: "保持期間を過ぎたメッセージやファイルを自動的に削除します。",
        },
        retentionPeriod: {
          label: "保持期間",
          helper: "メッセージ・ファイル・ログをどのくらい保存するかを選択します。",
        },
        options: {
          "30": "30日",
          "90": "90日",
          "180": "180日",
          "365": "1年",
        },
        exports: {
          label: "定期エクスポート",
          description: "コンプライアンス担当者へ暗号化されたエクスポートを自動送信します。",
          actions: {
            configure: "スケジュールを設定",
          },
        },
        lastExport: "最終エクスポート: {{value}}",
        nextExport: "次回エクスポート: {{value}}",
        history: {
          title: "エクスポート履歴",
          actions: {
            schedule: "エクスポートを予約",
          },
          table: {
            generatedAt: "生成日時",
            format: "形式",
            size: "サイズ",
            initiatedBy: "実行者",
            status: "ステータス",
          },
          status: {
            completed: "完了",
            pending: "処理中",
            failed: "失敗",
          },
          empty: "まだエクスポートはありません。",
        },
        modal: {
          title: "エクスポートスケジュールを設定",
          description: "エクスポートの生成方法と送信先を指定します。",
          fields: {
            cadence: "実行頻度",
            cadenceOptions: {
              weekly: "毎週（月曜実行）",
              monthly: "毎月（1日実行）",
              quarterly: "四半期ごと（1/4/7/10月）",
            },
            format: "エクスポート形式",
            formatOptions: {
              csv: "CSV（表計算向け）",
              json: "JSON（構造化データ）",
            },
            recipients: "送信先",
            recipientsHelper: "複数のメールアドレスはカンマで区切ってください。",
            includeAttachments: {
              label: "添付ファイルを含める",
              description: "アップロード済みファイルをエクスポートに含めます。",
            },
          },
          actions: {
            runNow: "今すぐ1回実行",
            save: "スケジュールを保存",
          },
        },
      },
      apiAccess: {
        title: "APIアクセス",
        description: "外部システム連携用のトークンを作成・管理します。",
        summary: "アクティブなトークン: {{count}} 件",
        helper: "長期利用トークンは定期的にローテーションし、未使用のものは解除してください。",
        actions: {
          create: "新しいトークン",
          revoke: "取り消す",
        },
        scopes: {
          full: "フルアクセス",
          chat: "チャットと会話",
          tasks: "タスクとプロジェクト",
          read: "読み取りのみ",
        },
        status: {
          active: "有効",
          revoked: "無効",
        },
        createdAt: "作成: {{value}}",
        lastUsed: {
          value: "最終利用: {{value}}",
          never: "未使用",
        },
        expiresIn: "{{days}}日後に失効",
        modal: {
          title: "APIトークンを作成",
          description: "共有する前にアクセススコープと期限を設定します。",
          fields: {
            name: "トークン名",
            scope: "スコープ",
            expires: "有効期限",
            expiresOption: "{{days}}日後に失効",
          },
          actions: {
            create: "トークンを作成",
          },
        },
        generated: {
          title: "トークンを発行しました",
          description: "このトークンは今回のみ表示されます。必ずコピーしてください。",
          helper: "シークレットマネージャーや連携先の設定に安全に保存してください。",
        },
        revoke: {
          title: "トークンを取り消しますか？",
          description: "{{name}} を取り消すと、利用中のシステムのアクセスが即時に無効化されます。",
          confirm: "トークンを取り消す",
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
        disabled: "利用停止",
      },
      roles: {
        admin: "管理者",
        manager: "マネージャー",
        member: "メンバー",
      },
      rolesDescriptions: {
        admin: "ワークスペース・セキュリティ・請求を含む全権限",
        manager: "チーム・プロジェクト・ナレッジの管理",
      requests: {
        title: "アクセス申請",
        description: "保留中のワークスペース参加申請を承認または却下します。",
        badge: "保留中 {{count}} 件",
        empty: "現在、対応が必要なアクセス申請はありません。",
        requestedAt: "申請日時: {{value}}",
        actions: {
          review: "詳細を確認",
          dismiss: "却下",
          approve: "承認",
          deny: "拒否",
        },
        modal: {
          title: "アクセス申請を確認",
          description: "申請内容を確認し、必要に応じて権限を付与してください。",
          fields: {
            name: "氏名",
            email: "メールアドレス",
            role: "希望ロール",
            message: "申請メッセージ",
            messageEmpty: "追加のメッセージはありません。",
            requestedAt: "申請日時: {{value}}",
          },
        },
      },
        member: "タスクやミーティング、ナレッジで協働",
      },
      badges: {
        mfaEnforced: "2FA 必須",
      },
      editMemberTitle: "メンバー情報を編集",
      editMemberDescription: "ワークスペースのアクセス権と通知設定を調整します。",
      deleteConfirmTitle: "メンバーを削除",
      deleteConfirmDescription: "このメンバーは直ちにワークスペースへのアクセス権を失います。",
      dialog: {
        fields: {
          role: "ロール",
          status: "ステータス",
          notifications: "通知頻度",
        },
        permissions: {
          title: "権限",
          description: "このメンバーが管理できる領域を選択します。",
          projects: {
            label: "プロジェクト",
            description: "プロジェクトの作成とマイルストーン更新",
          },
          tasks: {
            label: "タスク",
            description: "タスクの割り当て・編集・完了",
          },
          meetings: {
            label: "ミーティング",
            description: "ワークスペースの会議をスケジュールおよび編集",
          },
          knowledge: {
            label: "ナレッジベース",
            description: "ワークスペースのナレッジを公開・アーカイブ",
          },
          billing: {
            label: "請求",
            description: "請求情報と請求書を管理",
          },
        },
        notifications: {
          summary: "{{cadence}}で通知を受信",
          options: {
            realtime: "リアルタイム",
            hourly: "1時間ごと",
            daily: "毎日",
            weekly: "毎週",
          },
        },
        enforcement: {
          label: "2FAを必須にする",
          description: "このメンバーに二要素認証を強制します",
        },
      },
      rolesModal: {
        title: "カスタムロールを作成",
        description: "チームで再利用できる権限セットを定義します。",
        fields: {
          name: "ロール名",
          description: "説明",
        },
        permissions: {
          title: "権限",
        },
        actions: {
          save: "ロールを保存",
        },
      },
      inviteModal: {
        title: "メンバーを招待",
        description: "メールでワークスペースの招待を送信します。",
        fields: {
          emails: "メールアドレス",
          role: "初期ロール",
          message: "メッセージ",
        },
        placeholders: {
          emails: "john@example.com, sarah@example.com",
          message: "招待に添える任意のメッセージ",
        },
        hints: {
          emails: "複数アドレスはカンマで区切って入力してください。",
        },
        actions: {
          send: "招待を送信",
        },
      },
      bulkInvite: {
        title: "一括招待",
        description: "CSVを貼り付けるかテンプレートを利用してまとめて招待します。",
        fields: {
          csv: "CSV入力",
        },
        placeholders: {
          csv: "name,email,role",
        },
        actions: {
          downloadTemplate: "テンプレートをダウンロード",
          upload: "招待を処理",
        },
      },
      rolesCard: {
        title: "ロール一覧",
        description: "既定のロールと役割を確認できます。",
        actions: {
          create: "ロールを作成",
        },
        hint: "さらに柔軟にしたい場合は、カスタムロールを作成して再利用できます。",
      },
      automation: {
        title: "メンバー自動化",
        description: "新しいメンバーのオンボーディングを自動化します。",
        inviteGuests: {
          label: "ゲストを自動招待",
          description: "信頼済みドメインからのアクセス申請を自動で承認します。",
        },
        assignMentor: {
          label: "メンターを自動割り当て",
          description: "新メンバーにオンボーディングメンターを自動で設定します。",
        },
        reminder: {
          label: "リマインダー頻度",
          options: {
            daily: "毎日",
            weekly: "毎週",
            monthly: "毎月",
          },
          helper: "選択した頻度でオンボーディングリマインダーを送信します。",
        },
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
      mfa: {
        title: "二段階認証",
        description: "強制状況を把握し、メンバーの登録状況を管理します。",
        metrics: {
          enforced: "強制済み",
          pending: "未登録",
          coverage: "カバレッジ",
        },
        badges: {
          enabled: "有効",
          pending: "未設定",
        },
        actions: {
          toggle: "{{name}} の二段階認証を切り替え",
        },
        empty: "メンバーがいません。チームを招待して二段階認証を管理しましょう。",
      },
      ip: {
        title: "IP許可リスト",
        description: "承認されたネットワーク範囲からのみアクセスを許可します。",
        summary: "設定済みルール: {{count}} 件",
        help: "CIDR範囲を追加してアクセス制御とコンプライアンス要件を満たします。",
        actions: {
          add: "IPルールを追加",
        },
        metadata: "追加者: {{addedBy}} / 場所: {{location}}",
        statuses: {
          active: "有効",
          pending: "保留",
          disabled: "無効",
        },
        modal: {
          title: "IPルールを追加",
          description: "CIDR範囲と説明を入力してください。",
          fields: {
            label: "ラベル",
            cidr: "CIDR範囲",
            location: "場所",
          },
          actions: {
            add: "ルールを追加",
          },
        },
      },
      password: {
        title: "パスワードポリシー",
        description: "パスワードの強度と有効期限を管理します。",
        minLength: {
          label: "最小文字数",
          helper: "推奨: 12文字以上でセキュリティを強化します。",
        },
        rotation: {
          label: "更新頻度",
          helper: "定期的なパスワード更新を要求します。",
          options: {
            "30": "30日ごと",
            "60": "60日ごと",
            "90": "90日ごと",
            "180": "180日ごと",
          },
        },
        requireMixedCase: {
          label: "大文字・小文字の混在を必須",
          description: "パスワードに大文字と小文字を含める必要があります。",
        },
        requireSpecial: {
          label: "記号の使用を必須",
          description: "パスワードに少なくとも1つの記号を含める必要があります。",
        },
        lockout: {
          label: "アカウントロックアウト",
          helper: "過度の失敗試行後にアカウントをロックし、不正アクセスを防止します。",
        },
      },
      audit: {
        title: "監査ログ",
        description: "ワークスペース内で実行された機密操作を追跡します。",
        table: {
          actor: "実行者",
          action: "アクション",
          target: "対象",
          time: "日時",
          actions: "操作",
        },
        viewEvent: "詳細を表示",
        statuses: {
          success: "成功",
          warning: "警告",
          failure: "失敗",
        },
        actions: {
          roleUpdate: "ロールを更新",
          mfaReminder: "二段階認証リマインダー送信",
          ipAdded: "IP許可リストを更新",
          export: "ワークスペースのエクスポートを開始",
        },
        descriptions: {
          roleUpdate: "管理者がメンバーのロールを変更しました",
          mfaReminder: "未登録メンバーに自動リマインダーを送信しました",
          ipAdded: "IP許可リストに新しい範囲を追加しました",
          export: "ワークスペースのデータエクスポートが要求されました",
        },
        modal: {
          title: "監査イベント",
          description: "イベントのメタデータとコンテキストを確認します。",
          fields: {
            actor: "実行者",
            action: "アクション",
            target: "対象",
            ip: "IPアドレス",
            time: "タイムスタンプ",
          },
        },
      },
    },
    notifications: {
      categories: {
        email: "メール",
        chat: "チャット",
        mobile: "モバイル",
        webhook: "Webhook",
      },
      channels: {
        title: "通知チャネル",
        description: "チームメンバーへ通知を届けるチャネルを有効化します。",
        actions: {
          configureSlack: "Slackアプリを管理",
          configureWebhook: "Webhookを設定",
        },
        emailDigest: {
          name: "メールダイジェスト",
          description: "ワークスペースの重要なアクティビティを日次でまとめて受信します。",
          cadence: "頻度",
        },
        slackAlerts: {
          name: "Slackアラート",
          description: "接続済みのSlackワークスペースへリアルタイムで通知します。",
        },
        mobilePush: {
          name: "モバイルプッシュ",
          description: "高優先度の通知をモバイルアプリへプッシュ配信します。",
        },
        dailySummary: {
          name: "デイリーサマリー",
          description: "前日の活動を翌朝に簡潔にまとめてお届けします。",
        },
        webhook: {
          name: "Webhook",
          description: "外部システム向けにカスタム自動化をトリガーします。",
        },
      },
      templates: {
        title: "通知テンプレート",
        description: "各チャネルで配信されるメッセージをカスタマイズし、プレビューします。",
        updated: "最終更新: {{value}}",
        actions: {
          preview: "プレビュー",
        },
        modal: {
          title: "{{name}} テンプレート",
          description: "受信者に送信されるメッセージ内容を確認します。",
          channel: "配信チャネル",
        },
        items: {
          digest: {
            name: "デイリーダイジェストメール",
            description: "ステークホルダーに朝のサマリーを送信します。",
            preview: "件名: BizLinkOne デイリーダイジェスト\n\nおはようございます。本日の予定は以下の通りです:\n・マイルストーン間近のプロジェクト 3 件\n・期限切れタスク 5 件\n・直近の会議: プロダクト定例、顧客レビュー\n\n詳細は BizLinkOne で確認してください。",
          },
          slackSummary: {
            name: "Slack サマリー",
            description: "接続されたSlackチャンネルに簡潔なレポートを投稿します。",
            preview: "*Workspace summary*\n・過去24時間で公開されたナレッジ記事 2 件\n・完了したタスク 8 件\n・次の会議まで 45 分（マーケティング定例）",
          },
          mobileAlert: {
            name: "モバイル重要アラート",
            description: "高優先度のインシデントやエスカレーションを即座に通知します。",
            preview: "重要アラート: インシデント #452 により顧客チャットの遅延が発生しています。タップしてインシデントルームを開きます。",
          },
        },
      },
      policy: {
        title: "通知ポリシー",
        description: "組織全体の通知ルールを定義します。",
        digestTime: {
          label: "デイリーダイジェスト送信時刻",
          option: "{{time}} に送信",
          helper: "日次サマリーを送信する時間を選択します。",
        },
        escalation: {
          label: "緊急通知のエスカレーション先",
          options: {
            admins: "ワークスペース管理者",
            owners: "ワークスペースオーナー",
            none: "エスカレーションしない",
          },
          helper: "エスカレートされた通知は選択したグループにリアルタイムで送信されます。",
        },
        quietHours: {
          label: "サイレント時間を有効化",
          description: "夜間は重要度の低い通知を抑制します。",
        },
        actions: {
          sendTest: "テスト通知を送信",
        },
      },
    },
    integrations: {
      title: "連携",
      description: "BizLinkOne をチームが利用している外部ツールと接続します。",
      lastSync: "最終同期: {{value}}",
      actions: {
        disconnect: "連携を解除",
        connect: "接続",
        configure: "設定",
      },
      status: {
        connected: "接続済み",
        disconnected: "未接続",
        requiresAction: "対応が必要",
      },
      items: {
        googleCalendar: {
          name: "Google カレンダー",
          description: "会議を同期してカレンダーの整合性を保ちます。",
        },
        outlook: {
          name: "Outlook カレンダー",
          description: "Microsoft 365 と連携して予定を同期します。",
        },
        zoom: {
          name: "Zoom",
          description: "会議リンクを添付し、録画を自動で同期します。",
        },
        teams: {
          name: "Microsoft Teams",
          description: "BizLinkOne のアクティビティをTeamsチャンネルに共有します。",
        },
        slack: {
          name: "Slack",
          description: "Slackワークスペースにメッセージと通知を送信します。",
        },
        zapier: {
          name: "Zapier",
          description: "数千のZapierコネクタと連携してワークフローを自動化します。",
        },
      },
      modal: {
        title: "{{name}} を設定",
        description: "{{name}} との同期設定を調整します。",
        sync: {
          heading: "同期設定",
          description: "どのデータを連携先へ送信するかを選択します。",
          events: "イベントを同期",
          eventsHelper: "BizLinkOneで新しい項目が作成されたタイミングで通知します。",
          reminders: "リマインダーを送信",
          remindersHelper: "この連携を通じてリマインダー通知を届けます。",
          postSummary: "日次サマリーを投稿",
          postSummaryHelper: "1日のアクティビティをまとめて投稿します。",
          alert: "設定の反映には最大10分ほどかかる場合があります。",
        },
      },
      automation: {
        title: "自動化レシピ",
        description: "連携イベントとワークスペースの出来事を結び付ける事前構築ワークフローを有効化します。",
        trigger: "トリガー: {{value}}",
        action: "アクション: {{value}}",
        actions: {
          toggle: "{{name}} を切り替え",
          view: "詳細を見る",
        },
        items: {
          calendarSync: {
            name: "カレンダー招待を同期",
            description: "BizLinkOneで作成した会議を接続済みカレンダーに自動反映します。",
            trigger: "BizLinkOne で会議が作成されたとき",
            action: "カレンダーイベントを作成・更新",
          },
          slackAlerts: {
            name: "Slack インシデントアラート",
            description: "重大インシデントをSlackに即時通知します。",
            trigger: "インシデントの状態がクリティカルに変化したとき",
            action: "Slack に構造化アラートを投稿",
          },
          zapierTasks: {
            name: "Zapier タスク同期",
            description: "Zapier 経由で外部ツールのフォローアップタスクを作成します。",
            trigger: "タスクがブロック状態になったとき",
            action: "Zapier ワークフローを起動",
          },
        },
        modal: {
          title: "{{name}}",
          description: "この自動化の有効・無効を調整します。",
          trigger: "トリガー",
          action: "アクション",
          statusLabel: "自動化の状態",
          statusHelper: "トラブルシューティング時は一時的に無効化できます。",
        },
      },
      // Meetings page expects meetings.integrations.* keys; provide localized labels
      meetings: {
        title: "連携",
        description: "BizLinkOne をチームが利用している外部ツールと接続します。",
        providers: {
          googleCalendar: "Google カレンダー",
          outlookCalendar: "Outlook カレンダー",
          zoom: "Zoom",
          teams: "Microsoft Teams",
        },
        status: {
          connected: "接続済み",
          disconnected: "未接続",
        },
        actions: {
          connect: "接続",
          disconnect: "連携を解除",
          configure: "設定",
        },
      },
    },
    billing: {
      currentPlan: {
        title: "現在のプラン",
        description: "このワークスペースの請求とプラン情報です。",
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
      paymentMethods: {
        title: "支払い方法",
        description: "サブスクリプションに使用するカードを管理します。",
        actions: {
          add: "支払い方法を追加",
          setDefault: "デフォルトに設定",
        },
        expires: "有効期限 {{expiry}}",
        default: "デフォルト",
        modal: {
          title: "支払い方法を追加",
          description: "保存するカード情報を入力してください。",
          fields: {
            brand: "カードブランド",
            last4: "下4桁",
            expiry: "有効期限",
            setDefault: "デフォルトとして使用",
            setDefaultHelper: "新しい請求はこの支払い方法が優先的に利用されます。",
          },
          actions: {
            save: "支払い方法を保存",
          },
        },
      },
      invoices: {
        title: "請求書",
        description: "過去の請求書をダウンロードし、支払い状況を確認できます。",
        table: {
          number: "請求書番号",
          period: "請求期間",
          amount: "金額",
          status: "ステータス",
          actions: "操作",
        },
        statuses: {
          paid: "支払い済み",
          open: "未払い",
          overdue: "延滞",
        },
        actions: {
          view: "表示",
          exportAll: "全てエクスポート",
          download: "PDFをダウンロード",
        },
        modal: {
          title: "請求書 {{number}}",
          description: "この請求期間の概要を表示します。",
          fields: {
            issuedAt: "発行日",
            dueAt: "支払期日",
            statusLabel: "ステータス",
          },
        },
      },
      usage: {
        title: "利用状況分析",
        description: "プランの割り当てに対する使用量を把握します。",
        metrics: {
          seats: "メンバーシート",
          storage: "使用ストレージ",
          automationRuns: "自動化実行数",
          apiRequests: "APIリクエスト",
        },
        units: {
          members: "名",
          gb: "GB",
          runs: "回",
          requests: "件",
        },
        remaining: "残り {{value}}{{unit}}",
      },
    },
  },
  common: {
    appName: "BizLinkOne",
    searchPlaceholder: "検索...",
    cancel: "キャンセル",
    confirm: "確定",
    delete: "削除",
    close: "閉じる",
    loading: "読み込み中...",
    confirmDelete: {
      cancel: "キャンセル",
      confirm: "削除",
      task: {
        title: "タスクを削除",
        description: "このタスクを削除してもよろしいですか？この操作は取り消せません。",
        descriptionWithName: "「{{name}}」を削除してもよろしいですか？この操作は取り消せません。",
      },
      knowledge: {
        title: "ナレッジを削除",
        description: "このナレッジ記事を削除してもよろしいですか？この操作は取り消せません。",
        descriptionWithName: "「{{name}}」を削除してもよろしいですか？この操作は取り消せません。",
      },
      meeting: {
        title: "ミーティングを削除",
        description: "このミーティングを削除してもよろしいですか？この操作は取り消せません。",
        descriptionWithName: "「{{name}}」を削除してもよろしいですか？この操作は取り消せません。",
      },
      message: {
        title: "メッセージを削除",
        description: "このメッセージを削除してもよろしいですか？この操作は取り消せません。",
        descriptionWithName: "このメッセージを削除してもよろしいですか？この操作は取り消せません。",
      },
      project: {
        title: "プロジェクトを削除",
        description: "このプロジェクトを削除してもよろしいですか？この操作は取り消せません。",
        descriptionWithName: "「{{name}}」を削除してもよろしいですか？この操作は取り消せません。",
      },
    },
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
      title: "アカウント設定",
      back: "戻る",
      description: "個人のアカウント設定と各種環境設定を管理します。",
    },
    actions: {
      saveChanges: "変更を保存",
      saveProfile: "プロフィールを保存",
      saving: "保存中...",
      cancel: "キャンセル",
    },
    alert: {
      unsaved: "未保存の変更があります。「{{action}}」をクリックして適用してください。",
    },
    autoSave: {
      description: "変更は自動的に保存されます。",
      saving: "保存中...",
      saved: "保存されました",
      dismiss: "閉じる",
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
  preferences: {
    header: {
      description: "ワークスペース体験と個人設定をカスタマイズします。",
      lastSaved: "最終保存: {{value}}",
    },
    alert: {
      unsaved: "未保存の変更があります。「{{action}}」をクリックして適用してください。",
    },
    actions: {
      save: "変更を保存",
      saving: "保存中...",
      reset: "デフォルトに戻す",
      preview: "テーマをプレビュー",
      testNotification: "テスト通知を送信",
      cancel: "キャンセル",
      editShortcut: "編集",
    },
    tabs: {
      appearance: "外観",
      notifications: "通知",
      accessibility: "アクセシビリティ",
      shortcuts: "ショートカット",
      general: "全般",
    },
    appearance: {
      title: "テーマと表示",
      description: "好みに合わせて見た目を調整します。",
      theme: {
        label: "テーマ",
        options: {
          light: "ライト",
          dark: "ダーク",
          system: "システム",
        },
        descriptions: {
          light: "明るい環境向けの高コントラストな配色です。",
          dark: "暗い場所でも目が疲れにくい配色です。",
          system: "OSのテーマ設定に自動で追従します。",
        },
      },
      accent: {
        label: "アクセントカラー",
        helper: "ボタンやアクティブ状態などで使用されます。",
        colors: {
          blue: "ブルー",
          green: "グリーン",
          purple: "パープル",
          red: "レッド",
          orange: "オレンジ",
          yellow: "イエロー",
          pink: "ピンク",
          indigo: "インディゴ",
        },
      },
      fontSize: {
        label: "文字サイズ",
        description: "アプリ全体の文字サイズを調整します。",
        options: {
          small: "コンパクト",
          medium: "標準",
          large: "大きめ",
        },
      },
      density: {
        sidebar: {
          label: "サイドバーを初期状態で折りたたむ",
          description: "毎回折りたたんだ状態でナビゲーションを開始します。",
        },
        compact: {
          label: "コンパクトモード",
          description: "余白を減らして情報量を増やします。",
        },
        avatars: {
          label: "アバターを表示",
          description: "リストやスレッドにメンバーのアバターを表示します。",
        },
        animations: {
          label: "アニメーションを有効化",
          description: "アプリ全体のトランジションとホバー効果を表示します。",
        },
      },
      preview: {
        sampleTitle: "チームのスタンドアップメモ",
        sampleDescription: "設定によってカードやコントロールがどう変わるかの例です。",
        cardTitle: "プロダクト戦略",
        cardDescription: "レビュー日程と担当者を整理します。",
        toggleLabel: "フォーカスモード",
        toggleDescription: "優先度の低い通知を30分間ミュートします。",
        button: "リマインダーを送信",
      },
    },
    notifications: {
      title: "通知とサウンド",
      description: "通知の受け取り方を細かく調整します。",
      sound: {
        label: "サウンド通知",
        description: "重要な更新時にチャイムを再生します。",
        volumeLabel: "音量 {{value}}%",
      },
      desktop: {
        label: "デスクトップ通知",
        description: "メンションやタスク、リマインダーをOSの通知で知らせます。",
      },
      emailDigest: {
        label: "メールダイジェスト",
        description: "ハイライトをまとめたメールを受信します。",
        options: {
          never: "送信しない",
          daily: "毎日",
          weekly: "毎週",
          monthly: "毎月",
        },
      },
      quietHours: {
        label: "サイレント時間",
        description: "指定した時間帯は通知を一時停止します。",
        start: "開始時間",
        end: "終了時間",
      },
      quietHoursActive: {
        helper: "通知は {{start}} から {{end}} まで停止します。",
      },
      inAppBadges: {
        label: "アプリ内バッジ",
        description: "ナビゲーションに未読インジケーターを表示します。",
      },
      mobilePush: {
        label: "モバイルプッシュ",
        description: "高優先度の通知をモバイルアプリへ送信します。",
      },
      importantOnly: {
        label: "重要なイベントのみ通知",
        description: "定型的な通知を抑えて重要なものだけ受け取ります。",
      },
      test: {
        description: "有効なチャネルで通知の見え方を確認します。",
      },
    },
    accessibility: {
      title: "アクセシビリティ",
      description: "フォーカスや読みやすさ、支援技術をサポートします。",
      highContrast: {
        label: "ハイコントラストモード",
        description: "視認性を高めるためにコントラストを上げます。",
      },
      reducedMotion: {
        label: "モーションを軽減",
        description: "大きなアニメーションやパララックス効果を抑制します。",
      },
      screenReader: {
        label: "スクリーンリーダー向け拡張",
        description: "支援技術向けの追加ラベルを表示します。",
      },
      keyboardNavigation: {
        label: "キーボードナビゲーション",
        description: "拡張ショートカットとフォーカス制御を有効にします。",
      },
      focusIndicators: {
        label: "フォーカス表示",
        description: "フォーカス中の要素にわかりやすい枠線を表示します。",
      },
      textScale: {
        label: "文字スケール",
        options: {
          small: "小",
          medium: "標準",
          large: "大",
        },
      },
      focusOutline: {
        label: "フォーカス枠の太さ",
        helper: "現在の太さ: {{value}} px",
      },
    },
    shortcuts: {
      title: "キーボードショートカット",
      description: "ワークフローに合わせてショートカットを調整します。",
      reset: "ショートカットをリセット",
      table: {
        headers: {
          action: "操作",
          shortcut: "ショートカット",
          category: "カテゴリ",
        },
      },
      categories: {
        navigation: "ナビゲーション",
        communication: "コミュニケーション",
        productivity: "生産性",
      },
      dialog: {
        title: "ショートカットを更新",
        description: "「Ctrl + Shift + P」のように「+」でキーを組み合わせて入力します。",
        helper: "重複するショートカットは以前の設定を上書きします。",
      },
      items: {
        commandPalette: {
          label: "コマンドパレットを開く",
          description: "ユニバーサルランチャーで任意の場所に移動します。",
        },
        quickSearch: {
          label: "クイック検索",
          description: "グローバル検索を表示します。",
        },
        newMessage: {
          label: "新しいメッセージを作成",
          description: "現在のチャンネルのコンポーザーにフォーカスします。",
        },
        createTask: {
          label: "タスクを作成",
          description: "タスク作成ダイアログを開きます。",
        },
        toggleTheme: {
          label: "テーマを切り替える",
          description: "ライト／ダークモードを切り替えます。",
        },
        focusNotifications: {
          label: "通知パネルを開く",
          description: "通知センターへ移動します。",
        },
      },
    },
    general: {
      title: "全般と地域",
      description: "言語、地域設定、詳細オプションを管理します。",
      language: {
        label: "言語",
        description: "インターフェースで使用する言語を選択します。",
        options: {
          en: "英語",
          ja: "日本語",
          es: "スペイン語",
          fr: "フランス語",
          de: "ドイツ語",
          ko: "韓国語",
          zh: "中国語",
          pt: "ポルトガル語",
        },
      },
      timezone: {
        label: "タイムゾーン",
        description: "日付やスケジュールはこのタイムゾーンに合わせて表示されます。",
        options: {
          et: "米国東部時間 (ET)",
          ct: "米国中部時間 (CT)",
          mt: "米国山岳部時間 (MT)",
          pt: "米国太平洋時間 (PT)",
          gmt: "グリニッジ標準時 (GMT)",
          cet: "中央ヨーロッパ時間 (CET)",
          jst: "日本標準時 (JST)",
        },
      },
      dateFormat: {
        label: "日付形式",
        options: {
          us: "MM/DD/YYYY (米国)",
          intl: "DD/MM/YYYY (国際)",
          iso: "YYYY-MM-DD (ISO)",
          written: "DD MMM YYYY (英語表記)",
        },
      },
      timeFormat: {
        label: "時刻形式",
        options: {
          "12h": "12時間（AM/PM）",
          "24h": "24時間",
        },
      },
      firstDay: {
        label: "週の開始曜日",
        options: {
          sunday: "日曜日",
          monday: "月曜日",
        },
      },
      autoStart: {
        label: "サインイン時にアプリを起動",
        description: "デバイスにサインインすると BizLinkOne を自動で開始します。",
      },
      confirmExit: {
        label: "終了前に確認する",
        description: "下書きや通話中に閉じようとした場合に警告します。",
      },
      betaFeatures: {
        label: "先行アクセス機能を有効化",
        description: "一般公開前の機能を試用できます。",
      },
      analytics: {
        label: "匿名の利用データを共有",
        description: "BizLinkOne 改善のために利用状況データを提供します。",
      },
      actions: {
        clearCache: "ローカルキャッシュを削除",
        cacheDescription: "キャッシュされたアセットを削除してディスク容量を確保します。サインイン状態は維持されます。",
      },
    },
    dialogs: {
      preview: {
        title: "テーマプレビュー",
        description: "カードやボタン、ナビゲーションが現在の設定でどう表示されるかを確認します。",
      },
      reset: {
        title: "環境設定をリセット",
        description: "すべての設定を初期値に戻します。保存すると適用されます。",
        confirm: "リセットする",
      },
      cache: {
        title: "ローカルキャッシュをクリア",
        description: "このデバイスに保存されたキャッシュと一時ファイルを削除します。",
        confirm: "キャッシュを削除",
      },
      shortcut: {
        save: "ショートカットを保存",
      },
    },
    toast: {
      saved: {
        title: "環境設定を保存しました",
        description: "個人設定がすぐに反映されます。",
      },
      reset: {
        title: "デフォルト値に戻しました",
        description: "内容を確認してから保存してください。",
      },
      notification: {
        title: "テスト通知を送信しました",
        description: "有効なチャネルでサンプル通知を確認してください。",
      },
      cacheCleared: {
        title: "キャッシュを削除しました",
        description: "一時ファイルを削除しました。一部のアセットは再読み込みされます。",
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
      project: {
        placeholder: "すべてのプロジェクト",
        options: {
          all: "すべてのプロジェクト",
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
      gantt: "ガント表示",
    },
    kanban: {
      columns: {
        todo: "未着手",
        inProgress: "進行中",
        review: "レビュー",
        done: "完了",
      },
    },
    gantt: {
      unknownProject: "未割り当てのプロジェクト",
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
      actions: {
        menu: "タスクアクションメニュー",
        changeStatus: "ステータスを {{status}} から変更",
        edit: "編集",
        favorite: "お気に入りに追加",
        unfavorite: "お気に入りから削除",
        duplicate: "複製",
        share: "共有",
        archive: "アーカイブ",
        delete: "削除",
      },
    },
    integrations: {
      title: "カレンダー・会議連携",
      description: "接続されているカレンダーや会議サービスを管理します。",
      status: {
        connected: "接続済み",
        disconnected: "未接続",
      },
      actions: {
        connect: "接続",
        disconnect: "切断",
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
        project: {
          label: "関連プロジェクト",
          placeholder: "プロジェクトを選択",
          none: "関連プロジェクトなし",
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
      notifications: {
        dueSoon: {
          fallbackTitle: "タスク",
          title: "「{{title}}」の期限が近づいています",
          message: "「{{title}}」の期限まで残り {{hours}} 時間です",
        },
        deleted: {
          title: "タスクを削除しました",
          message: "「{{title}}」を削除しました",
        },
        duplicated: {
          title: "タスクを複製しました",
          message: "タスクのコピーを作成しました",
        },
        archived: {
          title: "タスクをアーカイブしました",
          message: "タスクをアーカイブに移動しました",
        },
        shared: {
          title: "タスクを共有しました",
          message: "タスクの共有リンクをクリップボードにコピーしました",
        },
        favorited: {
          title: "お気に入りに追加しました",
          message: "タスクをお気に入りに追加しました",
        },
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
      accessNotes: "ミーティングノートにアクセス",
      actions: {
        menu: "ミーティングアクションメニュー",
        edit: "編集",
        favorite: "お気に入りに追加",
        unfavorite: "お気に入りから削除",
        duplicate: "複製",
        share: "共有",
        cancel: "キャンセル",
        delete: "削除",
      },
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
        select: "{{name}} プロジェクトを選択",
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
      title: "プロジェクトタイムライン",
      duration: "{{count}} 日間",
      status: {
        todo: "未着手",
        inProgress: "進行中",
        review: "レビュー中",
        done: "完了",
      },
      actions: {
        previous: "前の週",
        next: "次の週",
      },
      taskLabel: "{{title}} - {{progress}}% 完了",
      log: {
        taskClick: "タイムラインタスクをクリック:",
      },
      empty: "表示するタスクがありません",
    },
    create: {
      log: "プロジェクトを作成:",
      title: "新規プロジェクト作成",
      description: "ゴール・チームメンバー・マイルストーンを設定して新しいプロジェクトを立ち上げます。",
      fields: {
        name: "プロジェクト名",
        namePlaceholder: "プロジェクト名を入力...",
        description: "説明",
        descriptionPlaceholder: "プロジェクトの概要を入力...",
        template: "テンプレート",
        templatePlaceholder: "テンプレートを選択 (任意)",
        manager: "プロジェクトマネージャー",
        managerPlaceholder: "マネージャーを選択",
        team: "チームメンバー",
        priority: "優先度",
        priorityOptions: {
          low: "低",
          medium: "中",
          high: "高",
          urgent: "緊急",
        },
        startDate: "開始日",
        endDate: "終了日",
        milestones: "マイルストーン",
      },
      templates: {
        software: {
          name: "ソフトウェア開発",
          description: "API・フロントエンド・品質保証フェーズ",
        },
        marketing: {
          name: "マーケティングキャンペーン",
          description: "計画・実行・分析",
        },
        research: {
          name: "研究プロジェクト",
          description: "文献調査・実験・レポート",
        },
        custom: {
          name: "カスタムプロジェクト",
          description: "独自の構成で開始",
        },
      },
      milestones: {
        title: "マイルストーン ({{count}})",
        add: "追加",
        addTitle: "マイルストーンを追加",
        addDescription: "プロジェクトの主要な目標や期限を追跡しましょう。",
        fields: {
          title: "マイルストーンタイトル",
          titlePlaceholder: "マイルストーン名...",
          dueDate: "期限",
          selectDate: "日付を選択",
        },
        cancel: "キャンセル",
        save: "追加",
        empty: "まだマイルストーンはありません",
      },
      cancel: "キャンセル",
      submit: "プロジェクトを作成",
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
    detail: {
      noDescription: "説明がありません",
      tabs: {
        overview: "概要",
        team: "チーム",
        tasks: "タスク",
      },
      overallProgress: "全体進捗",
      tasks: "タスク",
      milestones: "マイルストーン",
      timeline: "タイムライン",
      startDate: "開始日",
      endDate: "終了日",
      upcomingMilestones: "今後のマイルストーン",
      completed: "完了",
      noMilestones: "マイルストーンが定義されていません",
      teamMembers: "チームメンバー ({{count}}名)",
      addMember: "メンバーを追加",
      projectTasks: "プロジェクトタスク ({{count}}件)",
      createTask: "タスクを作成",
      assignedTo: "担当:",
      noTasks: "タスクがありません",
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
    card: {
      anonymous: "匿名",
      views: "{{count}} 閲覧",
      openChat: "チャットを開く",
      share: "ナレッジを共有",
      actions: {
        menu: "ナレッジアクションメニュー",
        edit: "編集",
        favorite: "お気に入りに追加",
        unfavorite: "お気に入りから削除",
        duplicate: "複製",
        share: "共有",
        archive: "アーカイブ",
        delete: "削除",
      },
    },
    create: {
      title: "ナレッジ記事を作成",
      description: "チームの知見を文書化して共有します。",
      descriptionWithAuthor: "{{author}} のメッセージからナレッジ記事を作成します。",
      fields: {
        title: "タイトル",
        titlePlaceholder: "記事タイトルを入力...",
        summary: "概要",
        summaryPlaceholder: "概要 (任意 - 空欄の場合は自動生成)",
        content: "本文",
        contentPlaceholder: "記事の本文...",
        category: "カテゴリー",
        categoryPlaceholder: "カテゴリーを選択",
        tags: "タグ",
        tagPlaceholder: "カスタムタグを追加...",
        quickAdd: "クイック追加",
      },
      create: "記事を作成",
    },
    detail: {
      author: "著者",
      created: "作成日",
      updated: "更新日",
      views: "閲覧数",
      tags: "タグ",
      tagsPlaceholder: "タグ1, タグ2, タグ3...",
      content: "内容",
      relatedContext: "関連コンテキスト",
      fromChat: "チャットから",
      fromMeeting: "会議から",
      openChat: "チャットを開く",
      openMeeting: "会議を表示",
      save: "保存",
      cancel: "キャンセル",
      close: "閉じる",
      deleteConfirm: "この記事を削除しますか？この操作は取り消せません。",
    },
  },
  chat: {
    message: {
      actions: {
        messageActions: "メッセージアクション",
        reply: "返信",
        task: "タスク",
        knowledge: "ナレッジ",
        more: "その他",
        edit: "編集",
        copy: "コピー",
        pin: "ピン留め",
        unpin: "ピン留めを解除",
        share: "共有",
        flag: "報告",
        delete: "削除",
      },
    },
  },
  workspace: {
    members: {
      title: "ワークスペースメンバー",
      tabs: {
        members: "メンバー",
        invites: "招待",
      },
      inviteNew: "新規メンバーを招待",
      emailPlaceholder: "email@company.com",
      sendInvite: "招待を送信",
      searchPlaceholder: "メンバーを検索...",
      you: "あなた",
      actions: "操作",
      changeRole: "役割を変更:",
      remove: "メンバーを削除",
      removeConfirm: "{{name}} をこのワークスペースから削除しますか？",
      close: "閉じる",
      noPendingInvites: "保留中の招待はありません",
      invitedBy: "{{name}} が招待",
      expired: "期限切れ",
      pending: "保留中",
      resendInvite: "招待を再送信",
      cancelInvite: "招待をキャンセル",
    },
  },
} as const;

export type Translation = typeof ja;
