import { Configuration, OpenAIApi } from "openai";

import Config from "../config/index.js";

const configuration = new Configuration({
  apiKey: Config.openai.token,
});
const openai = new OpenAIApi(configuration);

export default openai;
