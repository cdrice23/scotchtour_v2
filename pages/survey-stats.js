import React, { useEffect } from "react";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import SurveyCharts from "../components/SurveyCharts";
import whiskyDbService from "../services/whiskyDbService";
import surveyService from "../services/surveyService";
import { SurveyChartData } from "../components/ChartData";
import { Typography } from "@mui/material";
import axios from "axios";
import clientPromise from "../mongodb";

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("scotch_tour_v2");
  const whiskies = await db.collection("whisky_db").find({}).toArray();
  const surveyResults = await db
    .collection("visitor_survey")
    .find({})
    .toArray();

  if (!whiskies) {
    return {
      notFound: true,
    };
  }
  if (!surveyResults) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      whiskies: JSON.parse(JSON.stringify(whiskies)),
      surveyResults: JSON.parse(JSON.stringify(surveyResults)),
    },
  };
}

export default function SurveyStats({ whiskies, surveyResults }) {
  // helpers
  const {
    totalcount,
    recognizeddata,
    beloveddata,
    popularregiondata,
    comparedtodata,
    hoverdata,
    whiskynotedata,
  } = SurveyChartData(whiskies, surveyResults);

  if (!whiskies || !surveyResults)
    return (
      <>
        <Typography>404 Error</Typography>
      </>
    );

  return (
    <>
      <DrawerAppBar title={navItems[8].title} />
      <SurveyCharts
        totalcount={totalcount}
        recognizeddata={recognizeddata}
        beloveddata={beloveddata}
        popularregiondata={popularregiondata}
        comparedtodata={comparedtodata}
        hoverdata={hoverdata}
        whiskynotedata={whiskynotedata}
      />
    </>
  );
}
