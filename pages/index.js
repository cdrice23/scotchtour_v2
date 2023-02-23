import React, { useEffect } from "react";
import FullPage from "../components/FullPage";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import { homeContent } from "../constants/siteContent";
import { surveyResultsState, whiskyListState } from "../components/atoms";
import { useRecoilState } from "recoil";
import clientPromise from "../mongodb";

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("scotch_tour_v2");
  const whiskies = await db.collection("whisky_db").find({}).toArray();
  const surveyResults = await db
    .collection("visitor_survey")
    .find({})
    .toArray();

  const initialRecoilState = {
    whiskyList: JSON.parse(JSON.stringify(whiskies)),
    surveyData: JSON.parse(JSON.stringify(surveyResults)),
  };

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
      initialRecoilState,
    },
  };
}

export default function Home(props) {
  const [whiskylist, setWhiskyList] = useRecoilState(whiskyListState);
  const [surveyData, setSurveyData] = useRecoilState(surveyResultsState);

  useEffect(() => {
    setWhiskyList(props.initialRecoilState.whiskyList);
    setSurveyData(props.initialRecoilState.surveyData);
  }, []);

  console.log(whiskylist);
  console.log(surveyData);
  return (
    <>
      <DrawerAppBar title={navItems[0].title} />
      <FullPage
        title={homeContent.mainTitle}
        hero={homeContent.hero}
        mainText={homeContent.mainText}
        // alt={homeContent.alt}
        // imgHeight={homeContent.imgHeight}
        // imgWidth={homeContent.imgWidth}
      />
    </>
  );
}
