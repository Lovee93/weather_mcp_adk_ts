import {LlmAgent, MCPToolset} from '@google/adk';
import {z} from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!googleMapsApiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not provided, please run "export GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_KEY" to add that.');
}

const getWeather = new MCPToolset({
  type: 'StdioConnectionParams',
  serverParams: {
    command: 'node',
    args: ["local/path/to/weather_mcp_adk_ts/weather_mcp_server/build/index.js"] // Add the correct local path to your MCP server build
  }
})

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

export const rootAgent = new LlmAgent({
  name: 'weather_agent',
  model: 'gemini-2.5-flash',
  description: 'Tells the current weather in a specified US city.',
  instruction: `You are a helpful assistant that tells the current weather in a city in US.
                Use the 'getWeather' tool for this purpose. 
                If you need the latitude and longitude of a place, use the 'getCoordinates' tool.`,
  tools: [getWeather, getCoordinates],
});