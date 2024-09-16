import { Box } from "@chakra-ui/react";
import Head from "next/head";

const HomePage = () => {
  // const [searchText, setSearchText] = useState<string>("");
  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="white" h="100vh">
      <Head>
        <title>Home Page</title>
      </Head>
    </Box>
  );
};

export default HomePage;
