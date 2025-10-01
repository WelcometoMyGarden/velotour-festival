import NotionClient from "./notion-reviews";
import { chunk } from "lodash-es";
import type { Review } from "../constants";

const sampleReviews: Review[] = [{
    Review: 'This is a sample review, your development environment is probably missing an Notion API key. That\'s OK, the deployment pipeline will fetch the actual reviews!',
    "Submitted At": {
        start: new Date(),
        end: null,
        time_zone: null
    },
    Language: 'English',
    "First name": "Sample",
    "Rating": 4
}]

export const reviews = import.meta.env.NOTION_ACCESS_TOKEN ? await (new NotionClient().getReviews()) : sampleReviews
export const lastPageNumber = reviews.length;
export const reviewPages = chunk(reviews, 6);

export const reviewAverage =
    Math.floor(
        (reviews.reduce((acc, r) => acc + r.Rating, 0) * 100) /
        reviews.length,
    ) / 100;

export function getReviewPageOf(params: Record<string, string | undefined>) {
    const pageInput = parseInt(params.page ?? "1");
    // Coalesce input to a valid number
    const page = pageInput < 1
        ? 1
        : pageInput > reviewPages.length
            ? reviewPages.length
            : pageInput;
    // We work with 1-indexed pages, to simplify the relationship with the UI.
    // This also seems to serialize Date objects into an ISO string: good!
    return reviewPages[page - 1]
}

export const reviewStaticPaths = reviewPages.map((_, i) => ({
    params: { page: (i + 1).toString() },
}));