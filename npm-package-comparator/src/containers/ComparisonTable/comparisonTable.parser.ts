export const comparePackage = (packages: any) => {
  if (packages.length < 1) {
    return;
  }
  let package1Score = 0;
  let package2Score = 0;
  //we are going to divide percentage of score for finding score
  //popularity:20% downloads:30% quality(carefulness and test):20% and maintainance:10%
  //we are getting popularity score with 20 % of total score.
  const highestPopularityIndex =
    packages[0].popularity["communityInterest"] >
    packages[1].popularity["communityInterest"]
      ? 0
      : 1;
  const highestPopularity =
    packages[highestPopularityIndex].popularity["communityInterest"];
  package1Score =
    highestPopularityIndex === 0
      ? 20
      : getPopularityPercentage(
          highestPopularity,
          packages[0].popularity["communityInterest"]
        );
  package2Score =
    highestPopularityIndex === 1
      ? 20
      : getPopularityPercentage(
          highestPopularity,
          packages[1].popularity["communityInterest"]
        );

  //we are moving forward now to get downloads score which is 30 percent of total score

  const highestDownloadsIndex =
    packages[0].popularity["downloadsCount"] >
    packages[1].popularity["downloadsCount"]
      ? 0
      : 1;
  const highestDownloads =
    packages[highestDownloadsIndex].popularity["downloadsCount"];
  package1Score +=
    highestDownloadsIndex === 0
      ? 50
      : getDownloadsPercentage(
          highestDownloads,
          packages[0].popularity["downloadsCount"]
        );
  package2Score +=
    highestDownloadsIndex === 1
      ? 50
      : getDownloadsPercentage(
          highestDownloads,
          packages[1].popularity["downloadsCount"]
        );

  //now we are moving forward to quality section

  const highestQualityIndex =
    packages[0].quality["carefulness"] + packages[0].quality["tests"] >
    packages[1].quality["carefulness"] + packages[1].quality["tests"]
      ? 0
      : 1;
  const highestQuality =
    packages[highestQualityIndex].quality["carefulness"] +
    packages[highestQualityIndex].quality["tests"];
  package1Score +=
    highestQualityIndex === 0
      ? 30
      : getQualityPercentage(
          highestQuality,
          packages[0].quality["carefulness"] + packages[0].quality["tests"]
        );
  package2Score +=
    highestQualityIndex === 1
      ? 30
      : getQualityPercentage(
          highestQuality,
          packages[1].quality["carefulness"] + packages[1].quality["tests"]
        );

  const winner = package1Score > package2Score ? 1 : 2;
  const winningPercentage = (
    winner === 1 ? package1Score / package2Score : package2Score / package1Score
  ).toFixed(2);
  return [winner, winningPercentage];
};
const getPopularityPercentage = (highest: number, lowest: number) => {
  const lowestPercentage = (lowest / highest) * 100;
  return Math.ceil((20 / 100) * lowestPercentage);
};
const getDownloadsPercentage = (highest: number, lowest: number) => {
  const lowestPercentage = (lowest / highest) * 100;
  return Math.ceil((50 / 100) * lowestPercentage);
};
const getQualityPercentage = (highest: number, lowest: number) => {
  const lowestPercentage = (lowest / highest) * 100;
  return Math.ceil((30 / 100) * lowestPercentage);
};
