import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

export async function generateAvatarFromSelfie(
  selfieBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'Gemini API key not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.'
    );
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseModalities: ['image', 'text'],
    } as any,
  });

  const prompt = `Generate a full-body stylized avatar illustration based on this person's face.
Requirements:
- Full body view from head to toe, standing straight, facing forward
- Clean, modern illustration style (NOT photorealistic)
- Neutral pose with arms slightly away from body
- Wearing a simple plain white t-shirt and plain gray pants
- Solid light gray background (#E0E0E0)
- The face should clearly resemble the person in the photo
- Body proportions should be realistic
- The avatar should be centered in the image
- Portrait orientation (roughly 3:5 aspect ratio)
- Leave clear separation between top clothing area and bottom clothing area
- No accessories, no patterns on clothes`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: selfieBase64,
          mimeType,
        },
      },
    ]);

    clearTimeout(timeout);

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if ((part as any).inlineData?.mimeType?.startsWith('image/')) {
        return (part as any).inlineData.data;
      }
    }

    throw new Error('No image was generated. Please try again.');
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Avatar generation timed out. Please try again.');
    }
    throw err;
  }
}
