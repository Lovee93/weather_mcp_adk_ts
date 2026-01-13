This sample is a part of this article: [Chaining MCP Servers with Gemini ADK - The TypeScript Story](https://medium.com/@LoveeJain/chaining-mcp-servers-with-gemini-adk-the-typescript-story-425a380407fe) demonstrating how to chain multiple **MCP (Model Context Protocol)** servers using the **Google Agent Development Kit (ADK)**.

We have created a local weather forecast MCP server that needs latitude and longitude of a place for the forecast.
We get those coordinates using the Google Maps MCP server - thus showcasing how ADK (the MCP client) is enabling these calls and chaining them together.

First build local mcp server by following:

- `cd weather_mcp_server`
- `npm i`
- `npm run build`

Next call it from ADK:

- `cd weather_adk_ts`
- `npm i`
- Update the local path to the `build/index.js` from the mcp server directory
- Add .env file and add `GEMINI_API_KEY` and `GOOGLE_MAPS_API_KEY`
- Run `npx @google/adk-devtools web`

For more information or to follow from scratch checkout the above article!
