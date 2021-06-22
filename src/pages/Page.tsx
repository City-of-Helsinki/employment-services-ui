import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  fetchFiles,
  fetchImages,
  fetchDocuments,
  fetchColorsTaxonomy,
  fetchWidthTaxonomy,
  getDrupalNodeDataFromPathAlias,
  getPagePagePath,
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

interface PageProps {
  lang: Lang;
  cookieConsent: string;
}

function Page(props: PageProps): JSX.Element {
  const { langParam, urlAlias } = useParams<Params>();
  const history = useHistory();
  const [data, setData] = useState<Data>(null);
  const [redirect, setRedirect] = useState(false);
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
      (await getDrupalNodeDataFromPathAlias(urlAlias, langParam)) || {};

    if (!nid) {
      setRedirect(true);
      return;
    }

    if (nodeLang !== langParam) {
      setRedirect(true);
      return;
    }

    const filter = `&filter[drupal_internal__nid]=${nid}`;

    const [fiPage, svPage, enPage] = getPagePagePath(filter);
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
    if (!data) {
      return;
    }
    const alias = data.urlAliases[lang];
    if (langParam !== lang) {
      history.replace(`/${lang}/${alias}`);
    }
  }, [lang]); // eslint-disable-line

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

export default Page;
