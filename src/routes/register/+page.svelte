<script>
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleRegister() {
    error = '';

    if (!name || !email || !password) {
      error = 'すべての項目を入力してください';
      return;
    }

    if (name.length < 2) {
      error = '名前は2文字以上で入力してください';
      return;
    }

    if (password.length < 8) {
      error = 'パスワードは8文字以上で入力してください';
      return;
    }

    loading = true;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 登録成功、自動ログインしてトップページへ
        goto('/');
      } else {
        error = data.error || '登録に失敗しました';
      }
    } catch (err) {
      console.error('Register error:', err);
      error = '登録に失敗しました';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>新規登録 - CurbAlert</title>
</svelte:head>

<div class="container">
  <div class="form-wrapper">
    <h1>新規登録</h1>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
      <div class="form-group">
        <label for="name">名前</label>
        <input
          type="text"
          id="name"
          bind:value={name}
          placeholder="山田太郎"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="example@mail.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">パスワード</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="8文字以上"
          required
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? '登録中...' : '新規登録'}
      </button>
    </form>

    <div class="link-group">
      <p>既にアカウントをお持ちの方</p>
      <a href="/login">ログインはこちら</a>
    </div>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .form-wrapper {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 30px;
    text-align: center;
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
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .link-group {
    margin-top: 24px;
    text-align: center;
  }

  .link-group p {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .link-group a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
  }

  .link-group a:hover {
    text-decoration: underline;
  }
</style>
