import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const generateSegmentRules = async (naturalLanguage) => {
  const prompt = `Convert this natural language segment description into structured rules in JSON format:
  
  Description: "${naturalLanguage}"
  
  Return only the JSON array with rules in this format:
  [{
    "condition": "AND"|"OR",
    "rules": [{
      "field": string,
      "operator": string,
      "value": string|number
    }]
  }]
  
  Fields available: name, email, totalSpent, totalOrders, lastPurchaseDate
  Operators: equals, notEquals, greaterThan, lessThan, contains, notContains, inLast, notInLast`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    console.error("Error generating segment rules:", err);
    throw err;
  }
};

const generateMessageVariants = async (campaignObjective) => {
  const prompt = `Generate 3 message variants for this campaign objective: "${campaignObjective}"
  
  Return a JSON array of strings:
  ["message 1", "message 2", "message 3"]`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    console.error("Error generating message variants:", err);
    throw err;
  }
};

const generateCampaignInsights = async (campaignStats) => {
  const prompt = `Generate human-readable insights from these campaign stats:
  
  ${JSON.stringify(campaignStats, null, 2)}
  
  Return a concise paragraph summarizing the performance.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Error generating campaign insights:", err);
    throw err;
  }
};

export {
  generateSegmentRules,
  generateMessageVariants,
  generateCampaignInsights,
};
