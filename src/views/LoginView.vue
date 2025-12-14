<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const handleLogin = async () => {
  if (!username.value || !password.value) return

  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    if (response.ok) {
      // セッションCookieはブラウザが自動で保存します
      // ログイン成功後、TODOリスト画面へ
      window.location.href = '/'
    } else {
      errorMessage.value = 'ログインに失敗しました。ユーザー名かパスワードを確認してください。'
    }
  } catch (e: unknown) {
    console.log(e)
    errorMessage.value = 'サーバーとの通信に失敗しました。'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>TODO App Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>ユーザー名</label>
          <input v-model="username" type="text" required placeholder="User Name" />
        </div>
        <div class="input-group">
          <label>パスワード</label>
          <input v-model="password" type="password" required placeholder="Password" />
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}
.input-group {
  margin-bottom: 1.5rem;
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background-color: #aaa;
}
.error-text {
  color: #f44336;
  font-size: 0.9rem;
  text-align: center;
}
</style>
