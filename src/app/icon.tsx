import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 248,
  height: 248,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div tw="flex h-full w-full items-center justify-center rounded-full bg-transparent p-2 text-[256px] text-cyan-500">
        T
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    },
  );
}
