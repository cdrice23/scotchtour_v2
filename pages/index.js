import React, { useEffect } from "react";
import FullPage from "../components/FullPage";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import { homeContent } from "../constants/siteContent";
import { surveyResultsState, whiskyListState } from "../components/atoms";
import { useRecoilState } from "recoil";
import clientPromise from "../mongodb";
import whiskyDbService from "../services/whiskyDbService";
import surveyService from "../services/surveyService";
import axios from "axios";
import { ConstructionOutlined } from "@mui/icons-material";

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

export default function Home({ whiskies, surveyResults }) {
  const [whiskySet, setWhiskySet] = useRecoilState(whiskyListState);
  const [surveyData, setSurveyData] = useRecoilState(surveyResultsState);
  console.log(whiskySet);
  console.log(surveyData);
  console.log(whiskies);
  console.log(surveyResults);

  useEffect(() => {
    if (!whiskySet.length > 0) {
      setWhiskySet(whiskies);
    }
    if (!surveyData.length > 0) {
      setSurveyData(surveyResults);
    }
  }, []);
  return (
    <>
      <DrawerAppBar title={navItems[0].title} />
      <FullPage
        title={homeContent.mainTitle}
        hero={homeContent.hero}
        mainText={homeContent.mainText}
        alt={homeContent.alt}
      />
    </>
  );
}
