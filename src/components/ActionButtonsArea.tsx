import { useState } from "preact/hooks";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { SocialIcon } from 'react-social-icons';
import styles from "./ActionButtonsArea.module.css";

interface ActionButtonsAreaProps {
  actionType: "wallpaper" | "devemon" | "banner";
  onDownloadDesktop?: () => void | Promise<void>;
  onDownloadMobile?: () => void | Promise<void>;
  onDownloadSmall?: () => void | Promise<void>;
  onDownloadCard?: () => void | Promise<void>;
  onDownloadBadge?: () => void | Promise<void>;
  onDownloadBanner?: () => void | Promise<void>;
  onCopyMarkdown?: () => void | Promise<void>;
  onShareTwitter?: () => void | Promise<void>;
  onShareBluesky?: () => void | Promise<void>;
  onShareThreads?: () => void | Promise<void>;
  onShareInstagram?: () => void | Promise<void>;
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
}: ActionButtonsAreaProps) {
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const isBusy = busyAction !== null;

  const runAction = async (
    actionId: string,
    action?: () => void | Promise<void>
  ) => {
    if (!action || isBusy) return;

    setBusyAction(actionId);
    try {
      await action();
    } finally {
      setBusyAction(null);
    }
  };

  const renderWallpaperActions = () => (
    <div className={styles.WallpaperActions}>
      <div className={styles.WallpaperSection}>
        <div className={styles.WallpaperGrid}>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-desktop", onDownloadDesktop)}
            disabled={isBusy}
          >
            <div className={styles.WallpaperButtonTitle}>
              Desktop (2560x1440)
            </div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-mobile", onDownloadMobile)}
            disabled={isBusy}
          >
            <div className={styles.WallpaperButtonTitle}>
              Mobile (1179x2556)
            </div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={() => runAction("wallpaper-small", onDownloadSmall)}
            disabled={isBusy}
          >
            <div className={styles.WallpaperButtonTitle}>Badge (320x240)</div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
        </div>
        <div className={styles.SocialShareRow}>
          <SecondaryButton
            onClick={() => runAction("wallpaper-twitter", onShareTwitter)}
            disabled={isBusy}
            icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
          >
            Twitter/X
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-bluesky", onShareBluesky)}
            disabled={isBusy}
            icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
          >
            Bluesky
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-threads", onShareThreads)}
            disabled={isBusy}
            icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
          >
            Threads
          </SecondaryButton>
          <SecondaryButton
            onClick={() => runAction("wallpaper-instagram", onShareInstagram)}
            disabled={isBusy}
            icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
          >
            Instagram
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
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          Download Card
        </PrimaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-badge", onDownloadBadge)}
          disabled={isBusy}
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          Download Badge
        </SecondaryButton>
      </div>
      <div className={styles.SocialShareRow}>
        <SecondaryButton
          onClick={() => runAction("devemon-twitter", onShareTwitter)}
          disabled={isBusy}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          Twitter/X
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-bluesky", onShareBluesky)}
          disabled={isBusy}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          Bluesky
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-threads", onShareThreads)}
          disabled={isBusy}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          Threads
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("devemon-instagram", onShareInstagram)}
          disabled={isBusy}
          icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
        >
          Instagram
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
          icon={
            <Icon
              name="download"
              size="functional"
              color="currentColor"
              label=""
            />
          }
        >
          Download
        </PrimaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-markdown", onCopyMarkdown)}
          disabled={isBusy}
          icon={<span>📋</span>}
        >
          Copy Markdown
        </SecondaryButton>
      </div>
      <div className={styles.SocialShareRow}>
        <SecondaryButton
          onClick={() => runAction("banner-twitter", onShareTwitter)}
          disabled={isBusy}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          Twitter/X
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-bluesky", onShareBluesky)}
          disabled={isBusy}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          Bluesky
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-threads", onShareThreads)}
          disabled={isBusy}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          Threads
        </SecondaryButton>
        <SecondaryButton
          onClick={() => runAction("banner-instagram", onShareInstagram)}
          disabled={isBusy}
          icon={<SocialIcon network="instagram" style={{ height: 20, width: 20 }} />}
        >
          Instagram
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
