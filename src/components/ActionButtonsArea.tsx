import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { SocialIcon } from 'react-social-icons';
import styles from "./ActionButtonsArea.module.css";

interface ActionButtonsAreaProps {
  actionType: "wallpaper" | "devemon" | "banner";
  onDownloadDesktop?: () => void;
  onDownloadMobile?: () => void;
  onDownloadSmall?: () => void;
  onDownloadCard?: () => void;
  onDownloadBadge?: () => void;
  onDownloadBanner?: () => void;
  onCopyMarkdown?: () => void;
  onShareTwitter?: () => void;
  onShareBluesky?: () => void;
  onShareThreads?: () => void;
  onShareInstagram?: () => void;
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
  const renderWallpaperActions = () => (
    <div className={styles.WallpaperActions}>
      <div className={styles.WallpaperSection}>
        <div className={styles.WallpaperGrid}>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={onDownloadDesktop}
          >
            <div className={styles.WallpaperButtonTitle}>
              Desktop (2560x1440)
            </div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={onDownloadMobile}
          >
            <div className={styles.WallpaperButtonTitle}>
              Mobile (1179x2556)
            </div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
          <PrimaryButton
            className={styles.WallpaperButton}
            onClick={onDownloadSmall}
          >
            <div className={styles.WallpaperButtonTitle}>Badge (320x240)</div>
            <div className={styles.WallpaperButtonSubtitle}>Download PNG</div>
          </PrimaryButton>
        </div>
        <div className={styles.SocialShareRow}>
          <SecondaryButton
            onClick={onShareTwitter}
            icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
          >
            Twitter/X
          </SecondaryButton>
          <SecondaryButton
            onClick={onShareBluesky}
            icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
          >
            Bluesky
          </SecondaryButton>
          <SecondaryButton
            onClick={onShareThreads}
            icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
          >
            Threads
          </SecondaryButton>
          <SecondaryButton
            onClick={onShareInstagram}
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
          onClick={onDownloadCard}
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
          onClick={onDownloadBadge}
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
          onClick={onShareTwitter}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          Twitter/X
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareBluesky}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          Bluesky
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareThreads}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          Threads
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareInstagram}
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
          onClick={onDownloadBanner}
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
        <SecondaryButton onClick={onCopyMarkdown} icon={<span>📋</span>}>
          Copy Markdown
        </SecondaryButton>
      </div>
      <div className={styles.SocialShareRow}>
        <SecondaryButton
          onClick={onShareTwitter}
          icon={<SocialIcon network="x" style={{ height: 20, width: 20 }} />}
        >
          Twitter/X
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareBluesky}
          icon={<SocialIcon network="bsky.app" style={{ height: 20, width: 20 }} />}
        >
          Bluesky
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareThreads}
          icon={<SocialIcon network="threads" style={{ height: 20, width: 20 }} />}
        >
          Threads
        </SecondaryButton>
        <SecondaryButton
          onClick={onShareInstagram}
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
