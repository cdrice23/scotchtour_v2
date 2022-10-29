import React from "react";
import ContainerBlock from "../components/ContainerBlock";
import FullPage from "../components/FullPage";
import defaultdata from "../constants/defaultdata";
import navItems from "../constants/navitems";
import DrawerAppBar from "../components/DrawerAppBar";

export default function ScotchDb(pageProps) {
  const title = "Scotch Whisky Search";
  return (
    <>
      <DrawerAppBar title={navItems[6].title} />
      <ContainerBlock>
        <FullPage defaultdata={defaultdata} />
      </ContainerBlock>
    </>
  );
}
