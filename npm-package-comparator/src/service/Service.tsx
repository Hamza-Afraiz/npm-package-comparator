//src
import { request } from "../utils/axios-utils";
import axios from "axios";

export const getSuggestions = async (searchQuery: string) => {
  const { data } = await request({
    url: `/search/suggestions?q=${searchQuery}`,
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
export const getPackageInfo = async (packageName: string) => {
  packageName = packageName.split("/")[0];
  packageName = packageName.replace(/[/@]/g, "");

  const { data } = await request({
    url: `/package/${packageName}`,
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const getPackageLanguageInfo = async (githubUrl: string) => {
  if (!githubUrl) {
    return [];
  }
  const repoName = githubUrl.split("com")[1];

  const res = await axios.get(
    `https://api.github.com/repos${repoName}/languages`
  );

  return Object.keys(res.data);
};
