<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

const todos = ref<TodoItem[]>([])

const newTaskText = ref<string>('')

const addTask = async (): Promise<void> => {
  const text = newTaskText.value.trim()
  if (!text) return

  try {
    const response = await fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text, completed: false }),
    })
    if (response.ok) {
      loadTodos()
    }
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }

  newTaskText.value = ''
}

const removeTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/todo/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      loadTodos()
    }
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

const changeCompletionStatus = async (id: number): Promise<void> => {
  const targetTodo = todos.value.find((todo) => todo.id === id)
  if (!targetTodo) return
  const text = targetTodo.text
  const completed = targetTodo.completed

  try {
    const response = await fetch(`/api/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text, completed: completed }),
    })
    if (response.ok) {
      await loadTodos()
    }
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

const incompleteCount = computed<number>(() => {
  return todos.value.filter((todo) => !todo.completed).length
})

onBeforeMount(async () => {
  console.log('TODOアプリがマウントされました。')
  await loadTodos()
})

const loadTodos = async () => {
  try {
    const response = await fetch('/api/todos', { method: 'GET' })
    if (response.ok) {
      const data = await response.json()
      todos.value = data
    }
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}
</script>

<template>
  <div class="todo-app-container">
    <h1>Simple TODO List</h1>

    <section class="todo-input">
      <input
        type="text"
        placeholder="新しいタスクを入力..."
        v-model="newTaskText"
        @keyup.enter="addTask"
      />
      <button @click="addTask" :disabled="!newTaskText.trim()">追加</button>
    </section>

    <hr />

    <section class="todo-list">
      <p v-if="todos.length === 0" class="empty-message">
        タスクはまだありません。何か追加しましょう！
      </p>

      <ul>
        <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
          <input
            type="checkbox"
            v-model="todo.completed"
            @change="changeCompletionStatus(todo.id)"
          />
          <span class="todo-text">{{ todo.text }}</span>
          <button @click="removeTask(todo.id)">削除</button>
        </li>
      </ul>
    </section>

    <hr />

    <section class="todo-summary">
      <p>残りタスク数 (未完了): {{ incompleteCount }}</p>
    </section>
  </div>
</template>

<style scoped>
.todo-app-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-input button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.todo-input button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.todo-list ul {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.todo-list li:hover {
  background-color: #f9f9f9;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}

.todo-list li input[type='checkbox'] {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.todo-list li .todo-text {
  flex-grow: 1;
}

.todo-list li button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
}

.empty-message {
  text-align: center;
  color: #888;
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>
