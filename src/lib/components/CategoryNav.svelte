<script>
  export let selectedCategory = 'all';

  const categories = [
    { id: 'all', label: 'すべて', icon: '🏠' },
    { id: 'electronics', label: '家電', icon: '📦' },
    { id: 'furniture', label: '家具', icon: '🪑' },
    { id: 'clothing', label: '衣類', icon: '👕' },
    { id: 'books', label: '本', icon: '📚' },
    { id: 'hobby', label: '趣味', icon: '🎮' },
    { id: 'other', label: 'その他', icon: '📦' }
  ];

  function selectCategory(categoryId) {
    selectedCategory = categoryId;
  }
</script>

<nav class="category-nav">
  {#each categories as category}
    <button
      class="category-btn"
      class:active={selectedCategory === category.id}
      on:click={() => selectCategory(category.id)}
    >
      <span class="icon">{category.icon}</span>
      <span class="label">{category.label}</span>
    </button>
  {/each}
</nav>

<style>
  .category-nav {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: white;
    overflow-x: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .category-nav::-webkit-scrollbar {
    height: 4px;
  }

  .category-nav::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }

  .category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: #f5f5f5;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 70px;
    white-space: nowrap;
  }

  .category-btn:hover {
    background: #e8e8e8;
  }

  .category-btn.active {
    background: #fff;
    border-color: #667eea;
  }

  .icon {
    font-size: 20px;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: #333;
  }

  @media (max-width: 768px) {
    .category-nav {
      gap: 6px;
      padding: 10px 12px;
    }

    .category-btn {
      min-width: 60px;
      padding: 6px 10px;
    }

    .icon {
      font-size: 18px;
    }

    .label {
      font-size: 11px;
    }
  }
</style>
