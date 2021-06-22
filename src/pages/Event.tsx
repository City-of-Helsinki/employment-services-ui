import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  getDrupalNodeDataFromPathAlias,
  getEventPagePath,
} from "../helpers/fetchHelper";
import { findTaxonomy } from "../helpers/taxonomiesHelper";
import { findEventData, findNodeAttributes } from "../helpers/dataHelper";
import PageUsingParagraphs from "../components/ParagraphsPage";
import { Lang, EventParams, ParagraphData } from "../types";
import NotFound from "./NotFound";

type Data = null | {
  nodeData: any;
  paragraphData: ParagraphData;
  width: any;
};
interface EventProps {
  lang: Lang;
  cookieConsent: string;
}

function Event(props: EventProps): JSX.Element {
  const { urlAlias } = useParams<EventParams>();
  const history = useHistory();
  const [data, setData] = useState<Data>(null);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { lang, cookieConsent } = props;

  const fetchData = async () => {
    // TODO: Change langParam here when there's lang support for events
    const { nid } =
      (await getDrupalNodeDataFromPathAlias(urlAlias, "en")) || {};
    if (!nid) {
      setRedirect(true);
      return;
    }

    const filter = `&filter[drupal_internal__nid]=${nid}`;
    const [fiPage, svPage, enPage] = getEventPagePath(filter);

    const [fi, sv, en] = await Promise.all([
      axios.get(fiPage),
      axios.get(svPage),
      axios.get(enPage),
    ]);

    setData({
      nodeData: {
        fi: findNodeAttributes(fi.data),
        en: findNodeAttributes(en.data),
        sv: findNodeAttributes(sv.data),
      },
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
      const newPath = `${t("list.events_url")}/${urlAlias}`;
      history.replace(newPath);
    }
  }, [lang, t]); // eslint-disable-line

  if (redirect) {
    return <NotFound lang={lang} />;
  }

  if (!data) {
    return <></>;
  }

  return (
    <PageUsingParagraphs
      lang={lang}
      cookieConsent={cookieConsent}
      nodeData={data.nodeData}
      paragraphData={data.paragraphData}
      width={data.width}
    />
  );
}

export default Event;
