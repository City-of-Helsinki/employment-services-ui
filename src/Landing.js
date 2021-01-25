import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FooterBottom from './FooterBottom';
import data_fi from './data_fi';
import data_sv from './data_sv';
import data_en from './data_en';
import Paragraphs from './Paragraphs';
import Hero from './Hero';
import {Navigation} from "hds-react/components/Navigation";
import {findData} from './dataHelper';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
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
  en: { name: 'Employment services'}
};

export default function Landing() {
  const lang = 'FI';
  const [appState, setAppState] = useState({
    loading: false,
    datax: null,
  });
  const classes = useStyles();

  let data = data_fi;
  let logolang = 'fi';
  let appName = appNames.fi.name;
  switch(lang) {
    case 'EN': data = data_en; logolang = 'en'; appName = appNames.en.name; break;
    case 'SV': data = data_sv; logolang = 'sv'; appName = appNames.sv.name; break;
    case 'FI':
    default:
      appName = appNames.fi.name;
      data = data_fi;
  }

  async function makeRequests() {
    const d_url_fi = process.env.REACT_APP_DRUPAL_URL + '/fi/apijson/node/prerelease_landing?include=field_prerelease_';
    const d_url_sv = process.env.REACT_APP_DRUPAL_URL + '/sv/apijson/node/prerelease_landing?include=field_prerelease_';
    const d_url_en = process.env.REACT_APP_DRUPAL_URL + '/apijson/node/prerelease_landing?include=field_prerelease_';
    const files = process.env.REACT_APP_DRUPAL_URL + '/apijson/file/file';
    const media = process.env.REACT_APP_DRUPAL_URL + '/apijson/media/image';
    const doc = process.env.REACT_APP_DRUPAL_URL + '/apijson/media/document';
    let [fi, sv, en, f, m, d] = await Promise.all([
      axios.get(d_url_fi),
      axios.get(d_url_sv),
      axios.get(d_url_en),
      axios.get(files),
      axios.get(media),
      axios.get(doc),
    ]);
    console.log(f); console.log(m); console.log(en.data);
    //let fiData = findData('fi', fi.data, f, m, d);
    //let svData = findData('sv', sv.data, f, m, d);
    let enData = findData('en', en.data, f, m, d);
    //console.log('fi'); console.log(fi.data); console.log(fiData);
    //console.log('sv'); console.log(sv.data); console.log(svData);
    console.log('en'); console.log(en.data); console.log(enData);
    //setAppState({loading: false, datax: {fi: fiData, sv: svData, en: enData, files: f, media: m}, doc: d});
    setAppState({loading: false, datax: {en: enData, files: f, media: m}, doc: d});
  }

  useEffect(() => {
    setAppState({ loading: true });
    makeRequests();
  }, [setAppState]);

  let setLang = (l) => {}
  return (
    <React.Fragment>
      <CssBaseline />
        <Navigation
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
              <Navigation.LanguageSelector label={lang}>
                <Navigation.Item label="Suomeksi" onClick={() => setLang('FI')}/>
                <Navigation.Item label="På svenska" onClick={() => setLang('SV')}/>
                <Navigation.Item label="In English" onClick={() => setLang('EN')}/>
              </Navigation.LanguageSelector>
            </Navigation.Actions>
          </Navigation>
      <main className={classes.main}>
        <Hero
          title={data[0].title}
          text={data[0].text}
          className={classes.hero}
        />
         <Paragraphs paragraphs={data} className={classes.paragraphs}/>
      </main>
      <FooterBottom
        title={appName}
        description=""
        lang={logolang}
      />
    </React.Fragment>
  );
}
