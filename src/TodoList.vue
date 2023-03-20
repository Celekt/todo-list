<script>
import TodoItem from "./TodoItem.vue";
import { useRoute } from "vue-router";

export default {
  components: {
    TodoItem: TodoItem
  },
  inject: ['todoLists', 'addTodo', 'updateTodo', 'removeTodo'],

  data() {
    return {
      title: "My TODO list",
      newTodo: '',
      // todos: [],
      display: "all",
      idCount: 0,
      route: useRoute(),
    }
  },
  computed: {
    filteredTodos(){
      return this.todos.filter(todo =>
        this.display === "all"
      || this.display === "todo" && !todo.done
      || this.display === "done" && todo.done);
    },
    allDone() {
      return this.todos.length > 0 && this.todos.every(todo => todo.done);
    },
    indeterminate() {
      return this.todos.length !== 0
      && this.todos.some(todo => todo.done !== this.todos[0].done);
    },
    todos() {
      return this.todoLists[this.route.params.id] || []
    },
  },
  watch: {
    title: {
      handler() {
        document.title = this.title
      },
      immediate: true
    },
    // todos: {
    //   handler() {
    //     this.setLocalStorage();
    //   },
    //   deep: true
    // },

    // route: {
    //   handler() {
    //     let loaded = JSON.parse(localStorage.getItem("myLists"))
    //     this.todos = !loaded || !loaded[this.route.params.id] ? [] : loaded[this.route.params.id];
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    addNewTodo() {
      if (this.newTodo !== "") {
        // this.todos.push({
        //   text: this.newTodo,
        //   done: false,
        //   id: this.idCount++
        // });
        this.addTodo(this.route.params.id, this.newTodo)
        this.newTodo = ""
      } else {
        alert("Le champ est vide.")
      }
    },
    setAllTodos() {
      let currentState = this.allDone;
      this.todos.forEach(todo => {
        todo.done = !currentState;
      })
    },
    handleUpdate(id, newTodo) {
      // let updatedIndex = this.todos.findIndex(todo => todo.id === id);
      // this.todos[updatedIndex] = newTodo;
      this.updateTodo(this.route.params.id, newTodo)
    },
    handleRemove(id) {
      // let removedIndex = this.todos.findIndex(todo => todo.id === id);
      // this.todos.splice(removedIndex,1);
      this.removeTodo(this.route.params.id, id)
    },
    setLocalStorage(){
      // localStorage.setItem("todos", JSON.stringify(newTodos));

      let loaded = JSON.parse(localStorage.getItem("myLists"));
      loaded[this.route.params.id] = this.todos;
      localStorage.setItem("myLists", JSON.stringify(loaded));
    },
  },
  mounted() {
    // this.todos = JSON.parse(localStorage.getItem("todos")) ?? [];
    this.idCount = (this.todos.length === 0)
              ? 0
              : Math.max(...this.todos.map(todo => todo.id)) + 1;
    this.$refs.newTodo.focus();
  },
}
</script>

<template>
  <div class="main-body">
    <h1 style="text-align: center">My TODO list #{{ parseInt(route.params.id) + 1 }}</h1>
    <form @submit.prevent="addNewTodo">
      <input class="todo-input" v-model="newTodo" type="text" ref="newTodo">
    </form>
    <div class="filter-buttons">
      <input type="radio" id="filter-all" name="filter" value="filter-all"
              :checked="display === 'all'" style="display: none">
      <label class="filter-button" for="filter-all" @click="display = 'all'">All</label>

      <input type="radio" id="filter-all" name="filter" value="filter-todo"
             :checked="display === 'todo'" style="display: none">
      <label class="filter-button" for="filter-todo" @click="display = 'todo'">To do</label>

      <input type="radio" id="filter-all" name="filter" value="filter-done"
             :checked="display === 'done'" style="display: none">
      <label class="filter-button" for="filter-done" @click="display = 'done'">Done</label>
    </div>
    <div class="check-all">
      <input type="checkbox" id="check-all"
             :checked="allDone" @change="setAllTodos"
              :indeterminate.prop="indeterminate">
      <label for="check-all">
        {{ allDone ? "Mark all to be done" : "Mark all done" }}
      </label>
    </div>
    <ul>
<!--      <li v-for="todo of filteredTodos" :key="todo.id" :class="{todo_done: todo.done}">-->
<!--        {{ todo.text }}-->
<!--        <input type="checkbox" v-model="todo.done">-->
      <TransitionGroup class="todo-list" name="todo-list" tag="ul">
        <todo-item
            v-for="todo in filteredTodos"
            :todo="todo"
            @update:todo="handleUpdate(todo.id, $event)"
            :key="todo.id"
        >
            <button class="remove-button"
                    type="button"
                    @click="handleRemove(todo.id)">
              <img class="icon" src="../assets/delete-icon.svg">
            </button>
        </todo-item>
      </TransitionGroup>
    </ul>
  </div>
</template>

<style scoped>
.main-body{
  width: 600px;
  background-color: rgb(230,230,230);
  border-radius: 10px;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
}

.todo-input{
  width: 100%;
}

.todo_done{
  text-decoration: line-through;
}

.check-all{
  text-align: right;
  margin-top: 10px;
  font-size: 20px;
}

.filter-buttons{
  display: flex;
  margin-top: 10px;
  justify-content: stretch;
}

.filter-button{
  background-color: darkseagreen;
  border: 2px solid darkgreen;
  border-radius: 5px;
  font-size: 20px;
  flex: 1 1 0;
  margin-left: 2px;
  margin-right: 2px;
  text-align: center;
}

input:checked + label.filter-button{
  background-color: rgb(100, 150, 110);
  border-color: rgb(100, 150, 110);
  color: white
}

.icon {
  width: 20px;
  height: auto;
  padding: 5px;
  border-radius: 5px;
  background-color: #800000;
}

.remove-button{
  padding: 0px;
  border: none;
  margin-left: 5px;
}


.remove-button:hover{
  box-shadow: 3px 3px 5px black;
  background-color: transparent;
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.5s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
