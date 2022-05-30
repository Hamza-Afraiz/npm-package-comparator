/* eslint-disable react/jsx-no-target-blank */
import { Line } from "@ant-design/plots";
import { Divider, Empty, Spin, Tag } from "antd";
import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
//src
import { getPackageInfo, getPackageLanguageInfo } from "../../service/Service";
//style
import "./ComparisonTable.css";
import { comparePackage } from "./comparisonTable.parser";

interface ComparisonTableProps {
  packagesName: string[];
}

const ComparisonTable = ({ packagesName }: ComparisonTableProps) => {
  const [comparisonTable, setComparisonTable] = React.useState<any>([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [recommendedPackage, setRecommendedPackage] = React.useState<any>("");
  const [isIncorrectPackageName, setIsIncorrectPackageName] =
    React.useState(false);

  React.useEffect(() => {
    getPackagesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesName]);
  const config = {
    data: lineChartData,
    xField: "from",
    yField: "count",
    seriesField: "name",
    xAxis: {
      type: "time",
    },
    yAxis: {
      label: {
        formatter: (v: any) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },

    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };

  //resetting package details
  const resettingPackageData = () => {
    setComparisonTable([]);
    setLineChartData([]);
    setRecommendedPackage([]);
  };

  //here we are getting package data from backend and then shaping it into object form for better access
  const getPackagesData = async () => {
    setIsIncorrectPackageName(false);
    resettingPackageData();
    const packageComparisonArray = [];
    //just incase if we entered only one package for comparison
    if (packagesName.length < 1) {
      return;
    }
    //parsing backend package data
    for (let i = 0; i < packagesName.length; i++) {
      const packageData = await getPackageInfo(packagesName[i]);
      //for example..if we enter wrong package name and didnt get any data

      if (packageData === undefined) {
        setIsIncorrectPackageName(true);
        resettingPackageData();
        notification.open({
          message: `Data not found for ${packagesName[i]}`,
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
      const packageComparisonObject = {
        packageName: packageData["collected"]["metadata"]["name"],
        keywords:
          packageData["collected"]["metadata"]["keywords"]
            ?.slice(0, 4)
            .toString() || "",
        description: packageData["collected"]["metadata"]["description"],
        version: packageData["collected"]["metadata"]["version"],
        date: packageData["collected"]["metadata"]["date"],
        links: packageData["collected"]["metadata"]["links"],
        license: packageData["collected"]["metadata"]["license"],
        modifiedDate: Math.ceil(
          (new Date().getTime() -
            new Date(packageData["analyzedAt"]).getTime()) /
            (1000 * 60 * 60 * 24) /
            30
        ),
        downloads: packageData["collected"]["npm"]["downloads"],
        stars: packageData["collected"]["github"]
          ? packageData["collected"]["github"]["starsCount"]
          : 0,
        quality: packageData["evaluation"]["quality"],
        popularity: packageData["evaluation"]["popularity"],
        maintainance: packageData["evaluation"]["maintenance"],
        languages: await getPackageLanguageInfo(
          packageData["collected"]["metadata"]["links"]["repository"]
        ),
        author:
          packageData["collected"]["metadata"]["author"] ||
          packageData["collected"]["metadata"]["publisher"],
        maintainers: packageData["collected"]["metadata"]["maintainers"].slice(
          0,
          1
        ),
      };

      packageComparisonArray.push(packageComparisonObject);
    }

    //adding name property to downloads object for line chart
    packageComparisonArray?.forEach((packageData) => {
      packageData?.downloads.forEach((downloads: any) => {
        downloads.count = packageData?.downloads[5].count - downloads.count;
        downloads.name = packageData.packageName;
      });
    });
    if (packageComparisonArray !== undefined)
      setComparisonTable(packageComparisonArray);

    setRecommendedPackage(comparePackage(packageComparisonArray));

    // combining array for line chart
    const chartData = packageComparisonArray[0]?.downloads.concat(
      packageComparisonArray[1]?.downloads
    );
    setLineChartData(chartData);
  };

  //if there is incorrect package name show blank slate
  if (isIncorrectPackageName) {
    return <Empty style={{ marginTop: "10%" }} />;
  }
  return (
    <div className="comparison">
      {packagesName?.length > 1 && comparisonTable?.length < 1 && (
        <Spin size="large" style={{ marginTop: "10%" }} />
      )}

      {comparisonTable.length > 1 && (
        <>
          <div className="comparison-tables">
            <div className="comparison-table-heading-names">
              <div>Package Name</div>
              <div>Description</div>
              <div>Keywords</div>
              <div>Repository</div>
              <div>License</div>
              {/* <div>Creation Date</div> */}
              <div>Last Modification Date</div>
              <div>Authors/Publishers</div>
              <div>Maintainers</div>
            </div>
            {comparisonTable?.map((packageData: any,index:number) => (
              <div key={index} className="comparison-table">
                <div className="comparison-table-heading">
                  {packageData?.packageName}
                  <p>{packageData?.version}</p>
                </div>
                <div>{packageData?.description}</div>
                <div>{packageData?.keywords || "N/A"}</div>
                <div className="package-links">
                  <p>
                    <a
                      href={packageData?.links["homepage"] || "N/A"}
                      target="_blank"
                    >
                      HomePage
                    </a>
                  </p>
                  <p>
                    <a
                      href={packageData?.links["bugs"] || "N/A"}
                      target="_blank"
                    >
                      Bugs
                    </a>
                  </p>
                  <p>
                    <a
                      href={packageData?.links["repository"] || "N/A"}
                      target="_blank"
                    >
                      GitHub
                    </a>
                  </p>
                </div>
                <div>{packageData?.license}</div>
                {/* <div>
              Created
              {" " +
                Math.ceil(
                  (new Date().getTime() -
                    new Date(packageData?.date).getTime()) /
                    (1000 * 60 * 60 * 24) /
                    1
                ) +
                " "}{" "}
              years ago
            </div> */}
                <div>
                  Modified
                  {" " + packageData?.modifiedDate + " "}
                  {packageData?.modifiedDate > 1 ? " months " : "month "}
                  ago
                </div>
                <div>
                  <p>
                    <a
                      href={
                        packageData?.author["url"] ||
                        packageData?.links["homepage"]
                      }
                      target="_blank"
                    >
                      {packageData?.author["name"] ||
                        packageData?.author["userame"] ||
                        "N/A"}
                    </a>
                  </p>
                </div>
                <div>
                  {packageData?.maintainers?.map(
                    (maintainer: any, index: number) => (
                      <p key={index}> {maintainer.email}</p>
                    )
                  ) || "N/A"}
                </div>
              </div>
            ))}
          </div>

          {lineChartData.length > 1 && (
            <div className="line-chart">
              <h1>Downloads </h1>
              <Line {...config} />
            </div>
          )}
          {recommendedPackage && (
            <h1>
              {comparisonTable[recommendedPackage[0] - 1]?.packageName} is{" "}
              {recommendedPackage[1]} times better.
            </h1>
          )}
          {recommendedPackage && (
            <div className="recommendation">
              <div className="recommendation-details">
                <h2>
                  <b>Recommended</b> :{" "}
                  {comparisonTable[recommendedPackage[0] - 1]?.packageName}
                </h2>{" "}
                <p>{comparisonTable[recommendedPackage[0] - 1]?.description}</p>
                <p>
                  Visit this link for more information{" "}
                  <a
                    href={
                      comparisonTable[recommendedPackage[0] - 1]?.links[
                        "homepage"
                      ] || "N/A"
                    }
                    target="_blank"
                  >
                    HomePage
                  </a>
                </p>
              </div>
              <div className="recommendation-technical-details">
                <div className="downloads-box">
                  <p>Downloads</p>
                  <h2>
                    {Math.round(
                      comparisonTable[recommendedPackage[0] - 1]["popularity"][
                        "downloadsCount"
                      ]
                    )}
                    +
                  </h2>
                </div>
                <div className="downloads-box">
                  <p>Stars</p>
                  <h2>
                    {Math.round(
                      comparisonTable[recommendedPackage[0] - 1]?.stars
                    ) || "N/A"}
                    +
                  </h2>
                </div>
                <div className="downloads-box">
                  <p>Health</p>
                  <h2>
                    {Math.round(
                      comparisonTable[recommendedPackage[0] - 1]["quality"][
                        "health"
                      ] * 100
                    )}
                    %
                  </h2>
                </div>
              </div>
              <Divider orientation="left" style={{ color: "#1890ff" }}>
                Languages
              </Divider>
              <div className="languages">
                {comparisonTable[recommendedPackage[0] - 1]?.languages?.map(
                  (language: string, index: number) => (
                    <Tag key={index} className="Tag">
                      {language}
                    </Tag>
                  )
                )}
              </div>
              <Divider style={{ color: "#1890ff" }}></Divider>
            </div>
          )}
          <Divider />
        </>
      )}
    </div>
  );
};

export default ComparisonTable;
