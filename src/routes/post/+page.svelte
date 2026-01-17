<script>
  import { enhance } from '$app/forms';
  import Header from '$lib/components/Header.svelte';

  export let data;
  export let form;

  let title = '';
  let description = '';
  let category = '';
  let lat = null;
  let lng = null;
  let address_display = '';
  let images = [];
  let uploadedImages = [];
  let locationStatus = '';
  let uploading = false;
  let submitting = false;

  const categories = [
    { id: 'electronics', label: '📦 家電' },
    { id: 'furniture', label: '🪑 家具' },
    { id: 'clothing', label: '👕 衣類' },
    { id: 'books', label: '📚 本' },
    { id: 'hobby', label: '🎮 趣味' },
    { id: 'other', label: '📦 その他' }
  ];

  async function getCurrentLocation() {
    locationStatus = '位置情報を取得中...';

    if (!navigator.geolocation) {
      locationStatus = '位置情報がサポートされていません';
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      lat = position.coords.latitude;
      lng = position.coords.longitude;
      address_display = `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`;
      locationStatus = '位置情報を取得しました';
    } catch (error) {
      console.error('位置情報取得エラー:', error);
      locationStatus = '位置情報の取得に失敗しました';
    }
  }

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files);

    if (uploadedImages.length + files.length > 5) {
      alert('画像は最大5枚までアップロードできます');
      return;
    }

    uploading = true;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          uploadedImages = [...uploadedImages, data.url];
        } else {
          alert(data.error || '画像のアップロードに失敗しました');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('画像のアップロードに失敗しました');
      }
    }

    uploading = false;
    event.target.value = '';
  }

  function removeImage(index) {
    uploadedImages = uploadedImages.filter((_, i) => i !== index);
  }

  function handleSubmit() {
    return async ({ formData }) => {
      submitting = true;
      formData.set('images', JSON.stringify(uploadedImages));
      return async ({ update }) => {
        await update();
        submitting = false;
      };
    };
  }
</script>

<svelte:head>
  <title>出品する - CurbAlert</title>
</svelte:head>

<div class="app-container">
  <Header user={data.user} />

  <main class="main-content">
    <div class="form-container">
      <h1>アイテムを出品</h1>

      {#if form?.error}
        <div class="error">{form.error}</div>
      {/if}

      <form method="POST" use:enhance={handleSubmit()}>
        <div class="form-group">
          <label for="title">タイトル <span class="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            bind:value={title}
            placeholder="例: 洗濯機（美品）"
            maxlength="100"
            required
          />
          <span class="char-count">{title.length}/100</span>
        </div>

        <div class="form-group">
          <label for="description">説明 <span class="required">*</span></label>
          <textarea
            id="description"
            name="description"
            bind:value={description}
            placeholder="アイテムの状態、受け渡し方法などを記載してください"
            maxlength="1000"
            rows="6"
            required
          />
          <span class="char-count">{description.length}/1000</span>
        </div>

        <div class="form-group">
          <label for="category">カテゴリ <span class="required">*</span></label>
          <select id="category" name="category" bind:value={category} required>
            <option value="">選択してください</option>
            {#each categories as cat}
              <option value={cat.id}>{cat.label}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label>画像（最大5枚）</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            on:change={handleImageUpload}
            disabled={uploading || uploadedImages.length >= 5}
          />

          {#if uploading}
            <p class="upload-status">アップロード中...</p>
          {/if}

          {#if uploadedImages.length > 0}
            <div class="image-preview">
              {#each uploadedImages as image, index}
                <div class="preview-item">
                  <img src={image} alt="プレビュー" />
                  <button
                    type="button"
                    class="remove-btn"
                    on:click={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <div class="form-group">
          <label>位置情報 <span class="required">*</span></label>
          <button type="button" class="btn-location" on:click={getCurrentLocation}>
            現在地を取得
          </button>
          {#if locationStatus}
            <p class="location-status">{locationStatus}</p>
          {/if}
          <input type="hidden" name="lat" value={lat} />
          <input type="hidden" name="lng" value={lng} />
          <input type="hidden" name="address_display" value={address_display} />
        </div>

        <button
          type="submit"
          class="btn-submit"
          disabled={submitting || !lat || !lng || !title || !description || !category}
        >
          {submitting ? '出品中...' : '出品する'}
        </button>
      </form>
    </div>
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
    background: #f5f5f5;
  }

  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .form-container {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
  }

  .error {
    background-color: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 24px;
    position: relative;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }

  .required {
    color: #c33;
  }

  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    font-family: inherit;
    transition: border-color 0.3s;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #667eea;
  }

  textarea {
    resize: vertical;
  }

  .char-count {
    position: absolute;
    right: 0;
    bottom: -20px;
    font-size: 12px;
    color: #999;
  }

  input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 2px dashed #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
  }

  .upload-status {
    margin-top: 8px;
    font-size: 14px;
    color: #667eea;
  }

  .image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .preview-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e0e0e0;
  }

  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .btn-location {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-location:hover {
    background: #764ba2;
  }

  .location-status {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }

  .btn-submit {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    margin-top: 30px;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 20px 16px;
    }

    .form-container {
      padding: 24px;
    }

    h1 {
      font-size: 24px;
    }

    .image-preview {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }
  }
</style>
