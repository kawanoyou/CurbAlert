<script>
  import { formatDistance, formatRelativeTime, calculateDistance } from '$lib/utils.js';

  export let item;
  export let userLocation = null;

  let distance = '';

  // ユーザーの現在位置からの距離を計算
  $: if (userLocation && item) {
    const meters = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      item.display_lat,
      item.display_lng
    );
    distance = formatDistance(meters);
  }

  const categoryLabels = {
    electronics: '📦 家電',
    furniture: '🪑 家具',
    clothing: '👕 衣類',
    books: '📚 本',
    hobby: '🎮 趣味',
    other: '📦 その他'
  };
</script>

<a href="/item/{item.id}" class="item-card">
  <div class="image-container">
    {#if item.image_path}
      <img src={item.image_path} alt={item.title} />
    {:else}
      <div class="no-image">画像なし</div>
    {/if}
  </div>

  <div class="content">
    <div class="header">
      <h3 class="title">{item.title}</h3>
      <span class="category">{categoryLabels[item.category] || categoryLabels.other}</span>
    </div>

    {#if item.description}
      <p class="description">{item.description.substring(0, 60)}{item.description.length > 60 ? '...' : ''}</p>
    {/if}

    <div class="footer">
      {#if distance}
        <span class="distance">📍 {distance}</span>
      {/if}
      <span class="time">{formatRelativeTime(item.created_at)}</span>
    </div>
  </div>
</a>

<style>
  .item-card {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.3s;
    border: 1px solid #e0e0e0;
  }

  .item-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #999;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .category {
    flex-shrink: 0;
    font-size: 11px;
    padding: 4px 8px;
    background: #f5f5f5;
    border-radius: 4px;
    white-space: nowrap;
  }

  .description {
    margin: 0;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #999;
    margin-top: auto;
  }

  .distance {
    font-weight: 500;
    color: #667eea;
  }

  @media (max-width: 768px) {
    .item-card {
      gap: 10px;
      padding: 10px;
    }

    .image-container {
      width: 80px;
      height: 80px;
    }

    .title {
      font-size: 14px;
    }

    .description {
      font-size: 12px;
    }
  }
</style>
