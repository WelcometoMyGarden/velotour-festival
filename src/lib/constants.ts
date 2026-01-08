import { DateTime } from "luxon";

// TODO: actually calculate
export const AVG_SCORE = "4.6";

// 18:00 in UTC
// 19:00 in Europe/Brussels
export const SCREENING_DATE_REAL = new Date("2023-11-26T18:00:00.000Z");

// Safety interval: 1 hour before when we actually launch the film
export const SCREENING_DATE_SAFE = new Date("2023-11-26T17:00:00.000Z");

// Test for the safety interval
// export const SCREENING_DATE_TEST = new Date("2023-11-26T11:15:00+02:00");
export const SCREENING_DATE_TEST = DateTime.now()
  .plus({ seconds: 4 })
  .toJSDate();

type ParsedNotionDate = { start: Date | null; end: Date | null; time_zone: string | null }

export type NotionReview = {
  "Submitted At": ParsedNotionDate,
  "Rating": number,
  "Respondent ID": string,
  "Review": string,
  "Email": string,
  "Form ID": string,
  "Submission ID": string,
  "First name": string,
  // Automatically filled by Notion, manually re-assignable.
  "Language": string,
  // Formula derived from Form ID
  "Form Language": string
}


export type Review = Omit<
  NotionReview,
  "Respondent ID" | "Form ID" | "Submission ID" | "Email" | "Form Language"
>;

