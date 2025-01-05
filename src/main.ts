import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { RequestBody } from "./interfaces/shared";

dotenv.config();

const url: string = process.env.API_URL!;
const authToken: string = process.env.AUTH_TOKEN!;

const bodiesFolder: string = path.join(__dirname, "bodies");
const bodyType: string | undefined = process.argv[2]?.split("=")[1];

const bodyFilePath: string = path.join(bodiesFolder, `${bodyType}.json`);

if (!bodyType || !fs.existsSync(bodyFilePath)) {
  console.error(
    `Invalid body type or file not found. Available options: body1, body2, body3.`
  );
  process.exit(1);
}

const bodyData: RequestBody = JSON.parse(
  fs.readFileSync(bodyFilePath, "utf-8")
);

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  },
};

async function main() {
  try {
    const response = await axios.post(url, bodyData, config);
    console.log(`Data for ${bodyType} generated successfully:`, response.data);
  } catch (error: any) {
    console.error(
      "Error generating data:",
      error.response ? error.response.data : error.message
    );
  }
}

main();
