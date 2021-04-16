import React, { useState } from "react";
import Accord from "./components/Accord";
import SingleCard from "./components/SingleCard";
import { Mainheading, Subheading } from "./components/Headings";
import Info from "./components/Info";
import Pdf from "./components/Pdf";
import PhoneNumberBox from "./components/PhoneNumberBox";
import Text from "./components/Text";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Image from "./components/Image";
import { getCookieConsentValue } from "react-cookie-consent";
import ImageAndCard from "./components/ImageAndCard";
import CardList from "./components/CardList";
import EventsList from "./components/EventsList";
import { Container } from "hds-react";
import { Koros } from "hds-react/components/Koros";
import Link from "./components/Link";
import Date from "./components/Date";
import Location from "./components/Location";
import SujoEmbedded from "./components/SujoEmbedded";
import { ImportReactAndShare } from './hooks/ImportScripts';
import { Lang } from "./types";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    margin: "0 auto 32px auto",
    [theme.breakpoints.down(768)]: {
      paddingLeft: 16,
      paddingRight: 16,
      maxWidth: "100%",
    },
  },
  container2: {
    padding: 0,
    margin: "0 auto 0 auto",
    [theme.breakpoints.down(768)]: {
      paddingLeft: 16,
      paddingRight: 16,
      maxWidth: "100%",
    },
  },
  accord: {
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  card: {
    padding: 0,
    marginTop: 32,
    marginBottom: 15,
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  subheading: {
    padding: 0,
    marginTop: 32,
    marginBottom: 15,
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  info: {
    marginTop: 36,
    marginBottom: 72,
    [theme.breakpoints.only("xs")]: {
      marginTop: 24,
      marginBottom: 24,
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  pdf: {
    marginBottom: 10,
    padding: 0,
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  sides: {
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  cardList: {
    width: "100%",
  },
  sujo: {
    marginTop: 32,
    marginBottom: 32,
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  location: {
    paddingBottom: 20,
  },
  reactAndShare: {
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }
}));

type ParagraphWidth = "Narrow" | "Medium" | "Wide" | "Full" | null;
interface ParagraphsProps {
  paragraphs: any;
  width: ParagraphWidth;
  lang: Lang;
  lastParagraphColor: string;
}

const FullParagraphGrid = ({ className, children }: { className: string; children: any }) => (
  <Grid container spacing={1} className={className}>
    <Grid item style={{ margin: "0", zIndex: 10 }} xs={12}>
      {children}
    </Grid>
  </Grid>
);

const WideParagraphGrid = ({ className, children }: { className: string; children: any }) => (
  <Grid container spacing={1} className={className}>
    <Grid item style={{ margin: "0 auto", zIndex: 10 }} xs={12}>
      {children}
    </Grid>
  </Grid>
);

const NarrowParagraphGrid = ({ className, children }: { className: string; children: any }) => (
  <Grid container spacing={1} className={className}>
    <Grid item style={{ margin: "0 auto", zIndex: 10 }} xs={12} md={8}>
      {children}
    </Grid>
  </Grid>
);

const NarrowLargerParagraphGrid = ({ className, children }: { className: string; children: any }) => (
  <Grid container spacing={1} className={className}>
    <Grid item style={{ margin: "0 auto", zIndex: 10 }} xs={12} md={9}>
      {children}
    </Grid>
  </Grid>
);

export const DefaultParagraphGrid = ({ className, children }: { className: string; children: any }) => (
  <Grid container spacing={1} className={className}>
    <Grid item style={{ margin: "0 auto", zIndex: 10 }} xs={12} md={8} key={2}>
      {children}
    </Grid>
  </Grid>
);

export const ParagraphGrid = ({
  className,
  paragraphWidth,
  children,
}: {
  className: string;
  paragraphWidth: ParagraphWidth;
  children: any;
}) => {
  if (paragraphWidth === "Wide") {
    return <WideParagraphGrid className={className}>{children}</WideParagraphGrid>;
  }
  if (paragraphWidth === "Full") {
    return <FullParagraphGrid className={className}>{children}</FullParagraphGrid>;
  }
  return <NarrowParagraphGrid className={className}>{children}</NarrowParagraphGrid>;
};

function Paragraphs(props: ParagraphsProps) {
  const classes = useStyles();
  const { paragraphs, width, lang, lastParagraphColor } = props;
  const items: any[] = [];
  const [cookieConsent, setCookieConsent] = useState(getCookieConsentValue('tyollisyyspalvelut_cookie_consent'));
  ImportReactAndShare(cookieConsent, lang);

  paragraphs.forEach((paragraph: any, index: number) => {
    switch (paragraph.type) {
      case "Accordion":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.accord} paragraphWidth={width}>
              <Accord {...paragraph}></Accord>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Card":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.card} paragraphWidth={width}>
              <SingleCard {...paragraph}></SingleCard>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "CardList":
        const isKoro = paragraph.isKoro;
        const bgColor = paragraph.bgColor;
        items.push(
          <div
            style={{
              paddingTop: isKoro ? "20px" : "40px",
              paddingBottom: "40px",
              backgroundColor: bgColor,
              position: "relative",
            }}
          >
            <div style={{ backgroundColor: bgColor }}>
              {isKoro ? <Koros type="basic" style={{ fill: bgColor, position: "absolute", top: "-15px" }} /> : <></>}
              <Container className={classes.container} style={{ zIndex: 10 }}>
                <ParagraphGrid className={classes.cardList} paragraphWidth={"Full"}>
                  <CardList {...paragraph}></CardList>
                </ParagraphGrid>
              </Container>
            </div>
          </div>
        );
        break;
      case "Mainheading":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.subheading} paragraphWidth={width}>
              <Mainheading {...paragraph}></Mainheading>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Subheading":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.subheading} paragraphWidth={width}>
              <Subheading {...paragraph}></Subheading>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Info":
        items.push(
          width === "Narrow" ? (
            <Container className={classes.container}>
              <NarrowLargerParagraphGrid className={classes.info}>
                <Info {...paragraph}></Info>
              </NarrowLargerParagraphGrid>
            </Container>
          ) : (
            <Container className={classes.container}>
              <ParagraphGrid className={classes.info} paragraphWidth={width}>
                <Info {...paragraph}></Info>
              </ParagraphGrid>
            </Container>
          )
        );
        break;
      case "Link":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.card} paragraphWidth={width}>
              <Link url={paragraph.url} text={paragraph.url_text}></Link>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Pdf":
      case "PDF":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.pdf} paragraphWidth={width}>
              <Pdf {...paragraph}></Pdf>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Image":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.info} paragraphWidth={width}>
              <Image {...paragraph}></Image>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "ImageAndCard":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.info} paragraphWidth={width}>
              <ImageAndCard {...paragraph}></ImageAndCard>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "PhoneNumberBox":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.card} paragraphWidth={width}>
              <PhoneNumberBox {...paragraph}></PhoneNumberBox>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "Text":
        items.push(
          <Container className={classes.container}>
            <ParagraphGrid className={classes.accord} paragraphWidth={width}>
              <Text {...paragraph}></Text>
            </ParagraphGrid>
          </Container>
        );
        break;
      case "EventsList":
        items.push(<EventsList lang={lang} title={paragraph.title} bgColor={paragraph.bgColor} />);
        break;
      case "Date":
        items.push(
          <Container className={classes.container2}>
            <ParagraphGrid className={classes.accord} paragraphWidth={width}>
              <Date startTime={paragraph.startTime} endTime={paragraph.endTime} />
            </ParagraphGrid>
          </Container>
        );
        break;
      // Not used in Drupal ATM
      case "Location":
        items.push(
          <Container className={classes.container2}>
            <ParagraphGrid className={classes.location} paragraphWidth={width}>
              <Location location={paragraph.location} />
            </ParagraphGrid>
          </Container>
        )
        break;
      case "SujoEmbedded":
        items.push(
          <Container className={classes.container2}>
            <ParagraphGrid className={classes.sujo} paragraphWidth={width}>
              <SujoEmbedded training={paragraph.training} />
            </ParagraphGrid>
          </Container>
        )
        break;
      case "ReactAndShare":
        items.push(
          <div style={{ backgroundColor: lastParagraphColor }}>
            <Container className={classes.container2}>
              <ParagraphGrid className={classes.reactAndShare} paragraphWidth={width}>
                <div className="rns"></div>
              </ParagraphGrid>
            </Container>
          </div>
        )
        break;
      default:
        break;
    }
    return;
  });

  return (
    <>
      {items.map((item, i) =>
        <React.Fragment key={i}>
         {item}
        </React.Fragment>
      )}
    </>
  );
}

export default Paragraphs;
