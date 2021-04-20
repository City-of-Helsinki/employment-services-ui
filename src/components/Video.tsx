import React from "react";
import YouTube from 'react-youtube';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { deleteCookie } from "../helpers/helpers";

const useStyles = makeStyles((theme: any) => ({
  declined: () => ({
    border: "2px solid",
    padding: "24px 16px",
    textAlign: "center"
  }),
}));

interface VideoProps {
  videoUrl: string;
  cookieConsent: string;
}

function Video(props: VideoProps) {
  const classes = useStyles(props);
  const history = useHistory();
  const { t } = useTranslation();
  const { videoUrl, cookieConsent } = props;
  const videoId = videoUrl.split("?v=")[1];

  return (
    <>
      { cookieConsent === 'true' ? (
        videoId && <div><YouTube videoId={videoId} containerClassName="video-wrapper" /></div>
      ) : (
        <Typography component="p" className={classes.declined}>
          {t("video.cookie_consent")}
          <a href="#href" onClick={(e: any) => {deleteCookie(e ,'tyollisyyspalvelut_cookie_consent', history);}}>
          {t("video.link_text")}
          </a>
        </Typography>
      )}
    </>
  );
}

export default Video;
