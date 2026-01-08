<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import Review from "./Review.svelte";
  import type { Review as ReviewType } from "../lib/constants";
  import { getLangFromUrl } from "../lib/i18n/utils";
  import { tick } from "svelte";
  import { parseNotionDate } from "../lib/backend/notion";
  /**
   * Initial data for the first page, for SSG.
   */
  type ReviewUIType = ReviewType & { readonly scrollRight?: boolean };
  interface Props {
    initialData: ReviewUIType[];
    totalPages: number;
    url: string;
  }

  let { initialData, totalPages, url }: Props = $props();

  const pageDataCache: Record<number, ReviewUIType[]> = $state(
    Object.fromEntries(
      Array(totalPages)
        .fill(null)
        .map((_, i) => [i + 1]),
    ),
  );

  // 1-indexed
  let currentPage = $state(1);

  // Set the data of the first page
  pageDataCache[1] = initialData;

  async function showPage(page: number) {
    if (!pageDataCache[page]) {
      // Scroll the top of the reviews into view
      const reviews = document.getElementById("reviews");
      if (reviews) {
        reviews.scrollIntoView({ behavior: "smooth" });
      }
      // Fetch data
      const newData = (await fetch(`/reviews/json/${page}`).then((r) =>
        r.json(),
      )) as any[];
      const deserializedData = newData.map<ReviewType>(
        ({ "Submitted At": submittedAt, ...rest }) => ({
          ...rest,
          "Submitted At": parseNotionDate(submittedAt),
        }),
      );
      pageDataCache[page] = deserializedData;
    }

    // Tell each Review on the source & target page how it should animate
    const mapProps = (r: ReviewUIType) => ({
      ...r,
      scrollRight: page > currentPage,
    });
    pageDataCache[currentPage] = pageDataCache[currentPage].map(mapProps);
    pageDataCache[page] = pageDataCache[page].map(mapProps);
    // Wait for update
    await tick();

    // Make the move
    currentPage = page;
  }
</script>

<div class="outer-wrapper">
  <div class="inner-wrapper">
    <ul class="reviews-list">
      {#each pageDataCache[currentPage] as review (review["First name"] + review["Submitted At"].start?.toString())}
        <Review {...review} locale={getLangFromUrl(url)} />
      {/each}
    </ul>

    <!-- Paginator -->
    <nav>
      <ol class="pages icons">
        {#each Array(totalPages).fill(null) as _, i}
          <li>
            <!-- TODO: debounce -->
            <a
              href="/reviews/{i + 1}"
              onclick={preventDefault(() => showPage(i + 1))}
              class="icon page {i + 1 === currentPage && 'active'}">{i + 1}</a
            >
          </li>
        {/each}
      </ol>
    </nav>
  </div>
</div>

<style lang="scss">
  @import "../sass/libs/_vars.scss";
  @import "../sass/libs/_functions.scss";
  @import "../sass/libs/mixins.scss";

  $x-margin: 0.5rem;
  .outer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    // @include padding(0, _size(padding, small));

    > .inner-wrapper {
      width: 100%;
      margin: 0 $x-margin;
      max-width: 65rem;
      // max-width: 760px;
    }
  }

  .button {
    // margin-bottom: _size(padding, medium);
    width: fit-content;
    align-self: flex-start;
  }

  ul.reviews-list {
    list-style: none;
    padding: 1rem 0;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    flex-direction: column;

    @media screen and (max-width: 737px) {
      grid-template-columns: auto;
    }

    :global(li:last-child p) {
      margin-bottom: 0.4rem;
    }
  }

  /* Pagination */
  ol {
    list-style: none;
    padding-left: 0;
    justify-content: center;
  }
  ol > li {
    display: flex;
  }
  .pages {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    row-gap: 0.2rem;
    margin: auto auto 2rem auto;
    width: 100%;
    flex-wrap: wrap;

    font-size: 1.1rem;
  }

  .page {
    display: block;
    cursor: pointer;
    font-size: 1.3rem;
    font-weight: _font(weight-bold);
    color: _palette(fg-lighter);
  }

  .page.active,
  .page:hover {
    color: _palette(accent);
    transition: all 0.3s;
  }

  .add-review {
    // align with the list padding above
    // excluding 1rem global margin
    padding: 0 (1.25rem - $x-margin);
    text-align: start;

    > h3 {
      // align with the padding inside the Tally iframe
      padding-left: 8px;
    }
  }
</style>
