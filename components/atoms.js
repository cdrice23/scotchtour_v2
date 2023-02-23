import { selector, atom } from "recoil";

export const whiskyListState = atom({
  key: "whiskyList",
  default: [],
});

export const surveyResultsState = atom({
  key: "surveyResultsData",
  default: [],
});
