import {LlmAgent, MCPToolset} from '@google/adk';
import {z} from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const getWeather = new MCPToolset({
  type: 'StdioConnectionParams',
  serverParams: {
    command: 'node',
    args: ["local/path/to/weather_mcp_adk_ts/weather_mcp_server/build/index.js"] // Add the correct local path to your MCP server build
  }
})

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!googleMapsApiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not provided, please run "export GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_KEY" to add that.');
}

const getCoordinates = new MCPToolset({
  type: 'StdioConnectionParams',
  serverParams: {
    command: 'npx',
    args: [
      "-y",
      "@modelcontextprotocol/server-google-maps",
    ],
    env: {
     "GOOGLE_MAPS_API_KEY": googleMapsApiKey 
    }
  }
}, ["maps_geocode"])

const TopicArn = "arn:aws:sns:ap-southeast-2:123456789:weather" // Add the correct topic ARN
const AwsRegion = "ap-southeast-2" // Add the correct AWS region
const AwsProfile = "personal" // Add the correct AWS profile

const snsPublish = new MCPToolset({
  type: 'StdioConnectionParams',
  serverParams: {
    command: 'uvx',
    args: [
      "awslabs.amazon-sns-sqs-mcp-server@latest",
    ],
    env: {
     "AWS_PROFILE": AwsProfile
    }
  },
  // timeout: 10000,
}, ["sns_publish"])

export const rootAgent = new LlmAgent({
  name: 'weather_agent',
  model: 'gemini-2.5-flash',
  description: 'A helpful assistant for finding the coordinates, telling weather in a US city/place and publishing the weather summary to SNS topic.',
  instruction: `You can use 'get_coordinates' tool to get the coordinates of a US location.
                Once you have the coordinates, you can pass it to 'get_weather' tool to get the weather of that US location. 
                Once prompted, you can use 'publish_sns' tool to send the weather summary as message or if the user can do any outdoor activities based on the weather to SNS topic.
                Use ${TopicArn} as topic ARN and ${AwsRegion} as region. Do not ask the user for it.`,
  tools: [getWeather, getCoordinates, snsPublish],
});