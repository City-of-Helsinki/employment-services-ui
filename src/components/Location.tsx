import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconLocation } from "hds-react";

interface LocationProps {
  location: string;
}

const useStyles = makeStyles(() => ({
  container: () => ({
    display: "flex",
    color: "black",
  }),
  icon: () => ({
    marginRight: 5,
  }),
}));

function Location(props: LocationProps): JSX.Element {
  const classes = useStyles(props);
  const { location } = props;

  return (
    <div className={classes.container}>
      <IconLocation className={classes.icon} />
      <div>{location}</div>
    </div>
  );
}

export default Location;
