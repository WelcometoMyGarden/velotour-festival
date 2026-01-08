import { Client, collectPaginatedAPI } from "@notionhq/client";
import { flattenNotionPropValue } from "./notion";
import { mapValues, omit } from "lodash-es";
import {
  type Review,
} from "../constants";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const REVIEWS_DATA_SOURCE_ID = "27e4f49e-318e-802e-b65b-000bfeb38011";

const notionPageToFlatProps = (v: any) =>
  mapValues(v, flattenNotionPropValue) as unknown as Review;

export default class NotionClient {
  client: Client;

  constructor() {
    this.client = new Client({ auth: import.meta.env.NOTION_ACCESS_TOKEN });
  }

  getReviews = async (): Promise<Review[]> =>
    (
      await collectPaginatedAPI(this.client.dataSources.query, {
        data_source_id: REVIEWS_DATA_SOURCE_ID,
        filter: {
          property: "Review",
          rich_text: {
            is_not_empty: true,
          },
        },
        sorts: [
          {
            property: "Submitted At",
            direction: "descending",
          },
        ],
      })
    )
      .map((p) => (p as PageObjectResponse).properties)
      .map(notionPageToFlatProps)
      // Clear out private properties
      .map(((v: any) =>
        omit(v, [
          "Email",
          "Form ID",
          "Respondent ID",
          "Submission ID",
          "Form Language"
        ])) as () => Review);

}