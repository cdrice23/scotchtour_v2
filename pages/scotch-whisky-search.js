import React, { useReducer, useState, useEffect, useRef } from "react";
import { navItems } from "../constants/siteContent";
import DrawerAppBar from "../components/DrawerAppBar";
import ResultsTable from "../components/ResultsTable";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useScrollTrigger,
  Slide,
  Toolbar,
  Paper,
} from "@mui/material";
import whiskyDbService from "../services/whiskyDbService";
import { headers } from "../constants/siteContent";
import SearchDrawer from "../components/SearchDrawer";

export async function getStaticProps() {
  const whiskies = await whiskyDbService.getWhisky_db();
  return { props: { whiskies } };
}

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
  const [mobileWidth, setMobileWidth] = useState();
  const [navHeight, setNavHeight] = useState();

  // helpers
  const navRef = useRef();
  const searchRef = useRef();
  const tableHeaderRef = useRef();
  useEffect(() => {
    setMobileWidth(window.innerWidth);
    if (navRef.current) {
      navRef.current.focus();
    }
    if (searchRef.current) {
      searchRef.current.focus();
    }
    if (tableHeaderRef.current) {
      tableHeaderRef.current.focus();
    }
    console.log(tableHeaderRef);
    setNavHeight(navRef.current.clientHeight);
    // setSearchHeight(searchRef.current.clientHeight);
  }, []);
  const scrollStyle = mobileWidth >= 480 ? "pagination" : "infinite";
  const { TableContainer, TableHeader, TablePages, recordsAfterPagingSorting } =
    ResultsTable(records, headers, filterFn, navHeight);

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
      <DrawerAppBar title={navItems[6].title} ref={navRef} />
      {/* <SearchInput
        handleChangeValue={handleSearch}
        searchValue={filterInput}
        ref={searchRef}
        // setSearchHeight={setSearchHeight}
        // handleExpand={handleExpand}
        // expanded={expanded}
        scrollStyle={scrollStyle}
      /> */}
      {/* <SearchInputScroll
        handleChangeValue={handleSearch}
        searchValue={filterInput}
        ref={searchRef}
        scrollStyle={scrollStyle}
      /> */}
      <SearchDrawer
        handleChangeValue={handleSearch}
        searchValue={filterInput}
        ref={searchRef}
        scrollStyle={scrollStyle}
        handleReset={handleReset}
      />
      <TableContainer maxWidth={"100vw"}>
        <TableHeader stick={navHeight} />
        <TableBody>
          {console.log(filterInput)}
          {console.log(filterFn.fn(records))}
          {recordsAfterPagingSorting(scrollStyle).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.whisky}</TableCell>
              {/* <TableCell>{item.type}</TableCell> */}
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
      <TablePages scrollStyle={scrollStyle} />
    </>
  );
}
