import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FooterBottom from './FooterBottom';
import data_fi from './data_fi';
import data_sv from './data_sv';
import data_en from './data_en';
import Paragraphs from './Paragraphs';
import Hero from './Hero';
import {Navigation} from "hds-react/components/Navigation";
import {useParams, useHistory} from "react-router-dom";
import {findData, getFullRelease, makeMenu} from "./dataHelper";
import {getTaxonomyPath, findTaxonomy, setTaxonomies} from "./taxonomiesHelper.js";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  navi: {
    zIndex: 10000,
    fontFamily: 'HelsinkiGrotesk',
    fontSize: 16,
  },
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  hero: {
    height: 550,
  },
  main: {
    marginBottom: 100,
  },
  paragraphs: {
    marginTop: 72
  }
}));

let appNames = {
  fi: { name: 'Työllisyyspalvelut'},
  sv: { name: 'Arbetstjänster'},
  en: { name: 'Employment services'},
};

export default function Landing(props) {
  let {id, restofit} = useParams();

  let history = useHistory();
  const [path] = useState(restofit);
  const [lang, setLang] = useState(id);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const setItUrl = (l) => {
    let path = '/' + l;
    if (restofit) {
      path += '/'+restofit;
    }
    history.push(path);
  }

  const setIt = (l) => {
    let path = '/' + l;
    if (restofit) {
      path += '/'+restofit;
    }
    history.push(path);
    setLang(l);
  }

  if (id !== 'sv' && id !== 'en' && id !== 'fi') {
    setItUrl('fi');
  }

  const { testing, site } = props;
  let useData = data.fi;
  if (testing) {
    useData = {en: data_en, sv: data_sv, fi: data_fi,};
  }

  const getNavi = (menu, loading, isFullVersion, lang) => {
    let nav = [];
    if (loading || !!!menu || !!!isFullVersion) {
      return <></>;
    }

    menu.map((item, index) => {
      let subs = [];
      item.items.map((sub, i) => {
        subs.push(
          <Navigation.Item
            key={i}
            as="a"
            href={'/' + lang + '/' + sub.link.substr(10)}
            label={sub.name}
            onClick={function noRefCheck(){}}
          />
        );
        return subs;
      });
      nav.push(
        <Navigation.Dropdown label={item.name} key={index}>
          {subs}
        </Navigation.Dropdown>
      );
      return nav;
    });
    return nav;
  }

  // return fi, sv, en
  const getPagePath = (page, includes, filter='') => {
    const api = "apijson";
    let rest = "/" + api + page + "?include=" + includes;
    if (filter) {
      rest += filter;
    }
    return [
      site + '/fi' + rest,
      site + '/sv' + rest,
      site + rest,
    ];
  }

  async function makeRequests() {

    setLoading(true);

    const preInc = "field_prerelease_";
    const inc = "field_page_content,field_page_width,field_page_content.field_cards,field_page_content.field_ic_card";
    const land = "/node/landing";
    const page = "/node/page";
    const news = "/node/news";
    //const event = "/node/event";
    const pre = "/node/prerelease_landing";

    const files = site + '/apijson/file/file';
    const media = site + '/apijson/media/image';
    const doc = site + '/apijson/media/document';
    const conf = site + '/apijson/config_pages/release_settings?fields[config_pages--release_settings]=field_prerelease_content,field_full_release_content';
    const menuData = site + '/apijson/menu_link_content/menu_link_content';
    const paths = site + '/apijson/path_alias/path_alias';
    const taxColors = getTaxonomyPath(site, 'colors', false);
    const taxWidth = getTaxonomyPath(site, 'paragraph_width', false);
    const taxIcons = getTaxonomyPath(site, 'icons', false);

    let [f, m, d, configuration, me, colorsTax, widthTax, iconsTax] = await Promise.all([
      axios.get(files),
      axios.get(media),
      axios.get(doc),
      axios.get(conf),
      axios.get(menuData),
      axios.get(taxColors),
      axios.get(taxWidth),
      axios.get(taxIcons),
    ]);

    const taxonomies = setTaxonomies([['Colors',colorsTax], ['Width', widthTax], ['Icons', iconsTax]]);
    console.log(taxonomies);
    let menus = makeMenu(me);
    const fullRelease = getFullRelease(configuration);
    let [fi, sv, en,] = [null, null, null,];
    let [fiPage, svPage, enPage] = getPagePath(land, inc);

    if (fullRelease && path !== "QA" ) {
      if (path) {
        let exactPath = paths + "?filter[alias]=/" + path;
        let [res] =  await Promise.all([
          axios.get(exactPath),
          ]);
        if (res.data.meta.count>0 && res.data ) {
          let filter = "&filter[drupal_internal__nid]=" + res.data.data[0].attributes.path.substr(6);
          [fiPage, svPage, enPage] = getPagePath(page, inc, filter);
        }
      }
      [fi, sv, en,] = await Promise.all([
        axios.get(fiPage),
        axios.get(svPage),
        axios.get(enPage),
      ]);
      if (en.data.data.meta === '0') {
        console.log('data not found from path');
        [fiPage, svPage, enPage] = getPagePath(news, inc);
        [fi, sv, en,] = await Promise.all([
          axios.get(fiPage),
          axios.get(svPage),
          axios.get(enPage),
        ]);
      }
    } else {
      [fiPage, svPage, enPage] = getPagePath(pre, preInc);
      [fi, sv, en,] = await Promise.all([
        axios.get(fiPage),
        axios.get(svPage),
        axios.get(enPage),
      ]);
    }

    let fiData = findData('fi', fi.data, f, m, d, taxonomies);
    let svData = findData('sv', sv.data, f, m, d, taxonomies);
    let enData = findData('en', en.data, f, m, d, taxonomies);
    const width = findTaxonomy(en.data, 'field_page_width');
    setData({
      en: enData, fi: fiData, sv: svData,
      width: width,
      files: f,
      media: m,
      configuration: configuration,
      fullVersion: fullRelease,
      site: site,
      menu: menus,
      taxonomies: taxonomies,
    });
    setLoading(false);
  }

  useEffect(() => {
    makeRequests();
  }, []);

  let logolang = 'fi';
  let appName = appNames.fi.name;
  let langSelect = 'FI';

  switch (lang) {
    case 'en':
      useData = data.en;
      logolang = 'en';
      langSelect = 'EN';
      appName = appNames.en.name;
      break;
    case 'sv':
      useData = data.sv;
      logolang = 'sv';
      appName = appNames.sv.name;
      langSelect = 'SV';
      break;
    case 'fi':
    default:
      useData = data.fi;
      appName = appNames.fi.name;
      langSelect = 'FI';
  }

  let heroTitle = "";
  let heroText = "";
  let heroUrl = "";
  let isHero = true;

  if (!loading) {
    if (useData.length>0 && useData[0].type === 'Hero') {
      heroTitle = useData[0].title;
      heroText = useData[0].text;
      heroUrl = useData[0].url;
    } else {
      isHero = false;
    }
  }

  if (loading) {
    return <div></div>;
  }

  const navi = getNavi(data.menu, loading, data.fullVersion, lang);

  return (
    <React.Fragment>
      <CssBaseline />
        <Navigation className={classes.navi}
            logoLanguage={logolang}
            menuToggleAriaLabel="Menu"
            skipTo="#content"
            skipToContentLabel="Skip to main content"
            theme={{
              '--header-divider-color': 'white',
            }}
            title={appName}
            titleAriaLabel="Helsinki: Työllisyyspalvelut"
            titleUrl="https://tyollisyyspalvelut.hel.fi"
            style={{'--header-divider-color':'white'}}
        >
          <Navigation.Actions>
              <Navigation.LanguageSelector label={langSelect}>
                <Navigation.Item label="Suomeksi" onClick={() => setIt('fi')}/>
                <Navigation.Item label="På svenska" onClick={() => setIt('sv')}/>
                <Navigation.Item label="In English" onClick={() => setIt('en')}/>
              </Navigation.LanguageSelector>
            </Navigation.Actions>

          <Navigation.Row >
            {navi}
            </Navigation.Row>

        </Navigation>

      {loading ? <div></div> :
        <main className={classes.main}>
          {isHero ? <Hero
            title={heroTitle}
            text={heroText}
            url={heroUrl}
            site={site}
            className={classes.hero}
          /> : <></>}
          <Paragraphs paragraphs={useData} width={data.width} site={site} className={classes.paragraphs}/>

        </main>
      }
      <FooterBottom
        title={appName}
        description=""
        lang={logolang}
      />
    </React.Fragment>
  );
}
