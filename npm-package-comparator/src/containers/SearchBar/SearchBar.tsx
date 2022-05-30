import { Button, Select } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { notification } from "antd";
//src
import { getSuggestions } from "../../service/Service";

interface SearchBarProps {
  comparePackages(packagesName: string[]): void;
}
const SearchBar = ({ comparePackages }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchSuggestions, setSearchSuggestions] = React.useState<any>([]);
  const [selectedPackages, setSelectedPackages] = React.useState<any>([]);

  React.useEffect(() => {
    getSearchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  const getSearchSuggestions = async () => {
    if (searchQuery) {
      const data = await getSuggestions(searchQuery);
      //adding old suggestions and new also
      setSearchSuggestions(searchSuggestions.concat(data));
    }
  };

  return (
    <div>
      <Select
        mode={"multiple"}
        maxTagCount={2}
        style={{ width: "80%" }}
        onSearch={(e) => {
          setSearchQuery(e);
        }}
        value={selectedPackages}
        notFoundContent={<div>Please type some package name to get suggestions</div>}
        showSearch
        optionFilterProp="children"
        onChange={(value: any, event: any) => {
          if (value.length > 2) {
            notification.open({
              message: "You Can Select only two packages for Comparison",
              description: null,
              placement: "bottomRight",
              icon: (
                <SmileOutlined
                  style={{
                    color: "#108ee9",
                  }}
                />
              ),
            });
            return;
          }

          setSelectedPackages(event);
        }}
        filterOption={(input: any, option: any) => {
          return (
            option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        {searchSuggestions?.map((item: any, index: number) => {
          return (
            <Select.Option key={index} value={item["package"]?.name}>
              {item["package"]?.name}
            </Select.Option>
          );
        })}
      </Select>
      <Button
        type="primary"
        onClick={() => {
          if (selectedPackages.length < 2) {
            notification.open({
              message: "You Have to select minimum 2 packages for comparison",
              description: null,
              placement: "bottomRight",
              icon: (
                <SmileOutlined
                  style={{
                    color: "#108ee9",
                  }}
                />
              ),
            });
            return;
          }
          comparePackages(
            selectedPackages?.map(
              (selectedPackage: any) => selectedPackage?.children
            )
          );
        }}
      >
        Compare{" "}
      </Button>
    </div>
  );
};

export default SearchBar;
