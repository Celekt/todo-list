<template>
  <li class="todo">
    <div style="display: inline-flex">
      <input
          @change="handleDone"
          :checked="todo.done"
          class="todo__done"
          :id="'done-' + todo.id"
          type="checkbox"
      />
      <Transition name="edit" mode="out-in" @after-enter="onAfterEnter">
        <label v-if="!isEditing"
               class="todo__text"
               :class="{ 'todo__text--done': todo.done }"
               :for="'done-' + todo.id"
        >{{ todo.text }}</label>
        <form v-else @submit.prevent="handleSubmit">
          <input type="text" v-model="text"
                 ref="editText">
        </form>
      </Transition>
    </div>
    <div>
      <input :id="'edit-button' + todo.id" type="checkbox" v-model="isEditing" hidden/>
      <label :for="'edit-button' + todo.id">
        <img src="../assets/edit-icon.svg" class="icon"
             :style="isEditing ? checkedIcon : null">
      </label>
      <slot></slot>
    </div>
  </li>
</template>

<script>
export default {
  name: "TodoItem",
  props: ["todo"],
  emits: ["update:todo"],
  data() {
    return {
      text: this.todo.text,
      isEditing: false,
      checkedIcon: {
        backgroundColor: '#B06000'
      },
    }
  },
  methods: {
    handleDone(event) {
      this.$emit("update:todo", {
        ...this.todo,
        done: event.target.checked,
      });
    },
    handleSubmit() {
      this.$emit("update:todo", {
        ...this.todo,
        text: this.text,
      });
      this.isEditing = false;
    },
    onAfterEnter() {
      if (this.isEditing) {
        this.$refs.editText.focus();
      }
    },
  },
  watch: {
        isEditing: {
          handler() {
            if (!this.isEditing) {
              this.text = this.todo.text;
            }
            // else{
            //   this.$refs.editText.focus();
            // }
          },
          flush: 'post'
        },
  }
}
</script>

<style scoped>
.todo {
  display: flex;
  justify-content: space-between;
  margin-right: 40px;
  align-items: center;
}

.icon {
  width: 20px;
  height: auto;
  padding: 5px;
  border-radius: 5px;
  background-color: #00B000;
}

.icon:hover{
  box-shadow: 3px 3px 5px black;
}

.edit-enter-active,
.edit-leave-active {
  transition: all 0.25s ease-out;
}

.edit-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.edit-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>