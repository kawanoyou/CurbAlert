<script>
  import { onMount } from 'svelte';
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

  // Google Maps API Loaderを動的にインポート
  let Loader;

  export let items = [];
  export let center = { lat: 35.6812, lng: 139.7671 }; // デフォルト: 渋谷
  export let zoom = 15;

  let mapContainer;
  let map;
  let markers = [];

  // カテゴリごとのマーカー色
  const categoryColors = {
    electronics: '#4285F4', // 青
    furniture: '#34A853',   // 緑
    clothing: '#FBBC04',    // 黄
    books: '#EA4335',       // 赤
    hobby: '#9C27B0',       // 紫
    other: '#9E9E9E'        // グレー
  };

  onMount(async () => {
    try {
      // Google Maps API Loaderを動的にインポート
      const { Loader: LoaderClass } = await import('@googlemaps/js-api-loader');

      const loader = new LoaderClass({
        apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly'
      });

      await loader.load();

      // 現在地を取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            initMap();
          },
          () => {
            // 位置情報取得失敗時はデフォルト位置で初期化
            initMap();
          }
        );
      } else {
        initMap();
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  });

  function initMap() {
    map = new google.maps.Map(mapContainer, {
      center,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    // アイテムのマーカーを追加
    updateMarkers();
  }

  function updateMarkers() {
    if (!map) return;

    // 既存のマーカーを削除
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // 新しいマーカーを追加
    items.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.display_lat, lng: item.display_lng },
        map,
        title: item.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: categoryColors[item.category] || categoryColors.other,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        window.location.href = `/item/${item.id}`;
      });

      markers.push(marker);
    });
  }

  // itemsが変更されたらマーカーを更新
  $: if (map && items) {
    updateMarkers();
  }
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
</style>
