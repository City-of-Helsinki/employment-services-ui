import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Koros } from "hds-react/components/Koros";
import { Container, Button as HDSButton, IconPlus, IconArrowRight } from "hds-react";
import Box from "@material-ui/core/Box";
import { ParagraphGrid } from "../Paragraphs";
import { makeStyles } from "@material-ui/core/styles";
import CardList from "./CardList";
import { Mainheading } from "./Headings";
import { Lang } from "../types";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px 0 110px",
    margin: "0 auto 0 auto",
    [theme.breakpoints.down(768)]: {
      paddingLeft: 16,
      paddingRight: 16,
      maxWidth: "100%",
    },
  },
  title: {
    paddingBottom: 20,
    paddingTop: 15,
  },
  cardList: {
    width: "100%",
  },
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginTop: 40,
  },
  loadMore: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 30,
  },
}));

interface BlogState {
  total: number;
  results: Array<{
    path: string;
    title: string;
    summary: string;
    date: string;
  }>;
}

interface BlogListProps {
  title: string;
  lang: Lang;
  bgColor: string;
  isKoro: boolean;
  titleColor: string;
  limit: boolean;
}

function BlogList(props: BlogListProps) {
  const classes = useStyles();
  const history = useHistory();
  const { title, bgColor, lang, isKoro, titleColor, limit } = props;
  const [blogIndex, setBlogIndex] = useState<number>(0);
  const [blogs, setBlogs] = useState<BlogState>({ total: 0, results: [] });

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get("/api/blogs/all/" + blogIndex);
      const results = limit ? res.data.results.slice(0, 3) : res.data.results;
      const total = limit ? 3 : res.data.total;

      const newBlogs = {
        total: total,
        results: [...blogs.results, ...results],
      };
      setBlogs(newBlogs);
    };
    fetchBlogs();
  }, [blogIndex]);

  const loadMoreText = lang === "fi" ? "Lataa lisää" : lang === "sv" ? "Visa fler" : "Show more";
  const readMoreText = lang === "fi" ? "Lue kaikki blogit" : lang === "sv" ? "Läs alla bloggar" : "Read all blogs";
  const blogUrl = lang === "fi" ? "/fi/blogi" : lang === "sv" ? "/sv/blogg" : "/en/blog";

  return (
    <div
      style={{
        paddingTop: isKoro ? "20px" : "40px",
        backgroundColor: bgColor,
        position: "relative",
      }}
    >
      <div style={{ backgroundColor: bgColor }}>
        {isKoro ? <Koros type="basic" style={{ fill: bgColor, position: "absolute", top: "-15px" }} /> : <></>}
        <Container className={classes.container} style={{ zIndex: 10 }}>
          <ParagraphGrid className={classes.cardList} paragraphWidth={"Full"}>
            <div className={classes.title}>
              <Mainheading headingTag={"h2"} title={title} />
            </div>
            <CardList
              lang={lang}
              type="listItem"
              cards={blogs.results.map((blog) => ({
                type: "blog",
                title: blog.title,
                title_color: titleColor,
                text: blog.summary,
                dateContent: { startTime: blog.date },
                button_url: `${blogUrl}${blog.path}`,
              }))}
            />
            { limit && (
              <Box className={classes.box}>
                <HDSButton
                  iconRight={<IconArrowRight />}
                  onClick={() => {
                    history.replace(blogUrl);
                  }}
                >
                  {readMoreText}
                </HDSButton>
              </Box>
            )}
            { !limit && blogs.total > blogs.results.length && (
              <div className={classes.loadMore}>
                <HDSButton
                  variant="supplementary"
                  iconRight={<IconPlus />}
                  onClick={() => {
                    if (blogs.total > blogs.results.length) {
                      setBlogIndex(blogIndex + 1);
                    }
                  }}
                >
                  {loadMoreText}
                </HDSButton>
              </div>
            )}
          </ParagraphGrid>
        </Container>
      </div>
    </div>
  );
}
export default BlogList;
