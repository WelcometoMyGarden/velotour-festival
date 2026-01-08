<script lang="ts">
  import { fly } from "svelte/transition";
  import { type Review as ReviewType } from "../lib/constants";
  import Stars from "./Stars.svelte";
  import { langLocale } from "../lib/i18n/utils";
  interface Props {
    [key: string]: any;
  }

  let { ...props }: Props = $props();
  let {
    "Submitted At": submittedAt,
    "First name": firstName,
    Review: review,
    Rating: rating,
    Language: language,
    locale: locale,
    scrollRight,
  } = $derived(
    props as ReviewType & {
      locale: string;
      scrollRight?: boolean;
    },
  );

  const sR = (n: number) => (scrollRight ? -1 * n : 1 * n);
</script>

<li
  class="review"
  in:fly={{ x: sR(-100), delay: 250, duration: 200 }}
  out:fly={{ x: sR(100), duration: 250 }}
>
  <div property="review" typeof="Review">
    <!-- Inspired on IMDB tags, can't find docs on this -->
    <meta property="inLanguage" content={language} />
    <span property="author" typeof="Person"
      ><span property="name" class="first-name">{firstName}</span></span
    >{" "}
    {#if submittedAt && submittedAt.start}
      <meta
        property="dateCreated"
        content={submittedAt.start.toISOString().substring(0, 10)}
      />
      <span class="datetime"
        >({new Intl.DateTimeFormat(langLocale(locale), {
          year: "numeric",
        }).format(submittedAt.start)})</span
      >
    {/if}
  </div>
  <Stars {rating} />
  <span property="reviewRating" typeof="Rating">
    <meta property="ratingValue" content={rating + ""} />
    <meta property="worstRating" content="1" />
    <meta property="bestRating" content="5" />
  </span>
  <p property="reviewBody">{review}</p>
</li>

<style lang="scss">
  @import "../sass/libs/_vars.scss";
  @import "../sass/libs/_functions.scss";
  .review {
    text-align: left;
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid _palette(border);
    background-color: #3d4a57;

    p {
      margin-bottom: 0.5rem;
    }
  }

  .datetime {
    color: _palette(fg-lighter);
  }
  .first-name {
    font-size: 1.2rem;
    font-weight: 500;
  }
</style>
