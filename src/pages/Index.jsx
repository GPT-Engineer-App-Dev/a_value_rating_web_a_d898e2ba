import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, Text, VStack, useToast } from "@chakra-ui/react";
import { FaArrowRight, FaCheck, FaListUl, FaSearch } from "react-icons/fa";

// Mock-up values list
const allValues = ["Integrity", "Compassion", "Courage", "Respect", "Commitment", "Honesty", "Loyalty", "Responsibility", "Friendship", "Generosity", "Perseverance", "Optimism", "Reliability", "Discipline", "Creativity", "Kindness", "Freedom", "Equality", "Justice", "Wisdom"];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [comparisonResults, setComparisonResults] = useState({});
  const [rankings, setRankings] = useState([]);
  const toast = useToast();

  // Filter values based on search input
  const filteredValues = allValues.filter((value) => value.toLowerCase().includes(searchValue.toLowerCase()));

  // Add or remove value from selection
  const toggleValueSelection = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      if (selectedValues.length < 10) {
        setSelectedValues([...selectedValues, value]);
      } else {
        toast({
          title: "Maximum values selected",
          description: "You can only select 10 values.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Proceed to comparison interface
  const goToComparisons = () => {
    if (selectedValues.length === 10) {
      setCurrentStep(3);
      // Initialize comparison results
      let initialResults = {};
      selectedValues.forEach((value) => {
        initialResults[value] = { wins: 0, losses: 0 };
      });
      setComparisonResults(initialResults);
    } else {
      toast({
        title: "Not enough values selected",
        description: "Please select 10 values to proceed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Record the result of a comparison
  const recordComparisonResult = (winner, loser) => {
    setComparisonResults({
      ...comparisonResults,
      [winner]: {
        ...comparisonResults[winner],
        wins: comparisonResults[winner].wins + 1,
      },
      [loser]: {
        ...comparisonResults[loser],
        losses: comparisonResults[loser].losses + 1,
      },
    });
  };

  // Finalize the rankings
  const finalizeRankings = () => {
    const sortedValues = selectedValues.sort((a, b) => comparisonResults[b].wins - comparisonResults[a].wins);
    setRankings(sortedValues);
    setCurrentStep(4);
  };

  // Home Page Component
  const HomePage = () => (
    <VStack spacing={8}>
      <Heading>Welcome to the Value Rating App</Heading>
      <Text textAlign="center">Discover what values are most important to you by rating them.</Text>
      <Button rightIcon={<FaArrowRight />} colorScheme="blue" onClick={() => setCurrentStep(2)}>
        Start Rating
      </Button>
    </VStack>
  );

  // Value Selection Page Component
  const ValueSelectionPage = () => (
    <VStack spacing={4}>
      <Heading>Select Your Top 10 Values</Heading>
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<FaSearch />} />
        <Input placeholder="Search values" onChange={(e) => setSearchValue(e.target.value)} />
      </InputGroup>
      <List spacing={2} style={{ width: "100%" }}>
        {filteredValues.map((value) => (
          <ListItem key={value} p={2} bg={selectedValues.includes(value) ? "green.100" : "gray.100"} onClick={() => toggleValueSelection(value)}>
            {value} {selectedValues.includes(value) && <FaCheck color="green" />}
          </ListItem>
        ))}
      </List>
      <Button colorScheme="green" isDisabled={selectedValues.length !== 10} onClick={goToComparisons}>
        Compare Values
      </Button>
    </VStack>
  );

  // Comparison Interface Component
  const ComparisonInterface = () => (
    <VStack spacing={8}>
      <Heading>Compare Your Values</Heading>
      {/* Logic for 1:1 matchup interface is omitted for brevity */}
      <Button colorScheme="orange" onClick={finalizeRankings}>
        Finalize Rankings
      </Button>
    </VStack>
  );

  // Ranking Display Component
  const RankingDisplay = () => (
    <VStack spacing={4}>
      <Heading>Your Value Rankings</Heading>
      <List spacing={2} style={{ width: "100%" }}>
        {rankings.map((value, index) => (
          <ListItem key={value} p={2} bg="blue.100">
            {index + 1}. {value}
          </ListItem>
        ))}
      </List>
      <Button colorScheme="teal" onClick={() => setCurrentStep(1)}>
        Start Over
      </Button>
    </VStack>
  );

  return (
    <Container centerContent py={12}>
      <Box width="100%" maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
        <Stack spacing={8}>
          {currentStep === 1 && <HomePage />}
          {currentStep === 2 && <ValueSelectionPage />}
          {currentStep === 3 && <ComparisonInterface />}
          {currentStep === 4 && <RankingDisplay />}
        </Stack>
      </Box>
    </Container>
  );
};

export default Index;
