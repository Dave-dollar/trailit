/**
 * channels.ts — Narrow water channels / drainage ditches.
 * These are the small water features visible near the road and car park.
 */

export interface ChannelDef {
  id: string;
  points: [number, number][];
  width: number;
}

const CHANNELS: ChannelDef[] = [
  // Ditch from SE corner of Main Lake running east toward Fennes Rd
  { id: "main-lake-outlet", points: [[-5, -3], [-2, -3], [0, -2]], width: 0.9 },
  // South ditch beneath access track
  { id: "south-ditch",      points: [[-4, 3], [0, 3], [3, 3]],     width: 0.7 },
];

export default CHANNELS;
