<script>
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import CategoryNav from '$lib/components/CategoryNav.svelte';
  import Map from '$lib/components/Map.svelte';
  import ItemCard from '$lib/components/ItemCard.svelte';

  export let data;

  let items = [];
  let filteredItems = [];
  let selectedCategory = 'all';
  let userLocation = null;
  let loading = true;

  onMount(async () => {
    // 現在地を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          loadItems();
        },
        () => {
          // 位置情報取得失敗時もアイテムをロード
          loadItems();
        }
      );
    } else {
      loadItems();
    }
  });

  async function loadItems() {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
        params.append('maxDistance', 5000); // 5km圏内
      }

      const response = await fetch(`/api/items?${params}`);
      const data = await response.json();

      if (response.ok) {
        items = data.items;
        filteredItems = items;
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      loading = false;
    }
  }

  // カテゴリが変更されたらアイテムを再読み込み
  $: if (selectedCategory) {
    loadItems();
  }
</script>

<svelte:head>
  <title>CurbAlert - Find Free Items in Your Neighborhood</title>
  <meta name="description" content="Discover and share free items left on the curb in your neighborhood" />
</svelte:head>

<div class="app-container">
  <Header user={data.user} />

  <CategoryNav bind:selectedCategory />

  <main class="main-content">
    <div class="map-section">
      <Map items={filteredItems} />
    </div>

    <div class="items-section">
      <div class="items-header">
        <h2>近くのアイテム</h2>
        <span class="item-count">{filteredItems.length}件</span>
      </div>

      <div class="items-list">
        {#if loading}
          <div class="loading">読み込み中...</div>
        {:else if filteredItems.length === 0}
          <div class="empty">
            <p>アイテムが見つかりませんでした</p>
            <p class="empty-hint">別のカテゴリを試すか、範囲を広げてみてください</p>
          </div>
        {:else}
          {#each filteredItems as item (item.id)}
            <ItemCard {item} {userLocation} />
          {/each}
        {/if}
      </div>
    </div>
  </main>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 400px;
    overflow: hidden;
  }

  .map-section {
    height: 100%;
    position: relative;
  }

  .items-section {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    border-left: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .items-header {
    padding: 16px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .items-header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .item-count {
    font-size: 14px;
    color: #666;
  }

  .items-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .loading,
  .empty {
    padding: 40px 20px;
    text-align: center;
    color: #666;
  }

  .empty p {
    margin: 8px 0;
  }

  .empty-hint {
    font-size: 14px;
    color: #999;
  }

  @media (max-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr;
      grid-template-rows: 50vh 1fr;
    }

    .items-section {
      border-left: none;
      border-top: 1px solid #e0e0e0;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      grid-template-rows: 40vh 1fr;
    }

    .items-header {
      padding: 12px 16px;
    }

    .items-header h2 {
      font-size: 16px;
    }

    .items-list {
      padding: 10px;
      gap: 10px;
    }
  }
</style>
