import React from "react";
import { motion } from "framer-motion";
import { Typography, Grid, Box } from "@mui/material";
import styles from "../styles/ScrollBox.module.css";

const scrollboxVar = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
  hidden: {
    opacity: 0,
  },
};

export default function ScrollBox(props) {
  const imgSizing = props.content.imgSizing === "grow" ? styles.grow : "";
  const imgShow = props.content.imageUrl ? styles.imageShow : styles.imageHide;
  const imgStyle = `${imgSizing} ${imgShow}`;

  return (
    <Grid
      item
      container
      sx={{
        scrollSnapAlign: "center",
      }}
      className={styles.blockWrapper}
    >
      <Grid item xs={12} sm={5} className={styles.titleBlock}>
        <Typography variant="h1" className={styles.title}>
          {props.content.title}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={7} className={styles.scrollWrapper}>
        <motion.div
          initial={scrollboxVar.hidden}
          whileInView={scrollboxVar.visible}
          viewport={{ once: true }}
        >
          <img src={props.content.imageUrl} className={imgStyle} />
        </motion.div>
        <motion.div
          initial={scrollboxVar.hidden}
          whileInView={scrollboxVar.visible}
          viewport={{ once: true }}
        >
          <Typography
            className={
              props.content.caption ? styles.captionShow : styles.captionHide
            }
          >
            {props.content.caption}
          </Typography>
        </motion.div>
        <Box className={styles.paragraphBlock}>
          {props.content.description.map((bit, i) => (
            <motion.div
              initial={scrollboxVar.hidden}
              whileInView={scrollboxVar.visible}
              viewport={{ once: true }}
              key={`motion-${i}`}
            >
              <div key={`bit-${i}`}>{bit}</div>
            </motion.div>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}
