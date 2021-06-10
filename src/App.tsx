import "./App.css";
import "./fonts.css";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Helmet } from "react-helmet";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import Nav from "./components/Nav";
import { Lang } from "./types";
import Landing from "./pages/Landing";
import Page from "./pages/Page";
import Event from "./pages/Event";
import News from "./pages/News";
import Blog from "./pages/Blog";
import { getAppName } from "./config";
import { useMatomo } from './hooks';

const groteskTheme = createMuiTheme({
  palette: {
    background: {
      default: "#fff"
    },
    success: {
      main: "#006250" 
    }
  },
  typography: {
    fontFamily: "HelsinkiGrotesk",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  overrides: {},
});

const strToLang = (langParam: string): Lang => {
  switch (langParam) {
    case "en":
      return "en";
    case "sv":
      return "sv";
    default:
      return "fi";
  }
};

function App(): JSX.Element {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [, langPath] = location.pathname.split("/");
  const [lang, setLang] = useState<Lang>(strToLang(langPath));
  const [cookieConsent, setCookieConsent] = useState(getCookieConsentValue('tyollisyyspalvelut_cookie_consent'));
  useMatomo(cookieConsent);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
  };

  return (
    <ThemeProvider theme={groteskTheme}>
      {/* <Helmet>
        <html lang={lang} />
        <title>{getAppName(lang)}</title>
      </Helmet> */}
      <Nav lang={lang} changeLang={changeLang} />
      <CssBaseline />
      <Switch>
        <Route path="/QA">
          <Redirect to="/fi/QA" />
        </Route>
        <Route path="/fi/tapahtuma/:urlAlias" strict>
          <Event lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/en/event/:urlAlias" strict>
          <Event lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/sv/evenemang/:urlAlias" strict>
          <Event lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/fi/uutiset/:urlAlias" strict>
          <News lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/en/news/:urlAlias" strict>
          <News lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/sv/nyheter/:urlAlias" strict>
          <News lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/fi/blogi/:urlAlias" strict>
          <Blog lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/en/blog/:urlAlias" strict>
          <Blog lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/sv/blogg/:urlAlias" strict>
          <Blog lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/:langParam/:urlAlias" strict>
          <Page lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Route path="/:langParam" strict>
          <Landing lang={lang} cookieConsent={cookieConsent} />
        </Route>
        <Redirect to="/fi" />
      </Switch>
      <CookieConsent
        location="bottom"
        buttonText={t("cookies.accept")}
        ariaAcceptLabel={t("cookies.accept")}
        enableDeclineButton
        declineButtonText={t("cookies.decline")}
        ariaDeclineLabel={t("cookies.decline")}
        cookieName="tyollisyyspalvelut_cookie_consent"
        containerClasses="cookie-banner"
        style={{ background: "#0000bf", color: "#fff", fontSize: "18px", alignItems: "center" }}
        buttonStyle={{ background: "#fff", color: "#0000bf", fontSize: "16px", fontWeight: "500", lineHeight: "1.5", border: "2px solid #fff", padding: "16px 24px", margin: "0 8px 16px" }}
        declineButtonStyle={{ background: "#0000bf", color: "#fff", fontSize: "16px", fontWeight: "500", lineHeight: "1.5", border: "2px solid #fff", padding: "16px 24px", margin: "0 8px 16px" }}
        expires={180}
        flipButtons
        onAccept={() => {
          setCookieConsent('true');
        }}
        onDecline={() => {
          setCookieConsent('false');
        }}
      >
        <p>{t("cookies.text")}</p>
        <a href={t("cookies.url")} style={{ color: "#fff" }}>{t("cookies.link_text")}</a>
      </CookieConsent>
    </ThemeProvider>
  );
}

export default App;
