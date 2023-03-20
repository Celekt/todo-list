<template>
  <router-view></router-view>
  <div class="update-buttons">
    <button class="update-button add-button" type="button" @click="addNewList">+ Add new list</button>
    <button class="update-button remove-button" type="button" @click="removeList">- Remove current list</button>
    <select class="select-list" :value="this.route.params.id" v-model="currentList" @change="routerPush()">
      <option
          v-for="(list, key) in this.todoLists"
          :key="key" :value="key"
      >
        Liste#{{ Number(key) + 1 }}
      </option>
    </select>
  </div>
</template>

<style>

</style>

<script>
import {useRoute, useRouter} from "vue-router";

export default {
  data() {
    return {
      router: useRouter(),
      route: useRoute(),
      todoLists: JSON.parse(localStorage.getItem("myLists")) || {},
      currentList: 0,
    }
  },

  provide() {
    return {
      todoLists: this.todoLists,
      addTodo: this.addTodo,
      updateTodo: this.updateTodo,
      removeTodo: this.removeTodo
    }
  },

  mounted() {
    this.currentList = this.route.params.id;
  },

  methods: {
    routerPush() {
      this.router.push(`/todo/${this.currentList}`);
    },

    addNewList() {
      // let loaded = JSON.parse(localStorage.getItem("myLists")) || {};
      // const id = Number(Object.keys(loaded).at(-1)) + 1;
      // loaded[id] = []
      // localStorage.setItem("myLists", JSON.stringify(loaded));

      const id = Number(Object.keys(this.todoLists).at(-1)) + 1;
      this.todoLists[id] = []
      localStorage.setItem("myLists", JSON.stringify(this.todoLists));

      this.currentList = id;
      this.router.push(`/todo/${id}`);
    },
    removeList() {
      // let loaded = JSON.parse(localStorage.getItem("myLists"));
      // delete loaded[this.route.params.id];
      // localStorage.setItem("myLists", JSON.stringify(loaded));

      delete this.todoLists[this.route.params.id];
      localStorage.setItem("myLists", JSON.stringify(this.todoLists));
      this.currentList = id;
      this.router.push("/");
    },
    addTodo(id, text) {
      const todos = this.todoLists[id];
      const nextIndex = Math.max(-1, ...todos.map(todo => todo.id)) + 1;
      todos.push({
        text: text,
        done: false,
        id: nextIndex
      })
    },
    removeTodo(id, index) {
      this.todoLists[id].splice(index, 1);
    },
    updateTodo(id, newTodo) {
      const currentList = this.todoLists[id];
      const index = currentList.findIndex(todo => todo.id === newTodo.id);
      currentList[index] = newTodo;
    },
  },

  watch: {
    router: {
      handler() {
        const loadedTodoLists = JSON.parse(localStorage.getItem("myLists")) || {};
        Object.assign(this.todoLists, loadedTodoLists);
      },
      deep: true,
      immediate: true
    },

    todoLists: {
      handler(newValue) {
        localStorage.setItem("myLists", JSON.stringify(newValue))
      },
      deep: true,
      immediate: true
    },
  },

  // computed: {
  //   todoLists() {
  //     return JSON.parse(localStorage.getItem("myLists")) || {}
  //   },
  // }
}
</script>

<style scoped>
.update-buttons {
  width: 600px;
  background-color: rgb(230, 230, 230);
  border-radius: 10px;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  border: dimgrey 2px solid;
  display: flex;
}

.update-button {
  /*flex: 1 1 0;*/
  flex-grow: 1;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 20px;
  border-radius: 5px;
  border: transparent;
}

.add-button {
  background-color: mediumseagreen;
  color: black;
}

.remove-button {
  background-color: indianred;
  color: white;
}

.select-list {
  font-size: 20px;
  flex-grow: 1;
  text-align: center;
}

* {
  font-family: "DejaVu Sans";
}
</style>