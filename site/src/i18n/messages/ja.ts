import type { LandingMessages } from "./types";

export const jaMessages = {
  languageLabel: "言語",
  languageSwitchLabel: "English",
  nav: {
    features: "機能",
    howItWorks: "必要な理由",
    comparison: "比較",
    docs: "ドキュメント",
    getStarted: "始める",
  },
  hero: {
    releaseBadge: "ベータ公開中",
    titleLead: "もう二度と、",
    titleAccent: "SSH",
    titleTail: "での生存確認に時間を使わない。",
    subtitle:
      "機械学習などの長時間プロセスをリアルタイムで追跡。完了・失敗の通知と実行状況を、コード変更なしで一元管理。",
    installHeading: "Install",
    copyLabel: "コピー",
    copiedLabel: "コピー済み",
    quickStartLines: [
      "# 通常通りに実行",
      "python train_model.py --epochs 100",
      "# 一度だけ初期化 (obsern.yaml を作成)",
      "obsern init",
      "# obsern でラップして実行",
      "obsern run python train_model.py --epochs 100",
    ],
  },
  pain: {
    eyebrow: "開発現場の課題",
    title: "Obsernが必要な理由",
    subtitle:
      "SSHでプロセスを都度確認する運用は、完了の見逃しや異常終了の発見遅れを生みます。Obsernはその “待ち時間と手戻り” を減らし、運用の負担を軽減します。",
    cards: [
      {
        title: "サイレント停止",
        body: "想定より早く完了していたのに気づけず、時間を無駄にした。別の日には開始5分で止まっていたのに、気づいたのは翌朝。通知があればもっと時間を有効に使えたのに。",
      },
      {
        title: "エラー原因の把握が遅い",
        body: "異常終了しても、バックグラウンド実行のせいで原因は不明。Obsernなら、終了ステータスとエラー内容をすぐ確認できます。",
      },
      {
        title: "マルチサーバーの混乱",
        body: "どのサーバーで何が動いているのかわからない。複数ホストを横断して、実行状況とログを1画面で可視化します。",
      },
    ],
  },
  features: {
    title: "開発者のための監視体験。",
    cards: [
      {
        title: "コード変更不要",
        body: "既存コマンドを obsern でラップするだけ。SDK導入や計測コードは不要です。",
      },
      {
        title: "Slackに即時通知",
        body: "Webhook連携で、失敗や完了の通知をSlackのチャンネルへすぐに送れます。",
      },
      {
        title: "統合ダッシュボード",
        body: "実行状況、ログ、実行サーバーをまとめて確認できます。",
      },
    ],
  },
  comparison: {
    title: "他ツールとの違い",
    subtitle: "実験メトリクスではなく、実行健全性の監視に主眼を置きます。",
    featureColumn: "項目",
    rows: [
      {
        label: "主な目的",
        obsern: "実行監視",
        mlflow: "実験管理",
        tensorboard: "学習メトリクス可視化",
      },
      {
        label: "導入方法",
        obsern: "CLIでラップ（コード変更なし）",
        mlflow: "SDK組み込み",
        tensorboard: "SDK組み込み",
      },
      {
        label: "監視対象",
        obsern: "実行中のプロセス",
        mlflow: "実験ログ",
        tensorboard: "学習ログ",
      },
      {
        label: "異常終了の通知",
        obsern: "即時通知（Slack等）",
        mlflow: "基本なし",
        tensorboard: "なし",
      },
      {
        label: "監視スコープ",
        obsern: "複数サーバー横断",
        mlflow: "プロジェクト単位",
        tensorboard: "ローカル中心",
      },
    ],
  },
  cta: {
    title: "今すぐバックグラウンドジョブを可視化。",
    subtitle: "数分でセットアップできます。",
    primary: "無料で始める",
    secondary: "ドキュメント",
  },
  footer: {
    title: "役に立ったら、GitHubでStarを。",
    subtitle: "ObsernはOSSです。Starとフィードバックが開発の支えになります。",
    button: "Star on GitHub",
  },
} satisfies LandingMessages;
