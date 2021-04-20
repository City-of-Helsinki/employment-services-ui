import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { getDrupalNodeDataFromPathAlias, getEventPagePath } from "../helpers/fetchHelper";
import { findTaxonomy } from "../helpers/taxonomiesHelper";
import { findEventData } from "../helpers/dataHelper";
import PageUsingParagraphs from "./ParagraphsPage";
import { Lang, EventParams, ParagraphData } from "../types";
import NotFound from "./NotFound";

type Data = null | {
  paragraphData: ParagraphData;
  width: any;
};
interface EventProps {
  lang: Lang;
  cookieConsent: string;
}

function Event(props: EventProps) {
  const { urlAlias } = useParams<EventParams>();
  const history = useHistory();
  const [data, setData] = useState<Data>(null);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  const { lang, cookieConsent } = props;

  const fetchData = async () => {
    // TODO: Change langParam here when there's lang support for events
    const { nid } = await getDrupalNodeDataFromPathAlias(urlAlias, 'en') || {};
    if (!nid) {
      setRedirect(true);
      return;
    }

    const filter = "&filter[drupal_internal__nid]=" + nid;
    const [fiPage, svPage, enPage] = getEventPagePath(filter);

    const [fi, sv, en] = await Promise.all([axios.get(fiPage), axios.get(svPage), axios.get(enPage)]);

    setData({
      paragraphData: {
        en: findEventData("en", en.data),
        fi: findEventData("fi", fi.data),
        sv: findEventData("sv", sv.data),
      },
      width: findTaxonomy(en.data, "field_page_width"),
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const [, langPath] = location.pathname.split("/");
    if (lang !== langPath) {
      const newPath =
        lang === "fi"
          ? `/fi/tapahtuma/${urlAlias}`
          : lang === "sv"
          ? `/sv/evenemang/${urlAlias}`
          : `/en/event/${urlAlias}`;
      history.replace(newPath);
    }
  }, [lang]);

  if (redirect) {
    return <NotFound lang={lang} />;
  }

  if (!data) {
    return <></>;
  }

  return <PageUsingParagraphs lang={lang} cookieConsent={cookieConsent} paragraphData={data.paragraphData} width={data.width} />;
}

export default Event;
