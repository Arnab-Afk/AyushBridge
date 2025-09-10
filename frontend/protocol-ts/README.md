# AyushBridge Documentation Site

Documentation site for the AyushBridge FHIR R4-compliant terminology microservice for NAMASTE & ICD-11 TM2 integration, built using Next.js and Tailwind CSS.

## Getting Started

To get started with this site, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## AI Chatbot Integration

This documentation site includes an integrated AI chatbot that can answer questions about AyushBridge. The chatbot uses RAG (Retrieval Augmented Generation) technology with a FAISS vector database to provide accurate answers from the documentation.

### Setting Up the Chatbot

1. **Install Python Dependencies**
   ```bash
   npm run setup:chatbot
   ```
   This will install all required Python packages and set up the vector database.

2. **Configure OpenRouter API Key**
   - Create a copy of the example environment file:
     ```bash
     cp AyushBridge_Chatbot/.env_chatbot.example AyushBridge_Chatbot/.env_chatbot
     ```
   - Edit the `.env_chatbot` file and add your OpenRouter API key

3. **Run with Chatbot Enabled**
   ```bash
   npm run dev:chatbot
   ```
   This script starts both the Next.js server and the Python chatbot server.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## Global search

This template includes a global search that's powered by the [FlexSearch](https://github.com/nextapps-de/flexsearch) library. It's available by clicking the search input or by using the `⌘K` shortcut.

This feature requires no configuration, and works out of the box by automatically scanning your documentation pages to build its index. You can adjust the search parameters by editing the `/src/mdx/search.mjs` file.

## License

This site template is a commercial product and is licensed under the [Tailwind UI license](https://tailwindui.com/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [Framer Motion](https://www.framer.com/docs/) - the official Framer Motion documentation
- [MDX](https://mdxjs.com/) - the official MDX documentation
- [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/) - the official Algolia Autocomplete documentation
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - the official FlexSearch documentation
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - the official Zustand documentation
