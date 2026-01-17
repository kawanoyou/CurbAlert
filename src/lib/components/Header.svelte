<script>
  import { signOut } from '@auth/sveltekit/client';

  export let user = null;

  async function handleLogout() {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

<header>
  <div class="header-content">
    <a href="/" class="logo">
      <span class="logo-icon">📦</span>
      <span class="logo-text">モッテケ</span>
    </a>

    <nav>
      {#if user}
        <a href="/post" class="btn-post">出品する</a>
        <span class="user-name">{user.name}</span>
        <button on:click={handleLogout} class="btn-logout">ログアウト</button>
      {:else}
        <a href="/login" class="btn-login">ログイン</a>
      {/if}
    </nav>
  </div>
</header>

<style>
  header {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #333;
    font-weight: 700;
    font-size: 20px;
  }

  .logo-icon {
    font-size: 24px;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-name {
    font-size: 14px;
    color: #666;
  }

  .btn-post {
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.2s;
  }

  .btn-post:hover {
    transform: translateY(-2px);
  }

  .btn-login {
    padding: 8px 16px;
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
  }

  .btn-register {
    padding: 8px 16px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    transition: background 0.3s;
  }

  .btn-register:hover {
    background: #764ba2;
  }

  .btn-logout {
    padding: 8px 16px;
    background: #e0e0e0;
    color: #333;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.3s;
  }

  .btn-logout:hover {
    background: #d0d0d0;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 12px 16px;
    }

    .logo-text {
      font-size: 18px;
    }

    .user-name {
      display: none;
    }

    nav {
      gap: 8px;
    }

    .btn-post, .btn-register, .btn-logout {
      padding: 8px 12px;
      font-size: 13px;
    }
  }
</style>
