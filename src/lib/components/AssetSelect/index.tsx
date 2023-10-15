/* eslint-disable react-hooks/exhaustive-deps */
/*
    Asset Select
      -Highlander
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  HStack,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
} from "@chakra-ui/react";
import { usePioneer } from "@pioneer-sdk/pioneer-react";
import { useEffect, useState } from "react";

export default function AssetSelect({ onClose }: any) {
  const { state } = usePioneer();
  const { api, app, user } = state;
  const [currentPage, setCurrentPage] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showOwnedAssets, setShowOwnedAssets] = useState(false);
  const [totalAssets, setTotalAssets] = useState(0);
  const itemsPerPage = 6;

  const handleSelectClick = async (asset: any) => {
    try {
      app.setAssetContext(asset);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  // const onSearch = async function (searchQuery: string) {
  //   try {
  //     if (!api) {
  //       alert("Failed to init API!");
  //       return;
  //     }
  //     // console.log("searchQuery: ", searchQuery);
  //     const search = {
  //       limit: itemsPerPage,
  //       skip: currentPageIndex * itemsPerPage, // Use currentPageIndex for pagination
  //       collection: "assets",
  //       searchQuery,
  //       searchFields: ["name", "symbol"],
  //     };
  //
  //     const info = await api.SearchAtlas(search);
  //     const currentPageData = info.data.results;
  //     setCurrentPage(currentPageData);
  //     setTotalAssets(info.data.total); // Update total assets count
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const fetchPage = async (pageIndex: number) => {
    try {
      const search = {
        limit: itemsPerPage,
        skip: pageIndex * itemsPerPage,
        collection: "assets",
        ownedBy: showOwnedAssets ? user.id : undefined,
      };

      const info = await api.SearchAtlas(search);
      const currentPageData = info.data.results;
      setCurrentPage(currentPageData);
      setTotalAssets(info.data.total); // Update total assets count
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPage(currentPageIndex);
  }, [currentPageIndex, showOwnedAssets]);

  return (
    <Stack spacing={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Bitcoin..."
          type="text"
          onChange={() => {
            setTimeout(() => {
              setCurrentPageIndex(0); // Reset pageIndex when searching
              // onSearch(e.target.value || "");
            }, 1000);
          }}
        />
      </InputGroup>
      <Box>
        <Text fontSize="2xl">Total Assets: {totalAssets}</Text>
        <Checkbox
          isChecked={showOwnedAssets}
          onChange={() => setShowOwnedAssets(!showOwnedAssets)}
        >
          Show only owned assets
        </Checkbox>
        {currentPage.map((asset: any) => (
          <Box key={asset.name}>
            <HStack spacing={4} alignItems="center">
              <Avatar src={asset?.image} />
              <Box>
                <small>asset: asset?.caip</small>
                <br />
                <small>name: {asset.name}</small>
              </Box>
            </HStack>
            <HStack mt={2} spacing={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSelectClick(asset)}
              >
                Select
              </Button>
            </HStack>
          </Box>
        ))}
      </Box>
      <HStack mt={4}>
        <Button
          isDisabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
        >
          Previous Page
        </Button>
        <Button
          isDisabled={currentPage.length < itemsPerPage}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
        >
          Next Page
        </Button>
      </HStack>
    </Stack>
  );
}