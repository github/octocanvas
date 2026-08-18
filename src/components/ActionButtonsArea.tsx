import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { SocialIcon } from 'react-social-icons';
import styles from "./ActionButtonsArea.module.css";

type ActionHandler = () => void | Promise<void>;

interface ActionButtonsAreaProps {
  actionType: "wallpaper" | "devemon" | "banner";
  busyAction: string | null;
  onRunAction: (actionId: string, action?: ActionHandler) => void;
  onDownloadDesktop?: ActionHandler;
  onDownloadMobile?: ActionHandler;
  onDownloadSmall?: ActionHandler;
  onDownloadCard?: ActionHandler;
  onDownloadBadge?: ActionHandler;
  onDownloadBanner?: ActionHandler;
  onCopyMarkdown?: ActionHandler;
  onShareTwitter?: ActionHandler;
  onShareBluesky?: ActionHandler;
  onShareThreads?: ActionHandler;
  onShareInstagram?: ActionHandler;
}

export default function ActionButtonsArea({
  actionType,
  onDownloadDesktop,
  onDownloadMobile,
  onDownloadSmall,
  onDownloadCard,
  onDownloadBadge,
  onDownloadBanner,
  onCopyMarkdown,
  onShareTwitter,
  onShareBluesky,
  onShareThreads,
  onShareInstagram,
  busyAction,
  onRunAction,
}: ActionButtonsAreaProps) {
  const isBusy = busyAction !== null;
  const isActionBusy = (actionId: string) => busyAction === actionId;
  const runAction = (actionId: string, action?: ActionHandler) => {
    onRunAction(actionId, action);
  };
  const actionLabel = (actionId: string, label: string) =>
    isActionBusy(actionId) ? "Generating image..." : label;
  const copyMarkdownLabel = isActionBusy("banner-markdown")
    ? "Copying..."
    : "Copy Markdown";
  const wallpaperDownloadLabel = (actionId: string, label: string) => (
    <>
      <div className={styles.WallpaperButtonTitle}>
        {isActionBusy(actionId) ? "Generating image..." : label}
      </div>
      <div className={styles.WallpaperButtonSubtitle}>
        {isActionBusy(actionId) ? "Please wait" : "Download PNG"}
      </div>
    </>
  );

  const renderWallpaperActions = () => (
    <div className={styles.WallpaperActions}>
      <div className={styles.WallpaperSection}>
        <div className={styles.WallpaperGrid}>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-desktop", onDownloadDesktop)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-desktop")}
          >
            {wallpaperDownloadLabel("wallpaper-desktop", "Desktop (2560x1440)")}
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-mobile", onDownloadMobile)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-mobile")}
          >
            {wallpaperDownloadLabel("wallpaper-mobile", "Mobile (1179x2556)")}
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-small", onDownloadSmall)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-small")}
          >
            {wallpaperDownloadLabel("wallpaper-small", "Badge (320x240)")}
          </PrimaryButton>
        </div>
        <div className={styles.SocialShareRow}>
          <SecondaryButton
            onClick={() => runAction("wallpaper-twitter", onShareTwitter)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-twitter")}
            icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
          >
            {actionLabel("wallpaper-twitter", "Twitter/X")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-bluesky", onShareBluesky)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-bluesky")}
            icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
          >
            {actionLabel("wallpaper-bluesky", "Bluesky")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-threads", onShareThreads)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-threads")}
            icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
          >
            {actionLabel("wallpaper-threads", "Threads")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-instagram", onShareInstagram)}
            disabled={isBusy}
            ariaBusy={isActionBusy("wallpaper-instagram")}
            icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
          >
            {actionLabel("wallpaper-instagram", "Instagram")}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );

  const renderDevemonActions = () => (
    <div className={styles.ActionsContainer}>
      <div className={styles.ActionsRow}>
        <PrimaryButton
          onClick={() => runAction("devemon-card", onDownloadCard)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-card")}
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          {actionLabel("devemon-card", "Download Card")}
        </PrimaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-badge", onDownloadBadge)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-badge")}
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          {actionLabel("devemon-badge", "Download Badge")}
        </SecondaryButton>
      </div>
      <div className={styles.SocialShareRow}>
        <SecondaryButton
          onClick={() => runAction("devemon-twitter", onShareTwitter)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-twitter")}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("devemon-twitter", "Twitter/X")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-bluesky", onShareBluesky)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-bluesky")}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("devemon-bluesky", "Bluesky")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-threads", onShareThreads)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-threads")}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("devemon-threads", "Threads")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-instagram", onShareInstagram)}
          disabled={isBusy}
          ariaBusy={isActionBusy("devemon-instagram")}
          icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("devemon-instagram", "Instagram")}
        </SecondaryButton>
      </div>
    </div>
  );

  const renderBannerActions = () => (
    <div className={styles.ActionsContainer}>
      <div className={styles.ActionsRow}>
        <PrimaryButton
          onClick={() => runAction("banner-download", onDownloadBanner)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-download")}
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          {actionLabel("banner-download", "Download")}
        </PrimaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-markdown", onCopyMarkdown)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-markdown")}
          icon={<span>📋</span>}
        >
          {copyMarkdownLabel}
        </SecondaryButton>
      </div>
      <div className={styles.SocialShareRow}>
        <SecondaryButton
          onClick={() => runAction("banner-twitter", onShareTwitter)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-twitter")}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("banner-twitter", "Twitter/X")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-bluesky", onShareBluesky)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-bluesky")}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("banner-bluesky", "Bluesky")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-threads", onShareThreads)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-threads")}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("banner-threads", "Threads")}
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-instagram", onShareInstagram)}
          disabled={isBusy}
          ariaBusy={isActionBusy("banner-instagram")}
          icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
        >
          {actionLabel("banner-instagram", "Instagram")}
        </SecondaryButton>
      </div>
    </div>
  );

  return (
    <div className={styles.ActionArea}>
      {actionType === "wallpaper" && renderWallpaperActions()}
      {actionType === "devemon" && renderDevemonActions()}
      {actionType === "banner" && renderBannerActions()}
    </div>
  );
}
