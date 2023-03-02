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

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db("scotch_tour_v2");
  const whiskies = await db.collection("whisky_db").find({}).toArray();
  if (!whiskies) {
    return {
      notFound: true,
    };
  }
  return { props: { whiskies: JSON.parse(JSON.stringify(whiskies)) } };
}

export default function Home({ whiskies }) {
  const [whiskySet, setWhiskySet] = useRecoilState(whiskyListState);
  const [surveyData, setSurveyData] = useRecoilState(surveyResultsState);

  useEffect(() => {
    if (!whiskySet.length > 0) {
      setWhiskySet(whiskies);
    }
    if (!surveyData.length > 0) {
      fetch("/api/surveys")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSurveyData(data);
        });
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
