import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../config/logger";
import { geminiApiKeys } from "../secret";
import { handleError } from "../utils";
import { InstagramCommentSchema } from "./schema";
import fs from "fs";
import path from "path";
import * as readlineSync from "readline-sync";

export async function runAgent(schema: InstagramCommentSchema, prompt: string): Promise<any> {
    let currentApiKeyIndex = 0;  
    let geminiApiKey = geminiApiKeys[currentApiKeyIndex];

    if (!geminiApiKey) {
        logger.error("No Gemini API key available.");
        return "No API key available.";
    }
    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
    };

    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig,
    });

    try {
        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
            logger.info("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }

        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        return data;
    } catch (error) {
        await handleError(error, currentApiKeyIndex, schema, prompt, runAgent);
    }
}

export function chooseCharacter(isInteractive: boolean = false): any {
    const charactersDir = (() => {
        const buildPath = path.join(__dirname, "characters");
        if (fs.existsSync(buildPath)) {
            return buildPath;
        } else {
            // Fallback to source directory
            return path.join(process.cwd(), "src", "Agent", "characters");
        }
    })();
    const files = fs.readdirSync(charactersDir);
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    if (jsonFiles.length === 0) {
        throw new Error("No character JSON files found");
    }

    let selection = 1; // Default to first character

    if (isInteractive) {
        console.log("Select a character:");
        jsonFiles.forEach((file, index) => {
            console.log(`${index + 1}: ${file}`);
        });
        const answer = readlineSync.question("Enter the number of your choice: ");
        const parsedSelection = parseInt(answer);
        if (isNaN(parsedSelection) || parsedSelection < 1 || parsedSelection > jsonFiles.length) {
            throw new Error("Invalid selection");
        }
        selection = parsedSelection;
    } else {
        // Use default character (first one) for automated startup
        logger.info(`Auto-selecting character: ${jsonFiles[0]}`);
    }

    const chosenFile = path.join(charactersDir, jsonFiles[selection - 1]);
    const data = fs.readFileSync(chosenFile, "utf8");
    const characterConfig = JSON.parse(data);
    return characterConfig;
}

export function initAgent(isInteractive: boolean = false): any {
    try {
        const character = chooseCharacter(isInteractive);
        logger.info("Character selected:", character.name || "Unknown");
        return character;
    } catch (error) {
        logger.error("Error selecting character:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    (() => {
        initAgent(true); // Interactive mode when run directly
    })();
}
