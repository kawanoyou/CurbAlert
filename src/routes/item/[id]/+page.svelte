<script>
  import { onMount } from 'svelte';
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
  import Header from '$lib/components/Header.svelte';

  // Google Maps API Loaderを動的にインポート
  let Loader;

  export let data;

  let currentImageIndex = 0;
  let mapContainer;

  const categoryLabels = {
    electronics: '📦 家電',
    furniture: '🪑 家具',
    clothing: '👕 衣類',
    books: '📚 本',
    hobby: '🎮 趣味',
    other: '📦 その他'
  };

  const statusLabels = {
    available: '募集中',
    reserved: '予約済み',
    completed: '取引完了'
  };

  function nextImage() {
    if (data.item.images && data.item.images.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % data.item.images.length;
    }
  }

  function prevImage() {
    if (data.item.images && data.item.images.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + data.item.images.length) % data.item.images.length;
    }
  }

  function openGoogleMaps() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${data.item.display_lat},${data.item.display_lng}`;
    window.open(url, '_blank');
  }

  onMount(async () => {
    // 地図を表示
    try {
      // Google Maps API Loaderを動的にインポート
      const { Loader: LoaderClass } = await import('@googlemaps/js-api-loader');

      const loader = new LoaderClass({
        apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly'
      });

      await loader.load();

      const map = new google.maps.Map(mapContainer, {
        center: { lat: data.item.display_lat, lng: data.item.display_lng },
        zoom: 15,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      new google.maps.Marker({
        position: { lat: data.item.display_lat, lng: data.item.display_lng },
        map,
        title: data.item.title
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>{data.item.title} - CurbAlert</title>
  <meta name="description" content={data.item.description} />
</svelte:head>

<div class="app-container">
  <Header user={data.user} />

  <main class="main-content">
    <div class="content-wrapper">
      <div class="left-section">
        <!-- 画像スライダー -->
        <div class="image-slider">
          {#if data.item.images && data.item.images.length > 0}
            <img src={data.item.images[currentImageIndex]} alt={data.item.title} />
            {#if data.item.images.length > 1}
              <button class="slider-btn prev" on:click={prevImage}>‹</button>
              <button class="slider-btn next" on:click={nextImage}>›</button>
              <div class="image-counter">
                {currentImageIndex + 1} / {data.item.images.length}
              </div>
            {/if}
          {:else}
            <div class="no-image">画像なし</div>
          {/if}
        </div>

        <!-- アイテム情報 -->
        <div class="item-info">
          <div class="header-row">
            <h1>{data.item.title}</h1>
            <span class="status status-{data.item.status}">{statusLabels[data.item.status]}</span>
          </div>

          <div class="meta-row">
            <span class="category">{categoryLabels[data.item.category]}</span>
            <span class="date">投稿日: {formatDate(data.item.created_at)}</span>
          </div>

          <div class="description">
            <h2>説明</h2>
            <p>{data.item.description}</p>
          </div>

          <!-- 出品者情報 -->
          <div class="seller-info">
            <h2>出品者</h2>
            <div class="seller-card">
              <div class="seller-avatar">{data.item.user_name.charAt(0)}</div>
              <div class="seller-details">
                <p class="seller-name">{data.item.user_name}</p>
                <p class="seller-rating">
                  ⭐ {data.item.user_rating.toFixed(1)} ({data.item.user_review_count}件の評価)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-section">
        <!-- 地図 -->
        <div class="map-card">
          <h2>受け渡し場所</h2>
          <div class="map-container" bind:this={mapContainer}></div>
          <p class="location-note">※ プライバシー保護のため、おおよその位置を表示しています</p>
          <button class="btn-route" on:click={openGoogleMaps}>
            📍 ルート案内
          </button>
        </div>

        <!-- アクションボタン -->
        {#if data.user && data.item.status === 'available'}
          <div class="action-card">
            <button class="btn-contact">
              💬 出品者に連絡
            </button>
            <p class="contact-note">※ メッセージ機能は現在開発中です</p>
          </div>
        {:else if !data.user}
          <div class="action-card">
            <p class="login-note">出品者に連絡するにはログインが必要です</p>
            <a href="/login" class="btn-login">ログイン</a>
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
    background: #f5f5f5;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 24px;
  }

  .left-section,
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .image-slider {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: #f0f0f0;
    border-radius: 12px;
    overflow: hidden;
  }

  .image-slider img {
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
    color: #999;
    font-size: 18px;
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }

  .slider-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .slider-btn.prev {
    left: 16px;
  }

  .slider-btn.next {
    right: 16px;
  }

  .image-counter {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
  }

  .item-info {
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
  }

  .status {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-available {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .status-reserved {
    background: #fff3e0;
    color: #e65100;
  }

  .status-completed {
    background: #e0e0e0;
    color: #616161;
  }

  .meta-row {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #666;
  }

  .category {
    font-weight: 500;
  }

  .description {
    margin-bottom: 32px;
  }

  .description h2 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .description p {
    line-height: 1.7;
    color: #333;
    white-space: pre-wrap;
  }

  .seller-info h2 {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .seller-card {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .seller-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
  }

  .seller-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .seller-rating {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .map-card,
  .action-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .map-card h2,
  h2 {
    font-size: 18px;
    margin: 0 0 16px 0;
  }

  .map-container {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .location-note {
    font-size: 12px;
    color: #999;
    margin: 0 0 16px 0;
  }

  .btn-route,
  .btn-contact,
  .btn-login {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: block;
    text-align: center;
    transition: transform 0.2s;
  }

  .btn-route:hover,
  .btn-contact:hover,
  .btn-login:hover {
    transform: translateY(-2px);
  }

  .contact-note,
  .login-note {
    font-size: 13px;
    color: #666;
    text-align: center;
    margin: 12px 0 0 0;
  }

  .login-note {
    margin-bottom: 16px;
  }

  @media (max-width: 1024px) {
    .content-wrapper {
      grid-template-columns: 1fr;
    }

    .right-section {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 20px 16px;
    }

    .item-info,
    .map-card,
    .action-card {
      padding: 20px;
    }

    h1 {
      font-size: 24px;
    }

    .image-slider {
      border-radius: 0;
      margin: -20px -16px 20px;
    }

    .slider-btn {
      width: 40px;
      height: 40px;
      font-size: 28px;
    }
  }
</style>
