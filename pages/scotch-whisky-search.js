import React, { useReducer, useState } from "react";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import ResultsTable from "../components/ResultsTable";
import { Chip, TableBody, TableCell, TableRow } from "@mui/material";
import whiskyDbService from "../services/whiskyDbService";
import { headers } from "../constants/siteContent";
import SearchDrawer from "../components/SearchDrawer";
// added to create serverless functions
// import connectDb from "../services/connectDb";
import axios from "axios";
import clientPromise from "../mongodb";

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db("scotch_tour_v2");
  const whiskies = await db.collection("whisky_db").find({}).toArray();

  if (!whiskies) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      whiskies: JSON.parse(JSON.stringify(whiskies)),
    },
  };
}

// export async function getServerSideProps() {
//   // const whiskies = await whiskyDbService.getWhisky_db();

//   // const baseURL = 'https://scotchtour-v2-ricechrisdtreat.vercel.app'
//   // process.env.NODE_ENV === "development"
//   //   ? "http://localhost:3000"
//   //   : "https://scotchtour-v2-ricechrisdtreat.vercel.app";

//   const WHISKY_URL =
//     "https://scotchtour-v2-ricechrisdtreat.vercel.app/api/whiskies";
//   const whisky_res = await axios.get(WHISKY_URL, {
//     headers: { "Accept-Encoding": "gzip,deflate,compress" },
//   });
//   const whiskies = await whisky_res.data;
//   if (!whiskies) {
//     return {
//       notFound: true,
//     };
//   }
//   return { props: { whiskies } };
// }

export default function ScotchDb({ whiskies }) {
  // state
  const [records, setRecords] = useState(whiskies);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [filterInput, setFilterInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      whisky: "",
      min: 1,
      max: 6,
      range: [1, 6],
      tags: [],
    }
  );

  // helpers
  const { TableContainer, TableHeader, recordsAfterSorting } = ResultsTable(
    records,
    headers,
    filterFn
  );

  // handlers
  const handleSearch = (event, newValue) => {
    const { name, value, textContent } = event.target;
    name === "range"
      ? setFilterInput({ range: value, min: value[0], max: value[1] })
      : name
      ? setFilterInput({ [name]: value })
      : setFilterInput({ tags: newValue });
    setFilterFn({
      fn: (items) => {
        return items
          .filter((item) => {
            return item.whisky
              .toLowerCase()
              .includes(
                name === "whisky"
                  ? value.toLowerCase()
                  : filterInput.whisky.toLowerCase()
              );
          })
          .filter((item) => {
            let tempTags;
            name == "range"
              ? (tempTags = filterInput.tags)
              : (tempTags = newValue);
            return name == "range"
              ? tempTags.every((v) => {
                  return item.tags.includes(v);
                })
              : newValue !== undefined
              ? newValue.length > 0
                ? tempTags.every((v) => {
                    return item.tags.includes(v);
                  })
                : item
              : filterInput.tags.every((v) => {
                  return item.tags.includes(v);
                });
          })
          .filter((item) => {
            let tempMin, tempMax;
            name === "range"
              ? (tempMin = value[0])
              : (tempMin = filterInput.min);
            name === "range"
              ? (tempMax = value[1])
              : (tempMax = filterInput.max);
            return item.cost.length <= tempMax && item.cost.length >= tempMin;
          });
      },
    });
  };
  const handleReset = () => {
    setFilterInput({
      whisky: "",
      min: 1,
      max: 6,
      range: [1, 6],
      tags: [],
    });
    setFilterFn({
      fn: (items) => {
        return items;
      },
    });
  };

  return (
    <>
      <DrawerAppBar title={navItems[6].title} />
      <SearchDrawer
        handleChangeValue={handleSearch}
        searchValue={filterInput}
        handleReset={handleReset}
      />
      <TableContainer maxWidth={"100vw"}>
        <TableHeader />
        <TableBody>
          {recordsAfterSorting().map((item) => (
            <TableRow key={item.id}>
              <TableCell sx={{ fontWeight: "bold" }}>{item.whisky}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>
                {item.tags.map((tag) => (
                  <Chip
                    variant="outlined"
                    key={item.id + "-" + item.tags.indexOf(tag)}
                    label={tag}
                    size="small"
                    sx={{
                      margin: "1px",
                      backgroundColor: filterInput.tags.includes(tag)
                        ? "#d5ebff"
                        : "transparent",
                      fontSize: {
                        xs: "0.75rem",
                        md: "1rem",
                      },
                    }}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </>
  );
}
