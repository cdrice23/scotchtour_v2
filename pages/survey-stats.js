import React, { useEffect, useState } from "react";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import SurveyCharts from "../components/SurveyCharts";
import whiskyDbService from "../services/whiskyDbService";
import surveyService from "../services/surveyService";
import { SurveyChartData } from "../components/ChartData";
import { Typography } from "@mui/material";
import axios from "axios";
import clientPromise from "../mongodb";
import { useRecoilState, useRecoilValue } from "recoil";
import { surveyResultsState, whiskyListState } from "../components/atoms";

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
  // state
  const [whiskySet, setWhiskySet] = useRecoilState(whiskyListState);
  const [surveyData, setSurveyData] = useRecoilState(surveyResultsState);

  // useEffect(() => {
  //   if (!whiskySet.length > 0) {
  //     axios
  //       .get("/api/whiskeys")
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((data) => setWhiskySet(data));
  //   }
  //   if (!surveyData.length > 0) {
  //     fetch("/api/surveys")
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((data) => {
  //         setSurveyData(data);
  //       });
  //   }
  // }, []);
  // helpers
  const whiskyChartData = whiskySet.length > 0 ? whiskySet : whiskies;
  const surveyResultChartData =
    surveyData.length > 0 ? surveyData : surveyResults;
  const {
    totalcount,
    recognizeddata,
    beloveddata,
    popularregiondata,
    comparedtodata,
    hoverdata,
    whiskynotedata,
  } = SurveyChartData(whiskyChartData, surveyResultChartData);

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
