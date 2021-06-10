import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Paragraphs from "../components/Paragraphs";
import { Hero, HeroShallow } from "../components/Hero";
import { getAppName } from "../config";
import { Lang, ParagraphData } from "../types";

const useStyles = makeStyles((theme) => ({
  navi: {
    zIndex: 10000,
    fontFamily: "HelsinkiGrotesk",
    fontSize: 16,
  },
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  hero: (heroShallow) => ({
    height: heroShallow ? 360 : 550,
  }),
  main: {},
  paragraphs: {
    marginTop: 56,
  },
}));

export interface PageUsingParagraphsProps {
  lang: Lang;
  cookieConsent: string;
  nodeData?: any;
  paragraphData: ParagraphData;
  width: any;
}

export default function ParagraphsPage(props: PageUsingParagraphsProps): JSX.Element {
  const { lang, cookieConsent, nodeData, paragraphData, width } = props;

  let useData = paragraphData.fi;
  let nodeAttributes = nodeData.fi;
  if (lang === "en") {
    useData = paragraphData.en;
    nodeAttributes = nodeData.en;
  } else if (lang === "sv") {
    useData = paragraphData.sv;
    nodeAttributes = nodeData.sv;
  }

  let heroTitle = "";
  let heroText = "";
  let heroUrl = "";
  let isHero = true;
  let heroShallow = false;

  if (useData.length > 0 && useData[0].type === "Hero") {
    heroTitle = useData[0].title;
    heroText = useData[0].text;
    heroUrl = useData[0].imageUrl;
    heroShallow = useData[0].shallow;
  } else {
    isHero = false;
  }

  const classes = useStyles(heroShallow);

  const filteredParagraphs = useData.filter((el: any) => el.type !== 'ReactAndShare' && el.type !== 'ShareButtons');
  const lastParagraph = !filteredParagraphs ? undefined : filteredParagraphs[filteredParagraphs.length - 1];
  const lastParagraphColor = lastParagraph ? lastParagraph.bgColor : "";
  const imageParagraph = useData.filter((el: any) => el.type === 'Image');

  return (
    <>
      {/* <Helmet>
        <title>{`${getAppName(lang)} | ${nodeAttributes.title}`}</title>
        { nodeAttributes.summary && <meta name="description" content={nodeAttributes.summary} /> }
        <meta name="og:title" content={nodeAttributes.title} />
        { nodeAttributes.summary && <meta name="og:description" content={nodeAttributes.summary} />}
        { imageParagraph?.length && <meta name="og:image" content={imageParagraph[0].imageUrl} />}
      </Helmet> */}
      <main className={classes.main}>
        {isHero ? (
          <div className={classes.hero}>
            {heroShallow ? (
              <HeroShallow title={heroTitle} imageUrl={heroUrl} />
            ) : (
              <Hero title={heroTitle} text={heroText} imageUrl={heroUrl} />
            )}
          </div>
        ) : (
          <></>
        )}
        <div className={classes.paragraphs}>
          <Paragraphs
            paragraphs={useData}
            lang={lang}
            cookieConsent={cookieConsent}
            nodeData={nodeAttributes}
            width={width}
            lastParagraphColor={lastParagraphColor}
          />
        </div>
      </main>
      <Footer
        title={getAppName(lang)}
        lang={lang}
        lastParagraphColor={lastParagraphColor}
      />
    </>
  );
}
