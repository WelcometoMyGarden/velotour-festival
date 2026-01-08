<script lang="ts">
    import { innerWidth } from "svelte/reactivity/window";
</script>

<!-- We're doing this dynamically in Svelte because
 the browser will otherwise download both videos -->
{#if innerWidth.current && innerWidth.current <= 736}
    <!-- Mobile video (see css for art direction) -->
    <video
        class="bg-video bg-video--mobile"
        preload="auto"
        muted
        loop
        autoplay
        playsinline
    >
        <source
            type="video/mp4"
            src="https://storage.googleapis.com/wtmg-static/velotour/velotour_homepage_2200.mp4"
        />
    </video>
{:else if innerWidth.current}
    <!-- Desktop video (see css for art direction) -->
    <video
        class="bg-video bg-video--desktop"
        preload="auto"
        muted
        loop
        autoplay
        playsinline
    >
        <source
            type="video/mp4"
            src="https://storage.googleapis.com/wtmg-static/velotour/velotour_homepage_2000_3.mp4"
        />
    </video>
{/if}
