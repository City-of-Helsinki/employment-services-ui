import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  fetchFiles,
  fetchImages,
  fetchDocuments,
  fetchColorsTaxonomy,
  fetchWidthTaxonomy,
  getLandingPagePath,
} from "../helpers/fetchHelper";
import { findTaxonomy, setTaxonomies } from "../helpers/taxonomiesHelper";
import { findPageData } from "../helpers/dataHelper";
import PageUsingParagraphs from "./ParagraphsPage";
import { Lang, ParagraphData } from "../types";

type Data = null | {
  paragraphData: ParagraphData;
  width: any;
};

interface LandingProps {
  lang: Lang;
  cookieConsent: string;
}

function Landing(props: LandingProps) {
  const { langParam } = useParams<{langParam: string}>()
  const history = useHistory();
  const [data, setData] = useState<Data>(null);
  const { lang, cookieConsent } = props;

  const fetchData = async () => {
    const [files, media, documents, colorsTax, widthTax] = await Promise.all([
      fetchFiles(),
      fetchImages(),
      fetchDocuments(),
      fetchColorsTaxonomy(),
      fetchWidthTaxonomy(),
    ]);

    const taxonomies = setTaxonomies([
      ["Colors", colorsTax],
      ["Width", widthTax],
    ]);
    const [fiPage, svPage, enPage] = getLandingPagePath();
    const [fi, sv, en] = await Promise.all([axios.get(fiPage), axios.get(svPage), axios.get(enPage)]);

    setData({
      paragraphData: {
        en: findPageData("en", en.data, files, media, documents, taxonomies),
        fi: findPageData("fi", fi.data, files, media, documents, taxonomies),
        sv: findPageData("sv", sv.data, files, media, documents, taxonomies),
      },
      width: findTaxonomy(en.data, "field_page_width"),
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (lang !== langParam) {
      history.replace(lang);
    }
  }, [lang])

  if (!data) {
    return <></>;
  }

  return <PageUsingParagraphs lang={lang} cookieConsent={cookieConsent} paragraphData={data.paragraphData} width={data.width} />;
}

export default Landing;
