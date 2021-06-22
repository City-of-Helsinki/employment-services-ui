import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  fetchFiles,
  fetchImages,
  fetchDocuments,
  fetchColorsTaxonomy,
  fetchWidthTaxonomy,
  getDrupalNodeDataFromPathAlias,
  getBlogPagePath,
} from "../helpers/fetchHelper";
import { findTaxonomy, setTaxonomies } from "../helpers/taxonomiesHelper";
import { findPageData, getUrlAlias, findNodeAttributes } from "../helpers/dataHelper";
import PageUsingParagraphs from "../components/ParagraphsPage";
import { Lang, Params, ParagraphData } from "../types";
import NotFound from "./NotFound";

type Data = null | {
  nodeData: any;
  paragraphData: ParagraphData;
  urlAliases: { [k in Lang]: any };
  width: any;
};

interface BlogProps {
  lang: Lang;
  cookieConsent: string;
}

function Blog(props: BlogProps): JSX.Element {
  const { urlAlias } = useParams<Params>();
  const history = useHistory();
  const [data, setData] = useState<Data>(null);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
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

    const { nid, nodeLang } =
      (await getDrupalNodeDataFromPathAlias(urlAlias, lang)) || {};

    if (!nid) {
      setRedirect(true);
      return;
    }

    if (nodeLang !== lang) {
      setRedirect(true);
      return;
    }

    const filter = `&filter[drupal_internal__nid]=${nid}`;

    const [fiPage, svPage, enPage] = getBlogPagePath(filter);
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
        fi: findPageData("fi", fi.data, files, media, documents, taxonomies),
        en: findPageData("en", en.data, files, media, documents, taxonomies),
        sv: findPageData("sv", sv.data, files, media, documents, taxonomies),
      },
      urlAliases: {
        fi: getUrlAlias(fi),
        en: getUrlAlias(en),
        sv: getUrlAlias(sv),
      },
      width: findTaxonomy(en.data, "field_page_width"),
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const [, langPath] = location.pathname.split("/");
    const alias = data?.urlAliases[lang];
    
    if (lang !== langPath) {
      const newPath = `${t("list.blog_url")}/${alias}`;
      history.replace(newPath);
    }
  }, [lang, t]);

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

export default Blog;
