import { GoogleGenAI, Modality } from "@google/genai";
import type { BaseImage, ClothingItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const runVirtualTryOn = async (
  userImage: BaseImage,
  clothingItems: ClothingItem[],
  isHeadshot: boolean,
): Promise<string> => {
  let processedUserImage = userImage;

  // Step 1: If it's a headshot, generate a full body first.
  if (isHeadshot) {
    console.log("Generating full body from headshot...");
    const bodyGenPrompt = 'From this headshot, realistically generate a full-body image of the person. They should be standing in a simple, neutral pose against a plain, light-colored background. The generated body should be stylistically consistent with the headshot and photo-realistic.';
    
    const bodyGenResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          fileToGenerativePart(userImage.base64, userImage.mimeType),
          { text: bodyGenPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const generatedImagePart = bodyGenResponse.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (!generatedImagePart?.inlineData?.data || !generatedImagePart?.inlineData?.mimeType) {
      throw new Error("Could not generate a full body from the headshot. The AI response was incomplete.");
    }

    processedUserImage = {
      base64: generatedImagePart.inlineData.data,
      mimeType: generatedImagePart.inlineData.mimeType,
    };
  }

  // Step 2: Create a base image of the person in athletic wear from the full-body photo.
  console.log("Creating base model image...");
  const createBaseModelPrompt = "Recreate the person in this image, but dress them in simple, form-fitting, neutral-colored athletic wear (like a tank top and shorts). The goal is to create a clean base model for a virtual try-on. It is critical to preserve the person's exact face, body shape, identity, pose, and the original background. The output must be a photo-realistic image.";
  
  const baseModelResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        fileToGenerativePart(processedUserImage.base64, processedUserImage.mimeType),
        { text: createBaseModelPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const baseImagePart = baseModelResponse.candidates?.[0]?.content?.parts.find(part => part.inlineData);
  if (!baseImagePart?.inlineData?.data || !baseImagePart?.inlineData?.mimeType) {
    throw new Error("The AI failed to create a base model from your photo. This can happen due to AI safety policies or if the subject isn't clearly visible. Please try a different photo with clearer lighting and a simpler background.");
  }
  
  const baseImageForEditing = {
    base64: baseImagePart.inlineData.data,
    mimeType: baseImagePart.inlineData.mimeType,
  };

  // If no clothing items are provided, the process is done. Return the base model image.
  if (clothingItems.length === 0) {
    console.log("No clothing items provided. Returning base model image.");
    return `data:${baseImageForEditing.mimeType};base64,${baseImageForEditing.base64}`;
  }


  // Step 3: Assemble the prompt for the virtual try-on with all clothing items.
  const promptParts = [];
  const clothingDescriptions = clothingItems.map(item => `- A '${item.description}'`).join('\n');
  const promptText = `**Virtual Try-On Task:**
You are an expert AI fashion stylist. The user has provided an image of a person and ${clothingItems.length} separate images of clothing items.
Your goal is to generate a single, photo-realistic image where the person is wearing ALL of the provided clothing items combined into a cohesive outfit.

**Instructions:**
1. The first image provided after this text is the main image of the person.
2. The subsequent images are the clothing items. The items are described as:
${clothingDescriptions}
3. Digitally dress the person in ALL these items. The result must look like a natural photograph.
4. **Crucially, preserve the person's original face, body shape, identity, pose, and the background from the main image.**
5. Combine the clothes logically (e.g., a jacket over a shirt).
6. The final output must be only the resulting image. Do not add any text or borders.`;
  
  promptParts.push({ text: promptText });
  // The order is important. The prompt now refers to this order.
  promptParts.push(fileToGenerativePart(baseImageForEditing.base64, baseImageForEditing.mimeType));
  
  for (const item of clothingItems) {
    promptParts.push(fileToGenerativePart(item.base64, item.mimeType));
  }

  console.log("Running virtual try-on...");
  const tryOnResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts: promptParts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const finalImagePart = tryOnResponse.candidates?.[0]?.content?.parts.find(part => part.inlineData);
  if (!finalImagePart?.inlineData?.data || !finalImagePart?.inlineData?.mimeType) {
    throw new Error("The AI could not generate the final image. Please try different images or descriptions.");
  }

  return `data:${finalImagePart.inlineData.mimeType};base64,${finalImagePart.inlineData.data}`;
};

export const generatePlaceholderImage = async (): Promise<string> => {
    console.log("Generating placeholder image...");
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: 'A minimalist and elegant fashion illustration of a person standing, like a mannequin. Use simple lines and a neutral color palette (grays, beige). The background should be a solid, light, off-white color. The style should be modern and abstract.',
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '3:4',
        },
    });

    const base64ImageBytes: string | undefined = response.generatedImages?.[0]?.image.imageBytes;

    if (!base64ImageBytes) {
        throw new Error("Could not generate a placeholder image.");
    }

    return `data:image/png;base64,${base64ImageBytes}`;
};