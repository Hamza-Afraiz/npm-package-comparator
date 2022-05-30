import React from "react";
//src
import SearchBar from "../../containers/SearchBar/SearchBar";
import ComparisonTable from "../../containers/ComparisonTable/ComparisonTable";

const HomePage = () => {
  const [packagesName, setPackagesName] = React.useState<string[]>([]);

  const comparePackages = (packagesName: string[]) => {
    setPackagesName(packagesName);
  };
  return (
    <div>
      <h1>Compare NPM Packages</h1>

      <SearchBar comparePackages={comparePackages} />
      <ComparisonTable packagesName={packagesName} />
    </div>
  );
};

export default HomePage;
