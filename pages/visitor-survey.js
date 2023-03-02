import React, { useReducer, useEffect, useState } from "react";
import Survey from "../components/Survey";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import {
  ratingLabels,
  interestLabels,
  initialFormValues,
  brandData,
} from "../constants/siteContent";
import surveyService from "../services/surveyService";
import useRouter from "next/router";
import clientPromise from "../mongodb";
import { surveyResultsState, whiskyListState } from "../components/atoms";
import { useRecoilState } from "recoil";

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

export default function VisitorSurvey({ whiskies }) {
  // state
  const [whiskySet, setWhiskySet] = useRecoilState(whiskyListState);
  const [surveyData, setSurveyData] = useRecoilState(surveyResultsState);
  console.log(whiskySet);
  console.log(surveyData);

  useEffect(() => {
    fetch("/api/surveys")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSurveyData(data);
      });
  }, []);

  const [surveyInput, setSurveyInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialFormValues
  );
  const disableSubmit = Object.values(surveyInput)
    .map((v) => v)
    .every((v) => (v ? true : false))
    ? false
    : true;
  const submitSurvey = (data) => surveyService.submitSurvey(data);

  // handlers
  const handleChangeValue = (event) => {
    const { name, value } = event.target;
    setSurveyInput({ [name]: Number(value) });
  };
  const handleChangeScotchBrands = (event, newValue) => {
    setSurveyInput({ "scotch-brands": newValue });
  };
  const handleChangeFavoriteWhisky = (event, newValue) => {
    setSurveyInput({ "favorite-whisky": newValue });
  };
  const handleSurveySubmit = () => {
    submitSurvey(surveyInput);
    setSurveyData([...surveyData, surveyInput]);
    const router = useRouter;
    router.push("/survey-stats");
  };

  return (
    <>
      <DrawerAppBar title={navItems[7].title} />
      <Survey
        ratingLabels={ratingLabels}
        interestLabels={interestLabels}
        surveyValues={surveyInput}
        handleChangeValue={handleChangeValue}
        handleChangeScotchBrands={handleChangeScotchBrands}
        handleChangeFavoriteWhisky={handleChangeFavoriteWhisky}
        handleSurveySubmit={handleSurveySubmit}
        disableSubmit={disableSubmit}
        brandList={brandData.map((obj) => obj.name)}
        whiskyList={whiskies.map((obj) => obj.whisky)}
      />
    </>
  );
}
